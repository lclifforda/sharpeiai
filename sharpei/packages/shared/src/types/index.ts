import { z } from 'zod';
import {
  orgSchema,
  orgBrandingSchema,
  orgSettingsSchema,
  orgAIConfigSchema,
  createOrgSchema,
} from '../schemas/org';
import {
  userSchema,
  signupSchema,
  loginSchema,
  inviteUserSchema,
  acceptInviteSchema,
  updateUserSchema,
} from '../schemas/user';
import {
  vendorSchema,
  createVendorSchema,
  updateVendorSchema,
} from '../schemas/vendor';
import {
  applicationSchema,
  createApplicationSchema,
  updateApplicationSchema,
  equipmentItemSchema,
  aiAssessmentSchema,
} from '../schemas/application';
import {
  customerSchema,
  createCustomerSchema,
  updateCustomerSchema,
} from '../schemas/customer';
import {
  documentSchema,
  uploadDocumentSchema,
  extractedDataSchema,
} from '../schemas/document';
import {
  automationSchema,
  createAutomationSchema,
  updateAutomationSchema,
  automationExecutionSchema,
  automationConditionSchema,
} from '../schemas/automation';

// Org types
export type Org = z.infer<typeof orgSchema>;
export type OrgBranding = z.infer<typeof orgBrandingSchema>;
export type OrgSettings = z.infer<typeof orgSettingsSchema>;
export type OrgAIConfig = z.infer<typeof orgAIConfigSchema>;
export type CreateOrgInput = z.infer<typeof createOrgSchema>;

// User types
export type User = z.infer<typeof userSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Vendor types
export type Vendor = z.infer<typeof vendorSchema>;
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;

// Application types
export type Application = z.infer<typeof applicationSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type EquipmentItem = z.infer<typeof equipmentItemSchema>;
export type AIAssessment = z.infer<typeof aiAssessmentSchema>;

// Customer types
export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

// Document types
export type Document = z.infer<typeof documentSchema>;
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
export type ExtractedData = z.infer<typeof extractedDataSchema>;

// Automation types
export type Automation = z.infer<typeof automationSchema>;
export type CreateAutomationInput = z.infer<typeof createAutomationSchema>;
export type UpdateAutomationInput = z.infer<typeof updateAutomationSchema>;
export type AutomationExecution = z.infer<typeof automationExecutionSchema>;
export type AutomationCondition = z.infer<typeof automationConditionSchema>;
