import crypto from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { env } from "../../config/env";
import { adminService } from "./admin.service";
import {
  adminListOrdersQuerySchema,
  adminUpdateOrderStatusSchema,
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
}
