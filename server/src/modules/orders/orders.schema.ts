import { z } from "zod";

export const orderItemInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
});

export const shippingAddressInputSchema = z.object({
  recipientName: z
    .string()
    .min(2, "Ime i prezime moraju imati barem 2 znaka")
    .max(200, "Ime i prezime mogu imati najviše 200 znakova"),
  streetAddress: z
    .string()
    .min(3, "Ulica i kućni broj su obavezni")
    .max(200, "Adresa može imati najviše 200 znakova"),
  city: z
    .string()
    .min(2, "Grad je obavezan")
    .max(100, "Naziv grada može imati najviše 100 znakova"),
  postalCode: z
    .string()
    .min(4, "Poštanski broj je obavezan")
    .max(20, "Poštanski broj može imati najviše 20 znakova"),
  country: z.string().max(10).default("HR"),
  phoneNumber: z
    .string()
    .min(6, "Broj telefona je obavezan radi dostave kurirske službe")
    .max(50, "Broj telefona može imati najviše 50 znakova"),
  companyName: z.string().max(200).optional(),
  companyOib: z.string().max(20).optional(),
  deliveryInstructions: z.string().max(500).optional(),
  parcelLockerId: z.string().max(100).optional(),
});

export const createOrderInputSchema = z.object({
  items: z
    .array(orderItemInputSchema)
    .min(1, "Košarica ne smije biti prazna")
    .max(50, "Maksimalno 50 različitih stavki po narudžbi"),
  customerEmail: z
    .string()
    .email("Neispravna email adresa")
    .max(255, "Email adresa je predugačka"),
  shippingAddress: shippingAddressInputSchema,
  paymentMethod: z.enum(["cod", "keks", "transfer"]), // 'card' je za sad isključen prema uputi korisnika!
  ruoDeclarationAccepted: z.literal(true, {
    errorMap: () => ({
      message:
        "Prihvaćanje izjave o laboratorijskoj namjeni (Research Use Only) je zakonski obavezno.",
    }),
  }),
  notes: z.string().max(1000, "Napomena može imati najviše 1000 znakova").optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const quoteOrderInputSchema = z.object({
  items: z.array(orderItemInputSchema).min(1),
});

export type QuoteOrderInput = z.infer<typeof quoteOrderInputSchema>;
