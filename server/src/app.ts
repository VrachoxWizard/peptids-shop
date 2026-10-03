import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySensible from "@fastify/sensible";
import Fastify, { type FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { env } from "./config/env";
import { pool } from "./db";
import { catalogRoutes } from "./modules/catalog/catalog.routes";
import { ordersRoutes } from "./modules/orders/orders.routes";
import { inquiriesRoutes } from "./modules/inquiries/inquiries.routes";
import { adminRoutes } from "./modules/admin/admin.routes";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
  });

  // 1. Sigurnosna zaglavlja (Helmet)
  app.register(fastifyHelmet, {
    contentSecurityPolicy: env.NODE_ENV === "production",
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });

  // 2. CORS pravila (u produkciji dozvoljava samo konfigurirani CORS_ORIGIN)
  app.register(fastifyCors, {
    origin:
      env.NODE_ENV === "production"
        ? env.CORS_ORIGIN
        : env.CORS_ORIGIN === "*"
        ? true
        : [env.CORS_ORIGIN, "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  // 3. Globalni Rate Limiting
  app.register(fastifyRateLimit, {
    max: 120,
    timeWindow: "1 minute",
  });

  // 4. Pomoćni HTTP odgovori
  app.register(fastifySensible);

  // 5. Globalno rukovanje greškama s podrškom za Zod format
  app.setErrorHandler((error: any, request, reply) => {
    request.log.error(error);

    if (error instanceof ZodError) {
      const details = error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Podaci poslani u zahtjevu nisu ispravni.",
          details,
        },
        meta: {
          requestId: request.id,
          timestamp: new Date().toISOString(),
        },
      });
    }

    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      error: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message:
          statusCode === 500 && env.NODE_ENV === "production"
            ? "Došlo je do neočekivane pogreške na poslužitelju."
            : error.message,
      },
      meta: {
        requestId: request.id,
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Health check endpoint s provjerom stanja baze
  app.get("/health", async () => {
    let dbStatus = "connected";
    try {
      await pool.query("SELECT 1");
    } catch {
      dbStatus = "disconnected";
    }

    return {
      status: "ok",
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: "PeptideLab API",
    };
  });

  // Registracija API v1 modula
  app.register(
    async (apiV1) => {
      apiV1.register(catalogRoutes);
      apiV1.register(ordersRoutes);
      apiV1.register(inquiriesRoutes);
      apiV1.register(adminRoutes);
    },
    { prefix: "/api/v1" },
  );

  return app;
}
