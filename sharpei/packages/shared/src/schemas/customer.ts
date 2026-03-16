import { z } from 'zod';

export const customerStatusEnum = z.enum(['active', 'inactive']);

export const customerSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  industry: z.string().nullable(),
  location: z.string().nullable(),
  status: customerStatusEnum.default('active'),
  form_data: z.record(z.string()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  form_data: z.record(z.string()).optional(),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  status: customerStatusEnum.optional(),
  form_data: z.record(z.string()).optional(),
});
