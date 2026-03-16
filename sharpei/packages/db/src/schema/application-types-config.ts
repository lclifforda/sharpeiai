import { pgTable, uuid, text, jsonb, boolean, timestamp, unique } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';

export const applicationTypesConfig = pgTable(
  'application_types_config',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    type_id: text('type_id').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'),
    enabled: boolean('enabled').default(true),
    fields: jsonb('fields').notNull().default([]),
    documents: jsonb('documents').notNull().default([]),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [unique('app_types_config_org_type_unique').on(table.org_id, table.type_id)],
);
