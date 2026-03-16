import { z } from 'zod';

export const applicationStatusEnum = z.enum([
  'draft',
  'submitted',
  'in_review',
  'approved',
  'funded',
  'declined',
  'incomplete',
]);

export const equipmentItemSchema = z.object({
  description: z.string(),
  vendor: z.string(),
  quantity: z.number().positive(),
  unitCost: z.number().positive(),
});

export const aiAssessmentSchema = z.object({
  recommendation: z.enum(['approve', 'review', 'decline']),
  confidence: z.number().min(0).max(100),
  highlights: z.array(z.string()),
  summary: z.string(),
});

export const applicationSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  customer_id: z.string().uuid().nullable(),
  vendor_id: z.string().uuid().nullable(),
  application_type: z.string(),
  status: applicationStatusEnum.default('draft'),
  form_data: z.record(z.string()).default({}),
  equipment_items: z.array(equipmentItemSchema).default([]),
  amount: z.number().nullable(),
  assigned_to: z.string().uuid().nullable(),
  ai_assessment: aiAssessmentSchema.nullable(),
  submitted_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createApplicationSchema = z.object({
  application_type: z.string().min(1),
  customer_id: z.string().uuid().optional(),
  vendor_id: z.string().uuid().optional(),
  form_data: z.record(z.string()).optional(),
  equipment_items: z.array(equipmentItemSchema).optional(),
  amount: z.number().optional(),
});

export const updateApplicationSchema = z.object({
  form_data: z.record(z.string()).optional(),
  equipment_items: z.array(equipmentItemSchema).optional(),
  amount: z.number().optional(),
  status: applicationStatusEnum.optional(),
  assigned_to: z.string().uuid().optional(),
});
