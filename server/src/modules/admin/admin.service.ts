import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import {
  auditLogs,
  orderItems,
  orders,
  productBatches,
  shippingAddresses,
} from "../../db/schema";
import type {
  AdminListOrdersQuery,
  AdminUpdateOrderStatusInput,
} from "./admin.schema";

export class AdminService {
  async listOrders(query: AdminListOrdersQuery) {
    const conditions = [];

    if (query.status) {
      conditions.push(eq(orders.status, query.status));
    }

    if (query.search && query.search.trim().length > 0) {
      const searchTerm = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(orders.orderNumber, searchTerm),
          ilike(orders.customerEmail, searchTerm),
          ilike(orders.customerName, searchTerm),
          ilike(orders.customerPhone, searchTerm),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereClause);

    const orderRows = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(query.limit)
      .offset(query.offset);

    return {
      total: Number(totalResult?.count || 0),
      orders: orderRows.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        total: Number(o.total),
        currency: o.currency,
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        trackingNumber: o.trackingNumber,
        shippingCarrier: o.shippingCarrier,
        createdAt: o.createdAt,
      })),
    };
  }

  async getOrderDetails(orderId: string) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) return null;

    const [address] = await db
      .select()
      .from(shippingAddresses)
      .where(eq(shippingAddresses.orderId, order.id));

    const items = await db
      .select({
        id: orderItems.id,
        productName: orderItems.productNameSnapshot,
        unitPrice: orderItems.unitPriceSnapshot,
        quantity: orderItems.quantity,
        totalPrice: orderItems.totalPrice,
        batchNumber: productBatches.batchNumber,
        purityPercentage: productBatches.purityPercentage,
        expiryDate: productBatches.expiryDate,
      })
      .from(orderItems)
      .leftJoin(productBatches, eq(orderItems.batchId, productBatches.id))
      .where(eq(orderItems.orderId, order.id));

    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.entityId, order.id))
      .orderBy(desc(auditLogs.timestamp));

    return {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        total: Number(order.total),
        currency: order.currency,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        shippingCarrier: order.shippingCarrier,
        ruoAccepted: order.ruoAccepted,
        ruoAcceptedAt: order.ruoAcceptedAt,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      shippingAddress: address || null,
      items: items.map((i) => ({
        id: i.id,
        productName: i.productName,
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
        totalPrice: Number(i.totalPrice),
        batchNumber: i.batchNumber,
        purityPercentage: i.purityPercentage ? Number(i.purityPercentage) : null,
        expiryDate: i.expiryDate,
      })),
      auditLogs: logs.map((l) => ({
        id: l.id,
        action: l.action,
        details: l.details,
        createdAt: l.timestamp,
      })),
    };
  }

  async updateOrderStatus(
    orderId: string,
    input: AdminUpdateOrderStatusInput,
    ipAddress?: string,
  ) {
    return await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

      if (!existing) {
        throw new Error(`Narudžba s ID-om ${orderId} ne postoji.`);
      }

      // Ako se status mijenja u CANCELLED, vrati zalihe u dodijeljene serije
      const isCancelling = existing.status !== "CANCELLED" && input.status === "CANCELLED";
      if (isCancelling) {
        const items = await tx
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, orderId));

        for (const item of items) {
          if (item.batchId) {
            await tx
              .update(productBatches)
              .set({
                stockQuantity: sql`${productBatches.stockQuantity} + ${item.quantity}`,
              })
              .where(eq(productBatches.id, item.batchId));
          }
        }
      }

      type OrderUpdateData = {
        updatedAt: Date;
        status?: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
        paymentStatus?: "PENDING" | "PAID" | "REFUNDED";
        trackingNumber?: string | null;
        shippingCarrier?: string;
      };

      const updates: OrderUpdateData = {
        updatedAt: new Date(),
      };

      if (input.status) updates.status = input.status;
      if (input.paymentStatus) updates.paymentStatus = input.paymentStatus;
      if (input.trackingNumber !== undefined)
        updates.trackingNumber = input.trackingNumber;
      if (input.shippingCarrier !== undefined)
        updates.shippingCarrier = input.shippingCarrier;

      const [updated] = await tx
        .update(orders)
        .set(updates)
        .where(eq(orders.id, orderId))
        .returning();

      // Zabilježi u audit log
      await tx.insert(auditLogs).values({
        entityName: "ORDER",
        entityId: orderId,
        action: isCancelling ? "ORDER_CANCELLED_RESTOCKED" : "STATUS_UPDATED",
        details: JSON.stringify({
          previousStatus: existing.status,
          newStatus: input.status || existing.status,
          previousPaymentStatus: existing.paymentStatus,
          newPaymentStatus: input.paymentStatus || existing.paymentStatus,
          trackingNumber: input.trackingNumber,
          carrier: input.shippingCarrier,
          note: input.note,
          restocked: isCancelling,
        }),
        ipAddress: ipAddress || null,
      });

      return updated;
    });
  }

  async getDashboardStats() {
    const [totalOrdersRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    const [revenueRes] = await db
      .select({ sum: sql<string>`coalesce(sum(cast(${orders.total} as numeric)), 0)` })
      .from(orders);

    const [pendingOrdersRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "CONFIRMED"));

    return {
      totalOrders: Number(totalOrdersRes?.count || 0),
      totalRevenue: Number(revenueRes?.sum || 0),
      pendingFulfillment: Number(pendingOrdersRes?.count || 0),
      currency: "EUR",
    };
  }
}

export const adminService = new AdminService();
