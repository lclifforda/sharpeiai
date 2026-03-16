import type { DocumentType } from "@/types/documents";

// ── Types ──────────────────────────────────────────────────────────────

export interface ApplicationFieldConfig {
  fieldId: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "select" | "date";
  category: "identity" | "contact" | "financial" | "guarantor";
  enabled: boolean;
  required: boolean;
  aiNote: string;
  minThreshold?: number;
  maxThreshold?: number;
}

export interface DocumentConfig {
  documentType: DocumentType;
  label: string;
  category: string;
  enabled: boolean;
  required: boolean;
  aiNote: string;
}

export interface ApplicationTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  fields: ApplicationFieldConfig[];
  documents: DocumentConfig[];
}

export interface PlatformProfile {
  companyDescription: string;
  minTimeInBusiness?: number;
  minTimeInBusinessUnit?: 'months' | 'years';
  industries: string[];
  customerTypes: string[];
  assetTypes: string[];
  geographicFocus: string[];
  lendingRangeMin: number;
  lendingRangeMax: number;
}

export interface PlatformBranding {
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  welcomeMessage: string;
  companyName: string;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  category: "contract_templates" | "rate_sheets" | "terms_conditions" | "underwriting" | "product_guides";
  size: string;
  uploadedAt: string;
  status: "processed" | "processing" | "error";
  aiNote: string;
  applicableTypes: string[]; // application type IDs — empty means applies to all
}

export interface PlatformConfiguration {
  lastUpdated: string;
  profile: PlatformProfile;
  branding: PlatformBranding;
  applicationTypes: ApplicationTypeConfig[];
  knowledgeBase: KnowledgeDocument[];
}

export const KB_CATEGORY_LABELS: Record<string, string> = {
  contract_templates: "Contract Templates",
  rate_sheets: "Rate Sheets & Pricing",
  terms_conditions: "Terms & Conditions",
  underwriting: "Underwriting Guidelines",
  product_guides: "Product Documentation",
};

// ── Option libraries (for multi-select dropdowns) ──────────────────────

export const INDUSTRY_OPTIONS = [
  "Healthcare",
  "Construction",
  "Technology",
  "Manufacturing",
  "Agriculture",
  "Transportation",
  "Hospitality",
  "Retail",
  "Energy",
  "Education",
];

export const CUSTOMER_TYPE_OPTIONS = [
  "Small Business",
  "Mid-Market",
  "Enterprise",
  "Startup",
  "Franchise",
  "Non-Profit",
];

export const ASSET_TYPE_OPTIONS = [
  "Medical Equipment",
  "Heavy Machinery",
  "IT / Technology",
  "Vehicles",
  "Restaurant Equipment",
  "Office Equipment",
  "Industrial Equipment",
  "Agricultural Equipment",
];

