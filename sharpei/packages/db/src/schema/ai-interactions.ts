import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';
import { users } from './users';

export const aiInteractions = pgTable('ai_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id),
  user_id: uuid('user_id').references(() => users.id),
  provider: text('provider').notNull(),
  model: text('model').notNull(),
  context: text('context'),
  input_tokens: integer('input_tokens'),
  output_tokens: integer('output_tokens'),
  latency_ms: integer('latency_ms'),
  status: text('status').notNull(),
  error_message: text('error_message'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
