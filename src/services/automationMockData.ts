// Mock data for Automations demo UI

export interface AutomationTemplate {
  slug: string;
  name: string;
  description: string;
  category: "notifications" | "crm" | "operations";
  icon: string;
  eventType: string;
  eventLabel: string;
  actionType: "slack" | "email" | "webhook" | "crm_update";
  configFields: ConfigField[];
  isPopular: boolean;
}

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "email" | "url" | "textarea" | "select";
  placeholder: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

export interface Automation {
  id: string;
  pid: string;
  name: string;
  description: string;
  eventType: string;
  eventLabel: string;
  actionType: "slack" | "email" | "webhook" | "crm_update";
  actionLabel: string;
  actionConfig: Record<string, string>;
  status: "active" | "paused";
  executionCount: number;
  lastExecutedAt: string | null;
  successRate: number;
  createdAt: string;
  templateSlug: string | null;
}

export interface AutomationExecution {
  id: string;
  automationId: string;
  eventType: string;
  status: "success" | "failed" | "running" | "pending";
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  errorMessage: string | null;
  triggerData: Record<string, any>;
}

export interface AutomationStats {
  totalAutomations: number;
  activeAutomations: number;
  executionsToday: number;
  executionsWeek: number;
  successRate: number;
}

export interface EventCategory {
  label: string;
  events: { value: string; label: string }[];
}

// Event categories matching the existing backend event system
export const EVENT_CATEGORIES: EventCategory[] = [
  {
    label: "Orders",
    events: [
      { value: "order_created", label: "Order Created" },
      { value: "order_updated", label: "Order Updated" },
      { value: "order_payment_method_pending", label: "Payment Method Pending" },
      { value: "order_payment_method_error", label: "Payment Method Error" },
      { value: "order_payment_method_added", label: "Payment Method Added" },
      { value: "order_review", label: "Order Under Review" },
      { value: "order_cancelled", label: "Order Cancelled" },
      { value: "order_accepted", label: "Order Accepted" },
      { value: "order_fulfillment", label: "Order Fulfillment" },
      { value: "order_delivery", label: "Order Delivered" },
      { value: "order_completed", label: "Order Completed" },
    ],
  },
  {
    label: "Contracts",
    events: [
      { value: "contract_active", label: "Contract Activated" },
      { value: "contract_cancelled", label: "Contract Cancelled" },
      { value: "contract_completed", label: "Contract Completed" },
      { value: "contract_completed_buyout", label: "Contract Buyout" },
      { value: "contract_draft", label: "Contract Draft Created" },
      { value: "contract_inspection", label: "Equipment Inspection" },
      { value: "contract_return", label: "Equipment Return" },
      { value: "contract_printed_label", label: "Return Label Printed" },
    ],
  },
  {
    label: "Payments",
    events: [
      { value: "transaction_cancelled", label: "Payment Cancelled" },
      { value: "transaction_captured", label: "Payment Captured" },
      { value: "transaction_declined", label: "Payment Declined" },
      { value: "transaction_failed", label: "Payment Failed" },
      { value: "transaction_paid", label: "Payment Received" },
      { value: "transaction_refunded", label: "Payment Refunded" },
    ],
  },
  {
    label: "Customers",
    events: [
      { value: "customer_created", label: "Customer Created" },
    ],
  },
  {
    label: "Financing",
    events: [
      { value: "financing_positive_preapproval", label: "Financing Pre-Approved" },
      { value: "financing_approved_grenke", label: "Grenke Financing Approved" },
    ],
  },
];

