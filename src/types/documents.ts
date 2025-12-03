// Document types and requirements for commercial equipment lending
// Matches the document collection process in checkout

export type DocumentType =
  | 'business_license'
  | 'articles_of_incorporation'
  | 'tax_return_year1'
  | 'tax_return_year2'
  | 'balance_sheet'
  | 'profit_loss'
  | 'bank_statement'
  | 'equipment_quote'
  | 'personal_guarantee'
  | 'personal_tax_return'
  | 'insurance_cert'
  | 'personal_id'
  | 'ucc_filing';

export type ProductType = 'lease' | 'financing';

export interface DocumentRequirement {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
  requiredFor: ProductType[];
  category: 'business_info' | 'financial' | 'equipment' | 'personal' | 'security';
}

export interface UploadedDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  uploadDate: Date;
  status: 'pending' | 'processing' | 'verified' | 'rejected';
  extractedData?: Record<string, any>;
  verificationNotes?: string[];
}

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  business_license: 'Business License',
  articles_of_incorporation: 'Articles of Incorporation',
  tax_return_year1: 'Business Tax Return (Most Recent)',
  tax_return_year2: 'Business Tax Return (Previous Year)',
  balance_sheet: 'Balance Sheet',
  profit_loss: 'Profit & Loss Statement',
  bank_statement: 'Bank Statements (6 months)',
  equipment_quote: 'Equipment Quote/Invoice',
  personal_guarantee: 'Personal Guarantee Form',
  personal_tax_return: 'Personal Tax Return',
  insurance_cert: 'Insurance Certificate',
  personal_id: 'Government-Issued ID',
  ucc_filing: 'UCC-1 Filing Authorization',
};

export const DOCUMENT_CATEGORIES: Record<string, string> = {
  business_info: 'Business Information',
  financial: 'Financial Documentation',
  equipment: 'Equipment Details',
  personal: 'Personal Guarantor',
  security: 'Collateral & Security',
};
