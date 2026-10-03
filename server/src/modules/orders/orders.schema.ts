import { z } from "zod";

export const orderItemInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
});

export const shippingAddressInputSchema = z.object({
  recipientName: z.string().min(2, "Ime i prezime moraju imati barem 2 znaka"),
  streetAddress: z.string().min(3, "Ulica i kućni broj su obavezni"),
  city: z.string().min(2, "Grad je obavezan"),
  postalCode: z.string().min(4, "Poštanski broj je obavezan"),
  country: z.string().default("HR"),
  phoneNumber: z
    .string()
    .min(6, "Broj telefona je obavezan radi dostave kurirske službe"),
  companyName: z.string().optional(),
  companyOib: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  parcelLockerId: z.string().optional(),
});

export const createOrderInputSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, "Košarica ne smije biti prazna"),
  customerEmail: z.string().email("Neispravna email adresa"),
  shippingAddress: shippingAddressInputSchema,
  paymentMethod: z.enum(["cod", "keks", "transfer"]), // 'card' je za sad isključen prema uputi korisnika!
  ruoDeclarationAccepted: z.literal(true, {
    errorMap: () => ({
      message:
        "Prihvaćanje izjave o laboratorijskoj namjeni (Research Use Only) je zakonski obavezno.",
    }),
  }),
  notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const quoteOrderInputSchema = z.object({
  items: z.array(orderItemInputSchema).min(1),
});

export type QuoteOrderInput = z.infer<typeof quoteOrderInputSchema>;
