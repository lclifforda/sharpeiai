import { pgTable, uuid, text, jsonb, timestamp, numeric } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';
import { customers } from './customers';
import { vendors } from './vendors';
import { users } from './users';

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  customer_id: uuid('customer_id').references(() => customers.id),
  vendor_id: uuid('vendor_id').references(() => vendors.id),
  application_type: text('application_type').notNull(),
  status: text('status').notNull().default('draft'),
  form_data: jsonb('form_data').notNull().default({}),
  equipment_items: jsonb('equipment_items').default([]),
  amount: numeric('amount', { precision: 12, scale: 2 }),
  assigned_to: uuid('assigned_to').references(() => users.id),
  ai_assessment: jsonb('ai_assessment'),
  submitted_at: timestamp('submitted_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
