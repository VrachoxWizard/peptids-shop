import type { FastifyInstance } from "fastify";
import { inquiriesService } from "./inquiries.service";
import { createInquiryInputSchema } from "./inquiries.schema";

export async function inquiriesRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/inquiries",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    async (request, reply) => {
      const input = createInquiryInputSchema.parse(request.body);
      const ipAddress = request.ip;

      const result = await inquiriesService.createInquiry(input, ipAddress);

      return reply.status(201).send({
        data: result,
        meta: {
          message: "Vaš upit je uspješno zabilježen.",
          timestamp: new Date().toISOString(),
        },
      });
    },
  );
}
