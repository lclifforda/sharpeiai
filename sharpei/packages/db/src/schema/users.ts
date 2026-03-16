import { pgTable, uuid, text, boolean, timestamp, unique } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';
import { vendors } from './vendors';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey(), // References auth.users(id) — set at application level
    org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    name: text('name').notNull(),
    initials: text('initials'),
    role: text('role').notNull().default('viewer'),
    vendor_id: uuid('vendor_id').references(() => vendors.id, { onDelete: 'set null' }),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique('users_org_email_unique').on(table.org_id, table.email)],
);
