import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  entityName: varchar("entity_name", { length: 50 }).notNull(), // 'ORDER' | 'PRODUCT' | 'BATCH'
  entityId: varchar("entity_id", { length: 100 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(), // 'CREATED' | 'STATUS_CHANGE' | 'STOCK_UPDATE'
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 100 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
