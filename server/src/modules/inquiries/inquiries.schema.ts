import { z } from "zod";

export const createInquiryInputSchema = z.object({
  name: z.string().min(2, "Ime mora imati barem 2 znaka").max(100),
  email: z.string().email("Unesite ispravnu email adresu"),
  message: z.string().min(10, "Poruka mora imati barem 10 znakova").max(2000),
});

export type CreateInquiryInput = z.infer<typeof createInquiryInputSchema>;
