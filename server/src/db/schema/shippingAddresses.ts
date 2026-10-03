import {
  pgTable,
  serial,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const shippingAddresses = pgTable(
  "shipping_addresses",
  {
    id: serial("id").primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    recipientName: varchar("recipient_name", { length: 255 }).notNull(),
    streetAddress: varchar("street_address", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 50 }).default("HR").notNull(),
    phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
    companyName: varchar("company_name", { length: 255 }),
    companyOib: varchar("company_oib", { length: 50 }),
    deliveryInstructions: text("delivery_instructions"),
    parcelLockerId: varchar("parcel_locker_id", { length: 100 }),
  },
  (table) => [
    uniqueIndex("idx_shipping_addresses_order_id").on(table.orderId),
  ],
);

export type ShippingAddress = typeof shippingAddresses.$inferSelect;
export type NewShippingAddress = typeof shippingAddresses.$inferInsert;
