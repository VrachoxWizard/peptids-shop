import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "../../db";
import {
  auditLogs,
  inquiries,
  orderItems,
  orders,
  productBatches,
  products,
  shippingAddresses,
} from "../../db/schema";
import type {
  AdminCreateBatchInput,
  AdminCreateProductInput,
  AdminListInquiriesQuery,
  AdminListOrdersQuery,
  AdminUpdateBatchStockInput,
  AdminUpdateOrderStatusInput,
  AdminUpdateProductInput,
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

  async listAdminProducts() {
    const rows = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    if (rows.length === 0) {
      return [];
    }

    const productIds = rows.map((p) => p.id);
    const batches = await db
      .select()
      .from(productBatches)
      .where(inArray(productBatches.productId, productIds));

    const batchesByProduct = new Map<number, typeof batches>();
    for (const b of batches) {
      const list = batchesByProduct.get(b.productId) || [];
      list.push(b);
      batchesByProduct.set(b.productId, list);
    }

    return rows.map((p) => {
      const productBatchesList = batchesByProduct.get(p.id) || [];
      const totalStock = productBatchesList.reduce(
        (acc, b) => acc + (b.isReleased ? b.stockQuantity : 0),
        0,
      );
      const latestBatch = productBatchesList.sort((a, b) => b.id - a.id)[0] || null;

      return {
        ...p,
        price: Number(p.price),
        stockQuantity: totalStock,
        currentBatch: latestBatch
          ? {
              id: latestBatch.id,
              batchNumber: latestBatch.batchNumber,
              purityPercentage: latestBatch.purityPercentage,
              stockQuantity: latestBatch.stockQuantity,
              expiryDate: latestBatch.expiryDate,
              isReleased: latestBatch.isReleased,
            }
          : null,
      };
    });
  }

  async createProduct(input: AdminCreateProductInput, ipAddress?: string) {
    const [created] = await db
      .insert(products)
      .values({
        slug: input.slug,
        nameHr: input.nameHr,
        nameEn: input.nameEn || null,
        category: input.category,
        categoryEn: input.categoryEn || null,
        descriptionHr: input.descriptionHr,
        descriptionEn: input.descriptionEn || null,
        amount: input.amount,
        price: input.price.toString(),
        imageUrl: input.imageUrl || null,
        featured: input.featured ?? false,
        purity: input.purity || null,
        casNumber: input.casNumber || null,
        molecularWeight: input.molecularWeight || null,
        isActive: input.isActive ?? true,
      })
      .returning();

    await db.insert(auditLogs).values({
      entityName: "PRODUCT",
      entityId: created.id.toString(),
      action: "PRODUCT_CREATED",
      details: JSON.stringify({ slug: created.slug, name: created.nameHr, price: created.price }),
      ipAddress: ipAddress || null,
    });

    return {
      ...created,
      price: Number(created.price),
    };
  }

  async updateProduct(id: number, input: AdminUpdateProductInput, ipAddress?: string) {
    type ProductUpdates = {
      updatedAt: Date;
      slug?: string;
      nameHr?: string;
      nameEn?: string | null;
      category?: string;
      categoryEn?: string | null;
      descriptionHr?: string;
      descriptionEn?: string | null;
      amount?: string;
      price?: string;
      imageUrl?: string | null;
      featured?: boolean;
      purity?: string | null;
      casNumber?: string | null;
      molecularWeight?: string | null;
      isActive?: boolean;
    };

    const updateValues: ProductUpdates = {
      updatedAt: new Date(),
    };
    if (input.slug !== undefined) updateValues.slug = input.slug;
    if (input.nameHr !== undefined) updateValues.nameHr = input.nameHr;
    if (input.nameEn !== undefined) updateValues.nameEn = input.nameEn;
    if (input.category !== undefined) updateValues.category = input.category;
    if (input.categoryEn !== undefined) updateValues.categoryEn = input.categoryEn;
    if (input.descriptionHr !== undefined) updateValues.descriptionHr = input.descriptionHr;
    if (input.descriptionEn !== undefined) updateValues.descriptionEn = input.descriptionEn;
    if (input.amount !== undefined) updateValues.amount = input.amount;
    if (input.price !== undefined) updateValues.price = input.price.toString();
    if (input.imageUrl !== undefined) updateValues.imageUrl = input.imageUrl;
    if (input.featured !== undefined) updateValues.featured = input.featured;
    if (input.purity !== undefined) updateValues.purity = input.purity;
    if (input.casNumber !== undefined) updateValues.casNumber = input.casNumber;
    if (input.molecularWeight !== undefined) updateValues.molecularWeight = input.molecularWeight;
    if (input.isActive !== undefined) updateValues.isActive = input.isActive;

    const [updated] = await db
      .update(products)
      .set(updateValues)
      .where(eq(products.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Artikl s ID-om ${id} nije pronađen.`);
    }

    await db.insert(auditLogs).values({
      entityName: "PRODUCT",
      entityId: id.toString(),
      action: "PRODUCT_UPDATED",
      details: JSON.stringify(input),
      ipAddress: ipAddress || null,
    });

    return {
      ...updated,
      price: Number(updated.price),
    };
  }

  async deleteProduct(id: number, ipAddress?: string) {
    const [deactivated] = await db
      .update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (!deactivated) {
      throw new Error(`Artikl s ID-om ${id} nije pronađen.`);
    }

    await db.insert(auditLogs).values({
      entityName: "PRODUCT",
      entityId: id.toString(),
      action: "PRODUCT_DEACTIVATED",
      details: JSON.stringify({ id, slug: deactivated.slug }),
      ipAddress: ipAddress || null,
    });

    return deactivated;
  }

  async createBatch(input: AdminCreateBatchInput, ipAddress?: string) {
    const [created] = await db
      .insert(productBatches)
      .values({
        productId: input.productId,
        batchNumber: input.batchNumber,
        purityPercentage:
          input.purityPercentage !== undefined
            ? input.purityPercentage.toString()
            : null,
        synthesisDate: input.synthesisDate || null,
        expiryDate: input.expiryDate || null,
        coaPdfUrl: input.coaPdfUrl || null,
        stockQuantity: input.stockQuantity ?? 100,
        isReleased: input.isReleased ?? true,
      })
      .returning();

    await db.insert(auditLogs).values({
      entityName: "BATCH",
      entityId: created.id.toString(),
      action: "BATCH_CREATED",
      details: JSON.stringify({
        productId: created.productId,
        batchNumber: created.batchNumber,
        stockQuantity: created.stockQuantity,
      }),
      ipAddress: ipAddress || null,
    });

    return created;
  }

  async updateBatchStock(
    batchId: number,
    input: AdminUpdateBatchStockInput,
    ipAddress?: string,
  ) {
    type BatchUpdates = {
      stockQuantity?: number;
      isReleased?: boolean;
    };

    const updateValues: BatchUpdates = {};
    if (input.stockQuantity !== undefined)
      updateValues.stockQuantity = input.stockQuantity;
    if (input.isReleased !== undefined)
      updateValues.isReleased = input.isReleased;

    const [updated] = await db
      .update(productBatches)
      .set(updateValues)
      .where(eq(productBatches.id, batchId))
      .returning();

    if (!updated) {
      throw new Error(`Serija s ID-om ${batchId} nije pronađena.`);
    }

    await db.insert(auditLogs).values({
      entityName: "BATCH",
      entityId: batchId.toString(),
      action: "BATCH_STOCK_UPDATED",
      details: JSON.stringify(input),
      ipAddress: ipAddress || null,
    });

    return updated;
  }

  async listInquiries(query?: AdminListInquiriesQuery) {
    const limit = query?.limit ?? 50;
    const offset = query?.offset ?? 0;
    const conditions = [];

    if (query?.status) {
      conditions.push(eq(inquiries.status, query.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries)
      .where(whereClause);

    const rows = await db
      .select()
      .from(inquiries)
      .where(whereClause)
      .orderBy(desc(inquiries.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      inquiries: rows,
      total: Number(totalRes?.count || 0),
    };
  }

  async updateInquiryStatus(id: number, status: string, ipAddress?: string) {
    const [updated] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Upit s ID-om ${id} nije pronađen.`);
    }

    await db.insert(auditLogs).values({
      entityName: "INQUIRY",
      entityId: id.toString(),
      action: "INQUIRY_STATUS_UPDATED",
      details: JSON.stringify({ status }),
      ipAddress: ipAddress || null,
    });

    return updated;
  }
}

export const adminService = new AdminService();
