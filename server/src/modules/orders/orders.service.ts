import { randomInt } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import {
  auditLogs,
  orderItems,
  orders,
  productBatches,
  products,
  shippingAddresses,
} from "../../db/schema";
import { env } from "../../config/env";
import { generateHub3Payload } from "../payments/hub3";
import type { CreateOrderInput, QuoteOrderInput } from "./orders.schema";

export class OrdersService {
  async quoteOrder(input: QuoteOrderInput) {
    const productIds = input.items.map((i) => i.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    let subtotal = 0;
    const validatedItems = [];

    for (const item of input.items) {
      const dbProd = dbProducts.find((p) => p.id === item.productId);
      if (!dbProd) {
        throw new Error(`Proizvod s ID-em ${item.productId} više nije dostupan.`);
      }
      const unitPrice = Number(dbProd.price);
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: dbProd.id,
        slug: dbProd.slug,
        name: dbProd.nameHr,
        amount: dbProd.amount,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    const shippingFee =
      subtotal >= env.FREE_SHIPPING_THRESHOLD ? 0 : env.SHIPPING_FEE;
    const total = subtotal + shippingFee;

    return {
      items: validatedItems,
      subtotal: Number(subtotal.toFixed(2)),
      shippingFee: Number(shippingFee.toFixed(2)),
      total: Number(total.toFixed(2)),
      freeShippingThreshold: env.FREE_SHIPPING_THRESHOLD,
      freeShippingReached: subtotal >= env.FREE_SHIPPING_THRESHOLD,
      currency: env.SHOP_CURRENCY,
    };
  }

  async createOrder(
    input: CreateOrderInput,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // 1. Izračunaj i validiraj cijene na poslužitelju
    const quote = await this.quoteOrder({ items: input.items });

    // 2. Generiraj jedinstveni broj narudžbe uz kriptografsku slučajnost: npr. ORD-2026-784912
    const currentYear = new Date().getFullYear();
    const randomSuffix = randomInt(100000, 999999);
    const orderNumber = `ORD-${currentYear}-${randomSuffix}`;

    // 3. Atomarna transakcija (ACID)
    const result = await db.transaction(async (tx) => {
      // a) Spremi narudžbu
      const [newOrder] = await tx
        .insert(orders)
        .values({
          orderNumber,
          customerEmail: input.customerEmail,
          customerPhone: input.shippingAddress.phoneNumber,
          customerName: input.shippingAddress.recipientName,
          subtotal: quote.subtotal.toFixed(2),
          shippingFee: quote.shippingFee.toFixed(2),
          total: quote.total.toFixed(2),
          currency: env.SHOP_CURRENCY,
          status: "CONFIRMED",
          paymentMethod: input.paymentMethod,
          paymentStatus: input.paymentMethod === "cod" ? "PENDING" : "PENDING",
          ruoAccepted: true,
          ruoAcceptedAt: new Date(),
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          notes: input.notes || null,
        })
        .returning();

      // b) Spremi adresu dostave
      await tx.insert(shippingAddresses).values({
        orderId: newOrder.id,
        recipientName: input.shippingAddress.recipientName,
        streetAddress: input.shippingAddress.streetAddress,
        city: input.shippingAddress.city,
        postalCode: input.shippingAddress.postalCode,
        country: input.shippingAddress.country,
        phoneNumber: input.shippingAddress.phoneNumber,
        companyName: input.shippingAddress.companyName || null,
        companyOib: input.shippingAddress.companyOib || null,
        deliveryInstructions: input.shippingAddress.deliveryInstructions || null,
        parcelLockerId: input.shippingAddress.parcelLockerId || null,
      });

      // c) Provjeri zalihe, rezerviraj i spremi stavke narudžbe s dodijeljenom serijom
      for (const item of quote.items) {
        // Pronađi aktivnu seriju za ovaj spoj
        const [batch] = await tx
          .select()
          .from(productBatches)
          .where(
            and(
              eq(productBatches.productId, item.productId),
              eq(productBatches.isReleased, true),
            ),
          )
          .limit(1);

        if (batch) {
          if (batch.stockQuantity < item.quantity) {
            throw new Error(
              `Nedovoljna zaliha za proizvod "${item.name}". Na skladištu preostalo: ${batch.stockQuantity} kom.`,
            );
          }

          // Transakcijsko smanjivanje zaliha
          await tx
            .update(productBatches)
            .set({
              stockQuantity: batch.stockQuantity - item.quantity,
            })
            .where(eq(productBatches.id, batch.id));
        }

        await tx.insert(orderItems).values({
          orderId: newOrder.id,
          productId: item.productId,
          productNameSnapshot: item.name,
          unitPriceSnapshot: item.unitPrice.toFixed(2),
          quantity: item.quantity,
          totalPrice: item.totalPrice.toFixed(2),
          batchId: batch ? batch.id : null,
        });
      }

      // d) Kriptografski / Audit zapis o prihvaćanju RUO uvjeta
      await tx.insert(auditLogs).values({
        entityName: "ORDER",
        entityId: newOrder.id,
        action: "CREATED",
        details: JSON.stringify({
          orderNumber,
          paymentMethod: input.paymentMethod,
          ruoAccepted: true,
          total: quote.total,
        }),
        ipAddress: ipAddress || null,
      });

      return newOrder;
    });

    // 4. Za način plaćanja 'transfer' (virman) generiraj HUB3 2D barkod
    let paymentDetails = null;
    if (input.paymentMethod === "transfer") {
      paymentDetails = generateHub3Payload({
        orderNumber: result.orderNumber,
        amount: quote.total,
        customerName: input.shippingAddress.recipientName,
        customerStreet: input.shippingAddress.streetAddress,
        customerCity: input.shippingAddress.city,
      });
    }

    return {
      orderNumber: result.orderNumber,
      status: result.status,
      paymentMethod: result.paymentMethod,
      total: quote.total,
      currency: env.SHOP_CURRENCY,
      createdAt: result.createdAt,
      paymentDetails,
    };
  }

  async getOrderByNumber(orderNumber: string) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber));

    if (!order) return null;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const [address] = await db
      .select()
      .from(shippingAddresses)
      .where(eq(shippingAddresses.orderId, order.id));

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      shippingFee: Number(order.shippingFee),
      total: Number(order.total),
      currency: order.currency,
      createdAt: order.createdAt,
      items: items.map((i) => ({
        name: i.productNameSnapshot,
        unitPrice: Number(i.unitPriceSnapshot),
        quantity: i.quantity,
        totalPrice: Number(i.totalPrice),
      })),
      shipping: address
        ? {
            recipientName: address.recipientName,
            city: address.city,
            country: address.country,
          }
        : null,
    };
  }
}

export const ordersService = new OrdersService();