// Pre-built automation templates
export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    slug: "slack-order-created",
    name: "New Order Alert",
    description: "Send a Slack notification when a new order is placed",
    category: "notifications",
    icon: "MessageSquare",
    eventType: "order_created",
    eventLabel: "Order Created",
    actionType: "slack",
    isPopular: true,
    configFields: [
      { key: "webhookUrl", label: "Slack Webhook URL", type: "url", placeholder: "https://hooks.slack.com/services/...", required: true },
      { key: "channel", label: "Channel", type: "text", placeholder: "#orders", required: true },
      { key: "messageTemplate", label: "Message Template", type: "textarea", placeholder: "New order {{order_id}} from {{company_name}} - {{amount}}", required: false },
    ],
  },
  {
    slug: "email-payment-failed",
    name: "Payment Failure Alert",
    description: "Email the team when a payment fails so you can act quickly",
    category: "notifications",
    icon: "AlertTriangle",
    eventType: "transaction_failed",
    eventLabel: "Payment Failed",
    actionType: "email",
    isPopular: true,
    configFields: [
      { key: "recipients", label: "Recipients", type: "email", placeholder: "finance@company.com, ops@company.com", required: true },
      { key: "subject", label: "Email Subject", type: "text", placeholder: "Payment Failed - {{order_id}}", required: true },
      { key: "body", label: "Email Body", type: "textarea", placeholder: "A payment of {{amount}} for order {{order_id}} has failed...", required: false },
    ],
  },
  {
    slug: "slack-contract-active",
    name: "Contract Activation Notice",
    description: "Notify your team on Slack when a contract goes live",
    category: "notifications",
    icon: "FileCheck",
    eventType: "contract_active",
    eventLabel: "Contract Activated",
    actionType: "slack",
    isPopular: true,
    configFields: [
      { key: "webhookUrl", label: "Slack Webhook URL", type: "url", placeholder: "https://hooks.slack.com/services/...", required: true },
      { key: "channel", label: "Channel", type: "text", placeholder: "#contracts", required: true },
      { key: "messageTemplate", label: "Message Template", type: "textarea", placeholder: "Contract {{contract_id}} is now active for {{company_name}}", required: false },
    ],
  },
  {
    slug: "email-payment-received",
    name: "Payment Confirmation",
    description: "Send a confirmation email when a payment is successfully received",
    category: "notifications",
    icon: "CheckCircle",
    eventType: "transaction_paid",
    eventLabel: "Payment Received",
    actionType: "email",
    isPopular: false,
    configFields: [
      { key: "recipients", label: "Recipients", type: "email", placeholder: "finance@company.com", required: true },
      { key: "subject", label: "Email Subject", type: "text", placeholder: "Payment Received - {{amount}}", required: true },
      { key: "body", label: "Email Body", type: "textarea", placeholder: "Payment of {{amount}} has been received for order {{order_id}}", required: false },
    ],
  },
  {
    slug: "hubspot-customer-sync",
    name: "Sync to HubSpot",
    description: "Automatically create or update a HubSpot contact when a new customer signs up",
    category: "crm",
    icon: "Users",
    eventType: "customer_created",
    eventLabel: "Customer Created",
    actionType: "crm_update",
    isPopular: true,
    configFields: [
      { key: "apiKey", label: "HubSpot API Key", type: "text", placeholder: "pat-na1-...", required: true },
      { key: "pipeline", label: "Pipeline", type: "select", placeholder: "Select pipeline", required: true, options: [
        { label: "Sales Pipeline", value: "sales" },
        { label: "Onboarding", value: "onboarding" },
        { label: "Equipment Leasing", value: "leasing" },
      ]},
      { key: "dealStage", label: "Initial Deal Stage", type: "select", placeholder: "Select stage", required: true, options: [
        { label: "New Lead", value: "new_lead" },
        { label: "Qualified", value: "qualified" },
        { label: "In Progress", value: "in_progress" },
      ]},
    ],
  },
  {
    slug: "salesforce-order-sync",
    name: "Sync Orders to Salesforce",
    description: "Push new orders to Salesforce as opportunities for your sales team",
    category: "crm",
    icon: "Cloud",
    eventType: "order_created",
    eventLabel: "Order Created",
    actionType: "crm_update",
    isPopular: false,
    configFields: [
      { key: "instanceUrl", label: "Salesforce Instance URL", type: "url", placeholder: "https://your-org.salesforce.com", required: true },
      { key: "accessToken", label: "Access Token", type: "text", placeholder: "00D...", required: true },
      { key: "objectType", label: "Object Type", type: "select", placeholder: "Select object", required: true, options: [
        { label: "Opportunity", value: "Opportunity" },
        { label: "Lead", value: "Lead" },
        { label: "Custom Object", value: "Custom" },
      ]},
    ],
  },
  {
    slug: "webhook-order-completed",
    name: "Webhook on Completion",
    description: "POST to an external URL when an order is completed, for custom integrations",
    category: "operations",
    icon: "Globe",
    eventType: "order_completed",
    eventLabel: "Order Completed",
    actionType: "webhook",
    isPopular: false,
    configFields: [
      { key: "url", label: "Webhook URL", type: "url", placeholder: "https://api.your-service.com/webhook", required: true },
      { key: "method", label: "HTTP Method", type: "select", placeholder: "Select method", required: true, options: [
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
      ]},
      { key: "headers", label: "Custom Headers (JSON)", type: "textarea", placeholder: '{"Authorization": "Bearer ..."}', required: false },
    ],
  },
  {
    slug: "slack-financing-approved",
    name: "Financing Approval Alert",
    description: "Celebrate wins - get notified when financing is approved",
    category: "notifications",
    icon: "PartyPopper",
    eventType: "financing_approved_grenke",
    eventLabel: "Financing Approved",
    actionType: "slack",
    isPopular: false,
    configFields: [
      { key: "webhookUrl", label: "Slack Webhook URL", type: "url", placeholder: "https://hooks.slack.com/services/...", required: true },
      { key: "channel", label: "Channel", type: "text", placeholder: "#wins", required: true },
    ],
  },
  {
    slug: "email-contract-return",
    name: "Equipment Return Notice",
    description: "Alert the ops team when equipment is being returned",
    category: "operations",
    icon: "RotateCcw",
    eventType: "contract_return",
    eventLabel: "Equipment Return",
    actionType: "email",
    isPopular: false,
    configFields: [
      { key: "recipients", label: "Recipients", type: "email", placeholder: "warehouse@company.com", required: true },
      { key: "subject", label: "Email Subject", type: "text", placeholder: "Equipment Return - Contract {{contract_id}}", required: true },
    ],
  },
  {
    slug: "webhook-payment-refund",
    name: "Refund Webhook",
    description: "Forward refund events to your accounting system via webhook",
    category: "operations",
    icon: "RefreshCcw",
    eventType: "transaction_refunded",
    eventLabel: "Payment Refunded",
    actionType: "webhook",
    isPopular: false,
    configFields: [
      { key: "url", label: "Webhook URL", type: "url", placeholder: "https://accounting.your-service.com/refunds", required: true },
      { key: "method", label: "HTTP Method", type: "select", placeholder: "Select method", required: true, options: [
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
      ]},
    ],
  },
];

