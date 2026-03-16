import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';

export const knowledgeBase = pgTable('knowledge_base', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  storage_path: text('storage_path').notNull(),
  file_size: text('file_size'),
  status: text('status').default('processing').notNull(),
  ai_note: text('ai_note'),
  applicable_types: text('applicable_types').array(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