export const US_STATES = [
  "Nationwide",
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

// ── Category labels ────────────────────────────────────────────────────

export const FIELD_CATEGORY_LABELS: Record<string, string> = {
  identity: "Identity & Business Info",
  contact: "Contact Information",
  financial: "Financial Details",
  guarantor: "Guarantor / Personal",
};

export const DOC_CATEGORY_LABELS: Record<string, string> = {
  business_info: "Business Information",
  financial: "Financial Documentation",
  equipment: "Equipment Details",
  personal: "Personal Guarantor",
  security: "Collateral & Security",
};

// ── Standard field library (25 fields) ─────────────────────────────────

const STANDARD_FIELDS: ApplicationFieldConfig[] = [
  // Identity (8)
  { fieldId: "companyName", label: "Company Legal Name", type: "text", category: "identity", enabled: true, required: true, aiNote: "Ask for full legal name, not DBA" },
  { fieldId: "dba", label: "DBA / Trade Name", type: "text", category: "identity", enabled: true, required: false, aiNote: "" },
  { fieldId: "ein", label: "EIN / Tax ID", type: "text", category: "identity", enabled: true, required: true, aiNote: "Format: XX-XXXXXXX" },
  { fieldId: "entityType", label: "Entity Type", type: "select", category: "identity", enabled: true, required: true, aiNote: "LLC, Corporation, Sole Proprietor, Partnership" },
  { fieldId: "dateEstablished", label: "Date Established", type: "date", category: "identity", enabled: true, required: true, aiNote: "" },
  { fieldId: "industry", label: "Industry / SIC Code", type: "text", category: "identity", enabled: true, required: false, aiNote: "" },
  { fieldId: "numberOfEmployees", label: "Number of Employees", type: "number", category: "identity", enabled: true, required: false, aiNote: "", minThreshold: 1, maxThreshold: 10000 },
  { fieldId: "ownershipPercentage", label: "Your Ownership Percentage", type: "number", category: "identity", enabled: true, required: false, aiNote: "What % of the business do you own? (e.g. 100)", minThreshold: 0, maxThreshold: 100 },

  // Contact (3)
  { fieldId: "contactEmail", label: "Business Email", type: "email", category: "contact", enabled: true, required: true, aiNote: "" },
  { fieldId: "contactPhone", label: "Business Phone", type: "tel", category: "contact", enabled: true, required: true, aiNote: "" },
  { fieldId: "contactName", label: "Primary Contact Name", type: "text", category: "contact", enabled: true, required: true, aiNote: "" },

  // Financial (6)
  { fieldId: "annualRevenue", label: "Annual Revenue (FY 2024)", type: "number", category: "financial", enabled: true, required: true, aiNote: "Most recent fiscal year", minThreshold: 50000, maxThreshold: 100000000 },
  { fieldId: "requestedAmount", label: "Requested Amount", type: "number", category: "financial", enabled: true, required: true, aiNote: "", minThreshold: 5000, maxThreshold: 5000000 },
  { fieldId: "equipmentCost", label: "Equipment Cost", type: "number", category: "financial", enabled: true, required: true, aiNote: "Total cost of equipment to be financed", minThreshold: 5000, maxThreshold: 5000000 },
  { fieldId: "downPayment", label: "Down Payment", type: "number", category: "financial", enabled: true, required: false, aiNote: "", minThreshold: 0, maxThreshold: 5000000 },
  { fieldId: "useOfFunds", label: "Use of Funds", type: "text", category: "financial", enabled: false, required: false, aiNote: "How the capital will be used — e.g. inventory, payroll, expansion" },
  { fieldId: "fiscalYearEnd", label: "Fiscal Year End", type: "text", category: "financial", enabled: true, required: false, aiNote: "e.g. December 2024" },

  // Address — grouped under identity for display
  { fieldId: "streetAddress", label: "Street Address", type: "text", category: "identity", enabled: true, required: true, aiNote: "" },
  { fieldId: "suite", label: "Suite / Unit", type: "text", category: "identity", enabled: true, required: false, aiNote: "" },
  { fieldId: "city", label: "City", type: "text", category: "identity", enabled: true, required: true, aiNote: "" },
  { fieldId: "state", label: "State", type: "select", category: "identity", enabled: true, required: true, aiNote: "" },
  { fieldId: "zipCode", label: "ZIP Code", type: "text", category: "identity", enabled: true, required: true, aiNote: "" },
  { fieldId: "country", label: "Country", type: "select", category: "identity", enabled: true, required: false, aiNote: "" },

  // Guarantor (4)
  { fieldId: "guarantorName", label: "Guarantor Full Name", type: "text", category: "guarantor", enabled: true, required: true, aiNote: "Legal name as it appears on ID" },
  { fieldId: "guarantorIdNumber", label: "Guarantor ID Number", type: "text", category: "guarantor", enabled: true, required: true, aiNote: "Driver license or passport number" },
  { fieldId: "guarantorSSN", label: "Guarantor SSN", type: "text", category: "guarantor", enabled: true, required: true, aiNote: "Collected securely, never displayed" },
  { fieldId: "guarantorDOB", label: "Guarantor Date of Birth", type: "date", category: "guarantor", enabled: true, required: true, aiNote: "" },
];

// ── Standard document library (14 documents) ──────────────────────────

const STANDARD_DOCUMENTS: DocumentConfig[] = [
  // Business Info (2)
  { documentType: "business_license", label: "Business License", category: "business_info", enabled: true, required: true, aiNote: "Must be current and valid" },
  { documentType: "articles_of_incorporation", label: "Articles of Incorporation", category: "business_info", enabled: true, required: false, aiNote: "Required for corporations and LLCs" },

  // Financial (5)
  { documentType: "tax_return_year1", label: "Business Tax Return (Most Recent)", category: "financial", enabled: true, required: true, aiNote: "Must be filed, not draft" },
  { documentType: "tax_return_year2", label: "Business Tax Return (Previous Year)", category: "financial", enabled: true, required: false, aiNote: "" },
  { documentType: "balance_sheet", label: "Balance Sheet", category: "financial", enabled: true, required: true, aiNote: "Dated within last 90 days" },
  { documentType: "profit_loss", label: "Profit & Loss Statement", category: "financial", enabled: true, required: true, aiNote: "Year-to-date" },
  { documentType: "bank_statement", label: "Bank Statements (6 months)", category: "financial", enabled: true, required: true, aiNote: "All business accounts, 6 consecutive months" },

  // Equipment (3)
  { documentType: "equipment_quote", label: "Equipment Quote / Invoice", category: "equipment", enabled: true, required: true, aiNote: "Itemized quote from dealer or manufacturer" },
  { documentType: "equipment_spec_sheet", label: "Equipment Tech Spec Sheet", category: "equipment", enabled: true, required: false, aiNote: "Manufacturer spec sheet for equipment being financed" },
  { documentType: "insurance_cert", label: "Insurance Certificate", category: "equipment", enabled: true, required: false, aiNote: "If equipment requires specialized insurance" },

  // Personal (3)
  { documentType: "personal_guarantee", label: "Personal Guarantee Form", category: "personal", enabled: true, required: true, aiNote: "Signed by all owners with 20%+ ownership" },
  { documentType: "personal_tax_return", label: "Personal Tax Return", category: "personal", enabled: true, required: false, aiNote: "Most recent year" },
  { documentType: "personal_id", label: "Government-Issued ID", category: "personal", enabled: true, required: true, aiNote: "Must not be expired" },

  // Security (1)
  { documentType: "ucc_filing", label: "UCC-1 Filing Authorization", category: "security", enabled: true, required: false, aiNote: "Required for secured transactions" },
];

// ── Helper to clone fields/docs per application type ───────────────────

function cloneFields(overrides?: Partial<Record<string, Partial<ApplicationFieldConfig>>>): ApplicationFieldConfig[] {
  return STANDARD_FIELDS.map((f) => {
    const o = overrides?.[f.fieldId];
    return { ...f, ...(o ?? {}) };
  });
}

function cloneDocs(overrides?: Partial<Record<string, Partial<DocumentConfig>>>): DocumentConfig[] {
  return STANDARD_DOCUMENTS.map((d) => {
    const o = overrides?.[d.documentType];
    return { ...d, ...(o ?? {}) };
  });
}

// ── Helper: get enabled documents for a given application type ─────────

export interface EnabledDocument {
  id: string;          // snake_case documentType, e.g. "business_license"
  name: string;        // label from config
  description: string; // aiNote from config
  required: boolean;
  category: string;
}

export function getEnabledDocuments(
  applicationTypeId: string = "equipment-financing",
  config?: PlatformConfiguration
): EnabledDocument[] {
  const cfg = config ?? DEFAULT_PLATFORM_CONFIG;
  const appType = cfg.applicationTypes.find((t) => t.id === applicationTypeId);
  const docs = appType?.documents ?? STANDARD_DOCUMENTS;
  return docs
    .filter((d) => d.enabled)
    .map((d) => ({
      id: d.documentType,
      name: d.label,
      description: d.aiNote,
      required: d.required,
      category: d.category,
    }));
}

/** Lightweight docs for new clients at application (pre-qual only): equipment quote, ID, business license */
const PRE_QUAL_DOC_IDS = ["equipment_quote", "personal_id", "business_license"] as const;

export function getPreQualDocuments(
  applicationTypeId: string = "equipment-financing",
  config?: PlatformConfiguration
): EnabledDocument[] {
  const all = getEnabledDocuments(applicationTypeId, config);
  return all.filter((d) => PRE_QUAL_DOC_IDS.includes(d.id as (typeof PRE_QUAL_DOC_IDS)[number]));
}

// ── Helper: get enabled fields for a given application type ─────────

export interface EnabledField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "select" | "date";
  category: string;
  required: boolean;
  aiNote: string;
  minThreshold?: number;
  maxThreshold?: number;
}

