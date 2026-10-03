import crypto from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { env } from "../../config/env";
import { adminService } from "./admin.service";
import {
  adminCreateBatchSchema,
  adminCreateProductSchema,
  adminListOrdersQuerySchema,
  adminUpdateBatchStockSchema,
  adminUpdateInquiryStatusSchema,
  adminUpdateOrderStatusSchema,
  adminUpdateProductSchema,
} from "./admin.schema";

function verifyAdminAuth(request: FastifyRequest, reply: FastifyReply) {
  const rawHeaderKey = request.headers["x-admin-key"];
  const headerKey = Array.isArray(rawHeaderKey)
    ? rawHeaderKey[0]
    : typeof rawHeaderKey === "string"
    ? rawHeaderKey
    : undefined;

  const authHeader = Array.isArray(request.headers.authorization)
    ? request.headers.authorization[0]
    : request.headers.authorization;
  const bearerKey = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : undefined;

  const keyToTest = headerKey || bearerKey;

  if (
    env.NODE_ENV === "production" &&
    (!env.ADMIN_API_KEY ||
      env.ADMIN_API_KEY === "dev_admin_secret_key_replace_in_prod")
  ) {
    return reply.status(500).send({
      error: {
        code: "SERVER_MISCONFIGURATION",
        message:
          "Administratorski pristup je onemogućen jer poslužitelj nema postavljen siguran produkcijski ključ.",
      },
    });
  }

  if (!keyToTest || !env.ADMIN_API_KEY) {
    return reply.status(401).send({
      error: {
        code: "UNAUTHORIZED",
        message: "Nedostaje administratorski autorizacijski ključ.",
      },
    });
  }

  const hashKey = (key: string) =>
    crypto.createHash("sha256").update(key).digest();
  const providedHash = hashKey(keyToTest);
  const secretHash = hashKey(env.ADMIN_API_KEY);

  if (!crypto.timingSafeEqual(providedHash, secretHash)) {
    return reply.status(403).send({
      error: {
        code: "FORBIDDEN",
        message: "Neispravan administratorski ključ.",
      },
    });
  }
}

const adminRouteConfig = {
  rateLimit: {
    max: 15,
    timeWindow: "1 minute",
  },
};

