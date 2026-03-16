import { z } from 'zod';

export const automationStatusEnum = z.enum(['active', 'paused']);
export const executionStatusEnum = z.enum(['success', 'failed', 'running', 'pending']);

export const automationConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
  value: z.string(),
});

export const automationSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  event_type: z.string(),
  action_type: z.string(),
  action_config: z.record(z.unknown()),
  conditions: z.array(automationConditionSchema).default([]),
  status: automationStatusEnum.default('active'),
  execution_count: z.number().default(0),
  last_executed_at: z.string().datetime().nullable(),
  success_rate: z.number().default(100),
  created_by: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createAutomationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  event_type: z.string().min(1),
  action_type: z.string().min(1),
  action_config: z.record(z.unknown()),
  conditions: z.array(automationConditionSchema).optional(),
});

export const updateAutomationSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  event_type: z.string().optional(),
  action_type: z.string().optional(),
  action_config: z.record(z.unknown()).optional(),
  conditions: z.array(automationConditionSchema).optional(),
  status: automationStatusEnum.optional(),
});

export const automationExecutionSchema = z.object({
  id: z.string().uuid(),
  automation_id: z.string().uuid(),
  org_id: z.string().uuid(),
  status: executionStatusEnum,
  started_at: z.string().datetime(),
  completed_at: z.string().datetime().nullable(),
  duration_ms: z.number().nullable(),
  error_message: z.string().nullable(),
  trigger_data: z.record(z.unknown()).nullable(),
  created_at: z.string().datetime(),
});
