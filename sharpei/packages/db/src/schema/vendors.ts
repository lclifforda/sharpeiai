import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';

export const vendors = pgTable('vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  contact_email: text('contact_email'),
  contact_phone: text('contact_phone'),
  status: text('status').default('pending').notNull(),
  invited_at: timestamp('invited_at', { withTimezone: true }),
  activated_at: timestamp('activated_at', { withTimezone: true }),
  metadata: jsonb('metadata').default({}),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
