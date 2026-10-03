import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().default("postgres://postgres:postgres@localhost:5432/peptidelab"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  SHOP_CURRENCY: z.string().default("EUR"),
  FREE_SHIPPING_THRESHOLD: z.coerce.number().default(70),
  SHIPPING_FEE: z.coerce.number().default(4.9),
  COMPANY_NAME: z.string().default("PeptideLab d.o.o."),
  COMPANY_IBAN: z.string().default("HR1234567890123456789"),
  COMPANY_MODEL: z.string().default("HR00"),
  COMPANY_STREET: z.string().default("Istraživačka 10"),
  COMPANY_CITY: z.string().default("Zagreb"),
  ADMIN_API_KEY: z.string().default("dev_admin_secret_key_replace_in_prod"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
