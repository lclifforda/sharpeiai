import { z } from 'zod';

export const vendorStatusEnum = z.enum(['pending', 'active', 'suspended']);

export const vendorSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  name: z.string().min(1),
  contact_email: z.string().email().nullable(),
  contact_phone: z.string().nullable(),
  status: vendorStatusEnum.default('pending'),
  invited_at: z.string().datetime().nullable(),
  activated_at: z.string().datetime().nullable(),
  metadata: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createVendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateVendorSchema = z.object({
  name: z.string().min(1).optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  status: vendorStatusEnum.optional(),
  metadata: z.record(z.unknown()).optional(),
});