export function getEnabledFields(
  applicationTypeId: string = "equipment-financing",
  config?: PlatformConfiguration
): EnabledField[] {
  const cfg = config ?? DEFAULT_PLATFORM_CONFIG;
  const appType = cfg.applicationTypes.find((t) => t.id === applicationTypeId);
  const fields = appType?.fields ?? STANDARD_FIELDS;
  return fields
    .filter((f) => f.enabled)
    .map((f) => ({
      id: f.fieldId,
      label: f.label,
      type: f.type,
      category: f.category,
      required: f.required,
      aiNote: f.aiNote,
      minThreshold: f.minThreshold,
      maxThreshold: f.maxThreshold,
    }));
}

// ── Helper: get enabled application types ───────────────────────────────

export function getEnabledApplicationTypes(
  config?: PlatformConfiguration
): { id: string; name: string; description: string; icon: string }[] {
  const cfg = config ?? DEFAULT_PLATFORM_CONFIG;
  return cfg.applicationTypes
    .filter((t) => t.enabled)
    .map((t) => ({ id: t.id, name: t.name, description: t.description, icon: t.icon }));
}

// ── Default platform configuration ─────────────────────────────────────

export const DEFAULT_PLATFORM_CONFIG: PlatformConfiguration = {
  lastUpdated: new Date().toISOString(),

  profile: {
    companyDescription:
      "We are a mid-size commercial lender specializing in equipment financing for small and medium businesses across the United States. With over 15 years of experience, we help businesses acquire the equipment they need to grow, offering competitive rates and flexible terms.",
    minTimeInBusiness: 6,
    minTimeInBusinessUnit: 'months',
    industries: ["Healthcare", "Construction", "Technology", "Manufacturing", "Transportation"],
    customerTypes: ["Small Business", "Mid-Market", "Startup"],
    assetTypes: ["Medical Equipment", "Heavy Machinery", "IT / Technology", "Vehicles", "Restaurant Equipment"],
    geographicFocus: ["Nationwide"],
    lendingRangeMin: 25000,
    lendingRangeMax: 1000000,
  },

  branding: {
    logoUrl: "",
    primaryColor: "#1e40af",
    accentColor: "#3b82f6",
    welcomeMessage:
      "Welcome! I'm your AI lending assistant. I'll help you through the application process — just answer a few questions and I'll take care of the rest. Let's get started!",
    companyName: "Apex Capital Lending",
  },

  knowledgeBase: [
    { id: "kb-1", name: "Master Equipment Finance Agreement v3.2.pdf", category: "contract_templates", size: "2.4 MB", uploadedAt: "2025-11-15T10:30:00Z", status: "processed", aiNote: "Primary EFA template. Refer to Section 4 for early termination, Section 7 for insurance requirements.", applicableTypes: ["equipment-financing"] },
    { id: "kb-2", name: "Working Capital Loan Agreement.pdf", category: "contract_templates", size: "1.8 MB", uploadedAt: "2025-11-10T14:20:00Z", status: "processed", aiNote: "Standard WC agreement. Note: repayment terms differ from equipment contracts — see Section 3.", applicableTypes: ["working-capital"] },
    { id: "kb-3", name: "Equipment Lease Agreement - FMV.pdf", category: "contract_templates", size: "2.1 MB", uploadedAt: "2025-10-28T09:15:00Z", status: "processed", aiNote: "FMV lease template. Explain buyout options at end of term if applicant asks.", applicableTypes: ["equipment-leasing"] },
    { id: "kb-4", name: "2025 Rate Card - Equipment Finance.xlsx", category: "rate_sheets", size: "450 KB", uploadedAt: "2025-12-01T08:00:00Z", status: "processed", aiNote: "Current rates effective Jan 2025. Use these when quoting indicative rates to applicants.", applicableTypes: ["equipment-financing", "equipment-leasing"] },
    { id: "kb-5", name: "Working Capital Pricing Matrix.xlsx", category: "rate_sheets", size: "320 KB", uploadedAt: "2025-11-20T11:45:00Z", status: "processed", aiNote: "Tiered pricing based on credit score and time in business. Do not share exact margins.", applicableTypes: ["working-capital"] },
    { id: "kb-6", name: "General Terms & Conditions v2.1.pdf", category: "terms_conditions", size: "980 KB", uploadedAt: "2025-09-15T16:00:00Z", status: "processed", aiNote: "Applies to all product types. Summarize key points if applicant asks about T&Cs.", applicableTypes: [] },
    { id: "kb-7", name: "Late Payment & Default Policy.pdf", category: "terms_conditions", size: "540 KB", uploadedAt: "2025-09-15T16:05:00Z", status: "processed", aiNote: "Reference when applicants ask about penalties. Be transparent but reassuring.", applicableTypes: [] },
    { id: "kb-8", name: "Credit Underwriting Manual 2025.pdf", category: "underwriting", size: "5.2 MB", uploadedAt: "2025-10-01T13:00:00Z", status: "processed", aiNote: "Internal guidelines — do not share specifics with applicants. Use to flag applications that may need manual review.", applicableTypes: [] },
    { id: "kb-9", name: "Risk Assessment Criteria by Industry.pdf", category: "underwriting", size: "1.6 MB", uploadedAt: "2025-10-15T10:30:00Z", status: "processing", aiNote: "Industry-specific risk factors. Helps AI ask relevant follow-up questions based on applicant's industry.", applicableTypes: [] },
    { id: "kb-10", name: "Equipment Financing Product Guide.pdf", category: "product_guides", size: "3.1 MB", uploadedAt: "2025-11-05T14:00:00Z", status: "processed", aiNote: "Customer-facing product overview. Use to explain benefits, typical terms, and eligibility.", applicableTypes: ["equipment-financing"] },
    { id: "kb-11", name: "Leasing vs Financing - Customer FAQ.pdf", category: "product_guides", size: "890 KB", uploadedAt: "2025-11-05T14:10:00Z", status: "processed", aiNote: "Use when applicants are unsure whether to lease or finance. Explains pros/cons of each.", applicableTypes: ["equipment-financing", "equipment-leasing"] },
  ],

  applicationTypes: [
    {
      id: "equipment-financing",
      name: "Equipment Financing",
      description: "Traditional equipment loans with fixed terms and ownership at end of term",
      icon: "Truck",
      enabled: true,
      fields: cloneFields(),
      documents: cloneDocs(),
    },
    {
      id: "working-capital",
      name: "Working Capital",
      description: "Short-term funding for operational expenses, inventory, or growth",
      icon: "DollarSign",
      enabled: true,
      fields: cloneFields({
        equipmentCost: { enabled: false, required: false },
        downPayment: { enabled: false, required: false },
        useOfFunds: { enabled: true, required: true },
      }),
      documents: cloneDocs({
        equipment_quote: { enabled: false, required: false },
        equipment_spec_sheet: { enabled: false, required: false },
        insurance_cert: { enabled: false, required: false },
        ucc_filing: { enabled: false, required: false },
      }),
    },
    {
      id: "equipment-leasing",
      name: "Equipment Leasing",
      description: "Lease-to-own or fair market value leases for business equipment",
      icon: "FileText",
      enabled: true,
      fields: cloneFields(),
      documents: cloneDocs(),
    },
  ],
};
