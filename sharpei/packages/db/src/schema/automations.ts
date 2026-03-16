import { pgTable, uuid, text, jsonb, timestamp, integer, numeric } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';
import { users } from './users';

export const automations = pgTable('automations', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  event_type: text('event_type').notNull(),
  action_type: text('action_type').notNull(),
  action_config: jsonb('action_config').notNull().default({}),
  conditions: jsonb('conditions').default([]),
  status: text('status').default('active').notNull(),
  execution_count: integer('execution_count').default(0),
  last_executed_at: timestamp('last_executed_at', { withTimezone: true }),
  success_rate: numeric('success_rate', { precision: 5, scale: 2 }).default('100'),
  created_by: uuid('created_by').references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const automationExecutions = pgTable('automation_executions', {
  id: uuid('id').primaryKey().defaultRandom(),
  automation_id: uuid('automation_id').notNull().references(() => automations.id, { onDelete: 'cascade' }),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  started_at: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completed_at: timestamp('completed_at', { withTimezone: true }),
  duration_ms: integer('duration_ms'),
  error_message: text('error_message'),
  trigger_data: jsonb('trigger_data'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