export async function adminRoutes(fastify: FastifyInstance) {
  // Primijeni provjeru administratorskih ovlasti na sve rute unutar ovog modula
  fastify.addHook("preHandler", async (request, reply) => {
    return verifyAdminAuth(request, reply);
  });

  // Statistika za administratorsku kontrolnu ploču
  fastify.get("/admin/stats", { config: adminRouteConfig }, async () => {
    const stats = await adminService.getDashboardStats();
    return {
      data: stats,
      meta: { timestamp: new Date().toISOString() },
    };
  });

  // Pregled svih narudžbi uz filtriranje i pretraživanje
  fastify.get("/admin/orders", { config: adminRouteConfig }, async (request) => {
    const query = adminListOrdersQuerySchema.parse(request.query);
    const result = await adminService.listOrders(query);

    return {
      data: result.orders,
      pagination: {
        total: result.total,
        limit: query.limit,
        offset: query.offset,
      },
      meta: { timestamp: new Date().toISOString() },
    };
  });

  // Detaljan pregled jedne narudžbe
  fastify.get("/admin/orders/:id", { config: adminRouteConfig }, async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const orderDetails = await adminService.getOrderDetails(id);

    if (!orderDetails) {
      return reply.status(404).send({
        error: {
          code: "ORDER_NOT_FOUND",
          message: "Narudžba s navedenim ID-om nije pronađena.",
        },
      });
    }

    return {
      data: orderDetails,
      meta: { timestamp: new Date().toISOString() },
    };
  });

  // Ažuriranje statusa narudžbe i unos koda za praćenje pošiljke (GLS)
  fastify.patch("/admin/orders/:id/status", { config: adminRouteConfig }, async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const input = adminUpdateOrderStatusSchema.parse(request.body);
    const ipAddress = request.ip;

    try {
      const updated = await adminService.updateOrderStatus(id, input, ipAddress);
      return {
        data: {
          id: updated.id,
          orderNumber: updated.orderNumber,
          status: updated.status,
          paymentStatus: updated.paymentStatus,
          trackingNumber: updated.trackingNumber,
          shippingCarrier: updated.shippingCarrier,
          updatedAt: updated.updatedAt,
        },
        meta: { timestamp: new Date().toISOString() },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Neuspjelo ažuriranje statusa narudžbe.";
      return reply.status(400).send({
        error: {
          code: "UPDATE_STATUS_FAILED",
          message,
        },
      });
    }
  });

  // Dohvat svih artikala za administrativni CMS (uključujući zalihe i neaktivne artikle)
  fastify.get("/admin/products", { config: adminRouteConfig }, async () => {
    const productsList = await adminService.listAdminProducts();
    return {
      data: productsList,
      meta: { timestamp: new Date().toISOString() },
    };
  });

  // Dodavanje novog artikla
  fastify.post("/admin/products", { config: adminRouteConfig }, async (request, reply) => {
    const input = adminCreateProductSchema.parse(request.body);
    const ipAddress = request.ip;
    try {
      const created = await adminService.createProduct(input, ipAddress);
      return reply.status(201).send({
        data: created,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Neuspjelo dodavanje artikla.";
      return reply.status(400).send({
        error: {
          code: "CREATE_PRODUCT_FAILED",
          message,
        },
      });
    }
  });

  // Uređivanje artikla
  fastify.put("/admin/products/:id", { config: adminRouteConfig }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number().positive() }).parse(request.params);
    const input = adminUpdateProductSchema.parse(request.body);
    const ipAddress = request.ip;
    try {
      const updated = await adminService.updateProduct(id, input, ipAddress);
      return {
        data: updated,
        meta: { timestamp: new Date().toISOString() },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Neuspjelo ažuriranje artikla.";
      return reply.status(400).send({
        error: {
          code: "UPDATE_PRODUCT_FAILED",
          message,
        },
      });
    }
  });

  // Deaktivacija artikla
  fastify.delete("/admin/products/:id", { config: adminRouteConfig }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number().positive() }).parse(request.params);
    const ipAddress = request.ip;
    try {
      const deactivated = await adminService.deleteProduct(id, ipAddress);
      return {
        data: { id: deactivated.id, slug: deactivated.slug, isActive: deactivated.isActive },
        meta: { timestamp: new Date().toISOString() },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Neuspjela deaktivacija artikla.";
      return reply.status(400).send({
        error: {
          code: "DELETE_PRODUCT_FAILED",
          message,
        },
      });
    }
  });

  // Dodavanje nove serije (batch) za artikl
  fastify.post("/admin/batches", { config: adminRouteConfig }, async (request, reply) => {
    const input = adminCreateBatchSchema.parse(request.body);
    const ipAddress = request.ip;
    try {
      const created = await adminService.createBatch(input, ipAddress);
      return reply.status(201).send({
        data: created,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Neuspjelo dodavanje serije.";
      return reply.status(400).send({
        error: {
          code: "CREATE_BATCH_FAILED",
          message,
        },
      });
    }
  });

  // Ažuriranje zaliha serije artikla
  fastify.patch("/admin/batches/:id/stock", { config: adminRouteConfig }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number().positive() }).parse(request.params);
    const input = adminUpdateBatchStockSchema.parse(request.body);
    const ipAddress = request.ip;
    try {
      const updated = await adminService.updateBatchStock(id, input, ipAddress);
      return {
        data: updated,
        meta: { timestamp: new Date().toISOString() },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Neuspjelo ažuriranje zaliha serije.";
      return reply.status(400).send({
        error: {
          code: "UPDATE_BATCH_STOCK_FAILED",
          message,
        },
      });
    }
  });

  // Dohvat svih kontakt upita
  fastify.get("/admin/inquiries", { config: adminRouteConfig }, async () => {
    const inquiriesList = await adminService.listInquiries();
    return {
      data: inquiriesList,
      meta: { timestamp: new Date().toISOString() },
    };
  });

  // Ažuriranje statusa kontakt upita (npr. IN_PROGRESS, ANSWERED, ARCHIVED)
  fastify.patch("/admin/inquiries/:id/status", { config: adminRouteConfig }, async (request, reply) => {
    const { id } = z.object({ id: z.coerce.number().positive() }).parse(request.params);
    const input = adminUpdateInquiryStatusSchema.parse(request.body);
    const ipAddress = request.ip;
    try {
      const updated = await adminService.updateInquiryStatus(id, input.status, ipAddress);
      return {
        data: updated,
        meta: { timestamp: new Date().toISOString() },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Neuspjelo ažuriranje statusa upita.";
      return reply.status(400).send({
        error: {
          code: "UPDATE_INQUIRY_STATUS_FAILED",
          message,
        },
      });
    }
  });
}
