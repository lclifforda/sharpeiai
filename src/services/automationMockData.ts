// Mock data for Automations demo UI

export interface AutomationTemplate {
  slug: string;
  name: string;
  description: string;
  category: "notifications" | "crm" | "operations";
  icon: string;
  eventType: string;
  eventLabel: string;
  actionType: "slack" | "teams" | "email" | "webhook" | "lender_api" | "crm_update" | "assign_officer";
  configFields: ConfigField[];
  isPopular: boolean;
}

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "email" | "url" | "textarea" | "select" | "password";
  placeholder: string;
  required: boolean;
  group: "credential" | "setting";
  helpText?: string;
  options?: { label: string; value: string }[];
}

export interface Automation {
  id: string;
  pid: string;
  name: string;
  description: string;
  eventType: string;
  eventLabel: string;
  actionType: "slack" | "teams" | "email" | "webhook" | "lender_api" | "crm_update" | "assign_officer";
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

// Application fields available for condition building
export interface ApplicationField {
  value: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: { label: string; value: string }[];
}

// CRM field definitions for field mapping in workflow builder
export interface CrmActionField {
  apiName: string;
  label: string;
  required: boolean;
  defaultMapping?: string;       // APPLICATION_FIELDS.value for smart default
  defaultStaticValue?: string;   // Static default value or template string
  placeholder?: string;
}

export interface FieldMapping {
  crmField: string;
  sourceType: "field" | "static";
  sourceValue: string;
}

export function parseFieldMappings(config: Record<string, string>): FieldMapping[] {
  try { return JSON.parse(config._fieldMappings || "[]"); }
  catch { return []; }
}

export const APPLICATION_FIELDS: ApplicationField[] = [
  {
    value: "application.type",
    label: "Application Type",
    type: "select",
    options: [
      { label: "Equipment Financing", value: "Equipment Financing" },
      { label: "Working Capital", value: "Working Capital" },
      { label: "Equipment Leasing", value: "Equipment Leasing" },
    ],
  },
  {
    value: "application.status",
    label: "Application Status",
    type: "select",
    options: [
      { label: "Unqualified", value: "unqualified" },
      { label: "Incomplete (NIGO)", value: "incomplete" },
      { label: "Completed", value: "completed" },
      { label: "Declined", value: "declined" },
      { label: "Funded", value: "funded" },
    ],
  },
  {
    value: "application.requestedAmount",
    label: "Requested Amount",
    type: "number",
  },
  {
    value: "application.equipmentCost",
    label: "Equipment Cost",
    type: "number",
  },
  {
    value: "company.name",
    label: "Company Name",
    type: "text",
  },
  {
    value: "company.entityType",
    label: "Entity Type",
    type: "select",
    options: [
      { label: "Corporation", value: "Corporation" },
      { label: "LLC", value: "LLC" },
      { label: "Sole Proprietor", value: "Sole Proprietor" },
      { label: "Partnership", value: "Partnership" },
    ],
  },
  {
    value: "company.industry",
    label: "Industry",
    type: "text",
  },
  {
    value: "company.annualRevenue",
    label: "Annual Revenue",
    type: "number",
  },
  {
    value: "company.numberOfEmployees",
    label: "Number of Employees",
    type: "number",
  },
  {
    value: "company.state",
    label: "State",
    type: "text",
  },
  {
    value: "equipment.type",
    label: "Equipment Type",
    type: "text",
  },
  {
    value: "guarantor.name",
    label: "Guarantor Name",
    type: "text",
  },
];

// Template variables available for email templates
export const TEMPLATE_VARIABLES = [
  { variable: "{{company_name}}", label: "Company Name" },
  { variable: "{{application_type}}", label: "Application Type" },
  { variable: "{{requested_amount}}", label: "Requested Amount" },
  { variable: "{{equipment_cost}}", label: "Equipment Cost" },
  { variable: "{{application_id}}", label: "Application ID" },
  { variable: "{{application_status}}", label: "Application Status" },
  { variable: "{{customer_name}}", label: "Customer Name" },
  { variable: "{{customer_email}}", label: "Customer Email" },
  { variable: "{{entity_type}}", label: "Entity Type" },
  { variable: "{{industry}}", label: "Industry" },
  { variable: "{{annual_revenue}}", label: "Annual Revenue" },
  { variable: "{{state}}", label: "State" },
  { variable: "{{equipment_type}}", label: "Equipment Type" },
  { variable: "{{guarantor_name}}", label: "Guarantor Name" },
  { variable: "{{assigned_officer}}", label: "Assigned Officer Name" },
  { variable: "{{assigned_officer_email}}", label: "Assigned Officer Email" },
];

// Event categories matching the existing backend event system
export const EVENT_CATEGORIES: EventCategory[] = [
  {
    label: "Applications",
    events: [
      { value: "application_created", label: "Application Created" },
      { value: "application_updated", label: "Application Updated" },
      { value: "application_prequalified", label: "Application Prequalified" },
      { value: "application_not_prequalified", label: "Application Not Prequalified" },
      { value: "application_missing_docs", label: "Missing Documents Detected" },
      { value: "application_payment_method_pending", label: "Payment Method Pending" },
      { value: "application_payment_method_error", label: "Payment Method Error" },
      { value: "application_payment_method_added", label: "Payment Method Added" },
      { value: "application_review", label: "Application Under Review" },
      { value: "application_cancelled", label: "Application Cancelled" },
      { value: "application_accepted", label: "Application Accepted" },
      { value: "application_activated", label: "Application Activated" },
      { value: "application_fulfillment", label: "Application Fulfillment" },
      { value: "application_delivery", label: "Equipment Delivered" },
      { value: "application_completed", label: "Application Completed (all data collected)" },
      { value: "application_assigned", label: "Application Assigned to Officer" },
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
    label: "Customers",
    events: [
      { value: "customer_created", label: "Customer Created" },
      { value: "vendor_created", label: "Vendor / Merchant Created" },
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

// ── Shared config field snippets ─────────────────────────────────────

const SLACK_FIELDS: ConfigField[] = [
  { key: "webhookUrl", label: "Slack Webhook URL", type: "url", placeholder: "https://hooks.slack.com/services/T00.../B00.../xxxx", required: true, group: "credential", helpText: "Create an incoming webhook at api.slack.com/apps" },
  { key: "channel", label: "Channel", type: "text", placeholder: "#applications", required: true, group: "setting", helpText: "The Slack channel to post notifications to" },
  { key: "messageTemplate", label: "Message Template", type: "textarea", placeholder: "New application {{application_id}} from {{company_name}} - {{amount}}", required: false, group: "setting", helpText: "Use {{variable}} to insert dynamic data" },
];

const TEAMS_FIELDS: ConfigField[] = [
  { key: "webhookUrl", label: "Teams Webhook URL", type: "url", placeholder: "https://outlook.office.com/webhook/...", required: true, group: "credential", helpText: "Create an Incoming Webhook connector in your Teams channel" },
  { key: "messageTemplate", label: "Message Template", type: "textarea", placeholder: "New application {{application_id}} from {{company_name}}", required: false, group: "setting", helpText: "Use {{variable}} to insert dynamic data" },
];

const HUBSPOT_CRM_FIELDS: ConfigField[] = [
  { key: "apiKey", label: "HubSpot Private App Token", type: "password", placeholder: "pat-na1-xxxxxxxx-xxxx-xxxx-xxxx", required: true, group: "credential", helpText: "Create a private app in HubSpot > Settings > Integrations > Private Apps" },
  { key: "portalId", label: "HubSpot Portal ID", type: "text", placeholder: "12345678", required: true, group: "credential", helpText: "Found in HubSpot > Settings > Account & Billing" },
  { key: "pipeline", label: "Deal Pipeline", type: "select", placeholder: "Select pipeline", required: true, group: "setting", helpText: "Which pipeline to create deals in", options: [
    { label: "Sales Pipeline", value: "sales" },
    { label: "Onboarding", value: "onboarding" },
    { label: "Equipment Leasing", value: "leasing" },
  ]},
  { key: "dealStage", label: "Deal Stage", type: "select", placeholder: "Select stage", required: true, group: "setting", helpText: "The stage to assign deals to", options: [
    { label: "New Lead", value: "new_lead" },
    { label: "Qualified", value: "qualified" },
    { label: "In Progress", value: "in_progress" },
    { label: "Closed Won", value: "closed_won" },
  ]},
  { key: "owner", label: "Default Deal Owner", type: "email", placeholder: "sales@company.com", required: false, group: "setting", helpText: "HubSpot user email to assign as deal owner" },
];

const SALESFORCE_CRM_FIELDS: ConfigField[] = [
  { key: "instanceUrl", label: "Salesforce Instance URL", type: "url", placeholder: "https://your-org.salesforce.com", required: true, group: "credential" },
  { key: "clientId", label: "Connected App Client ID", type: "text", placeholder: "3MVG9...", required: true, group: "credential" },
  { key: "clientSecret", label: "Connected App Client Secret", type: "password", placeholder: "Enter client secret", required: true, group: "credential" },
  { key: "username", label: "Salesforce Username", type: "email", placeholder: "api-user@company.com", required: true, group: "credential" },
  { key: "objectType", label: "Object Type", type: "select", placeholder: "Select object", required: true, group: "setting", options: [
    { label: "Opportunity", value: "Opportunity" },
    { label: "Lead", value: "Lead" },
    { label: "Custom Object", value: "Custom" },
  ]},
];

const ASSIGN_OFFICER_FIELDS: ConfigField[] = [
  { key: "strategy", label: "Assignment Strategy", type: "select", placeholder: "Select strategy", required: true, group: "setting", helpText: "How to choose which officer gets assigned", options: [
    { label: "Specific Officer", value: "specific" },
    { label: "Round-Robin", value: "round_robin" },
    { label: "Least Loaded", value: "least_loaded" },
  ]},
  { key: "officerId", label: "Officer", type: "select", placeholder: "Select officer", required: false, group: "setting", helpText: "Required when strategy is 'Specific Officer'. Ignored for round-robin / least loaded.", options: [
    { label: "Lucia Clifford (Super Admin)", value: "user_lucia" },
    { label: "Carlos Rivera (Ops Manager)", value: "user_carlos" },
    { label: "Sarah Chen (Credit Analyst)", value: "user_sarah" },
  ]},
  { key: "notifyOfficer", label: "Notify Officer", type: "select", placeholder: "Yes", required: false, group: "setting", helpText: "Send an email/notification to the assigned officer", options: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ]},
];

const EMAIL_FIELDS: ConfigField[] = [
  { key: "smtpHost", label: "SMTP Server", type: "text", placeholder: "smtp.gmail.com", required: true, group: "credential" },
  { key: "smtpUser", label: "SMTP Username", type: "email", placeholder: "notifications@company.com", required: true, group: "credential" },
  { key: "smtpPassword", label: "SMTP Password", type: "password", placeholder: "Enter app password", required: true, group: "credential" },
  { key: "recipients", label: "Send To", type: "text", placeholder: "{{customer_email}}", required: true, group: "setting", helpText: "Use {{customer_email}} for dynamic recipient or enter a fixed address" },
  { key: "subject", label: "Email Subject", type: "text", placeholder: "Your Application Update", required: true, group: "setting" },
  { key: "bodyTemplate", label: "Email Body", type: "textarea", placeholder: "Dear {{customer_name}},\n\n...", required: false, group: "setting", helpText: "Use {{variable}} for dynamic data: customer_name, company_name, application_id, amount" },
];

// ── Pre-built automation templates ─────────────────────────────────────

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  // --- Broker / Lender workflow (primary use case) ---
  {
    slug: "email-send-to-lender",
    name: "Send Application to Lender",
    description: "When an application is completed, automatically email the application package to the appropriate lender based on conditions",
    category: "operations",
    icon: "Send",
    eventType: "application_completed",
    eventLabel: "Application Completed",
    actionType: "email",
    isPopular: true,
    configFields: [
      ...EMAIL_FIELDS.map((f) =>
        f.key === "recipients" ? { ...f, placeholder: "lender@bankpartner.com", helpText: "The lender's intake email address" } :
        f.key === "subject" ? { ...f, placeholder: "New {{application_type}} Application — {{company_name}} (${{requested_amount}})" } :
        f.key === "bodyTemplate" ? { ...f, placeholder: "Dear Lender,\n\nPlease find below a new {{application_type}} application for your review.\n\nCompany: {{company_name}}\nEntity Type: {{entity_type}}\nIndustry: {{industry}}\nAnnual Revenue: {{annual_revenue}}\nState: {{state}}\n\nRequested Amount: ${{requested_amount}}\nEquipment Type: {{equipment_type}}\nEquipment Cost: ${{equipment_cost}}\n\nGuarantor: {{guarantor_name}}\n\nApplication ID: {{application_id}}\n\nFull application documents are attached.\n\nBest regards,\nSharpei Platform" } :
        f
      ),
    ],
  },
  {
    slug: "lender-api-send-application",
    name: "Send Application to Lender API",
    description: "When an application is completed, POST the application data to your lender partner's API endpoint (e.g. funding portal, LOS, or partner integration)",
    category: "operations",
    icon: "Globe",
    eventType: "application_completed",
    eventLabel: "Application Completed",
    actionType: "lender_api",
    isPopular: true,
    configFields: [
      { key: "baseUrl", label: "Lender API Endpoint", type: "url", placeholder: "https://api.lender.com/v1/applications", required: true, group: "credential", helpText: "The lender's API URL to receive application submissions" },
      { key: "authHeader", label: "API Key / Bearer Token", type: "password", placeholder: "Bearer your-api-key", required: false, group: "credential", helpText: "Authorization header — e.g. Bearer xyz or Api-Key: xyz" },
      { key: "method", label: "HTTP Method", type: "select", placeholder: "POST", required: true, group: "setting", options: [
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
        { label: "PATCH", value: "PATCH" },
      ]},
      { key: "contentType", label: "Content-Type", type: "select", placeholder: "application/json", required: false, group: "setting", helpText: "Request body format", options: [
        { label: "application/json", value: "application/json" },
        { label: "application/x-www-form-urlencoded", value: "application/x-www-form-urlencoded" },
      ]},
    ],
  },

  // --- CRM automations ---
  {
    slug: "crm-create-deal-new-app",
    name: "Create CRM Deal on New Application",
    description: "Automatically create a deal in HubSpot or Salesforce when a new application is received",
    category: "crm",
    icon: "Users",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "crm_update",
    isPopular: true,
    configFields: HUBSPOT_CRM_FIELDS,
  },
  {
    slug: "crm-deal-qualified",
    name: "Move Deal to Qualified",
    description: "Move the CRM deal to Qualified stage when the customer is prequalified",
    category: "crm",
    icon: "CheckCircle",
    eventType: "application_prequalified",
    eventLabel: "Application Prequalified",
    actionType: "crm_update",
    isPopular: true,
    configFields: HUBSPOT_CRM_FIELDS,
  },
  {
    slug: "crm-deal-closed-won",
    name: "Move Deal to Closed Won",
    description: "Move the CRM deal to Closed Won when the application is activated",
    category: "crm",
    icon: "PartyPopper",
    eventType: "application_activated",
    eventLabel: "Application Activated",
    actionType: "crm_update",
    isPopular: true,
    configFields: HUBSPOT_CRM_FIELDS,
  },
  {
    slug: "crm-sync-customer",
    name: "Sync Customer to CRM",
    description: "Upload customer contact & company information to CRM when a new customer applies",
    category: "crm",
    icon: "Users",
    eventType: "customer_created",
    eventLabel: "Customer Created",
    actionType: "crm_update",
    isPopular: false,
    configFields: HUBSPOT_CRM_FIELDS,
  },
  {
    slug: "crm-sync-vendor",
    name: "Sync Vendor to CRM",
    description: "Upload vendor/merchant contact & company information to your CRM",
    category: "crm",
    icon: "Cloud",
    eventType: "vendor_created",
    eventLabel: "Vendor Created",
    actionType: "crm_update",
    isPopular: false,
    configFields: HUBSPOT_CRM_FIELDS,
  },
  {
    slug: "salesforce-create-deal",
    name: "Salesforce Opportunity on New Application",
    description: "Push new applications to Salesforce as opportunities for your sales team",
    category: "crm",
    icon: "Cloud",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "crm_update",
    isPopular: true,
    configFields: SALESFORCE_CRM_FIELDS,
  },
  {
    slug: "salesforce-deal-qualified",
    name: "Salesforce Move to Qualification",
    description: "Move the Salesforce opportunity to Qualification stage when the customer prequalifies",
    category: "crm",
    icon: "CheckCircle",
    eventType: "application_prequalified",
    eventLabel: "Application Prequalified",
    actionType: "crm_update",
    isPopular: false,
    configFields: SALESFORCE_CRM_FIELDS,
  },
  {
    slug: "salesforce-deal-closed-won",
    name: "Salesforce Move to Closed Won",
    description: "Move the Salesforce opportunity to Closed Won when the application is activated",
    category: "crm",
    icon: "PartyPopper",
    eventType: "application_activated",
    eventLabel: "Application Activated",
    actionType: "crm_update",
    isPopular: false,
    configFields: SALESFORCE_CRM_FIELDS,
  },
  {
    slug: "salesforce-create-lead",
    name: "Salesforce Lead on New Customer",
    description: "Automatically create a Salesforce lead when a new customer applies",
    category: "crm",
    icon: "Users",
    eventType: "customer_created",
    eventLabel: "Customer Created",
    actionType: "crm_update",
    isPopular: false,
    configFields: SALESFORCE_CRM_FIELDS,
  },
  {
    slug: "salesforce-create-account",
    name: "Salesforce Account from Vendor",
    description: "Create a Salesforce account record when a new vendor is onboarded",
    category: "crm",
    icon: "Cloud",
    eventType: "vendor_created",
    eventLabel: "Vendor Created",
    actionType: "crm_update",
    isPopular: false,
    configFields: SALESFORCE_CRM_FIELDS,
  },

  // --- Internal / platform actions (broker/lender domain) ---
  {
    slug: "internal-create-task",
    name: "Create Internal Task",
    description: "Create a task for your team when an application needs attention (e.g. review, docs, follow-up)",
    category: "operations",
    icon: "FileCheck",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "webhook",
    isPopular: true,
    configFields: [
      { key: "baseUrl", label: "Task API URL", type: "url", placeholder: "https://api.your-tool.com/tasks", required: true, group: "credential", helpText: "Your task management system webhook or API endpoint" },
      { key: "taskTitle", label: "Task Title Template", type: "text", placeholder: "Review application {{application_id}} — {{company_name}}", required: true, group: "setting", helpText: "Use {{variable}} for dynamic data" },
      { key: "taskDescription", label: "Task Description", type: "textarea", placeholder: "Application type: {{application_type}}\nAmount: ${{requested_amount}}\nContact: {{customer_email}}", required: false, group: "setting" },
    ],
  },
  {
    slug: "internal-update-status",
    name: "Update Application Status",
    description: "Automatically update application status in your system when certain events occur",
    category: "operations",
    icon: "RefreshCcw",
    eventType: "application_prequalified",
    eventLabel: "Application Prequalified",
    actionType: "webhook",
    isPopular: false,
    configFields: [
      { key: "baseUrl", label: "Status API URL", type: "url", placeholder: "https://api.your-system.com/status", required: true, group: "credential" },
      { key: "statusValue", label: "Status to Set", type: "text", placeholder: "prequalified", required: true, group: "setting" },
    ],
  },

  // --- Officer assignment automations ---
  {
    slug: "assign-officer-new-app",
    name: "Auto-Assign Officer on New Application",
    description: "Automatically assign an officer to review when a new application is created. Supports specific officer, round-robin, or least-loaded strategy.",
    category: "operations",
    icon: "UserCheck",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "assign_officer",
    isPopular: true,
    configFields: ASSIGN_OFFICER_FIELDS,
  },
  {
    slug: "assign-officer-completed-app",
    name: "Assign Senior Officer on Completed Application",
    description: "When all application data is collected, assign a senior officer for final underwriting review",
    category: "operations",
    icon: "UserCheck",
    eventType: "application_completed",
    eventLabel: "Application Completed",
    actionType: "assign_officer",
    isPopular: true,
    configFields: ASSIGN_OFFICER_FIELDS,
  },
  {
    slug: "reassign-officer-high-value",
    name: "Reassign High-Value Applications to Manager",
    description: "When an application is prequalified and the requested amount exceeds your threshold, reassign to an Operations Manager for review",
    category: "operations",
    icon: "UserCheck",
    eventType: "application_prequalified",
    eventLabel: "Application Prequalified",
    actionType: "assign_officer",
    isPopular: false,
    configFields: ASSIGN_OFFICER_FIELDS,
  },

  // --- Notifications (Slack / Teams — secondary to email/CRM) ---
  {
    slug: "slack-new-application",
    name: "Slack Alert — New Application",
    description: "Notify your team on Slack when a new application is received",
    category: "notifications",
    icon: "MessageSquare",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "slack",
    isPopular: false,
    configFields: SLACK_FIELDS,
  },
  {
    slug: "slack-application-activated",
    name: "Slack Alert — Application Activated",
    description: "Celebrate wins — get notified on Slack when an application is activated",
    category: "notifications",
    icon: "PartyPopper",
    eventType: "application_activated",
    eventLabel: "Application Activated",
    actionType: "slack",
    isPopular: false,
    configFields: SLACK_FIELDS,
  },
  {
    slug: "teams-new-application",
    name: "Teams Alert — New Application",
    description: "Send a Microsoft Teams notification when a new application is received",
    category: "notifications",
    icon: "MessageSquare",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "teams",
    isPopular: false,
    configFields: TEAMS_FIELDS,
  },
  {
    slug: "teams-application-activated",
    name: "Teams Alert — Application Activated",
    description: "Send a Microsoft Teams notification when an application is activated",
    category: "notifications",
    icon: "PartyPopper",
    eventType: "application_activated",
    eventLabel: "Application Activated",
    actionType: "teams",
    isPopular: false,
    configFields: TEAMS_FIELDS,
  },

  // --- Customer emails ---
  {
    slug: "email-application-activated",
    name: "Email Customer — Application Activated",
    description: "Send the customer an email when their application is activated: \"Everything is ready to go!\"",
    category: "notifications",
    icon: "CheckCircle",
    eventType: "application_activated",
    eventLabel: "Application Activated",
    actionType: "email",
    isPopular: true,
    configFields: [
      ...EMAIL_FIELDS.map((f) =>
        f.key === "subject" ? { ...f, placeholder: "Your financing is confirmed — you're all set!" } :
        f.key === "bodyTemplate" ? { ...f, placeholder: "Dear {{customer_name}},\n\nGreat news! Your application ({{application_id}}) has been activated and everything is ready to go.\n\nThank you for choosing {{company_name}}." } :
        f
      ),
    ],
  },
  {
    slug: "email-application-cancelled",
    name: "Email Customer — Application Declined (Risk)",
    description: "Notify the customer via email that their application was declined due to risk assessment",
    category: "notifications",
    icon: "AlertTriangle",
    eventType: "application_cancelled",
    eventLabel: "Application Cancelled",
    actionType: "email",
    isPopular: false,
    configFields: [
      ...EMAIL_FIELDS.map((f) =>
        f.key === "subject" ? { ...f, placeholder: "Update on your financing application" } :
        f.key === "bodyTemplate" ? { ...f, placeholder: "Dear {{customer_name}},\n\nAfter careful review, we are unable to approve your application ({{application_id}}) at this time based on our risk assessment criteria.\n\nPlease contact us if you have questions." } :
        f
      ),
    ],
  },
  {
    slug: "email-not-prequalified",
    name: "Email Customer — Not Prequalified",
    description: "Notify the customer that they did not prequalify due to eligibility criteria",
    category: "notifications",
    icon: "AlertTriangle",
    eventType: "application_not_prequalified",
    eventLabel: "Not Prequalified",
    actionType: "email",
    isPopular: false,
    configFields: [
      ...EMAIL_FIELDS.map((f) =>
        f.key === "subject" ? { ...f, placeholder: "Your application eligibility update" } :
        f.key === "bodyTemplate" ? { ...f, placeholder: "Dear {{customer_name}},\n\nUnfortunately, your application ({{application_id}}) does not meet our current qualification criteria.\n\nThis may be due to business tenure, revenue thresholds, or geographic restrictions. We encourage you to reapply if your circumstances change." } :
        f
      ),
    ],
  },
  {
    slug: "email-missing-docs",
    name: "Email Customer — Missing Documents",
    description: "Automatically email the customer when their application is missing required documents",
    category: "notifications",
    icon: "FileCheck",
    eventType: "application_missing_docs",
    eventLabel: "Missing Documents",
    actionType: "email",
    isPopular: true,
    configFields: [
      ...EMAIL_FIELDS.map((f) =>
        f.key === "subject" ? { ...f, placeholder: "Action needed: missing documents for your application" } :
        f.key === "bodyTemplate" ? { ...f, placeholder: "Dear {{customer_name}},\n\nYour application ({{application_id}}) is being processed but we're missing the following documents:\n\n{{missing_docs}}\n\nPlease upload them at your earliest convenience so we can continue processing your application." } :
        f
      ),
    ],
  },

];

// --- Connections (saved credentials) ---

export type PlatformType = "slack" | "teams" | "email" | "webhook" | "hubspot" | "salesforce" | "pipedrive" | "zoho" | "monday" | "dynamics" | "oracle";

export interface Connection {
  id: string;
  platform: PlatformType;
  name: string;
  status: "connected" | "error" | "expired";
  createdAt: string;
  lastUsedAt: string | null;
  maskedCredential: string;
  automationsUsing: number;
}

export interface AvailablePlatform {
  platform: PlatformType;
  name: string;
  description: string;
  category: "messaging" | "email" | "crm" | "developer";
  credentialFields: ConfigField[];
}

// What action types map to which platforms
export const ACTION_TO_PLATFORMS: Record<string, PlatformType[]> = {
  slack: ["slack"],
  teams: ["teams"],
  email: ["email"],
  webhook: ["webhook"],
  lender_api: ["webhook"],
  crm_update: ["hubspot", "salesforce", "pipedrive", "zoho", "monday", "dynamics"],
  assign_officer: [],
};

export const AVAILABLE_PLATFORMS: AvailablePlatform[] = [
  {
    platform: "slack",
    name: "Slack",
    description: "Send messages to Slack channels and users",
    category: "messaging",
    credentialFields: [
      { key: "webhookUrl", label: "Incoming Webhook URL", type: "url", placeholder: "https://hooks.slack.com/services/T00.../B00.../xxxx", required: true, group: "credential", helpText: "Create at api.slack.com/apps > Incoming Webhooks" },
    ],
  },
  {
    platform: "teams",
    name: "Microsoft Teams",
    description: "Send messages to Microsoft Teams channels",
    category: "messaging",
    credentialFields: [
      { key: "webhookUrl", label: "Teams Webhook URL", type: "url", placeholder: "https://outlook.office.com/webhook/...", required: true, group: "credential", helpText: "Create an Incoming Webhook connector in your Teams channel settings" },
    ],
  },
  {
    platform: "email",
    name: "Email (SMTP)",
    description: "Send emails via your SMTP server or Gmail",
    category: "email",
    credentialFields: [
      { key: "smtpHost", label: "SMTP Server", type: "text", placeholder: "smtp.gmail.com", required: true, group: "credential", helpText: "Gmail: smtp.gmail.com, Outlook: smtp.office365.com" },
      { key: "smtpPort", label: "Port", type: "text", placeholder: "587", required: true, group: "credential" },
      { key: "smtpUser", label: "Username / Email", type: "email", placeholder: "notifications@company.com", required: true, group: "credential" },
      { key: "smtpPassword", label: "Password / App Password", type: "password", placeholder: "Enter app password", required: true, group: "credential", helpText: "For Gmail, generate an App Password in Google Account > Security" },
    ],
  },
  {
    platform: "webhook",
    name: "Webhook",
    description: "Send HTTP requests to any URL endpoint",
    category: "developer",
    credentialFields: [
      { key: "baseUrl", label: "Base URL", type: "url", placeholder: "https://api.your-service.com", required: true, group: "credential" },
      { key: "authHeader", label: "Authorization Header", type: "password", placeholder: "Bearer your-api-token", required: false, group: "credential", helpText: "Sent as the Authorization header on every request" },
    ],
  },
  {
    platform: "hubspot",
    name: "HubSpot",
    description: "Sync contacts, deals, and companies to HubSpot CRM",
    category: "crm",
    credentialFields: [
      { key: "apiKey", label: "Private App Token", type: "password", placeholder: "pat-na1-xxxxxxxx-xxxx-xxxx-xxxx", required: true, group: "credential", helpText: "Create in HubSpot > Settings > Integrations > Private Apps" },
      { key: "portalId", label: "Portal ID", type: "text", placeholder: "12345678", required: true, group: "credential", helpText: "Found in Settings > Account & Billing" },
    ],
  },
  {
    platform: "salesforce",
    name: "Salesforce",
    description: "Sync leads, contacts, and opportunities to Salesforce",
    category: "crm",
    credentialFields: [
      { key: "instanceUrl", label: "Instance URL", type: "url", placeholder: "https://your-org.salesforce.com", required: true, group: "credential" },
      { key: "clientId", label: "Connected App Client ID", type: "text", placeholder: "3MVG9...", required: true, group: "credential", helpText: "Setup > App Manager > New Connected App" },
      { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "Enter client secret", required: true, group: "credential" },
      { key: "username", label: "API Username", type: "email", placeholder: "api-user@company.com", required: true, group: "credential" },
    ],
  },
  {
    platform: "pipedrive",
    name: "Pipedrive",
    description: "Sync deals and contacts to Pipedrive CRM",
    category: "crm",
    credentialFields: [
      { key: "apiToken", label: "API Token", type: "password", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", required: true, group: "credential", helpText: "Settings > Personal preferences > API" },
      { key: "companyDomain", label: "Company Domain", type: "text", placeholder: "your-company", required: true, group: "credential", helpText: "The subdomain in your-company.pipedrive.com" },
    ],
  },
  {
    platform: "zoho",
    name: "Zoho CRM",
    description: "Sync leads, contacts, and deals to Zoho CRM",
    category: "crm",
    credentialFields: [
      { key: "clientId", label: "Client ID", type: "text", placeholder: "1000.XXXX", required: true, group: "credential", helpText: "Zoho API Console > Self Client" },
      { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "Enter client secret", required: true, group: "credential" },
      { key: "refreshToken", label: "Refresh Token", type: "password", placeholder: "1000.xxxx.xxxx", required: true, group: "credential" },
    ],
  },
  {
    platform: "monday",
    name: "Monday CRM",
    description: "Create and update items in Monday.com boards",
    category: "crm",
    credentialFields: [
      { key: "apiToken", label: "API Token", type: "password", placeholder: "eyJhb...", required: true, group: "credential", helpText: "Admin > API section in your Monday account" },
    ],
  },
  {
    platform: "dynamics",
    name: "Microsoft Dynamics 365",
    description: "Sync contacts and opportunities to Dynamics 365",
    category: "crm",
    credentialFields: [
      { key: "tenantId", label: "Tenant ID", type: "text", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", required: true, group: "credential", helpText: "Azure Portal > Azure Active Directory > Properties" },
      { key: "clientId", label: "Application (Client) ID", type: "text", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", required: true, group: "credential" },
      { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "Enter client secret", required: true, group: "credential" },
      { key: "resourceUrl", label: "Environment URL", type: "url", placeholder: "https://your-org.crm.dynamics.com", required: true, group: "credential" },
    ],
  },
];

// Mock saved connections
export const MOCK_CONNECTIONS: Connection[] = [
  {
    id: "conn_001",
    platform: "slack",
    name: "Slack - LendCorp Workspace",
    status: "connected",
    createdAt: "2026-01-10T10:00:00Z",
    lastUsedAt: "2026-02-20T14:32:00Z",
    maskedCredential: "hooks.slack.com/...B0xxx/xxxx",
    automationsUsing: 2,
  },
  {
    id: "conn_002",
    platform: "email",
    name: "Gmail - Notifications",
    status: "connected",
    createdAt: "2026-01-15T09:00:00Z",
    lastUsedAt: "2026-02-21T08:00:00Z",
    maskedCredential: "notifications@lendcorp.com",
    automationsUsing: 4,
  },
  {
    id: "conn_003",
    platform: "hubspot",
    name: "HubSpot - Production",
    status: "connected",
    createdAt: "2025-12-01T09:00:00Z",
    lastUsedAt: "2026-02-21T16:45:00Z",
    maskedCredential: "pat-na1-***...7f2a",
    automationsUsing: 3,
  },
  {
    id: "conn_004",
    platform: "salesforce",
    name: "Salesforce - Sandbox",
    status: "expired",
    createdAt: "2026-01-20T14:00:00Z",
    lastUsedAt: "2026-01-28T10:00:00Z",
    maskedCredential: "test-org.salesforce.com",
    automationsUsing: 0,
  },
  {
    id: "conn_005",
    platform: "teams",
    name: "Microsoft Teams - Operations",
    status: "connected",
    createdAt: "2026-02-01T11:00:00Z",
    lastUsedAt: "2026-02-20T09:15:00Z",
    maskedCredential: "outlook.office.com/webhook/...xxxx",
    automationsUsing: 1,
  },
];

// Mock existing automations
export const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "10",
    pid: "aut_010",
    name: "Send equipment applications to ABC Capital",
    description: "Sends completed equipment financing applications over $25K to ABC Capital for review",
    eventType: "application_completed",
    eventLabel: "Application Completed",
    actionType: "email",
    actionLabel: "Email Notification",
    actionConfig: { recipients: "intake@abccapital.com", subject: "New Equipment Application — {{company_name}}" },
    status: "active",
    executionCount: 37,
    lastExecutedAt: "2026-02-24T15:20:00Z",
    successRate: 100,
    createdAt: "2026-01-28T09:00:00Z",
    templateSlug: "email-send-to-lender",
  },
  {
    id: "11",
    pid: "aut_011",
    name: "Send working capital apps to QuickFund",
    description: "Routes working capital applications under $50K to QuickFund Partners",
    eventType: "application_completed",
    eventLabel: "Application Completed",
    actionType: "email",
    actionLabel: "Email Notification",
    actionConfig: { recipients: "deals@quickfund.com", subject: "Working Capital Application — {{company_name}}" },
    status: "active",
    executionCount: 19,
    lastExecutedAt: "2026-02-23T11:45:00Z",
    successRate: 100,
    createdAt: "2026-02-01T14:00:00Z",
    templateSlug: "email-send-to-lender",
  },
  {
    id: "13",
    pid: "aut_013",
    name: "Push applications to LenderX API",
    description: "POSTs completed equipment applications to LenderX funding portal API",
    eventType: "application_completed",
    eventLabel: "Application Completed",
    actionType: "lender_api",
    actionLabel: "Lender API",
    actionConfig: { baseUrl: "https://api.lenderx.com/v1/applications", method: "POST" },
    status: "active",
    executionCount: 28,
    lastExecutedAt: "2026-02-24T14:10:00Z",
    successRate: 96.4,
    createdAt: "2026-02-10T09:00:00Z",
    templateSlug: "lender-api-send-application",
  },
  {
    id: "1",
    pid: "aut_001",
    name: "Create HubSpot deal on new application",
    description: "Automatically creates a new deal in HubSpot when an application is received",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "crm_update",
    actionLabel: "HubSpot Sync",
    actionConfig: { apiKey: "pat-na1-***", pipeline: "leasing", dealStage: "new_lead" },
    status: "active",
    executionCount: 84,
    lastExecutedAt: "2026-02-21T14:32:00Z",
    successRate: 98.8,
    createdAt: "2025-12-15T10:00:00Z",
    templateSlug: "crm-create-deal-new-app",
  },
  {
    id: "2",
    pid: "aut_002",
    name: "Move deal to Qualified on prequalification",
    description: "Moves the HubSpot deal to Qualified stage when the customer prequalifies",
    eventType: "application_prequalified",
    eventLabel: "Application Prequalified",
    actionType: "crm_update",
    actionLabel: "HubSpot Sync",
    actionConfig: { apiKey: "pat-na1-***", pipeline: "leasing", dealStage: "qualified" },
    status: "active",
    executionCount: 62,
    lastExecutedAt: "2026-02-21T11:20:00Z",
    successRate: 100,
    createdAt: "2025-12-15T10:30:00Z",
    templateSlug: "crm-deal-qualified",
  },
  {
    id: "3",
    pid: "aut_003",
    name: "Move deal to Closed Won on activation",
    description: "Moves the HubSpot deal to Closed Won when the application is activated",
    eventType: "application_activated",
    eventLabel: "Application Activated",
    actionType: "crm_update",
    actionLabel: "HubSpot Sync",
    actionConfig: { apiKey: "pat-na1-***", pipeline: "leasing", dealStage: "closed_won" },
    status: "active",
    executionCount: 41,
    lastExecutedAt: "2026-02-19T16:45:00Z",
    successRate: 100,
    createdAt: "2025-12-15T11:00:00Z",
    templateSlug: "crm-deal-closed-won",
  },
  {
    id: "12",
    pid: "aut_012",
    name: "Sync new applications to Salesforce",
    description: "Creates an opportunity in Salesforce when a new application is received",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "crm_update",
    actionLabel: "Salesforce Sync",
    actionConfig: { instanceUrl: "https://lendcorp.salesforce.com", objectType: "Opportunity" },
    status: "active",
    executionCount: 56,
    lastExecutedAt: "2026-02-24T13:10:00Z",
    successRate: 98.2,
    createdAt: "2025-12-20T09:00:00Z",
    templateSlug: "salesforce-create-deal",
  },
  {
    id: "4",
    pid: "aut_004",
    name: "Slack alert on new application",
    description: "Sends a notification to #applications channel when a new application is submitted",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "slack",
    actionLabel: "Slack Notification",
    actionConfig: { webhookUrl: "https://hooks.slack.com/services/T0xxx/B0xxx/xxxx", channel: "#applications" },
    status: "active",
    executionCount: 84,
    lastExecutedAt: "2026-02-21T14:32:00Z",
    successRate: 100,
    createdAt: "2026-01-15T10:00:00Z",
    templateSlug: "slack-new-application",
  },
  {
    id: "8",
    pid: "aut_008",
    name: "Teams alert on new application",
    description: "Sends a Microsoft Teams notification when a new application is submitted",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "teams",
    actionLabel: "Teams Notification",
    actionConfig: { webhookUrl: "https://outlook.office.com/webhook/..." },
    status: "active",
    executionCount: 67,
    lastExecutedAt: "2026-02-21T14:32:00Z",
    successRate: 100,
    createdAt: "2026-01-18T11:00:00Z",
    templateSlug: "teams-new-application",
  },
  {
    id: "5",
    pid: "aut_005",
    name: "Email customer — application activated",
    description: "Sends a confirmation email to the customer when their application is activated",
    eventType: "application_activated",
    eventLabel: "Application Activated",
    actionType: "email",
    actionLabel: "Email Notification",
    actionConfig: { recipients: "{{customer_email}}", subject: "Your financing is confirmed!" },
    status: "active",
    executionCount: 41,
    lastExecutedAt: "2026-02-19T16:45:00Z",
    successRate: 100,
    createdAt: "2026-01-20T12:00:00Z",
    templateSlug: "email-application-activated",
  },
  {
    id: "6",
    pid: "aut_006",
    name: "Email customer — declined (risk)",
    description: "Notifies the customer that their application was declined due to risk assessment",
    eventType: "application_cancelled",
    eventLabel: "Application Cancelled",
    actionType: "email",
    actionLabel: "Email Notification",
    actionConfig: { recipients: "{{customer_email}}", subject: "Update on your financing application" },
    status: "active",
    executionCount: 8,
    lastExecutedAt: "2026-02-18T10:15:00Z",
    successRate: 100,
    createdAt: "2026-01-20T12:30:00Z",
    templateSlug: "email-application-cancelled",
  },
  {
    id: "14",
    pid: "aut_014",
    name: "Auto-assign new applications (round-robin)",
    description: "Automatically assigns incoming applications to credit analysts using round-robin rotation",
    eventType: "application_created",
    eventLabel: "Application Created",
    actionType: "assign_officer",
    actionLabel: "Assign Officer",
    actionConfig: { strategy: "round_robin", notifyOfficer: "yes" },
    status: "active",
    executionCount: 52,
    lastExecutedAt: "2026-02-25T09:15:00Z",
    successRate: 100,
    createdAt: "2026-01-05T10:00:00Z",
    templateSlug: "assign-officer-new-app",
  },
  {
    id: "15",
    pid: "aut_015",
    name: "Assign high-value apps to Lucia",
    description: "Applications over $50K are automatically assigned to Lucia Clifford for senior review",
    eventType: "application_prequalified",
    eventLabel: "Application Prequalified",
    actionType: "assign_officer",
    actionLabel: "Assign Officer",
    actionConfig: { strategy: "specific", officerId: "user_lucia", notifyOfficer: "yes" },
    status: "active",
    executionCount: 12,
    lastExecutedAt: "2026-02-22T16:30:00Z",
    successRate: 100,
    createdAt: "2026-01-12T14:00:00Z",
    templateSlug: "reassign-officer-high-value",
  },
  {
    id: "7",
    pid: "aut_007",
    name: "Email customer — missing documents",
    description: "Automatically emails the customer when their application is missing required documents",
    eventType: "application_missing_docs",
    eventLabel: "Missing Documents",
    actionType: "email",
    actionLabel: "Email Notification",
    actionConfig: { recipients: "{{customer_email}}", subject: "Action needed: missing documents" },
    status: "active",
    executionCount: 23,
    lastExecutedAt: "2026-02-21T09:30:00Z",
    successRate: 95.7,
    createdAt: "2026-01-25T14:00:00Z",
    templateSlug: "email-missing-docs",
  },
];

// Mock executions for detail page
export const MOCK_EXECUTIONS: AutomationExecution[] = [
  {
    id: "exec_001",
    automationId: "1",
    eventType: "application_created",
    status: "success",
    startedAt: "2026-02-21T14:32:00Z",
    completedAt: "2026-02-21T14:32:01Z",
    durationMs: 342,
    errorMessage: null,
    triggerData: { applicationId: "APP-084", company: "TechCorp Industries", amount: "$42,500" },
  },
  {
    id: "exec_002",
    automationId: "1",
    eventType: "application_created",
    status: "success",
    startedAt: "2026-02-21T11:15:00Z",
    completedAt: "2026-02-21T11:15:01Z",
    durationMs: 289,
    errorMessage: null,
    triggerData: { applicationId: "APP-083", company: "DataFlow Systems", amount: "$16,000" },
  },
  {
    id: "exec_003",
    automationId: "4",
    eventType: "application_created",
    status: "failed",
    startedAt: "2026-02-20T16:45:00Z",
    completedAt: "2026-02-20T16:45:02Z",
    durationMs: 2100,
    errorMessage: "Slack webhook returned 403: channel_not_found",
    triggerData: { applicationId: "APP-082", company: "AgriTech Farms", amount: "$12,000" },
  },
  {
    id: "exec_004",
    automationId: "5",
    eventType: "application_activated",
    status: "success",
    startedAt: "2026-02-19T16:45:00Z",
    completedAt: "2026-02-19T16:45:03Z",
    durationMs: 1230,
    errorMessage: null,
    triggerData: { applicationId: "APP-078", company: "SmartFactory Inc", amount: "$28,000", customerEmail: "john@smartfactory.com" },
  },
  {
    id: "exec_005",
    automationId: "7",
    eventType: "application_missing_docs",
    status: "success",
    startedAt: "2026-02-21T09:30:00Z",
    completedAt: "2026-02-21T09:30:02Z",
    durationMs: 890,
    errorMessage: null,
    triggerData: { applicationId: "APP-081", company: "BuildRight LLC", missingDocs: "Bank Statements, Equipment Quote" },
  },
  {
    id: "exec_006",
    automationId: "7",
    eventType: "application_missing_docs",
    status: "success",
    startedAt: "2026-02-20T14:20:00Z",
    completedAt: "2026-02-20T14:20:01Z",
    durationMs: 756,
    errorMessage: null,
    triggerData: { applicationId: "APP-080", company: "LogiTrack Corp", missingDocs: "Personal Tax Return" },
  },
  // Lender API (aut_013) executions — as if multiple flows had run
  {
    id: "exec_007",
    automationId: "13",
    eventType: "application_completed",
    status: "success",
    startedAt: "2026-02-24T14:10:00Z",
    completedAt: "2026-02-24T14:10:01Z",
    durationMs: 412,
    errorMessage: null,
    triggerData: { applicationId: "APP-091", company: "Precision Machining Co", amount: "$67,200", applicationType: "Equipment Financing" },
  },
  {
    id: "exec_008",
    automationId: "13",
    eventType: "application_completed",
    status: "success",
    startedAt: "2026-02-24T11:30:00Z",
    completedAt: "2026-02-24T11:30:01Z",
    durationMs: 389,
    errorMessage: null,
    triggerData: { applicationId: "APP-090", company: "GreenEnergy Solutions", amount: "$125,000", applicationType: "Equipment Leasing" },
  },
  {
    id: "exec_009",
    automationId: "13",
    eventType: "application_completed",
    status: "failed",
    startedAt: "2026-02-23T16:22:00Z",
    completedAt: "2026-02-23T16:22:03Z",
    durationMs: 2850,
    errorMessage: "LenderX API returned 429: rate limit exceeded",
    triggerData: { applicationId: "APP-089", company: "Fleet Logistics Inc", amount: "$34,500", applicationType: "Equipment Financing" },
  },
  {
    id: "exec_010",
    automationId: "13",
    eventType: "application_completed",
    status: "success",
    startedAt: "2026-02-23T09:15:00Z",
    completedAt: "2026-02-23T09:15:01Z",
    durationMs: 521,
    errorMessage: null,
    triggerData: { applicationId: "APP-088", company: "MedSupply Partners", amount: "$89,000", applicationType: "Equipment Leasing" },
  },
  {
    id: "exec_011",
    automationId: "13",
    eventType: "application_completed",
    status: "success",
    startedAt: "2026-02-22T14:45:00Z",
    completedAt: "2026-02-22T14:45:02Z",
    durationMs: 678,
    errorMessage: null,
    triggerData: { applicationId: "APP-087", company: "Construction Pro LLC", amount: "$52,300", applicationType: "Equipment Financing" },
  },
  {
    id: "exec_012",
    automationId: "13",
    eventType: "application_completed",
    status: "success",
    startedAt: "2026-02-22T10:00:00Z",
    completedAt: "2026-02-22T10:00:01Z",
    durationMs: 445,
    errorMessage: null,
    triggerData: { applicationId: "APP-086", company: "FoodService Equipment Co", amount: "$28,700", applicationType: "Working Capital" },
  },
];

export const MOCK_STATS: AutomationStats = {
  totalAutomations: 12,
  activeAutomations: 12,
  executionsToday: 38,
  executionsWeek: 224,
  successRate: 98.6,
};

// Helper to get action type label
export function getActionLabel(type: string): string {
  const labels: Record<string, string> = {
    slack: "Slack",
    teams: "Teams",
    email: "Email",
    webhook: "Webhook",
    lender_api: "Lender API",
    crm_update: "CRM Sync",
    assign_officer: "Assign Officer",
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
    teams: "bg-indigo-500/10 text-indigo-700",
    email: "bg-blue-500/10 text-blue-700",
    webhook: "bg-orange-500/10 text-orange-700",
    lender_api: "bg-cyan-500/10 text-cyan-700",
    crm_update: "bg-purple-500/10 text-purple-700",
    assign_officer: "bg-teal-500/10 text-teal-700",
  };
  return colors[type] || "bg-muted text-muted-foreground";
}
