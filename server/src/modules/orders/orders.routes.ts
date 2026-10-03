import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ordersService } from "./orders.service";
import {
  createOrderInputSchema,
  quoteOrderInputSchema,
} from "./orders.schema";

export async function ordersRoutes(fastify: FastifyInstance) {
  // Izračun i verifikacija cijena / prag dostave u realnom vremenu
  fastify.post("/orders/quote", async (request) => {
    const input = quoteOrderInputSchema.parse(request.body);
    const quote = await ordersService.quoteOrder(input);

    return {
      data: quote,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  });

  // Kreiranje narudžbe sa strogim rate-limitom (zaštita od spam narudžbi)
  fastify.post(
    "/orders",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    async (request, reply) => {
    const input = createOrderInputSchema.parse(request.body);
    const ipAddress = request.ip;
    const userAgent = request.headers["user-agent"];

    try {
      const order = await ordersService.createOrder(input, ipAddress, userAgent);
      return reply.status(201).send({
        data: order,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Neuspjelo kreiranje narudžbe.";
      return reply.status(400).send({
        error: {
          code: "ORDER_CREATION_FAILED",
          message,
        },
      });
    }
  });

  // Praćenje statusa narudžbe sa zaštitom od prekomjernog broja upita
  fastify.get(
    "/orders/:orderNumber",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      },
    },
    async (request, reply) => {
      const { orderNumber } = z
        .object({ orderNumber: z.string().min(1) })
        .parse(request.params);

      const order = await ordersService.getOrderByNumber(orderNumber);

      if (!order) {
        return reply.status(404).send({
          error: {
            code: "ORDER_NOT_FOUND",
            message: "Narudžba s navedenim brojem nije pronađena.",
          },
        });
      }

      return {
        data: order,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    },
  );
}