// Mock existing automations
export const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "1",
    pid: "aut_001",
    name: "Slack alert on new order",
    description: "Sends a notification to #orders channel when a new order is placed",
    eventType: "order_created",
    eventLabel: "Order Created",
    actionType: "slack",
    actionLabel: "Slack Notification",
    actionConfig: { webhookUrl: "https://hooks.slack.com/services/T0xxx/B0xxx/xxxx", channel: "#orders" },
    status: "active",
    executionCount: 47,
    lastExecutedAt: "2026-02-11T14:32:00Z",
    successRate: 100,
    createdAt: "2026-01-15T10:00:00Z",
    templateSlug: "slack-order-created",
  },
  {
    id: "2",
    pid: "aut_002",
    name: "Email team on payment failure",
    description: "Alerts finance team when a payment transaction fails",
    eventType: "transaction_failed",
    eventLabel: "Payment Failed",
    actionType: "email",
    actionLabel: "Email Notification",
    actionConfig: { recipients: "finance@lendcorp.com", subject: "Payment Failed - {{order_id}}" },
    status: "active",
    executionCount: 12,
    lastExecutedAt: "2026-02-10T09:15:00Z",
    successRate: 91.7,
    createdAt: "2026-01-20T14:30:00Z",
    templateSlug: "email-payment-failed",
  },
  {
    id: "3",
    pid: "aut_003",
    name: "Sync customer to HubSpot",
    description: "Creates a new contact in HubSpot when a customer signs up",
    eventType: "customer_created",
    eventLabel: "Customer Created",
    actionType: "crm_update",
    actionLabel: "HubSpot Sync",
    actionConfig: { apiKey: "pat-na1-***", pipeline: "leasing", dealStage: "new_lead" },
    status: "paused",
    executionCount: 156,
    lastExecutedAt: "2026-02-05T16:45:00Z",
    successRate: 98.1,
    createdAt: "2025-12-01T09:00:00Z",
    templateSlug: "hubspot-customer-sync",
  },
  {
    id: "4",
    pid: "aut_004",
    name: "Webhook on contract signed",
    description: "POSTs contract data to external ERP when a contract is activated",
    eventType: "contract_active",
    eventLabel: "Contract Activated",
    actionType: "webhook",
    actionLabel: "Webhook POST",
    actionConfig: { url: "https://erp.lendcorp.com/api/contracts", method: "POST" },
    status: "active",
    executionCount: 23,
    lastExecutedAt: "2026-02-11T11:20:00Z",
    successRate: 95.7,
    createdAt: "2026-01-10T08:00:00Z",
    templateSlug: "webhook-order-completed",
  },
  {
    id: "5",
    pid: "aut_005",
    name: "Daily summary email",
    description: "Sends a daily digest of all orders and payments to management",
    eventType: "order_completed",
    eventLabel: "Order Completed",
    actionType: "email",
    actionLabel: "Email Notification",
    actionConfig: { recipients: "management@lendcorp.com", subject: "Daily Order Summary" },
    status: "active",
    executionCount: 30,
    lastExecutedAt: "2026-02-11T08:00:00Z",
    successRate: 100,
    createdAt: "2026-01-05T12:00:00Z",
    templateSlug: null,
  },
];

