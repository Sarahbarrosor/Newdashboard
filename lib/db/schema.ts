import { pgTable, pgEnum, uuid, text, integer, boolean, timestamp, jsonb, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userRole = pgEnum('user_role', ['global_admin', 'country_admin', 'viewer']);
export const transferStatus = pgEnum('transfer_status', ['pending', 'transit', 'received', 'cancelled']);
export const countryCode = pgEnum('country_code', ['US', 'MX', 'CO', 'AR', 'ES']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: userRole('role').notNull().default('viewer'),
  countryCode: countryCode('country_code'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  code: countryCode('code').notNull().unique(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  currency: text('currency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  unit: text('unit').notNull().default('vial'),
  cells: text('cells'),
  lastSynced: timestamp('last_synced', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const stockLevels = pgTable(
  'stock_levels',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id').notNull().references(() => locations.id, { onDelete: 'cascade' }),
    qtyOnHand: integer('qty_on_hand').notNull().default(0),
    threshold: integer('threshold').notNull().default(0),
    lastSynced: timestamp('last_synced', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    productLocationUnique: uniqueIndex('stock_product_location_idx').on(t.productId, t.locationId),
    locationIdx: index('stock_location_idx').on(t.locationId),
  }),
);

export const transferSeq = pgTable('transfer_seq', {
  id: integer('id').primaryKey().default(1),
  nextValue: integer('next_value').notNull().default(1),
});

export const transfers = pgTable(
  'transfers',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    referenceCode: text('reference_code').notNull().unique(),
    fromLocationId: uuid('from_location_id').notNull().references(() => locations.id),
    toLocationId: uuid('to_location_id').notNull().references(() => locations.id),
    productId: uuid('product_id').notNull().references(() => products.id),
    qty: integer('qty').notNull(),
    status: transferStatus('status').notNull().default('pending'),
    urgent: boolean('urgent').notNull().default(false),
    note: text('note'),
    createdBy: uuid('created_by').notNull().references(() => users.id),
    approvedBy: uuid('approved_by').references(() => users.id),
    receivedBy: uuid('received_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    statusIdx: index('transfers_status_idx').on(t.status),
    toIdx: index('transfers_to_idx').on(t.toLocationId),
    fromIdx: index('transfers_from_idx').on(t.fromLocationId),
  }),
);

export const activityLog = pgTable(
  'activity_log',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    eventType: text('event_type').notNull(),
    tone: text('tone').notNull().default('neutral'),
    countryCode: countryCode('country_code'),
    actorId: uuid('actor_id').references(() => users.id),
    subjectType: text('subject_type'),
    subjectId: uuid('subject_id'),
    text: text('text').notNull(),
    payload: jsonb('payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    countryCreatedIdx: index('activity_country_created_idx').on(t.countryCode, t.createdAt),
    typeIdx: index('activity_type_idx').on(t.eventType),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type Product = typeof products.$inferSelect;
export type StockLevel = typeof stockLevels.$inferSelect;
export type Transfer = typeof transfers.$inferSelect;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
