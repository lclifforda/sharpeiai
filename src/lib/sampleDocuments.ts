/**
 * Maps document types to sample PDF files in /public/sample-documents/.
 * Used in the admin ApplicationDetail view to preview/download demo documents.
 */

import type { DocumentType } from "@/types/documents";

const SAMPLE_DOCS: Record<DocumentType, string> = {
  business_license: "/sample-documents/01_Business_License.pdf",
  articles_of_incorporation: "/sample-documents/02_Articles_of_Incorporation.pdf",
  tax_return_year1: "/sample-documents/03_Business_Tax_Return_2024_Form1120.pdf",
  tax_return_year2: "/sample-documents/04_Business_Tax_Return_2023_Form1120.pdf",
  balance_sheet: "/sample-documents/05_Balance_Sheet.pdf",
  profit_loss: "/sample-documents/06_Profit_and_Loss_Statement.pdf",
  bank_statement: "/sample-documents/07_Bank_Statements_Jul-Dec_2024.pdf",
  equipment_quote: "/sample-documents/08_Equipment_Quote_Invoice.pdf",
  equipment_spec_sheet: "/sample-documents/09_Equipment_Tech_Spec.pdf",
  insurance_cert: "/sample-documents/10_Certificate_of_Insurance.pdf",
  personal_guarantee: "/sample-documents/11_Personal_Guarantee.pdf",
  personal_tax_return: "/sample-documents/12_Personal_Tax_Return_Form1040.pdf",
  personal_id: "/sample-documents/13_Government_Issued_ID.pdf",
  ucc_filing: "/sample-documents/01_Business_License.pdf", // fallback — no dedicated sample
};

/** Get the static URL for a sample document by its type */
export function getSampleDocumentUrl(docType: string): string | null {
  return SAMPLE_DOCS[docType as DocumentType] ?? null;
}

/** Get URL by filename heuristic (for manually uploaded docs without a known type) */
export function getSampleDocumentByFilename(fileName: string): string | null {
  const fn = fileName.toLowerCase();
  if (fn.includes("license") || fn.includes("permit")) return SAMPLE_DOCS.business_license;
  if (fn.includes("incorporation") || fn.includes("articles")) return SAMPLE_DOCS.articles_of_incorporation;
  if (fn.includes("1120") || (fn.includes("tax") && fn.includes("2024"))) return SAMPLE_DOCS.tax_return_year1;
  if (fn.includes("1120") || (fn.includes("tax") && fn.includes("2023"))) return SAMPLE_DOCS.tax_return_year2;
  if (fn.includes("balance")) return SAMPLE_DOCS.balance_sheet;
  if (fn.includes("profit") || fn.includes("loss") || fn.includes("p&l")) return SAMPLE_DOCS.profit_loss;
  if (fn.includes("bank") || fn.includes("statement")) return SAMPLE_DOCS.bank_statement;
  if (fn.includes("quote") || fn.includes("invoice")) return SAMPLE_DOCS.equipment_quote;
  if (fn.includes("spec") || fn.includes("tech")) return SAMPLE_DOCS.equipment_spec_sheet;
  if (fn.includes("insurance") || fn.includes("certificate")) return SAMPLE_DOCS.insurance_cert;
  if (fn.includes("guarantee") || fn.includes("guarantor")) return SAMPLE_DOCS.personal_guarantee;
  if (fn.includes("1040") || (fn.includes("personal") && fn.includes("tax"))) return SAMPLE_DOCS.personal_tax_return;
  if (fn.includes("id") || fn.includes("driver") || fn.includes("passport")) return SAMPLE_DOCS.personal_id;
  return null;
}