// Mock executions for detail page
export const MOCK_EXECUTIONS: AutomationExecution[] = [
  {
    id: "exec_001",
    automationId: "1",
    eventType: "order_created",
    status: "success",
    startedAt: "2026-02-11T14:32:00Z",
    completedAt: "2026-02-11T14:32:01Z",
    durationMs: 342,
    errorMessage: null,
    triggerData: { orderId: "ORD-047", company: "TechCorp Industries", amount: "$22,500" },
  },
  {
    id: "exec_002",
    automationId: "1",
    eventType: "order_created",
    status: "success",
    startedAt: "2026-02-11T11:15:00Z",
    completedAt: "2026-02-11T11:15:01Z",
    durationMs: 289,
    errorMessage: null,
    triggerData: { orderId: "ORD-046", company: "DataFlow Systems", amount: "$16,000" },
  },
  {
    id: "exec_003",
    automationId: "1",
    eventType: "order_created",
    status: "failed",
    startedAt: "2026-02-10T16:45:00Z",
    completedAt: "2026-02-10T16:45:02Z",
    durationMs: 2100,
    errorMessage: "Slack webhook returned 403: channel_not_found",
    triggerData: { orderId: "ORD-045", company: "AgriTech Farms", amount: "$12,000" },
  },
  {
    id: "exec_004",
    automationId: "1",
    eventType: "order_created",
    status: "success",
    startedAt: "2026-02-10T10:30:00Z",
    completedAt: "2026-02-10T10:30:01Z",
    durationMs: 412,
    errorMessage: null,
    triggerData: { orderId: "ORD-044", company: "SmartFactory Inc", amount: "$28,000" },
  },
  {
    id: "exec_005",
    automationId: "1",
    eventType: "order_created",
    status: "success",
    startedAt: "2026-02-09T14:20:00Z",
    completedAt: "2026-02-09T14:20:00Z",
    durationMs: 198,
    errorMessage: null,
    triggerData: { orderId: "ORD-043", company: "BuildRight LLC", amount: "$35,000" },
  },
  {
    id: "exec_006",
    automationId: "1",
    eventType: "order_created",
    status: "success",
    startedAt: "2026-02-09T09:10:00Z",
    completedAt: "2026-02-09T09:10:01Z",
    durationMs: 356,
    errorMessage: null,
    triggerData: { orderId: "ORD-042", company: "LogiTrack Corp", amount: "$19,500" },
  },
  {
    id: "exec_007",
    automationId: "2",
    eventType: "transaction_failed",
    status: "success",
    startedAt: "2026-02-10T09:15:00Z",
    completedAt: "2026-02-10T09:15:03Z",
    durationMs: 1520,
    errorMessage: null,
    triggerData: { orderId: "ORD-039", amount: "$4,200", reason: "Insufficient funds" },
  },
  {
    id: "exec_008",
    automationId: "2",
    eventType: "transaction_failed",
    status: "failed",
    startedAt: "2026-02-08T13:00:00Z",
    completedAt: "2026-02-08T13:00:05Z",
    durationMs: 5000,
    errorMessage: "SMTP timeout: could not connect to mail server",
    triggerData: { orderId: "ORD-037", amount: "$8,100", reason: "Card expired" },
  },
];

export const MOCK_STATS: AutomationStats = {
  totalAutomations: 5,
  activeAutomations: 4,
  executionsToday: 14,
  executionsWeek: 87,
  successRate: 97.2,
};

// Helper to get action type label
export function getActionLabel(type: string): string {
  const labels: Record<string, string> = {
    slack: "Slack",
    email: "Email",
    webhook: "Webhook",
    crm_update: "CRM Sync",
  };
  return labels[type] || type;
}

// Helper to get event label from value
export function getEventLabel(value: string): string {
  for (const category of EVENT_CATEGORIES) {
    const event = category.events.find((e) => e.value === value);
    if (event) return event.label;
  }
  return value;
}

// Helper to get category color
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    notifications: "bg-blue-500/10 text-blue-700 border-blue-200",
    crm: "bg-purple-500/10 text-purple-700 border-purple-200",
    operations: "bg-orange-500/10 text-orange-700 border-orange-200",
  };
  return colors[category] || "bg-muted text-muted-foreground";
}

// Helper to get action type color
export function getActionColor(type: string): string {
  const colors: Record<string, string> = {
    slack: "bg-green-500/10 text-green-700",
    email: "bg-blue-500/10 text-blue-700",
    webhook: "bg-orange-500/10 text-orange-700",
    crm_update: "bg-purple-500/10 text-purple-700",
  };
  return colors[type] || "bg-muted text-muted-foreground";
}
