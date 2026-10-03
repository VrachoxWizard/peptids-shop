import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySensible from "@fastify/sensible";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { env } from "./config/env";
import { pool } from "./db";
import { catalogRoutes } from "./modules/catalog/catalog.routes";
import { ordersRoutes } from "./modules/orders/orders.routes";
import { inquiriesRoutes } from "./modules/inquiries/inquiries.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
export function buildApp(): FastifyInstance {
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());

  const app = Fastify({
    trustProxy: true,
    bodyLimit: 131072, // 128 KB limit za sprječavanje DoS/memory exhaustion napada
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

  // 2. CORS pravila s podrškom za više produkcijskih domena i lokalni razvoj
  app.register(fastifyCors, {
    origin: (origin, cb) => {
      // Zahtjevi bez origin zaglavlja (server-to-server, cURL, healthcheck)
      if (!origin) {
        return cb(null, true);
      }

      if (env.NODE_ENV !== "production") {
        return cb(null, true);
      }

      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return cb(null, true);
      }

      return cb(new Error("CORS unauthorized origin"), false);
    },
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
  app.setErrorHandler((error: FastifyError | Error, request, reply) => {
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

    const statusCode =
      "statusCode" in error && typeof error.statusCode === "number"
        ? error.statusCode
        : 500;
    const errorCode =
      "code" in error && typeof error.code === "string"
        ? error.code
        : "INTERNAL_SERVER_ERROR";

    return reply.status(statusCode).send({
      error: {
        code: errorCode,
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
  app.get("/health", async (_request, reply) => {
    let dbStatus = "connected";
    try {
      await pool.query("SELECT 1");
    } catch {
      dbStatus = "disconnected";
    }

    const isHealthy = dbStatus === "connected";
    return reply.status(isHealthy ? 200 : 503).send({
      status: isHealthy ? "ok" : "degraded",
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: "PeptideLab API",
    });
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
