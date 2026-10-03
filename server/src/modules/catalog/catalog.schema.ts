import { z } from "zod";

export const getProductsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sort: z.enum(["default", "price-asc", "price-desc", "name-asc", "name-desc"]).default("default"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(6),
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;

export const productSlugParamSchema = z.object({
  slug: z.string().min(1),
});
