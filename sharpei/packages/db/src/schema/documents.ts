import { pgTable, uuid, text, jsonb, timestamp, bigint } from 'drizzle-orm/pg-core';
import { orgs } from './orgs';
import { applications } from './applications';
import { customers } from './customers';
import { users } from './users';

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  application_id: uuid('application_id').references(() => applications.id, { onDelete: 'cascade' }),
  customer_id: uuid('customer_id').references(() => customers.id),
  document_type: text('document_type').notNull(),
  file_name: text('file_name').notNull(),
  storage_path: text('storage_path').notNull(),
  file_size: bigint('file_size', { mode: 'number' }),
  mime_type: text('mime_type'),
  status: text('status').default('pending').notNull(),
  extracted_data: jsonb('extracted_data'),
  verification_notes: jsonb('verification_notes'),
  uploaded_by: uuid('uploaded_by').references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
