import type { EnabledField } from "@/services/platformConfigMockData";
import type { ChatSectionId } from "./chatSectionConfig";

export interface FormSectionData {
  sectionId: ChatSectionId;
  title: string;
  fields: EnabledField[];
  initialValues: Record<string, string>;
  isSubmitted: boolean;
  submittedValues?: Record<string, string>;
  stepLabel?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system' | 'offer' | 'contract' | 'comparison' | 'completion' | 'document_upload' | 'form_section' | 'submitted' | 'disqualified';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
  formSectionData?: FormSectionData;
  offerData?: {
    id: string;
    type: 'financing' | 'lease';
    lender: string;
    apr: number;
    termMonths: number;
    downPayment: number;
    monthlyPayment: number;
    totalAmount: number;
    residuals?: { name: string; percentage: number; value: number }[];
  };
  contractData?: {
    lender: string;
    customerName: string;
    customerEmail: string;
    totalFinanced: number;
    downPayment: number;
    apr: number;
    termMonths: number;
    monthlyPayment: number;
    docusignLink: string;
    offerType?: 'financing' | 'lease';
  };
  comparisonData?: {
    financing: {
      lender: string;
      apr: number;
      monthlyPayment: number;
      downPayment: number;
      totalCost: number;
    };
    lease: {
      lender: string;
      monthlyPayment: number;
      downPayment: number;
      totalCost: number;
    };
    difference: string;
    term: number;
  };
}

export type PromptKind = 'idle' | 'ask_customer_type' | 'ask_company_name' | 'ask_company_auth' | 'ask_rep_selection' | 'ask_otp' | 'ask_nif' | 'ask_business_type' | 'ask_state_incorporation' | 'ask_years_in_business' | 'ask_ownership_pct' | 'ask_representative' | 'ask_revenue_tranche' | 'ask_revenue_precise' | 'ask_guarantor_ssn' | 'ask_guarantor_income' | 'ask_guarantor_networth' | 'ask_guarantor_address' | 'ask_guarantor_license' | 'ask_ssn' | 'ask_income_tranche' | 'ask_income_precise' | 'ask_rent' | 'ask_employment' | 'choose_offer_type' | 'ask_tradein' | 'ask_tradein_details' | 'confirm_tradein_apply' | 'ask_tradein_value' | 'ready_for_docs' | 'ask_lease_or_finance' | 'ask_term_length' | 'contract_signature' | 'document_upload' | 'done';

export type ChatPhase =
  | 'greeting'
  | 'financing_type'  // bank: conversational financing type selection
  | 'company_name'
  | 'company_auth'    // sub-phases: recognized, rep_select, otp
  | 'section_form'    // inline form card for current section
  | 'document_upload'
  | 'offers'          // merchant: offer type, term selection, offer display
  | 'contract'        // merchant: contract signature
  | 'complete'        // merchant: done
  | 'submitted'       // bank: done
  | 'disqualified';

export type ApplicationStep = 'info' | 'documents' | 'offers' | 'contract' | 'complete';

export interface DocumentVerificationResult {
  status: 'pending' | 'processing' | 'verified' | 'rejected';
  extractedData?: Record<string, any>;
  verificationNotes?: string[];
}

export const monthlyRate = 800;
export const maintenanceCost = 150;
export const insuranceCost = 200;

export const computeMonthly = (principal: number, apr: number, months: number) => {
  if (!apr || apr <= 0) return Math.ceil(principal / months);
  const r = apr / 100 / 12;
  const n = months;
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
};

export const estimateTradeIn = (details: string): number | null => {
  const d = details.toLowerCase();
  if (d.includes('macbook air') && d.includes('2018')) return 250;
  if (d.includes('macbook') && d.match(/20(1[5-9]|2[0-1])/)) return 220;
  if (d.includes('iphone')) return 150;
  if (d.includes('ebike') || d.includes('e-bike')) return 300;
  if (d.includes('bike')) return 100;
  const num = parseInt(details.replace(/[^0-9]/g, ''), 10);
  if (!isNaN(num) && num > 0 && num < 2000) return Math.max(50, Math.min(400, Math.round(num / 2)));
  return null;
};
