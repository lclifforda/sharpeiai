import { z } from 'zod';

export const roleEnum = z.enum(['admin', 'manager', 'viewer', 'vendor']);
export type RoleType = z.infer<typeof roleEnum>;

export const userSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  initials: z.string().max(3).optional(),
  role: roleEnum,
  vendor_id: z.string().uuid().nullable(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const signupSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  orgName: z.string().min(1, 'Organization name is required'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Valid email required'),
  role: roleEnum,
  vendor_id: z.string().uuid().optional(),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
  name: z.string().min(1),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: roleEnum.optional(),
  is_active: z.boolean().optional(),
});
