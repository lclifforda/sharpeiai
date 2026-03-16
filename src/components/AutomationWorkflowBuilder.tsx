import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Zap,
  Mail,
  MessageSquare,
  Globe,
  Server,
  GitBranch,
  Filter,
  Clock,
  Webhook,
  Users,
  Trash2,
  Plus,
  X,
  ChevronRight,
  Timer,
  FileCheck,
  Save,
  UserCheck,
  Eye,
  EyeOff,
  Shield,
  Check,
  Play,
  Square,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import EmailTemplateBuilder from "@/components/EmailTemplateBuilder";
import { EVENT_CATEGORIES, APPLICATION_FIELDS, parseFieldMappings } from "@/services/automationMockData";
import type { CrmActionField, FieldMapping } from "@/services/automationMockData";

// ── Platform logos (inline SVGs for n8n-style branding) ──────────────

const GmailLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 256 193" fill="none">
    <path d="M58.2 192.1V93.1L0 50.5v125.6c0 8.8 7.2 16 16 16h42.2z" fill="#4285F4"/>
    <path d="M197.8 192.1h42.2c8.8 0 16-7.2 16-16V50.5l-58.2 42.6v99z" fill="#34A853"/>
    <path d="M197.8 16v77.1L256 50.5V24c0-19.8-22.6-31-38.4-19L197.8 16z" fill="#FBBC04"/>
    <path d="M58.2 93.1V16L128 68.7 197.8 16v77.1L128 135.8 58.2 93.1z" fill="#EA4335"/>
    <path d="M0 24v26.5l58.2 42.6V16L38.4 5C22.6-6 0 5.2 0 24z" fill="#C5221F"/>
  </svg>
);

const OutlookLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M22 6.5V17a1.5 1.5 0 01-1.5 1.5H9.5A1.5 1.5 0 018 17V6.5A1.5 1.5 0 019.5 5h11A1.5 1.5 0 0122 6.5z" fill="#0078D4"/>
    <path d="M22 6.5l-7 5-7-5" stroke="#fff" strokeWidth="1.2" fill="none"/>
    <rect x="1" y="4" width="10" height="15" rx="1.5" fill="#0364B8"/>
    <ellipse cx="6" cy="11.5" rx="3" ry="3.5" fill="#fff" fillOpacity="0.9"/>
    <ellipse cx="6" cy="11.5" rx="2" ry="2.5" fill="#0364B8"/>
  </svg>
);

const SendGridLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="6.5" height="6.5" fill="#009DD9"/>
    <rect x="8.75" y="2" width="6.5" height="6.5" fill="#1A82E2"/>
    <rect x="8.75" y="8.75" width="6.5" height="6.5" fill="#009DD9"/>
    <rect x="15.5" y="8.75" width="6.5" height="6.5" fill="#1A82E2"/>
    <rect x="8.75" y="15.5" width="6.5" height="6.5" fill="#1A82E2"/>
    <rect x="15.5" y="15.5" width="6.5" height="6.5" fill="#009DD9"/>
  </svg>
);

const SmtpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <Server className={`${className} text-slate-500`} />
);

const SlackLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none">
    <path d="M26.9 80.4c0 7.4-6 13.4-13.4 13.4S0 87.8 0 80.4c0-7.4 6-13.4 13.4-13.4h13.4v13.4z" fill="#E01E5A"/>
    <path d="M33.6 80.4c0-7.4 6-13.4 13.4-13.4s13.4 6 13.4 13.4v33.6c0 7.4-6 13.4-13.4 13.4s-13.4-6-13.4-13.4V80.4z" fill="#E01E5A"/>
    <path d="M47 26.9c-7.4 0-13.4-6-13.4-13.4S39.6 0 47 0s13.4 6 13.4 13.4v13.4H47z" fill="#36C5F0"/>
    <path d="M47 33.6c7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4H13.4C6 60.4 0 54.4 0 47s6-13.4 13.4-13.4H47z" fill="#36C5F0"/>
    <path d="M101.1 47c0-7.4 6-13.4 13.4-13.4 7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4h-13.4V47z" fill="#2EB67D"/>
    <path d="M94.4 47c0 7.4-6 13.4-13.4 13.4-7.4 0-13.4-6-13.4-13.4V13.4C67.6 6 73.6 0 81 0s13.4 6 13.4 13.4V47z" fill="#2EB67D"/>
    <path d="M81 101.1c7.4 0 13.4 6 13.4 13.4 0 7.4-6 13.4-13.4 13.4-7.4 0-13.4-6-13.4-13.4v-13.4H81z" fill="#ECB22E"/>
    <path d="M81 94.4c-7.4 0-13.4-6-13.4-13.4 0-7.4 6-13.4 13.4-13.4h33.6c7.4 0 13.4 6 13.4 13.4 0 7.4-6 13.4-13.4 13.4H81z" fill="#ECB22E"/>
  </svg>
);

const TeamsLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M16.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#5059C9"/>
    <path d="M19 9h-3a1 1 0 0 0-1 1v5a3 3 0 0 0 6 0v-4a2 2 0 0 0-2-2Z" fill="#5059C9"/>
    <path d="M10.5 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" fill="#7B83EB"/>
    <path d="M15 9H6a1 1 0 0 0-1 1v6a4.5 4.5 0 0 0 9 0v-6a1 1 0 0 0-1-1h2Z" fill="#7B83EB"/>
  </svg>
);

const HubSpotLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="none">
    <path d="M371.5 169.6V109c16.8-9.2 28.2-27.2 28.2-47.8 0-30.2-24.5-54.7-54.7-54.7-30.2 0-54.7 24.5-54.7 54.7 0 20.6 11.4 38.6 28.2 47.8v60.6c-23.8 5.8-45.4 17.4-63.2 34l-167-129.8c2-6 3.2-12.4 3.2-19.2C91.5 24.5 67 0 36.8 0S-17.9 24.5-17.9 54.7c0 30.2 24.5 54.7 54.7 54.7 11.8 0 22.6-3.8 31.6-10.2l163.8 127.4c-14.8 22-23.6 48.6-23.6 77.2 0 77.2 62.6 139.8 139.8 139.8s139.8-62.6 139.8-139.8c0-69.4-50.6-127-117-137.9zM345 396.8c-51.4 0-93.2-41.8-93.2-93.2s41.8-93.2 93.2-93.2 93.2 41.8 93.2 93.2-41.8 93.2-93.2 93.2z" fill="#FF7A59" transform="translate(30, 30) scale(0.88)"/>
  </svg>
);

const SalesforceLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M10 4.5c1.2-1.2 2.8-2 4.6-2 2.5 0 4.7 1.4 5.8 3.5.9-.4 1.8-.5 2.8-.5C26.4 5.5 29 8.1 29 11.3c0 3.2-2.6 5.8-5.8 5.8-.5 0-1-.1-1.5-.2-1 1.8-2.9 3.1-5.1 3.1-1 0-2-.3-2.8-.7-.9 2-3 3.3-5.3 3.3-3.3 0-5.9-2.6-5.9-5.9 0-1.3.4-2.4 1.1-3.4C2.6 12.3 2 11 2 9.5 2 6.7 4.3 4.5 7 4.5c1.1 0 2.2.4 3 1z" fill="#00A1E0" transform="translate(-2, 1) scale(0.88)"/>
  </svg>
);

const PipedriveLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#25292C"/>
    <path d="M12 6c2.2 0 4 1.8 4 4s-1.8 4-4 4v4" stroke="#4FBF26" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

// Provider configs for each action type (n8n-style provider picker)
interface ProviderField {
  key: string;
  label: string;
  type: "text" | "password" | "email" | "select";
  placeholder: string;
  options?: { label: string; value: string }[];
}

interface ProviderOption {
  id: string;
  name: string;
  logo: React.FC<{ className?: string }>;
  color: string;
  authType: "oauth" | "api_key" | "credentials";
  authLabel: string;       // e.g. "Connect Google Account", "Private App Token"
  fields: ProviderField[];
  actions?: { label: string; value: string; fields?: CrmActionField[] }[];
}

