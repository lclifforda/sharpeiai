import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  industry: text('industry'),
  location: text('location'),
  status: text('status').default('active').notNull(),
  form_data: jsonb('form_data').default({}),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
