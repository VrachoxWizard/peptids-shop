import {
  boolean,
  index,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    nameHr: varchar("name_hr", { length: 255 }).notNull(),
    nameEn: varchar("name_en", { length: 255 }),
    category: varchar("category", { length: 100 }).notNull(),
    categoryEn: varchar("category_en", { length: 100 }),
    descriptionHr: text("description_hr").notNull(),
    descriptionEn: text("description_en"),
    amount: varchar("amount", { length: 50 }).notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    imageUrl: varchar("image_url", { length: 512 }),
    featured: boolean("featured").default(false),
    purity: varchar("purity", { length: 100 }),
    casNumber: varchar("cas_number", { length: 50 }),
    molecularWeight: varchar("molecular_weight", { length: 50 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_products_category").on(table.category),
    index("idx_products_price").on(table.price),
    index("idx_products_active").on(table.isActive),
    index("idx_products_featured").on(table.featured),
  ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