const EMAIL_PROVIDERS: ProviderOption[] = [
  {
    id: "gmail",
    name: "Gmail / Google Workspace",
    logo: GmailLogo,
    color: "border-red-200 bg-red-50",
    authType: "oauth",
    authLabel: "Connect Google Account",
    fields: [
      { key: "fromEmail", label: "Send As", type: "email", placeholder: "notifications@company.com" },
    ],
  },
  {
    id: "outlook",
    name: "Outlook / Office 365",
    logo: OutlookLogo,
    color: "border-blue-200 bg-blue-50",
    authType: "oauth",
    authLabel: "Connect Microsoft Account",
    fields: [
      { key: "fromEmail", label: "Send As", type: "email", placeholder: "notifications@company.com" },
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    logo: SendGridLogo,
    color: "border-cyan-200 bg-cyan-50",
    authType: "api_key",
    authLabel: "API Key",
    fields: [
      { key: "apiKey", label: "API Key", type: "password", placeholder: "SG.xxxx..." },
      { key: "fromEmail", label: "From Email (verified sender)", type: "email", placeholder: "noreply@company.com" },
      { key: "fromName", label: "From Name", type: "text", placeholder: "Sharpei Platform" },
    ],
  },
  {
    id: "smtp",
    name: "Custom SMTP",
    logo: SmtpIcon,
    color: "border-slate-200 bg-slate-50",
    authType: "credentials",
    authLabel: "SMTP Credentials",
    fields: [
      { key: "smtpHost", label: "SMTP Host", type: "text", placeholder: "smtp.example.com" },
      { key: "smtpPort", label: "Port", type: "text", placeholder: "587" },
      { key: "smtpEncryption", label: "Encryption", type: "select", placeholder: "STARTTLS", options: [
        { label: "STARTTLS (587)", value: "starttls" },
        { label: "SSL/TLS (465)", value: "ssl" },
        { label: "None (25)", value: "none" },
      ]},
      { key: "smtpUser", label: "Username", type: "text", placeholder: "user@example.com" },
      { key: "smtpPassword", label: "Password", type: "password", placeholder: "Enter password" },
      { key: "fromEmail", label: "From Email", type: "email", placeholder: "noreply@company.com" },
    ],
  },
];

const CRM_PROVIDERS: ProviderOption[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    logo: HubSpotLogo,
    color: "border-orange-200 bg-orange-50",
    authType: "api_key",
    authLabel: "Private App Access Token",
    fields: [
      { key: "accessToken", label: "Private App Token", type: "password", placeholder: "pat-na1-xxxx..." },
    ],
    actions: [
      { label: "Create Contact", value: "create_contact", fields: [
        { apiName: "email", label: "Email", required: true, placeholder: "contact@example.com" },
        { apiName: "firstname", label: "First Name", required: false },
        { apiName: "lastname", label: "Last Name", required: false },
        { apiName: "phone", label: "Phone", required: false },
        { apiName: "company", label: "Company", required: false, defaultMapping: "company.name" },
        { apiName: "jobtitle", label: "Job Title", required: false },
      ]},
      { label: "Update Contact", value: "update_contact", fields: [
        { apiName: "email", label: "Email (lookup)", required: true, placeholder: "contact@example.com" },
        { apiName: "firstname", label: "First Name", required: false },
        { apiName: "lastname", label: "Last Name", required: false },
        { apiName: "phone", label: "Phone", required: false },
        { apiName: "company", label: "Company", required: false, defaultMapping: "company.name" },
      ]},
      { label: "Create Deal", value: "create_deal", fields: [
        { apiName: "dealname", label: "Deal Name", required: true, defaultStaticValue: "{{company_name}} — {{application_type}}", placeholder: "Deal name or template" },
        { apiName: "amount", label: "Amount", required: false, defaultMapping: "application.requestedAmount" },
        { apiName: "dealstage", label: "Deal Stage", required: false, defaultStaticValue: "qualifiedtobuy", placeholder: "e.g. qualifiedtobuy" },
        { apiName: "pipeline", label: "Pipeline", required: false, defaultStaticValue: "default", placeholder: "Pipeline ID" },
      ]},
      { label: "Update Deal Stage", value: "update_deal", fields: [
        { apiName: "dealstage", label: "Deal Stage", required: true, placeholder: "e.g. closedwon" },
      ]},
      { label: "Create Company", value: "create_company", fields: [
        { apiName: "name", label: "Company Name", required: true, defaultMapping: "company.name" },
        { apiName: "domain", label: "Domain", required: false, placeholder: "company.com" },
        { apiName: "industry", label: "Industry", required: false, defaultMapping: "company.industry" },
        { apiName: "phone", label: "Phone", required: false },
        { apiName: "state", label: "State / Region", required: false, defaultMapping: "company.state" },
      ]},
      { label: "Log Activity / Note", value: "log_activity", fields: [
        { apiName: "hs_note_body", label: "Note Body", required: true, defaultStaticValue: "Application {{application_id}} — {{application_type}} for ${{requested_amount}}", placeholder: "Note content" },
      ]},
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    logo: SalesforceLogo,
    color: "border-blue-200 bg-blue-50",
    authType: "oauth",
    authLabel: "Connect Salesforce Account",
    fields: [
      { key: "instanceUrl", label: "Instance URL", type: "text", placeholder: "https://yourorg.my.salesforce.com" },
      { key: "sandbox", label: "Environment", type: "select", placeholder: "Production", options: [
        { label: "Production", value: "production" },
        { label: "Sandbox", value: "sandbox" },
      ]},
    ],
    actions: [
      { label: "Create Lead", value: "create_lead", fields: [
        { apiName: "LastName", label: "Last Name", required: true, placeholder: "Contact last name" },
        { apiName: "Company", label: "Company", required: true, defaultMapping: "company.name" },
        { apiName: "Email", label: "Email", required: false, placeholder: "contact@example.com" },
        { apiName: "Phone", label: "Phone", required: false },
        { apiName: "Industry", label: "Industry", required: false, defaultMapping: "company.industry" },
        { apiName: "AnnualRevenue", label: "Annual Revenue", required: false, defaultMapping: "company.annualRevenue" },
        { apiName: "LeadSource", label: "Lead Source", required: false, defaultStaticValue: "Sharpei Platform", placeholder: "e.g. Web, Referral" },
        { apiName: "Description", label: "Description", required: false },
      ]},
      { label: "Create Opportunity", value: "create_opportunity", fields: [
        { apiName: "Name", label: "Opportunity Name", required: true, defaultStaticValue: "{{company_name}} — {{application_type}}", placeholder: "Opportunity name" },
        { apiName: "StageName", label: "Stage", required: true, defaultStaticValue: "Qualification", placeholder: "e.g. Qualification, Proposal" },
        { apiName: "Amount", label: "Amount", required: false, defaultMapping: "application.requestedAmount" },
        { apiName: "CloseDate", label: "Close Date", required: false, placeholder: "YYYY-MM-DD" },
        { apiName: "Description", label: "Description", required: false },
      ]},
      { label: "Update Opportunity Stage", value: "update_opportunity", fields: [
        { apiName: "StageName", label: "Stage", required: true, placeholder: "e.g. Closed Won, Closed Lost" },
      ]},
      { label: "Create Account", value: "create_account", fields: [
        { apiName: "Name", label: "Account Name", required: true, defaultMapping: "company.name" },
        { apiName: "Industry", label: "Industry", required: false, defaultMapping: "company.industry" },
        { apiName: "AnnualRevenue", label: "Annual Revenue", required: false, defaultMapping: "company.annualRevenue" },
        { apiName: "Phone", label: "Phone", required: false },
        { apiName: "Description", label: "Description", required: false },
      ]},
      { label: "Update Account", value: "update_account", fields: [
        { apiName: "Name", label: "Account Name (lookup)", required: true, defaultMapping: "company.name" },
        { apiName: "Industry", label: "Industry", required: false, defaultMapping: "company.industry" },
        { apiName: "AnnualRevenue", label: "Annual Revenue", required: false, defaultMapping: "company.annualRevenue" },
        { apiName: "Phone", label: "Phone", required: false },
      ]},
      { label: "Log Activity", value: "log_activity", fields: [
        { apiName: "Subject", label: "Subject", required: true, defaultStaticValue: "Application {{application_id}} submitted", placeholder: "Activity subject" },
        { apiName: "Description", label: "Description", required: false },
      ]},
    ],
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    logo: PipedriveLogo,
    color: "border-green-200 bg-green-50",
    authType: "api_key",
    authLabel: "API Token",
    fields: [
      { key: "companyDomain", label: "Company Domain", type: "text", placeholder: "yourcompany.pipedrive.com" },
      { key: "apiToken", label: "API Token", type: "password", placeholder: "xxxxxxxxxxxxxxxxxxxx" },
    ],
    actions: [
      { label: "Create Deal", value: "create_deal", fields: [
        { apiName: "title", label: "Deal Title", required: true, defaultStaticValue: "{{company_name}} — {{application_type}}", placeholder: "Deal title" },
        { apiName: "value", label: "Value", required: false, defaultMapping: "application.requestedAmount" },
        { apiName: "currency", label: "Currency", required: false, defaultStaticValue: "USD", placeholder: "e.g. USD, EUR" },
        { apiName: "stage_id", label: "Stage ID", required: false, placeholder: "Pipeline stage ID" },
      ]},
      { label: "Update Deal", value: "update_deal", fields: [
        { apiName: "title", label: "Deal Title (lookup)", required: true, placeholder: "Deal to update" },
        { apiName: "value", label: "Value", required: false, defaultMapping: "application.requestedAmount" },
        { apiName: "stage_id", label: "Stage ID", required: false, placeholder: "Pipeline stage ID" },
      ]},
      { label: "Create Person", value: "create_person", fields: [
        { apiName: "name", label: "Name", required: true, defaultMapping: "guarantor.name", placeholder: "Contact name" },
        { apiName: "email", label: "Email", required: false, placeholder: "contact@example.com" },
        { apiName: "phone", label: "Phone", required: false },
      ]},
      { label: "Update Person", value: "update_person", fields: [
        { apiName: "name", label: "Name (lookup)", required: true, placeholder: "Person to update" },
        { apiName: "email", label: "Email", required: false },
        { apiName: "phone", label: "Phone", required: false },
      ]},
      { label: "Create Organization", value: "create_organization", fields: [
        { apiName: "name", label: "Organization Name", required: true, defaultMapping: "company.name" },
        { apiName: "address", label: "Address", required: false, placeholder: "Street address" },
      ]},
      { label: "Add Note", value: "add_note", fields: [
        { apiName: "content", label: "Note Content", required: true, defaultStaticValue: "Application {{application_id}} — {{application_type}}", placeholder: "Note content" },
      ]},
    ],
  },
];

// Sharpei logo using the brand gradient
const SharpeiLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="sharpeiGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#sharpeiGrad)" />
    <path d="M10 22V12l6 4.5L22 12v10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="16" cy="10" r="2" fill="white" />
  </svg>
);

// Get platform logo for a node (based on subtype)
const getNodePlatformLogo = (subtype: string, _config: Record<string, string>): React.FC<{ className?: string }> | null => {
  const provider = getProviderForSubtype(subtype);
  if (provider) return provider.logo;
  if (subtype === "slack_message") return SlackLogo;
  if (subtype === "teams_message") return TeamsLogo;
  if (subtype === "assign_officer") return SharpeiLogo;
  return null;
};
import type { ApplicationField } from "@/services/automationMockData";
import type { WorkflowNode as ImportedWorkflowNode, WorkflowConnection } from "@/lib/workflowConversion";

// Condition entry for If/Else nodes
interface ConditionEntry {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// Node types for the builder
interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  subtype: string;
  label: string;
  x: number;
  y: number;
  config: Record<string, string>;
  conditions?: ConditionEntry[];
  conditionLogic?: "and" | "or";
}

interface Connection {
  from: string;
  to: string;
  sourceOutput?: string; // which output port the connection originates from (e.g. "true", "false")
}

// Returns the list of output port names for a given node
const getNodeOutputs = (node: WorkflowNode): string[] => {
  if (node.subtype === "if_else") return ["true", "false"];
  if (node.subtype === "filter") return ["match", "no match"];
  return ["default"];
};

// Calculate X position for a specific output port on a node
const getOutputPortX = (node: WorkflowNode, outputName: string): number => {
  const outputs = getNodeOutputs(node);
  if (outputs.length <= 1) return node.x + 100; // centered on 200px node
  const idx = outputs.indexOf(outputName);
  const portIndex = idx >= 0 ? idx : 0;
  // Distribute evenly across the node width (200px), with padding
  const padding = 30;
  const usableWidth = 200 - 2 * padding;
  const spacing = outputs.length > 1 ? usableWidth / (outputs.length - 1) : 0;
  return node.x + padding + portIndex * spacing;
};

// Operators per field type
const OPERATORS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  text: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
    { value: "between", label: "Between" },
  ],
  select: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
  ],
};

let conditionIdCounter = 0;

// ── Node type detection helpers ──────────────────────────────────
const CRM_SUBTYPES = new Set(CRM_PROVIDERS.map((p) => p.id));
const EMAIL_SUBTYPES = new Set(EMAIL_PROVIDERS.map((p) => p.id));

