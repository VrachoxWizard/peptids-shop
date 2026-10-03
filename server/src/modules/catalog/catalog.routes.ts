import type { FastifyInstance } from "fastify";
import { catalogService } from "./catalog.service";
import { getProductsQuerySchema, productSlugParamSchema } from "./catalog.schema";

export async function catalogRoutes(fastify: FastifyInstance) {
  fastify.get("/products", async (request) => {
    const query = getProductsQuerySchema.parse(request.query);
    const langHeader = request.headers["accept-language"];
    const lang: "hr" | "en" = langHeader && langHeader.toLowerCase().startsWith("en") ? "en" : "hr";

    const result = await catalogService.listProducts(query, lang);

    return {
      data: result.items,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  });

  fastify.get("/products/:slug", async (request, reply) => {
    const { slug } = productSlugParamSchema.parse(request.params);
    const langHeader = request.headers["accept-language"];
    const lang: "hr" | "en" = langHeader && langHeader.toLowerCase().startsWith("en") ? "en" : "hr";

    const product = await catalogService.getProductBySlug(slug, lang);

    if (!product) {
      return reply.status(404).send({
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: lang === "en" ? "Product not found" : "Traženi proizvod nije pronađen",
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    return {
      data: product,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  });
}
