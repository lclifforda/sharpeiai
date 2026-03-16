import { z } from 'zod';

export const documentTypeEnum = z.enum([
  'business_license',
  'articles_of_incorporation',
  'tax_return_year1',
  'tax_return_year2',
  'balance_sheet',
  'profit_loss',
  'bank_statement',
  'equipment_quote',
  'personal_guarantee',
  'personal_tax_return',
  'insurance_cert',
  'personal_id',
  'ucc_filing',
  'equipment_spec_sheet',
]);

export const documentStatusEnum = z.enum(['pending', 'processing', 'verified', 'needs_review', 'rejected']);

export const extractedDataSchema = z.object({
  document_type_confirmed: z.string().optional(),
  fields: z.record(z.unknown()).optional(),
  period: z.string().optional(),
  entity_name: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
  summary: z.string().optional(),
  flags: z.array(z.string()).default([]),
  textract_confidence: z.number().optional(),
  error: z.string().optional(),
});

export const documentSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  application_id: z.string().uuid().nullable(),
  customer_id: z.string().uuid().nullable(),
  document_type: z.string(),
  file_name: z.string(),
  storage_path: z.string(),
  file_size: z.number().nullable(),
  mime_type: z.string().nullable(),
  status: documentStatusEnum.default('pending'),
  extracted_data: extractedDataSchema.nullable(),
  verification_notes: z.array(z.string()).nullable(),
  uploaded_by: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
});

export const uploadDocumentSchema = z.object({
  application_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  document_type: z.string().min(1),
});
