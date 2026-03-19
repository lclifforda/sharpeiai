import { getEnabledFields, type EnabledField } from "@/services/platformConfigMockData";

// ── Section IDs ──────────────────────────────────────────────────────────

export type ChatSectionId =
  | "prequal"
  | "identity"
  | "contact"
  | "financial"
  | "equipment"
  | "guarantor";

// ── Section definition ───────────────────────────────────────────────────

export interface ChatSectionDef {
  id: ChatSectionId;
  title: string;
  intro: string;
  fieldIds: string[];
  qualificationGate?: boolean;
  condition?: (ctx: SectionContext) => boolean;
}

interface SectionContext {
  flowType: "vendor" | "bank";
  applicationType: string;
  formData: Record<string, string>;
  equipmentValue: number;
}

// ── Ordered section definitions ──────────────────────────────────────────

export const CHAT_SECTIONS: ChatSectionDef[] = [
  {
    id: "prequal",
    title: "Business Overview",
    intro: "Let's start with a few basics about your business to see what you qualify for.",
    fieldIds: ["entityType", "dateEstablished", "annualRevenue", "equipmentCost"],
    qualificationGate: true,
  },
  {
    id: "identity",
    title: "Business Details",
    intro: "Great! Now let's fill in the rest of your business information.",
    fieldIds: [
      "ein", "dba", "industry", "numberOfEmployees", "ownershipPercentage",
      "streetAddress", "suite", "city", "state", "zipCode", "country",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    intro: "Who should we contact about this application?",
    fieldIds: ["contactName", "contactEmail", "contactPhone"],
  },
  {
    id: "financial",
    title: "Financial Details",
    intro: "Almost there — a few financial details to finalize your profile.",
    fieldIds: ["requestedAmount", "downPayment", "useOfFunds", "fiscalYearEnd"],
    qualificationGate: true,
  },
  {
    id: "equipment",
    title: "Equipment Details",
    intro: "Tell us about the equipment you're looking to finance.",
    fieldIds: ["equipmentDescription", "equipmentValue"],
    condition: ({ flowType, applicationType }) =>
      flowType === "bank" && applicationType !== "working-capital",
  },
  {
    id: "guarantor",
    title: "Personal Guarantee",
    intro: "For financing over $50,000, we need a personal guarantee.",
    fieldIds: ["guarantorName", "guarantorIdNumber", "guarantorSSN", "guarantorDOB"],
    condition: ({ formData, equipmentValue }) => {
      const requested = parseFloat(formData.requestedAmount || "0");
      const equipCost = parseFloat(formData.equipmentCost || "0");
      return Math.max(requested, equipCost, equipmentValue) > 50000;
    },
  },
];

// ── Synthetic fields for equipment (not in platformConfigMockData) ────────

const SYNTHETIC_FIELDS: Record<string, EnabledField> = {
  equipmentDescription: {
    id: "equipmentDescription",
    label: "Equipment Description",
    type: "text",
    category: "equipment",
    required: true,
    aiNote: "Include make, model, and quantity if applicable",
  },
  equipmentValue: {
    id: "equipmentValue",
    label: "Estimated Equipment Value",
    type: "number",
    category: "equipment",
    required: true,
    aiNote: "Total value of all equipment",
    minThreshold: 1000,
    maxThreshold: 10000000,
  },
};

// ── Resolve sections for a given flow ────────────────────────────────────

export interface ResolvedSection {
  section: ChatSectionDef;
  fields: EnabledField[];
}

export function getSectionsForFlow(
  flowType: "vendor" | "bank",
  applicationType: string,
  formData: Record<string, string>,
  equipmentValue: number
): ResolvedSection[] {
  const enabledFields = getEnabledFields(applicationType);
  const enabledFieldMap = new Map(enabledFields.map((f) => [f.id, f]));

  const ctx: SectionContext = { flowType, applicationType, formData, equipmentValue };

  // Determine if equipment section will exist (for financial field filtering)
  const hasEquipmentSection = CHAT_SECTIONS.some(
    (s) => s.id === "equipment" && (!s.condition || s.condition(ctx))
  );

  const resolved: ResolvedSection[] = [];

  for (const section of CHAT_SECTIONS) {
    // Check conditional visibility
    if (section.condition && !section.condition(ctx)) continue;

    // Resolve fields: match fieldIds against enabled fields, use synthetic for unknowns
    let fields: EnabledField[] = [];
    for (const fieldId of section.fieldIds) {
      const configured = enabledFieldMap.get(fieldId);
      if (configured) {
        fields.push(configured);
      } else if (SYNTHETIC_FIELDS[fieldId]) {
        fields.push(SYNTHETIC_FIELDS[fieldId]);
      }
      // If not enabled and not synthetic, skip it (e.g. equipmentCost disabled for working-capital)
    }

    // Identity: filter out companyName (already collected in company_name chat phase)
    if (section.id === "identity") {
      fields = fields.filter((f) => f.id !== "companyName");
    }

    // Financial: hide equipmentCost + downPayment when equipment section exists
    if (section.id === "financial" && hasEquipmentSection) {
      fields = fields.filter((f) => f.id !== "equipmentCost" && f.id !== "downPayment");
    }

    // Skip section entirely if no fields remain
    if (fields.length === 0) continue;

    resolved.push({ section, fields });
  }

  return resolved;
}

// ── Check if a section is fully filled ───────────────────────────────────

export function isSectionComplete(
  fields: EnabledField[],
  formData: Record<string, string>
): boolean {
  return fields
    .filter((f) => f.required)
    .every((f) => {
      const val = formData[f.id];
      return val !== undefined && val !== null && String(val).trim().length > 0;
    });
}
