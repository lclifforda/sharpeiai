import { pgTable, uuid, text, jsonb, timestamp, inet } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';
import { users } from './users';

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  resource_type: text('resource_type').notNull(),
  resource_id: uuid('resource_id'),
  changes: jsonb('changes'),
  ip_address: inet('ip_address'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
