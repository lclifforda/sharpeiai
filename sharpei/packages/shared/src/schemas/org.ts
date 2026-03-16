import { z } from 'zod';

export const orgBrandingSchema = z.object({
  logoUrl: z.string().optional(),
  primaryColor: z.string().default('#1a1a2e'),
  accentColor: z.string().default('#e94560'),
  welcomeMessage: z.string().optional(),
  companyName: z.string().optional(),
});

export const orgAIConfigSchema = z.object({
  provider: z.enum(['anthropic_direct', 'bedrock']).default('anthropic_direct'),
  bedrock_region: z.string().optional(),
  bedrock_model_id: z.string().optional(),
  bedrock_role_arn: z.string().optional(),
});

export const orgSettingsSchema = z.object({
  timezone: z.string().default('America/Los_Angeles'),
  currency: z.string().default('USD'),
  defaultLanguage: z.string().default('en'),
});

export const orgSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  branding: orgBrandingSchema.default({}),
  settings: orgSettingsSchema.default({}),
  ai_config: orgAIConfigSchema.default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createOrgSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});

export const updateOrgBrandingSchema = orgBrandingSchema.partial();
export const updateOrgSettingsSchema = orgSettingsSchema.partial();
export const updateOrgAIConfigSchema = orgAIConfigSchema.partial();
