import { z } from "zod";

export const adminListOrdersQuerySchema = z.object({
  status: z
    .enum(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export const adminUpdateOrderStatusSchema = z.object({
  status: z
    .enum(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED"]).optional(),
  trackingNumber: z.string().max(100).optional(),
  shippingCarrier: z.string().max(50).optional(),
  note: z.string().max(500).optional(),
});

export type AdminListOrdersQuery = z.infer<typeof adminListOrdersQuerySchema>;
export type AdminUpdateOrderStatusInput = z.infer<
  typeof adminUpdateOrderStatusSchema
>;

export const adminCreateProductSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(128)
    .regex(/^[a-z0-9-]+$/, "Slug mora sadržavati samo mala slova, brojeve i crtice"),
  nameHr: z.string().min(2).max(255),
  nameEn: z.string().max(255).optional(),
  category: z.string().min(2).max(100),
  categoryEn: z.string().max(100).optional(),
  descriptionHr: z.string().min(5),
  descriptionEn: z.string().optional(),
  amount: z.string().min(1).max(50),
  price: z.coerce.number().positive("Cijena mora biti pozitivan broj"),
  imageUrl: z.string().max(512).optional(),
  featured: z.boolean().default(false),
  purity: z.string().max(100).optional(),
  casNumber: z.string().max(50).optional(),
  molecularWeight: z.string().max(50).optional(),
  isActive: z.boolean().default(true),
});

export const adminUpdateProductSchema = adminCreateProductSchema.partial();

export type AdminCreateProductInput = z.infer<typeof adminCreateProductSchema>;
export type AdminUpdateProductInput = z.infer<typeof adminUpdateProductSchema>;

