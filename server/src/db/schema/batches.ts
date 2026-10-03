import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { products } from "./products";

export const productBatches = pgTable("product_batches", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  batchNumber: varchar("batch_number", { length: 100 }).notNull(),
  purityPercentage: numeric("purity_percentage", { precision: 5, scale: 2 }),
  synthesisDate: date("synthesis_date"),
  expiryDate: date("expiry_date"),
  coaPdfUrl: varchar("coa_pdf_url", { length: 512 }),
  stockQuantity: integer("stock_quantity").default(100).notNull(),
  isReleased: boolean("is_released").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ProductBatch = typeof productBatches.$inferSelect;
export type NewProductBatch = typeof productBatches.$inferInsert;
