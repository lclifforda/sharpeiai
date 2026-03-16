import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';
import { vendors } from './vendors';
import { users } from './users';

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role').notNull(),
  vendor_id: uuid('vendor_id').references(() => vendors.id),
  token: text('token').unique().notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  accepted_at: timestamp('accepted_at', { withTimezone: true }),
  invited_by: uuid('invited_by').references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
