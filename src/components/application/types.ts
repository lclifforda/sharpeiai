import type { EnabledField } from "@/services/platformConfigMockData";
import type { EquipmentItem } from "@/components/EquipmentChat";
import type { QualificationResult } from "@/lib/qualificationCheck";

// ── Flow types ───────────────────────────────────────────────────────

export type FlowType = "vendor" | "bank";

export type SectionId =
  | "company_name"
  | "prequal"
  | "docs_lightweight"
  | "info"        // vendor combined: all fields + docs in one step
  | "identity"
  | "contact"
  | "financial"
  | "equipment"
  | "guarantor"
  | "documents"
  | "offers"      // vendor only
  | "contract"    // vendor only
  | "complete"    // vendor post-signature
  | "submitted"   // bank submission confirmation
  | "disqualified";

export interface FlowFeatures {
  /** Vendor keeps all fields + docs in a single step */
  splitSections: boolean;
  /** Bank uses OCR verification on document upload */
  enableOCR: boolean;
  /** Vendor generates offers after form submission */
  enableOffers: boolean;
  /** Vendor has contract signature step */
  enableContract: boolean;
  /** Bank uses equipment chat */
  enableEquipmentChat: boolean;
  /** Bank uses pre-qualification gate */
  enablePreQual: boolean;
  /** Bank uses lightweight doc step before full form */
  enableLightweightDocs: boolean;
  /** Vendor shows order summary sidebar */
  enableOrderSummary: boolean;
}

export interface FlowConfig {
  flowType: FlowType;
  features: FlowFeatures;
  embedded: boolean;
}

// ── Form state ───────────────────────────────────────────────────────

export interface AuthState {
  status: "none" | "recognized" | "verified";
  companyId?: string;
  repId?: string;
}

export interface DocumentVerificationState {
  status: "processing" | "verified" | "rejected";
  extractedData?: Record<string, any>;
  verificationNotes?: string[];
}

export interface FormState {
  formData: Record<string, string>;
  errors: Record<string, string>;
  uploadedDocs: Record<string, File | null>;
  documentVerification: Record<string, DocumentVerificationState>;
  uploadAttempts: Record<string, number>;
  draggedOver: string | null;
  authState: AuthState;
  applicationType: string;
  equipmentItems: EquipmentItem[];
  equipmentTotalValue: number;
  // Vendor-specific
  selectedOffer: any | null;
  generatedOffers: any[];
  isGeneratingOffers: boolean;
  offerTypeFilter: "financing" | "lease";
  revenue: number | null;
  // Bank-specific
  disqualification: QualificationResult | null;
  disqualifiedEmail: string;
  inlineWarning: string | null;
  qualificationPassed: boolean;
  isSubmitting: boolean;
}

// ── Section progression ──────────────────────────────────────────────

export interface SectionProgressionState {
  currentSection: SectionId;
  completedSections: Set<SectionId>;
  activeSections: SectionId[];
}

// ── Order details (vendor flow from Checkout) ──────────────────────

export interface OrderDetails {
  quantity: number;
  maintenance: boolean;
  insurance: boolean;
  term: string;
  downPayment: number;
  type: "lease" | "finance";
}

// ── Props shared by section components ───────────────────────────────

export interface SectionProps {
  flowConfig: FlowConfig;
  formData: Record<string, string>;
  errors: Record<string, string>;
  authState: AuthState;
  onFieldChange: (fieldId: string, value: string) => void;
  onContinue: () => void;
  enabledFields: EnabledField[];
  fieldsByCategory: Record<string, EnabledField[]>;
}