const isCrmNode = (subtype: string) => CRM_SUBTYPES.has(subtype);
const isEmailNode = (subtype: string) => EMAIL_SUBTYPES.has(subtype);

const getProviderForSubtype = (subtype: string): ProviderOption | null =>
  CRM_PROVIDERS.find((p) => p.id === subtype) || EMAIL_PROVIDERS.find((p) => p.id === subtype) || null;

// Palette entry — each integration is its own node
interface PaletteAction {
  subtype: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const NODE_PALETTE = {
  triggers: [
    { subtype: "event", label: "Platform Event", icon: Zap, color: "bg-blue-500" },
    { subtype: "schedule", label: "Schedule", icon: Clock, color: "bg-blue-500" },
    { subtype: "webhook_receive", label: "Webhook Received", icon: Webhook, color: "bg-blue-500" },
  ],
  conditions: [
    { subtype: "if_else", label: "If / Else", icon: GitBranch, color: "bg-amber-500" },
    { subtype: "filter", label: "Filter", icon: Filter, color: "bg-amber-500" },
    { subtype: "delay", label: "Delay / Wait", icon: Timer, color: "bg-amber-500" },
  ],
  actions: [
    { subtype: "gmail", label: "Gmail", icon: Mail, color: "bg-green-500" },
    { subtype: "outlook", label: "Outlook", icon: Mail, color: "bg-green-500" },
    { subtype: "sendgrid", label: "SendGrid", icon: Mail, color: "bg-green-500" },
    { subtype: "smtp", label: "Custom SMTP", icon: Mail, color: "bg-green-500" },
    { subtype: "hubspot", label: "HubSpot", icon: Users, color: "bg-green-500" },
    { subtype: "salesforce", label: "Salesforce", icon: Users, color: "bg-green-500" },
    { subtype: "pipedrive", label: "Pipedrive", icon: Users, color: "bg-green-500" },
    { subtype: "http_request", label: "HTTP Request", icon: Globe, color: "bg-green-500" },
    { subtype: "slack_message", label: "Slack", icon: MessageSquare, color: "bg-green-500" },
    { subtype: "teams_message", label: "Microsoft Teams", icon: MessageSquare, color: "bg-green-500" },
    { subtype: "create_task", label: "Create Task", icon: FileCheck, color: "bg-green-500" },
    { subtype: "assign_officer", label: "Sharpei Actions", icon: UserCheck, color: "bg-green-500" },
  ] as PaletteAction[],
};

const getNodeColor = (type: string) => {
  switch (type) {
    case "trigger": return { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-700", dot: "bg-blue-500" };
    case "condition": return { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-700", dot: "bg-amber-500" };
    case "action": return { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-700", dot: "bg-green-500" };
    default: return { bg: "bg-muted", border: "border-border", text: "text-foreground", dot: "bg-muted-foreground" };
  }
};

const getNodeIcon = (subtype: string) => {
  const all = [...NODE_PALETTE.triggers, ...NODE_PALETTE.conditions, ...NODE_PALETTE.actions];
  const found = all.find((n) => n.subtype === subtype);
  if (found) return found.icon;
  // Fallback for subtypes not in palette (e.g. legacy nodes)
  if (subtype === "lender_api") return Server;
  if (subtype === "send_email" || isEmailNode(subtype)) return Mail;
  if (subtype === "crm_update" || isCrmNode(subtype)) return Users;
  return Zap;
};

let nodeIdCounter = 0;

const DEFAULT_NODES: WorkflowNode[] = [
  { id: "node_1", type: "trigger", subtype: "event", label: "Application Completed", x: 300, y: 60, config: { event: "application_completed" } },
  { id: "node_2", type: "condition", subtype: "if_else", label: "Route by Type", x: 300, y: 240, config: {}, conditions: [
    { id: "cond_default_1", field: "application.type", operator: "equals", value: "Equipment Financing" },
    { id: "cond_default_2", field: "application.requestedAmount", operator: "greater_than", value: "25000" },
  ], conditionLogic: "and" },
  { id: "node_3", type: "action", subtype: "gmail", label: "Send Approval Email", x: 150, y: 460, config: { to: "intake@lender.com", subject: "New {{application_type}} — {{company_name}} (${{requested_amount}})", body: "" } },
  { id: "node_4", type: "action", subtype: "slack_message", label: "Notify Review Team", x: 450, y: 460, config: { channel: "#review-queue" } },
];
const DEFAULT_CONNECTIONS: Connection[] = [
  { from: "node_1", to: "node_2" },
  { from: "node_2", to: "node_3", sourceOutput: "true" },
  { from: "node_2", to: "node_4", sourceOutput: "false" },
];

export interface AutomationWorkflowBuilderProps {
  /** Initial nodes (for edit mode) */
  initialNodes?: ImportedWorkflowNode[];
  /** Initial connections (for edit mode) */
  initialConnections?: WorkflowConnection[];
  /** Edit mode: show Save button and call onSave with current nodes/connections */
  mode?: "create" | "edit";
  /** Called when user saves in edit mode */
  onSave?: (nodes: WorkflowNode[], connections: Connection[]) => void;
}

export default function AutomationWorkflowBuilder({
  initialNodes,
  initialConnections,
  mode = "create",
  onSave,
}: AutomationWorkflowBuilderProps = {}) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(
    initialNodes && initialNodes.length > 0
      ? (initialNodes as WorkflowNode[])
      : DEFAULT_NODES
  );
  const [connections, setConnections] = useState<Connection[]>(
    initialConnections && initialConnections.length > 0
      ? (initialConnections as Connection[])
      : DEFAULT_CONNECTIONS
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(
    initialNodes && initialNodes.length > 0 ? initialNodes[0].id : "node_1"
  );
  const [selectedConnection, setSelectedConnection] = useState<{ from: string; to: string; sourceOutput?: string } | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [connectionDragFrom, setConnectionDragFrom] = useState<{ nodeId: string; output: string } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragEndPos, setDragEndPos] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Test Run Simulation ──────────────────────────────────────────
  type SimNodeStatus = "idle" | "running" | "success" | "failed" | "skipped";
  interface SimState {
    running: boolean;
    nodeStatuses: Record<string, SimNodeStatus>;
    logs: { nodeId: string; message: string; status: "info" | "success" | "error" | "warn"; timestamp: number }[];
    activeConnectionKeys: Set<string>; // "from-to-output" keys for animated connections
  }
  const [sim, setSim] = useState<SimState>({
    running: false,
    nodeStatuses: {},
    logs: [],
    activeConnectionKeys: new Set(),
  });
  const simAbortRef = useRef(false);

  const connKey = (from: string, to: string, output?: string) => `${from}-${to}-${output || "default"}`;

  const simulateTestRun = useCallback(async () => {
    simAbortRef.current = false;

    // Find the trigger node (entry point)
    const triggerNode = nodes.find((n) => n.type === "trigger");
    if (!triggerNode) {
      setSim((s) => ({
        ...s,
        running: false,
        logs: [{ nodeId: "", message: "No trigger node found. Add a trigger to test.", status: "error", timestamp: Date.now() }],
      }));
      return;
    }

    // Init all nodes to idle
    const initialStatuses: Record<string, SimNodeStatus> = {};
    nodes.forEach((n) => (initialStatuses[n.id] = "idle"));
    setSim({ running: true, nodeStatuses: initialStatuses, logs: [], activeConnectionKeys: new Set() });

    const delay = (ms: number) => new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, ms);
      // Store for potential cleanup — not critical for simulation
      return () => clearTimeout(timer);
    });

    const addLog = (nodeId: string, message: string, status: "info" | "success" | "error" | "warn") => {
      setSim((s) => ({
        ...s,
        logs: [...s.logs, { nodeId, message, status, timestamp: Date.now() }],
      }));
    };

    const setNodeStatus = (nodeId: string, status: SimNodeStatus) => {
      setSim((s) => ({
        ...s,
        nodeStatuses: { ...s.nodeStatuses, [nodeId]: status },
      }));
    };

    const activateConnection = (from: string, to: string, output?: string) => {
      const key = connKey(from, to, output);
      setSim((s) => ({
        ...s,
        activeConnectionKeys: new Set([...s.activeConnectionKeys, key]),
      }));
    };

    // BFS-style walk through the workflow graph
    const processNode = async (nodeId: string): Promise<void> => {
      if (simAbortRef.current) return;

      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      setNodeStatus(nodeId, "running");
      addLog(nodeId, `Executing: ${node.label}`, "info");
      await delay(800);
      if (simAbortRef.current) return;

      // Simulate based on node type
      if (node.type === "trigger") {
        addLog(nodeId, `Trigger fired: ${node.config.event || node.subtype}`, "success");
        setNodeStatus(nodeId, "success");
      } else if (node.subtype === "if_else") {
        // Simulate condition evaluation — randomly pick true/false for demo
        const conditionResult = Math.random() > 0.3; // 70% chance of true
        const conditionDesc = node.conditions?.filter((c) => c.field).map((c) => {
          const f = APPLICATION_FIELDS.find((af) => af.value === c.field);
          return `${f?.label || c.field} ${c.operator} ${c.value}`;
        }).join(` ${(node.conditionLogic || "and").toUpperCase()} `) || "condition";
        addLog(nodeId, `Evaluating: ${conditionDesc}`, "info");
        await delay(500);
        if (simAbortRef.current) return;
        addLog(nodeId, `Result: ${conditionResult ? "TRUE" : "FALSE"} — following ${conditionResult ? "true" : "false"} branch`, conditionResult ? "success" : "warn");
        setNodeStatus(nodeId, "success");

        // Follow the matching output branch
        const matchingConns = connections.filter((c) => c.from === nodeId);
        for (const conn of matchingConns) {
          if (simAbortRef.current) return;
          const output = conn.sourceOutput || "default";
          const isMatch = (conditionResult && (output === "true" || output === "default")) ||
                          (!conditionResult && output === "false");
          if (isMatch) {
            activateConnection(conn.from, conn.to, conn.sourceOutput);
            await delay(400);
            await processNode(conn.to);
          } else {
            // Mark skipped nodes on the other branch
            const skipTarget = nodes.find((n) => n.id === conn.to);
            if (skipTarget) {
              setNodeStatus(conn.to, "skipped");
              addLog(conn.to, `Skipped: ${skipTarget.label} (${output} branch not taken)`, "warn");
            }
          }
        }
        return; // Already handled downstream
      } else if (node.subtype === "filter") {
        const filterResult = Math.random() > 0.4;
        addLog(nodeId, `Filter: ${node.config.filterField || "field"} ${node.config.filterOperator || "equals"} ${node.config.filterValue || "value"}`, "info");
        await delay(500);
        if (simAbortRef.current) return;
        addLog(nodeId, `Filter result: ${filterResult ? "MATCH" : "NO MATCH"}`, filterResult ? "success" : "warn");
        setNodeStatus(nodeId, "success");

        const matchingConns = connections.filter((c) => c.from === nodeId);
        for (const conn of matchingConns) {
          if (simAbortRef.current) return;
          const output = conn.sourceOutput || "default";
          const isMatch = (filterResult && (output === "match" || output === "default")) ||
                          (!filterResult && output === "no match");
          if (isMatch) {
            activateConnection(conn.from, conn.to, conn.sourceOutput);
            await delay(400);
            await processNode(conn.to);
          } else {
            const skipTarget = nodes.find((n) => n.id === conn.to);
            if (skipTarget) {
              setNodeStatus(conn.to, "skipped");
              addLog(conn.to, `Skipped: ${skipTarget.label} (${output} branch not taken)`, "warn");
            }
          }
        }
        return;
      } else if (node.subtype === "delay") {
        const dv = node.config.delayValue || "1";
        const du = node.config.delayUnit || "hours";
        addLog(nodeId, `Waiting ${dv} ${du} (simulated)`, "info");
        await delay(600);
        if (simAbortRef.current) return;
        addLog(nodeId, `Delay completed`, "success");
        setNodeStatus(nodeId, "success");
      } else if (node.type === "action") {
        // Simulate action execution
        const actionDescriptions: Record<string, string> = {
          gmail: `Sending email to ${node.config.to || "recipient"}`,
          outlook: `Sending email to ${node.config.to || "recipient"}`,
          sendgrid: `Sending email via SendGrid to ${node.config.to || "recipient"}`,
          smtp: `Sending email via SMTP to ${node.config.to || "recipient"}`,
          slack_message: `Posting to Slack channel ${node.config.channel || "#channel"}`,
          teams_message: `Posting to Microsoft Teams`,
          http_request: `${node.config.method || "POST"} ${node.config.url || "endpoint"}`,
          hubspot: `Updating HubSpot: ${node.config.action || "create_contact"}`,
          salesforce: `Updating Salesforce: ${node.config.action || "create_contact"}`,
          pipedrive: `Updating Pipedrive: ${node.config.action || "create_contact"}`,
          create_task: `Creating task: ${node.config.taskTitle || "New Task"}`,
          assign_officer: `Assigning officer: ${node.config.strategy || "round_robin"}`,
          lender_api: `Calling lender API: ${node.config.url || "endpoint"}`,
        };
        addLog(nodeId, actionDescriptions[node.subtype] || `Running ${node.label}`, "info");
        await delay(600);
        if (simAbortRef.current) return;

        // Small chance of simulated failure for realism
        const succeeded = Math.random() > 0.1;
        if (succeeded) {
          addLog(nodeId, `Completed successfully`, "success");
          setNodeStatus(nodeId, "success");
        } else {
          addLog(nodeId, `Failed: Simulated error (connection timeout)`, "error");
          setNodeStatus(nodeId, "failed");
          return; // Stop this branch on failure
        }
      } else {
        addLog(nodeId, `Processed: ${node.label}`, "success");
        setNodeStatus(nodeId, "success");
      }

      // Follow outgoing connections (for non-branching nodes)
      const outgoing = connections.filter((c) => c.from === nodeId);
      for (const conn of outgoing) {
        if (simAbortRef.current) return;
        activateConnection(conn.from, conn.to, conn.sourceOutput);
        await delay(400);
        await processNode(conn.to);
      }
    };

    await processNode(triggerNode.id);

    if (!simAbortRef.current) {
      addLog("", "Test run completed", "success");
      setSim((s) => ({ ...s, running: false }));
    }
  }, [nodes, connections]);

