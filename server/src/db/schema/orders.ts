import {
  boolean,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    customerEmail: varchar("customer_email", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).notNull(),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("EUR").notNull(),
    status: varchar("status", { length: 50 }).default("PENDING").notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // 'cod' | 'keks' | 'transfer'
    paymentStatus: varchar("payment_status", { length: 50 }).default("PENDING").notNull(),
    trackingNumber: varchar("tracking_number", { length: 100 }),
    shippingCarrier: varchar("shipping_carrier", { length: 50 }).default("GLS"),
    ruoAccepted: boolean("ruo_accepted").default(true).notNull(), // Research Use Only
    ruoAcceptedAt: timestamp("ruo_accepted_at").defaultNow().notNull(),
    ipAddress: varchar("ip_address", { length: 100 }),
    userAgent: varchar("user_agent", { length: 512 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_orders_order_number").on(table.orderNumber),
    index("idx_orders_customer_email").on(table.customerEmail),
    index("idx_orders_status").on(table.status),
    index("idx_orders_created_at").on(table.createdAt),
  ],
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
