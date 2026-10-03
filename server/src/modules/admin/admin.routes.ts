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
  const headerKey = request.headers["x-admin-key"] as string | undefined;
  const authHeader = request.headers.authorization;
  const bearerKey = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : undefined;

  const keyToTest = headerKey || bearerKey;

  if (!keyToTest || !env.ADMIN_API_KEY) {
    reply.status(401).send({
      error: {
        code: "UNAUTHORIZED",
        message: "Nedostaje administratorski autorizacijski ključ.",
      },
    });
    return;
  }

  const providedBuf = Buffer.from(keyToTest);
  const secretBuf = Buffer.from(env.ADMIN_API_KEY);

  if (
    providedBuf.length !== secretBuf.length ||
    !crypto.timingSafeEqual(providedBuf, secretBuf)
  ) {
    reply.status(403).send({
      error: {
        code: "FORBIDDEN",
        message: "Neispravan administratorski ključ.",
      },
    });
    return;
  }
}

export async function adminRoutes(fastify: FastifyInstance) {
  // Primijeni provjeru administratorskih ovlasti na sve rute unutar ovog modula
  fastify.addHook("preHandler", async (request, reply) => {
    verifyAdminAuth(request, reply);
  });

  // Statistika za administratorsku kontrolnu ploču
  fastify.get("/admin/stats", async () => {
    const stats = await adminService.getDashboardStats();
    return {
      data: stats,
      meta: { timestamp: new Date().toISOString() },
    };
  });

  // Pregled svih narudžbi uz filtriranje i pretraživanje
  fastify.get("/admin/orders", async (request) => {
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
  fastify.get("/admin/orders/:id", async (request, reply) => {
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
  fastify.patch("/admin/orders/:id/status", async (request, reply) => {
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
    } catch (err: any) {
      return reply.status(400).send({
        error: {
          code: "UPDATE_STATUS_FAILED",
          message: err.message || "Neuspjelo ažuriranje statusa narudžbe.",
        },
      });
    }
  });
}