  const stopSimulation = useCallback(() => {
    simAbortRef.current = true;
    setSim((s) => ({
      ...s,
      running: false,
      logs: [...s.logs, { nodeId: "", message: "Test run stopped by user", status: "warn", timestamp: Date.now() }],
    }));
  }, []);

  const resetSimulation = useCallback(() => {
    simAbortRef.current = true;
    setSim({ running: false, nodeStatuses: {}, logs: [], activeConnectionKeys: new Set() });
  }, []);

  const isSimulating = sim.running || Object.keys(sim.nodeStatuses).length > 0;
  // ── End Test Run Simulation ──────────────────────────────────────

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (connectionDragFrom && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDragEndPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        return;
      }
      if (!draggingNode || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNode ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n))
      );
    },
    [draggingNode, dragOffset, connectionDragFrom]
  );

  const handleCanvasMouseUp = useCallback(() => {
    setDraggingNode(null);
    setConnectionDragFrom(null);
    setDragEndPos(null);
  }, []);

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (connectionDragFrom) return; // Don't start node drag while connecting
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
    setDraggingNode(nodeId);
    setSelectedNode(nodeId);
  };

  const handleOutputPortMouseDown = (e: React.MouseEvent, nodeId: string, outputName: string = "default") => {
    e.stopPropagation();
    e.preventDefault();
    setConnectionDragFrom({ nodeId, output: outputName });
    setSelectedConnection(null);
    const node = nodes.find((n) => n.id === nodeId);
    if (node && canvasRef.current) {
      const portX = getOutputPortX(node, outputName);
      setDragEndPos({ x: portX, y: node.y + 70 });
    }
  };

  const handleInputPortMouseUp = (e: React.MouseEvent, toNodeId: string) => {
    e.stopPropagation();
    if (connectionDragFrom && connectionDragFrom.nodeId !== toNodeId) {
      addConnection(connectionDragFrom.nodeId, toNodeId, connectionDragFrom.output);
    }
    setConnectionDragFrom(null);
    setDragEndPos(null);
  };

  const addNode = (type: "trigger" | "condition" | "action", subtype: string, label: string) => {
    nodeIdCounter++;
    const newId = `node_new_${nodeIdCounter}`;
    const lastNode = nodes[nodes.length - 1];
    const newNode: WorkflowNode = {
      id: newId,
      type,
      subtype,
      label,
      x: lastNode ? lastNode.x : 300,
      y: lastNode ? lastNode.y + 180 : 80,
      config: {},
    };
    setNodes((prev) => [...prev, newNode]);

    // Auto-connect to last node if it makes sense
    if (lastNode) {
      setConnections((prev) => [...prev, { from: lastNode.id, to: newId }]);
    }
    setSelectedNode(newId);
  };

  const removeNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
    if (selectedConnection && (selectedConnection.from === nodeId || selectedConnection.to === nodeId)) {
      setSelectedConnection(null);
    }
  };

  const removeConnection = (from: string, to: string, sourceOutput?: string) => {
    setConnections((prev) => prev.filter((c) => !(c.from === from && c.to === to && c.sourceOutput === sourceOutput)));
    setSelectedConnection(null);
  };

  const addConnection = (from: string, to: string, sourceOutput?: string) => {
    if (from === to) return;
    const exists = connections.some((c) => c.from === from && c.to === to && c.sourceOutput === sourceOutput);
    if (exists) return;
    setConnections((prev) => [...prev, { from, to, sourceOutput: sourceOutput !== "default" ? sourceOutput : undefined }]);
  };

  const updateNodeConfig = (nodeId: string, key: string, value: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, config: { ...n.config, [key]: value } } : n
      )
    );
  };

  const addCondition = (nodeId: string) => {
    conditionIdCounter++;
    const newCondition: ConditionEntry = {
      id: `cond_${conditionIdCounter}`,
      field: "",
      operator: "",
      value: "",
    };
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              conditions: [...(n.conditions || []), newCondition],
              conditionLogic: n.conditionLogic || "and",
            }
          : n
      )
    );
  };

  const removeCondition = (nodeId: string, conditionId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, conditions: (n.conditions || []).filter((c) => c.id !== conditionId) }
          : n
      )
    );
  };

  const updateCondition = (
    nodeId: string,
    conditionId: string,
    key: keyof ConditionEntry,
    value: string
  ) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              conditions: (n.conditions || []).map((c) => {
                if (c.id !== conditionId) return c;
                // Reset downstream fields when the field changes
                if (key === "field") {
                  return { ...c, field: value, operator: "", value: "" };
                }
                // Reset value when operator changes
                if (key === "operator") {
                  return { ...c, operator: value, value: "" };
                }
                return { ...c, [key]: value };
              }),
            }
          : n
      )
    );
  };

  // ── Field mapping helpers (CRM nodes) ──────────────────────────
  const addMapping = (nodeId: string, crmFieldApiName: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        const mappings = parseFieldMappings(n.config);
        mappings.push({ crmField: crmFieldApiName, sourceType: "static", sourceValue: "" });
        return { ...n, config: { ...n.config, _fieldMappings: JSON.stringify(mappings) } };
      })
    );
  };

  const removeMapping = (nodeId: string, crmFieldApiName: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        const mappings = parseFieldMappings(n.config).filter((m) => m.crmField !== crmFieldApiName);
        return { ...n, config: { ...n.config, _fieldMappings: JSON.stringify(mappings) } };
      })
    );
  };

  const updateMapping = (
    nodeId: string,
    crmFieldApiName: string,
    key: "sourceType" | "sourceValue",
    value: string
  ) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        const mappings = parseFieldMappings(n.config).map((m) => {
          if (m.crmField !== crmFieldApiName) return m;
          if (key === "sourceType") {
            return { ...m, sourceType: value as "field" | "static", sourceValue: "" };
          }
          return { ...m, [key]: value };
        });
        return { ...n, config: { ...n.config, _fieldMappings: JSON.stringify(mappings) } };
      })
    );
  };

  const applySmartDefaults = (nodeId: string, providerId: string, actionValue: string) => {
    const provider = CRM_PROVIDERS.find((p) => p.id === providerId);
    const action = provider?.actions?.find((a) => a.value === actionValue);
    if (!action?.fields) {
      updateNodeConfig(nodeId, "_fieldMappings", "");
      return;
    }
    const mappings: FieldMapping[] = action.fields
      .filter((f) => f.required || f.defaultMapping || f.defaultStaticValue)
      .map((f) => ({
        crmField: f.apiName,
        sourceType: f.defaultMapping ? "field" as const : "static" as const,
        sourceValue: f.defaultMapping || f.defaultStaticValue || "",
      }));
    updateNodeConfig(nodeId, "_fieldMappings", JSON.stringify(mappings));
  };

  const toggleConditionLogic = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, conditionLogic: n.conditionLogic === "and" ? "or" : "and" }
          : n
      )
    );
  };

  const getFieldDef = (fieldValue: string): ApplicationField | undefined => {
    return APPLICATION_FIELDS.find((f) => f.value === fieldValue);
  };

  const [emailBuilderOpen, setEmailBuilderOpen] = useState(false);

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  // SVG path for connections
  const getConnectionPath = (from: WorkflowNode, to: WorkflowNode, sourceOutput?: string) => {
    const fromX = sourceOutput ? getOutputPortX(from, sourceOutput) : from.x + 100;
    const fromY = from.y + 70;
    const toX = to.x + 100;
    const toY = to.y;
    const midY = (fromY + toY) / 2;
    return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
  };

  const handleSave = () => {
    onSave?.(nodes, connections);
  };

  return (
    <div className="space-y-4">
      {mode === "edit" && onSave && (
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Workflow
          </Button>
        </div>
      )}
      {/* Test Run Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {!sim.running ? (
            <Button
              size="sm"
              variant={isSimulating ? "outline" : "default"}
              onClick={simulateTestRun}
              disabled={sim.running}
              className="gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              {isSimulating ? "Run Again" : "Test Run"}
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={stopSimulation} className="gap-2">
              <Square className="w-3.5 h-3.5" />
              Stop
            </Button>
          )}
          {isSimulating && !sim.running && (
            <Button size="sm" variant="ghost" onClick={resetSimulation} className="gap-2 text-muted-foreground">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
        </div>
        {isSimulating && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> {Object.values(sim.nodeStatuses).filter((s) => s === "success").length} passed</span>
            <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> {Object.values(sim.nodeStatuses).filter((s) => s === "failed").length} failed</span>
            <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-muted-foreground" /> {Object.values(sim.nodeStatuses).filter((s) => s === "skipped").length} skipped</span>
          </div>
        )}
      </div>
      <div className={`flex ${isSimulating ? "h-[460px]" : "h-[600px]"} border rounded-xl overflow-hidden bg-card`}>
      {/* Left Panel - Node Palette */}
      <div className="w-56 border-r bg-muted/30 p-4 overflow-y-auto flex-shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Triggers
        </p>
        {NODE_PALETTE.triggers.map((node) => (
          <button
            key={node.subtype}
            onClick={() => addNode("trigger", node.subtype, node.label)}
            className="w-full flex items-center gap-2.5 px-3 py-2 mb-1.5 rounded-lg text-sm text-foreground hover:bg-blue-500/10 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <node.icon className="w-3.5 h-3.5 text-blue-600" />
            </div>
            {node.label}
          </button>
        ))}

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5">
          Conditions
        </p>
        {NODE_PALETTE.conditions.map((node) => (
          <button
            key={node.subtype}
            onClick={() => addNode("condition", node.subtype, node.label)}
            className="w-full flex items-center gap-2.5 px-3 py-2 mb-1.5 rounded-lg text-sm text-foreground hover:bg-amber-500/10 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <node.icon className="w-3.5 h-3.5 text-amber-600" />
            </div>
            {node.label}
          </button>
        ))}

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5">
          Actions
        </p>
        {NODE_PALETTE.actions.map((node, idx) => {
          // Use platform logos for recognizable services
          const PaletteLogo = getProviderForSubtype(node.subtype)?.logo
            || (node.subtype === "slack_message" ? SlackLogo : null)
            || (node.subtype === "teams_message" ? TeamsLogo : null)
            || (node.subtype === "assign_officer" ? SharpeiLogo : null);
          return (
            <button
              key={`${node.subtype}_${idx}`}
              onClick={() => addNode("action", node.subtype, node.label)}
              className="w-full flex items-center gap-2.5 px-3 py-2 mb-1.5 rounded-lg text-sm text-foreground hover:bg-green-500/10 transition-colors text-left"
            >
              {PaletteLogo ? (
                <div className="w-6 h-6 rounded bg-white border border-border/50 flex items-center justify-center flex-shrink-0">
                  <PaletteLogo className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <node.icon className="w-3.5 h-3.5 text-green-600" />
                </div>
              )}
              {node.label}
            </button>
          );
        })}
      </div>

      {/* Center - Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-auto bg-[radial-gradient(circle,_hsl(var(--border))_1px,_transparent_1px)] [background-size:24px_24px] cursor-default"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onClick={() => {
          setSelectedNode(null);
          setSelectedConnection(null);
        }}
      >
        {/* Connection lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: "100%", minWidth: "100%" }}
          onClick={() => {
            setSelectedNode(null);
            setSelectedConnection(null);
          }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" className="fill-muted-foreground/40" />
            </marker>
          </defs>
          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            const pathD = getConnectionPath(fromNode, toNode, conn.sourceOutput);
            const isSelected = selectedConnection?.from === conn.from && selectedConnection?.to === conn.to && selectedConnection?.sourceOutput === conn.sourceOutput;
            // Label position: midpoint of the bezier
            const fromX = conn.sourceOutput ? getOutputPortX(fromNode, conn.sourceOutput) : fromNode.x + 100;
            const fromY = fromNode.y + 70;
            const toX = toNode.x + 100;
            const toY = toNode.y;
            const labelX = (fromX + toX) / 2;
            const labelY = (fromY + toY) / 2;
            const showLabel = conn.sourceOutput && conn.sourceOutput !== "default";
            const isTrue = conn.sourceOutput === "true" || conn.sourceOutput === "match";
            const isSimActive = sim.activeConnectionKeys.has(connKey(conn.from, conn.to, conn.sourceOutput));
            return (
              <g key={`${conn.from}-${conn.to}-${conn.sourceOutput || "default"}`} style={{ pointerEvents: "stroke", cursor: "pointer" }}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(null);
                    setSelectedConnection({ from: conn.from, to: conn.to, sourceOutput: conn.sourceOutput });
                  }}
                />
                {isSimActive && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="hsl(152 69% 50% / 0.3)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                )}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSimActive ? "hsl(152 69% 45%)" : isSelected ? "hsl(var(--primary))" : showLabel ? (isTrue ? "hsl(152 69% 40% / 0.4)" : "hsl(0 72% 60% / 0.4)") : "hsl(var(--muted-foreground) / 0.3)"}
                  strokeWidth={isSimActive ? 2.5 : 2}
                  strokeDasharray={isSimActive ? "none" : "6 3"}
                  markerEnd="url(#arrowhead)"
                />
                {showLabel && (
                  <g style={{ pointerEvents: "none" }}>
                    <rect
                      x={labelX - 20}
                      y={labelY - 8}
                      width="40"
                      height="16"
                      rx="4"
                      fill={isTrue ? "hsl(152 69% 94%)" : "hsl(0 72% 95%)"}
                      stroke={isTrue ? "hsl(152 69% 40% / 0.3)" : "hsl(0 72% 60% / 0.3)"}
                      strokeWidth="1"
                    />
                    <text
                      x={labelX}
                      y={labelY + 3}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill={isTrue ? "hsl(152 69% 30%)" : "hsl(0 72% 40%)"}
                      style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                      {conn.sourceOutput}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          {/* Connection drag preview line */}
          {connectionDragFrom && dragEndPos && (() => {
            const fromNode = nodes.find((n) => n.id === connectionDragFrom.nodeId);
            if (!fromNode) return null;
            const fromX = getOutputPortX(fromNode, connectionDragFrom.output);
            const fromY = fromNode.y + 70;
            const midY = (fromY + dragEndPos.y) / 2;
            const pathD = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${dragEndPos.x} ${midY}, ${dragEndPos.x} ${dragEndPos.y}`;
            return (
              <path
                d={pathD}
                fill="none"
                stroke="hsl(var(--primary) / 0.6)"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
            );
          })()}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const colors = getNodeColor(node.type);
          const Icon = getNodeIcon(node.subtype);
          const PlatformLogo = getNodePlatformLogo(node.subtype, node.config);
          const simStatus = sim.nodeStatuses[node.id];
          const simBorder = simStatus === "running" ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20"
            : simStatus === "success" ? "border-emerald-500 ring-2 ring-emerald-500/20"
            : simStatus === "failed" ? "border-red-500 ring-2 ring-red-500/20"
            : simStatus === "skipped" ? "border-muted-foreground/30 opacity-50"
            : "";
          return (
            <div
              key={node.id}
              className={`absolute w-[200px] rounded-xl border-2 shadow-sm transition-all duration-300 cursor-grab active:cursor-grabbing select-none ${
                colors.bg
              } ${
                simBorder
                  ? simBorder
                  : selectedNode === node.id
                  ? `${colors.border} shadow-md ring-2 ring-primary/20`
                  : "border-transparent hover:shadow-md"
              }`}
              style={{ left: node.x, top: node.y }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(node.id);
              }}
            >
              {/* Simulation status indicator */}
              {simStatus && simStatus !== "idle" && (
                <div className="absolute -top-2.5 -right-2.5 z-10">
                  {simStatus === "running" && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                  {simStatus === "success" && <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />}
                  {simStatus === "failed" && <XCircle className="w-5 h-5 text-red-500 fill-red-50" />}
                  {simStatus === "skipped" && <AlertCircle className="w-5 h-5 text-muted-foreground fill-muted" />}
                </div>
              )}
              <div className="px-3 py-2.5 flex items-center gap-2.5">
                {PlatformLogo ? (
                  <div className="w-7 h-7 rounded-lg bg-white border border-border/50 flex items-center justify-center flex-shrink-0">
                    <PlatformLogo className="w-4 h-4" />
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-lg ${colors.dot} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${colors.text} uppercase tracking-wider`}>
                    {node.type}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">{node.label}</p>
                </div>
              </div>
              {/* Node config preview */}
              {node.subtype === "if_else" && node.conditions && node.conditions.length > 0 ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {node.conditions
                      .filter((c) => c.field)
                      .slice(0, 2)
                      .map((c) => {
                        const f = APPLICATION_FIELDS.find((af) => af.value === c.field);
                        return `${f?.label || c.field} ${c.operator} ${c.value}`;
                      })
                      .join(` ${(node.conditionLogic || "and").toUpperCase()} `)}
                    {node.conditions.filter((c) => c.field).length > 2 ? " ..." : ""}
                  </div>
                </div>
              ) : node.subtype === "delay" && node.config.delayValue ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    Wait {node.config.delayValue} {node.config.delayUnit || "hours"}
                  </div>
                </div>
              ) : node.subtype === "filter" && node.config.filterField ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {APPLICATION_FIELDS.find((f) => f.value === node.config.filterField)?.label || node.config.filterField} {node.config.filterOperator} {node.config.filterValue}
                  </div>
                </div>
              ) : node.subtype === "event" && node.config.event ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {EVENT_CATEGORIES.flatMap((c) => c.events).find((e) => e.value === node.config.event)?.label || node.config.event}
                  </div>
                </div>
              ) : isEmailNode(node.subtype) && (node.config.to || node.config.subject) ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {node.config.to ? `To: ${node.config.to}` : node.config.subject}
                  </div>
                </div>
              ) : node.subtype === "slack_message" && node.config.channel ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    Channel: {node.config.channel}
                  </div>
                </div>
              ) : node.subtype === "teams_message" && node.config.messageTemplate ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {node.config.messageTemplate}
                  </div>
                </div>
              ) : isCrmNode(node.subtype) ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {CRM_PROVIDERS.find((p) => p.id === node.subtype)?.name || node.subtype}
                    {node.config.action ? ` → ${node.config.action.replace(/_/g, " ")}` : ""}
                    {node.config._fieldMappings ? (() => { try { const c = JSON.parse(node.config._fieldMappings).length; return c > 0 ? ` (${c} fields)` : ""; } catch { return ""; } })() : ""}
                  </div>
                </div>
              ) : node.subtype === "lender_api" && node.config.url ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {node.config.method || "POST"} {node.config.url}
                  </div>
                </div>
              ) : (node.subtype === "http_request" || node.subtype === "create_task") && (node.config.url || node.config.taskTitle) ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {node.config.taskTitle || `${node.config.method || "POST"} ${node.config.url}`}
                  </div>
                </div>
              ) : node.subtype === "assign_officer" && (node.config.strategy || node.config.officerName) ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {node.config.strategy === "specific" && node.config.officerName
                      ? `Assign to ${node.config.officerName}`
                      : node.config.strategy === "round_robin"
                      ? "Round-robin assignment"
                      : node.config.strategy === "least_loaded"
                      ? "Assign to least loaded"
                      : "Configure assignment"}
                  </div>
                </div>
              ) : Object.keys(node.config).length > 0 ? (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {Object.entries(node.config)
                      .slice(0, 1)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </div>
                </div>
              ) : null}
              {/* Connection ports - output (bottom) - drag from here to create connection */}
              {(() => {
                const outputs = getNodeOutputs(node);
                if (outputs.length <= 1) {
                  // Single output port - centered
                  return (
                    <div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-background bg-muted-foreground/50 hover:bg-primary/50 cursor-crosshair"
                      onMouseDown={(e) => handleOutputPortMouseDown(e, node.id, "default")}
                      title="Drag to connect to another node"
                    />
                  );
                }
                // Multiple output ports
                const padding = 30; // px from edge
                const usableWidth = 200 - 2 * padding;
                return outputs.map((outputName, idx) => {
                  const leftPx = padding + (outputs.length > 1 ? (idx * usableWidth) / (outputs.length - 1) : 0);
                  const isTrue = outputName === "true" || outputName === "match";
                  const portColor = isTrue
                    ? "bg-emerald-500 hover:bg-emerald-400"
                    : "bg-red-400 hover:bg-red-300";
                  return (
                    <div key={outputName} className="absolute -bottom-2" style={{ left: `${leftPx}px`, transform: "translateX(-50%)" }}>
                      <div
                        className={`w-5 h-5 rounded-full border-2 border-background ${portColor} cursor-crosshair`}
                        onMouseDown={(e) => handleOutputPortMouseDown(e, node.id, outputName)}
                        title={`${outputName} — drag to connect`}
                      />
                      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-muted-foreground whitespace-nowrap select-none pointer-events-none uppercase">
                        {outputName}
                      </span>
                    </div>
                  );
                });
              })()}
              {/* Connection port - input (top) - drop here to complete connection */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-background bg-muted-foreground/50 hover:bg-primary/50 cursor-crosshair"
                onMouseUp={(e) => handleInputPortMouseUp(e, node.id)}
                title="Drop connection here"
              />
            </div>
          );
        })}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Add nodes from the left panel to build your workflow
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Node or Connection Configuration */}
      <div className="w-72 border-l bg-muted/30 p-4 overflow-y-auto flex-shrink-0">
        {selectedConnection ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Connection</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeConnection(selectedConnection.from, selectedConnection.to, selectedConnection.sourceOutput)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {nodes.find((n) => n.id === selectedConnection.from)?.label ?? selectedConnection.from}
              {selectedConnection.sourceOutput && selectedConnection.sourceOutput !== "default" && (
                <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0">{selectedConnection.sourceOutput}</Badge>
              )}
              {" "}→ {nodes.find((n) => n.id === selectedConnection.to)?.label ?? selectedConnection.to}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => removeConnection(selectedConnection.from, selectedConnection.to, selectedConnection.sourceOutput)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              Remove connection
            </Button>
            <p className="text-[11px] text-muted-foreground">
              To add a node in the middle: remove this connection, add a new node from the palette, then drag from the first node&apos;s output (bottom dot) to the new node&apos;s input (top dot), and from the new node&apos;s output to the second node&apos;s input.
            </p>
          </div>
        ) : selectedNodeData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Configure Node</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeNode(selectedNodeData.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Node Type</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={getNodeColor(selectedNodeData.type).text}
                >
                  {selectedNodeData.type}
                </Badge>
                <span className="text-sm">{selectedNodeData.label}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Label
              </Label>
              <Input
                value={selectedNodeData.label}
                onChange={(e) =>
                  setNodes((prev) =>
                    prev.map((n) =>
                      n.id === selectedNodeData.id
                        ? { ...n, label: e.target.value }
                        : n
                    )
                  )
                }
                className="h-8 text-sm"
              />
            </div>

            {/* Dynamic config fields based on node subtype */}
            {selectedNodeData.subtype === "event" && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Event Type
                </Label>
                <Select
                  value={selectedNodeData.config.event || ""}
                  onValueChange={(v) =>
                    updateNodeConfig(selectedNodeData.id, "event", v)
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <div key={cat.label}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          {cat.label}
                        </div>
                        {cat.events.map((evt) => (
                          <SelectItem
                            key={evt.value}
                            value={evt.value}
                            className="text-sm"
                          >
                            {evt.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedNodeData.subtype === "schedule" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Frequency
                  </Label>
                  <Select
                    value={selectedNodeData.config.frequency || ""}
                    onValueChange={(v) =>
                      updateNodeConfig(selectedNodeData.id, "frequency", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Every day</SelectItem>
                      <SelectItem value="weekly">Every week</SelectItem>
                      <SelectItem value="monthly">Every month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Time
                  </Label>
                  <Input
                    type="time"
                    value={selectedNodeData.config.time || "09:00"}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "time", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "webhook_receive" && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Webhook Path
                </Label>
                <Input
                  value={selectedNodeData.config.path || "/incoming"}
                  onChange={(e) =>
                    updateNodeConfig(selectedNodeData.id, "path", e.target.value)
                  }
                  className="h-8 text-sm"
                  placeholder="/my-webhook"
                />
              </div>
            )}

            {selectedNodeData.subtype === "if_else" && (
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Conditions
                </Label>
                {(selectedNodeData.conditions || []).map((cond, idx) => {
                  const fieldDef = getFieldDef(cond.field);
                  const fieldType = fieldDef?.type || "text";
                  const operators = OPERATORS_BY_TYPE[fieldType] || OPERATORS_BY_TYPE.text;
                  return (
                    <div key={cond.id}>
                      {/* AND/OR toggle between conditions */}
                      {idx > 0 && (
                        <div className="flex items-center justify-center my-2">
                          <button
                            type="button"
                            onClick={() => toggleConditionLogic(selectedNodeData.id)}
                            className={`px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border transition-colors ${
                              selectedNodeData.conditionLogic === "or"
                                ? "bg-orange-500/10 text-orange-700 border-orange-300"
                                : "bg-blue-500/10 text-blue-700 border-blue-300"
                            }`}
                          >
                            {selectedNodeData.conditionLogic === "or" ? "OR" : "AND"}
                          </button>
                        </div>
                      )}
                      <div className="rounded-lg border bg-background/60 p-2.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground font-medium">
                            Condition {idx + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeCondition(selectedNodeData.id, cond.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        {/* Field dropdown */}
                        <Select
                          value={cond.field || ""}
                          onValueChange={(v) =>
                            updateCondition(selectedNodeData.id, cond.id, "field", v)
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {APPLICATION_FIELDS.map((f) => (
                              <SelectItem key={f.value} value={f.value} className="text-sm">
                                {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {/* Operator dropdown (adapts to field type) */}
                        {cond.field && (
                          <Select
                            value={cond.operator || ""}
                            onValueChange={(v) =>
                              updateCondition(selectedNodeData.id, cond.id, "operator", v)
                            }
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op.value} value={op.value} className="text-sm">
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {/* Value input - adapts to field type */}
                        {cond.field && cond.operator && (
                          <>
                            {fieldType === "select" && fieldDef?.options ? (
                              <Select
                                value={cond.value || ""}
                                onValueChange={(v) =>
                                  updateCondition(selectedNodeData.id, cond.id, "value", v)
                                }
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldDef.options.map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value}
                                      className="text-sm"
                                    >
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : fieldType === "number" ? (
                              <Input
                                type="number"
                                value={cond.value || ""}
                                onChange={(e) =>
                                  updateCondition(
                                    selectedNodeData.id,
                                    cond.id,
                                    "value",
                                    e.target.value
                                  )
                                }
                                className="h-8 text-sm"
                                placeholder="Enter number"
                              />
                            ) : (
                              <Input
                                value={cond.value || ""}
                                onChange={(e) =>
                                  updateCondition(
                                    selectedNodeData.id,
                                    cond.id,
                                    "value",
                                    e.target.value
                                  )
                                }
                                className="h-8 text-sm"
                                placeholder="Enter value"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={() => addCondition(selectedNodeData.id)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Condition
                </Button>
              </div>
            )}

            {selectedNodeData.subtype === "filter" && (
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Filter — Only continue if
                </Label>
                <div className="rounded-lg border bg-background/60 p-2.5 space-y-2">
                  <Select
                    value={selectedNodeData.config.filterField || ""}
                    onValueChange={(v) =>
                      updateNodeConfig(selectedNodeData.id, "filterField", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_FIELDS.map((f) => (
                        <SelectItem key={f.value} value={f.value} className="text-sm">
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedNodeData.config.filterField && (() => {
                    const fieldDef = getFieldDef(selectedNodeData.config.filterField);
                    const fieldType = fieldDef?.type || "text";
                    const operators = OPERATORS_BY_TYPE[fieldType] || OPERATORS_BY_TYPE.text;
                    return (
                      <>
                        <Select
                          value={selectedNodeData.config.filterOperator || ""}
                          onValueChange={(v) =>
                            updateNodeConfig(selectedNodeData.id, "filterOperator", v)
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {operators.map((op) => (
                              <SelectItem key={op.value} value={op.value} className="text-sm">
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedNodeData.config.filterOperator && (
                          fieldType === "select" && fieldDef?.options ? (
                            <Select
                              value={selectedNodeData.config.filterValue || ""}
                              onValueChange={(v) =>
                                updateNodeConfig(selectedNodeData.id, "filterValue", v)
                              }
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Select value" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldDef.options.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-sm">
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : fieldType === "number" ? (
                            <Input
                              type="number"
                              value={selectedNodeData.config.filterValue || ""}
                              onChange={(e) =>
                                updateNodeConfig(selectedNodeData.id, "filterValue", e.target.value)
                              }
                              className="h-8 text-sm"
                              placeholder="Enter number"
                            />
                          ) : (
                            <Input
                              value={selectedNodeData.config.filterValue || ""}
                              onChange={(e) =>
                                updateNodeConfig(selectedNodeData.id, "filterValue", e.target.value)
                              }
                              className="h-8 text-sm"
                              placeholder="Enter value"
                            />
                          )
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {isEmailNode(selectedNodeData.subtype) && (() => {
              const selectedProvider = EMAIL_PROVIDERS.find((p) => p.id === selectedNodeData.subtype);
              return (
                <div className="space-y-3">
                  {/* Provider branding */}
                  {selectedProvider && (
                    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${selectedProvider.color}`}>
                      <selectedProvider.logo className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{selectedProvider.name}</p>
                        <p className="text-[10px] text-muted-foreground">Email Integration</p>
                      </div>
                    </div>
                  )}

                  {/* Auth & settings */}
                  {selectedProvider && (
                    <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Authentication</span>
                      </div>
                      {/* OAuth connect button */}
                      {selectedProvider.authType === "oauth" && (
                        <div>
                          {selectedNodeData.config[`_oauth_connected_${selectedProvider.id}`] ? (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-xs font-medium text-green-700">Connected</span>
                              <button
                                className="ml-auto text-[10px] text-muted-foreground hover:text-foreground underline"
                                onClick={() => updateNodeConfig(selectedNodeData.id, `_oauth_connected_${selectedProvider.id}`, "")}
                              >
                                Disconnect
                              </button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className={`w-full h-9 text-xs font-medium ${selectedProvider.color}`}
                              onClick={() => updateNodeConfig(selectedNodeData.id, `_oauth_connected_${selectedProvider.id}`, "1")}
                            >
                              <selectedProvider.logo className="w-4 h-4 mr-2" />
                              {selectedProvider.authLabel}
                            </Button>
                          )}
                        </div>
                      )}
                      {/* Credential / API key fields */}
                      {selectedProvider.fields.map((field) => (
                        <div key={field.key}>
                          <Label className="text-xs text-muted-foreground mb-1 block">{field.label}</Label>
                          {field.type === "select" && field.options ? (
                            <Select
                              value={selectedNodeData.config[field.key] || ""}
                              onValueChange={(v) => updateNodeConfig(selectedNodeData.id, field.key, v)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="relative">
                              <Input
                                type={field.type === "password" && !selectedNodeData.config[`_show_${field.key}`] ? "password" : field.type === "password" ? "text" : field.type}
                                value={selectedNodeData.config[field.key] || ""}
                                onChange={(e) => updateNodeConfig(selectedNodeData.id, field.key, e.target.value)}
                                className={`h-7 text-xs ${field.type === "password" ? "pr-8" : ""}`}
                                placeholder={field.placeholder}
                              />
                              {field.type === "password" && (
                                <button
                                  type="button"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  onClick={() => updateNodeConfig(selectedNodeData.id, `_show_${field.key}`, selectedNodeData.config[`_show_${field.key}`] ? "" : "1")}
                                >
                                  {selectedNodeData.config[`_show_${field.key}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Email content */}
                  <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Message</span>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
                      <Input
                        value={selectedNodeData.config.to || ""}
                        onChange={(e) => updateNodeConfig(selectedNodeData.id, "to", e.target.value)}
                        className="h-7 text-xs"
                        placeholder="{{customer_email}}"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Subject</Label>
                      <Input
                        value={selectedNodeData.config.subject || ""}
                        onChange={(e) => updateNodeConfig(selectedNodeData.id, "subject", e.target.value)}
                        className="h-7 text-xs"
                        placeholder="Your Application Update"
                      />
                    </div>
                    {selectedNodeData.config.body && (
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Body Preview</span>
                        <p className="text-xs text-muted-foreground line-clamp-3 mt-0.5">{selectedNodeData.config.body}</p>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 text-sm"
                    onClick={() => setEmailBuilderOpen(true)}
                  >
                    <Mail className="w-3.5 h-3.5 mr-2" />
                    {selectedNodeData.config.to ? "Edit Email Template" : "Design Email"}
                  </Button>
                </div>
              );
            })()}

            {selectedNodeData.subtype === "slack_message" && (
              <div className="space-y-3">
                {/* Provider branding */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-purple-200 bg-purple-50">
                  <SlackLogo className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Slack</p>
                    <p className="text-[10px] text-muted-foreground">Incoming Webhook</p>
                  </div>
                </div>
                {/* Auth */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Connection</span>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Webhook URL</Label>
                    <Input
                      value={selectedNodeData.config.webhookUrl || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "webhookUrl", e.target.value)}
                      className="h-7 text-xs font-mono"
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                </div>
                {/* Message settings */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Message</span>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Channel</Label>
                    <Input
                      value={selectedNodeData.config.channel || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "channel", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="#general"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Message Template</Label>
                    <Input
                      value={selectedNodeData.config.messageTemplate || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "messageTemplate", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="New application from {{company_name}}"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "lender_api" && (
              <div className="space-y-3">
                {/* Provider branding */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-cyan-200 bg-cyan-50">
                  <Server className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Lender API</p>
                    <p className="text-[10px] text-muted-foreground">REST API Integration</p>
                  </div>
                </div>
                {/* Auth */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Authentication</span>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">API Key / Bearer Token</Label>
                    <div className="relative">
                      <Input
                        type={selectedNodeData.config._showAuth ? "text" : "password"}
                        value={selectedNodeData.config.authHeader || ""}
                        onChange={(e) => updateNodeConfig(selectedNodeData.id, "authHeader", e.target.value)}
                        className="h-7 text-xs pr-8 font-mono"
                        placeholder="Bearer your-api-key"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => updateNodeConfig(selectedNodeData.id, "_showAuth", selectedNodeData.config._showAuth ? "" : "1")}
                      >
                        {selectedNodeData.config._showAuth ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Request settings */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Request</span>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Endpoint URL</Label>
                    <Input
                      value={selectedNodeData.config.url || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "url", e.target.value)}
                      className="h-7 text-xs font-mono"
                      placeholder="https://api.lender.com/v1/applications"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Method</Label>
                    <Select
                      value={selectedNodeData.config.method || "POST"}
                      onValueChange={(v) => updateNodeConfig(selectedNodeData.id, "method", v)}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Content-Type</Label>
                    <Select
                      value={selectedNodeData.config.contentType || "application/json"}
                      onValueChange={(v) => updateNodeConfig(selectedNodeData.id, "contentType", v)}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="application/json">application/json</SelectItem>
                        <SelectItem value="application/x-www-form-urlencoded">form-urlencoded</SelectItem>
                        <SelectItem value="multipart/form-data">multipart/form-data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "http_request" && (
              <div className="space-y-3">
                {/* Provider branding */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-orange-200 bg-orange-50">
                  <Globe className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">HTTP Request</p>
                    <p className="text-[10px] text-muted-foreground">Webhook / REST API</p>
                  </div>
                </div>
                {/* Auth */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Authentication (optional)</span>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Authorization Header</Label>
                    <div className="relative">
                      <Input
                        type={selectedNodeData.config._showAuth ? "text" : "password"}
                        value={selectedNodeData.config.authHeader || ""}
                        onChange={(e) => updateNodeConfig(selectedNodeData.id, "authHeader", e.target.value)}
                        className="h-7 text-xs pr-8 font-mono"
                        placeholder="Bearer token or API key"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => updateNodeConfig(selectedNodeData.id, "_showAuth", selectedNodeData.config._showAuth ? "" : "1")}
                      >
                        {selectedNodeData.config._showAuth ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Request */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Request</span>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">URL</Label>
                    <Input
                      value={selectedNodeData.config.url || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "url", e.target.value)}
                      className="h-7 text-xs font-mono"
                      placeholder="https://api.example.com/webhook"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Method</Label>
                    <Select
                      value={selectedNodeData.config.method || "POST"}
                      onValueChange={(v) => updateNodeConfig(selectedNodeData.id, "method", v)}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {isCrmNode(selectedNodeData.subtype) && (() => {
              const selectedCrm = CRM_PROVIDERS.find((p) => p.id === selectedNodeData.subtype);
              return (
                <div className="space-y-3">
                  {/* Provider branding */}
                  {selectedCrm && (
                    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${selectedCrm.color}`}>
                      <selectedCrm.logo className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{selectedCrm.name}</p>
                        <p className="text-[10px] text-muted-foreground">CRM Integration</p>
                      </div>
                    </div>
                  )}

                  {/* Auth */}
                  {selectedCrm && (
                    <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Authentication</span>
                      </div>
                      {/* OAuth connect button */}
                      {selectedCrm.authType === "oauth" && (
                        <div>
                          {selectedNodeData.config[`_oauth_connected_${selectedCrm.id}`] ? (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-xs font-medium text-green-700">Connected</span>
                              <button
                                className="ml-auto text-[10px] text-muted-foreground hover:text-foreground underline"
                                onClick={() => updateNodeConfig(selectedNodeData.id, `_oauth_connected_${selectedCrm.id}`, "")}
                              >
                                Disconnect
                              </button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className={`w-full h-9 text-xs font-medium ${selectedCrm.color}`}
                              onClick={() => updateNodeConfig(selectedNodeData.id, `_oauth_connected_${selectedCrm.id}`, "1")}
                            >
                              <selectedCrm.logo className="w-4 h-4 mr-2" />
                              {selectedCrm.authLabel}
                            </Button>
                          )}
                        </div>
                      )}
                      {/* Credential / API key fields */}
                      {selectedCrm.fields.map((field) => (
                        <div key={field.key}>
                          <Label className="text-xs text-muted-foreground mb-1 block">{field.label}</Label>
                          {field.type === "select" && field.options ? (
                            <Select
                              value={selectedNodeData.config[field.key] || ""}
                              onValueChange={(v) => updateNodeConfig(selectedNodeData.id, field.key, v)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="relative">
                              <Input
                                type={field.type === "password" && !selectedNodeData.config[`_show_${field.key}`] ? "password" : "text"}
                                value={selectedNodeData.config[field.key] || ""}
                                onChange={(e) => updateNodeConfig(selectedNodeData.id, field.key, e.target.value)}
                                className={`h-7 text-xs font-mono ${field.type === "password" ? "pr-8" : ""}`}
                                placeholder={field.placeholder}
                              />
                              {field.type === "password" && (
                                <button
                                  type="button"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  onClick={() => updateNodeConfig(selectedNodeData.id, `_show_${field.key}`, selectedNodeData.config[`_show_${field.key}`] ? "" : "1")}
                                >
                                  {selectedNodeData.config[`_show_${field.key}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action — dynamic from provider */}
                  {selectedCrm && selectedCrm.actions && selectedCrm.actions.length > 0 && (
                    <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Action</span>
                      <Select
                        value={selectedNodeData.config.action || ""}
                        onValueChange={(v) => {
                          updateNodeConfig(selectedNodeData.id, "action", v);
                          applySmartDefaults(selectedNodeData.id, selectedNodeData.subtype, v);
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCrm.actions.map((a) => (
                            <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Field Mapping */}
                  {selectedCrm && selectedNodeData.config.action && (() => {
                    const action = selectedCrm.actions?.find((a) => a.value === selectedNodeData.config.action);
                    if (!action?.fields || action.fields.length === 0) return null;

                    const mappings = parseFieldMappings(selectedNodeData.config);
                    const mappedCrmFields = new Set(mappings.map((m) => m.crmField));
                    const unmappedFields = action.fields.filter((f) => !mappedCrmFields.has(f.apiName));

                    return (
                      <div className="rounded-lg border bg-background/60 p-3 space-y-2">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Field Mapping</span>

                        {mappings.length === 0 && (
                          <p className="text-[11px] text-muted-foreground italic">No fields mapped yet. Select an action above to auto-populate.</p>
                        )}

                        {mappings.map((mapping) => {
                          const fieldDef = action.fields!.find((f) => f.apiName === mapping.crmField);
                          const isRequired = fieldDef?.required ?? false;
                          return (
                            <div key={mapping.crmField} className="rounded border bg-muted/30 p-2 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium text-foreground">
                                  {fieldDef?.label || mapping.crmField}
                                  {isRequired && <span className="text-red-500 ml-0.5">*</span>}
                                </span>
                                {!isRequired && (
                                  <button
                                    className="text-muted-foreground hover:text-destructive p-0.5"
                                    onClick={() => removeMapping(selectedNodeData.id, mapping.crmField)}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <div className="flex gap-1.5">
                                <Select
                                  value={mapping.sourceType}
                                  onValueChange={(v) => updateMapping(selectedNodeData.id, mapping.crmField, "sourceType", v)}
                                >
                                  <SelectTrigger className="h-7 text-[11px] w-[76px] flex-shrink-0">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="field">Field</SelectItem>
                                    <SelectItem value="static">Static</SelectItem>
                                  </SelectContent>
                                </Select>

                                {mapping.sourceType === "field" ? (
                                  <Select
                                    value={mapping.sourceValue}
                                    onValueChange={(v) => updateMapping(selectedNodeData.id, mapping.crmField, "sourceValue", v)}
                                  >
                                    <SelectTrigger className="h-7 text-[11px] flex-1">
                                      <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {APPLICATION_FIELDS.map((f) => (
                                        <SelectItem key={f.value} value={f.value} className="text-xs">
                                          {f.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    value={mapping.sourceValue}
                                    onChange={(e) => updateMapping(selectedNodeData.id, mapping.crmField, "sourceValue", e.target.value)}
                                    className="h-7 text-[11px] flex-1"
                                    placeholder={fieldDef?.placeholder || "Enter value"}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Add optional field */}
                        {unmappedFields.length > 0 && (
                          <Select
                            value=""
                            onValueChange={(v) => addMapping(selectedNodeData.id, v)}
                          >
                            <SelectTrigger className="h-7 text-[11px] border-dashed text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Plus className="w-3 h-3" />
                                <span>Add field mapping</span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {unmappedFields.map((f) => (
                                <SelectItem key={f.apiName} value={f.apiName} className="text-xs">
                                  {f.label}{f.required ? " *" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            {selectedNodeData.subtype === "create_task" && (
              <div className="space-y-3">
                {/* Provider branding */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-green-200 bg-green-50">
                  <FileCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Create Task</p>
                    <p className="text-[10px] text-muted-foreground">Internal Task Manager</p>
                  </div>
                </div>
                {/* Connection */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Connection</span>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Task API URL</Label>
                    <Input
                      value={selectedNodeData.config.url || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "url", e.target.value)}
                      className="h-7 text-xs font-mono"
                      placeholder="https://api.your-tool.com/tasks"
                    />
                  </div>
                </div>
                {/* Task settings */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Task Details</span>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Task Title</Label>
                    <Input
                      value={selectedNodeData.config.taskTitle || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "taskTitle", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="Review {{application_id}} — {{company_name}}"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                    <Input
                      value={selectedNodeData.config.taskDescription || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "taskDescription", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="Application type: {{application_type}}, Amount: ${{requested_amount}}"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "teams_message" && (
              <div className="space-y-3">
                {/* Provider branding */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-indigo-200 bg-indigo-50">
                  <TeamsLogo className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Microsoft Teams</p>
                    <p className="text-[10px] text-muted-foreground">Incoming Webhook</p>
                  </div>
                </div>
                {/* Auth */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Connection</span>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Webhook URL</Label>
                    <Input
                      value={selectedNodeData.config.webhookUrl || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "webhookUrl", e.target.value)}
                      className="h-7 text-xs font-mono"
                      placeholder="https://outlook.office.com/webhook/..."
                    />
                  </div>
                </div>
                {/* Message settings */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Message</span>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Message Template</Label>
                    <Input
                      value={selectedNodeData.config.messageTemplate || ""}
                      onChange={(e) => updateNodeConfig(selectedNodeData.id, "messageTemplate", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="New application {{application_id}} from {{company_name}}"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "delay" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Wait Duration
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={selectedNodeData.config.delayValue || ""}
                      onChange={(e) =>
                        updateNodeConfig(selectedNodeData.id, "delayValue", e.target.value)
                      }
                      className="h-8 text-sm w-20"
                      placeholder="1"
                      min="1"
                    />
                    <Select
                      value={selectedNodeData.config.delayUnit || "hours"}
                      onValueChange={(v) =>
                        updateNodeConfig(selectedNodeData.id, "delayUnit", v)
                      }
                    >
                      <SelectTrigger className="h-8 text-sm flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "assign_officer" && (
              <div className="space-y-3">
                {/* Platform branding */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-violet-200 bg-violet-50">
                  <SharpeiLogo className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Sharpei Actions</p>
                    <p className="text-[10px] text-muted-foreground">Assign Officer</p>
                  </div>
                </div>
                {/* Assignment config */}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Assignment Strategy</span>
                  <Select
                    value={selectedNodeData.config.strategy || ""}
                    onValueChange={(v) => {
                      updateNodeConfig(selectedNodeData.id, "strategy", v);
                      if (v !== "specific") {
                        updateNodeConfig(selectedNodeData.id, "officerId", "");
                        updateNodeConfig(selectedNodeData.id, "officerName", "");
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="specific">Specific Officer</SelectItem>
                      <SelectItem value="round_robin">Round-Robin</SelectItem>
                      <SelectItem value="least_loaded">Least Loaded</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedNodeData.config.strategy === "round_robin"
                      ? "Distributes evenly across all eligible officers"
                      : selectedNodeData.config.strategy === "least_loaded"
                      ? "Assigns to the officer with fewest active applications"
                      : "Always assigns to the selected officer below"}
                  </p>
                </div>
                {selectedNodeData.config.strategy === "specific" && (
                  <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Officer</span>
                    <Select
                      value={selectedNodeData.config.officerId || ""}
                      onValueChange={(v) => {
                        updateNodeConfig(selectedNodeData.id, "officerId", v);
                        const names: Record<string, string> = {
                          user_lucia: "Lucia Clifford",
                          user_carlos: "Carlos Rivera",
                          user_sarah: "Sarah Chen",
                        };
                        updateNodeConfig(selectedNodeData.id, "officerName", names[v] || v);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select officer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user_lucia">Lucia Clifford (Super Admin)</SelectItem>
                        <SelectItem value="user_carlos">Carlos Rivera (Ops Manager)</SelectItem>
                        <SelectItem value="user_sarah">Sarah Chen (Credit Analyst)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="rounded-lg border bg-background/60 p-3 space-y-2.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Notification</span>
                  <Select
                    value={selectedNodeData.config.notifyOfficer || "yes"}
                    onValueChange={(v) =>
                      updateNodeConfig(selectedNodeData.id, "notifyOfficer", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes — send email notification</SelectItem>
                      <SelectItem value="no">No — silent assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-2">
              <ChevronRight className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Select a node or connection
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag from a node&apos;s bottom dot to another&apos;s top dot to connect.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Simulation Execution Log */}
      {isSimulating && sim.logs.length > 0 && (
        <div className="border rounded-xl overflow-hidden bg-card">
          <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Execution Log</h3>
            {sim.running && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
          </div>
          <div className="max-h-[140px] overflow-y-auto p-1">
            {sim.logs.map((log, i) => {
              const logNode = log.nodeId ? nodes.find((n) => n.id === log.nodeId) : null;
              return (
                <div key={i} className="flex items-start gap-2 px-3 py-1 text-xs hover:bg-muted/30 rounded">
                  <span className="text-muted-foreground/60 flex-shrink-0 tabular-nums w-[52px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                  {log.status === "success" && <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />}
                  {log.status === "error" && <XCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />}
                  {log.status === "info" && <Loader2 className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />}
                  {log.status === "warn" && <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />}
                  {logNode && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 flex-shrink-0">{logNode.label}</Badge>
                  )}
                  <span className={`${log.status === "error" ? "text-red-600" : log.status === "warn" ? "text-amber-600" : "text-foreground"}`}>
                    {log.message}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Email Template Builder Dialog */}
      {selectedNodeData && isEmailNode(selectedNodeData.subtype) && (
        <EmailTemplateBuilder
          open={emailBuilderOpen}
          onOpenChange={setEmailBuilderOpen}
          to={selectedNodeData.config.to || ""}
          cc={selectedNodeData.config.cc || ""}
          subject={selectedNodeData.config.subject || ""}
          body={selectedNodeData.config.body || ""}
          onSave={(values) => {
            updateNodeConfig(selectedNodeData.id, "to", values.to);
            updateNodeConfig(selectedNodeData.id, "cc", values.cc);
            updateNodeConfig(selectedNodeData.id, "subject", values.subject);
            updateNodeConfig(selectedNodeData.id, "body", values.body);
          }}
        />
      )}
      </div>
    </div>
  );
}
