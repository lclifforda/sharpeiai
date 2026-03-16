import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const orgs = pgTable('orgs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  branding: jsonb('branding').default({}),
  settings: jsonb('settings').default({}),
  ai_config: jsonb('ai_config').default({ provider: 'anthropic_direct' }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
