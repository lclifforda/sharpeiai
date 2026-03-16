export const DOCUMENT_TYPES = {
  business_license: 'Business License',
  articles_of_incorporation: 'Articles of Incorporation',
  tax_return_year1: 'Tax Return (Year 1)',
  tax_return_year2: 'Tax Return (Year 2)',
  balance_sheet: 'Balance Sheet',
  profit_loss: 'Profit & Loss Statement',
  bank_statement: 'Bank Statement',
  equipment_quote: 'Equipment Quote',
  personal_guarantee: 'Personal Guarantee',
  personal_tax_return: 'Personal Tax Return',
  insurance_cert: 'Insurance Certificate',
  personal_id: 'Personal ID',
  ucc_filing: 'UCC Filing',
  equipment_spec_sheet: 'Equipment Spec Sheet',
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPES;
