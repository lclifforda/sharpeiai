/**
 * Mock data for the Email-to-Application automation feature.
 * Simulates email ingestion, AI extraction, document classification, and status tracking.
 */

export type EmailStatus = 'new' | 'processing' | 'converted' | 'failed';
export type ApplicationInboxStatus = 'received' | 'pending_documents' | 'ready_for_underwriting';
export type DocClassification = 'financials' | 'id' | 'invoice' | 'company_docs' | 'other';
export type DocValidation = 'valid' | 'invalid' | 'missing';
export type CommunicationStatus = 'draft' | 'sent' | 'opened' | 'uploaded';

export interface EmailAttachment {
  id: string;
  fileName: string;
  fileSize: number; // bytes
  mimeType: string;
  classification?: DocClassification;
  validationStatus?: DocValidation;
  validationNotes?: string[];
}

export interface InboxEmail {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
  receivedAt: Date;
  status: EmailStatus;
  attachments: EmailAttachment[];
  extractedData?: ExtractedFields;
  applicationId?: string;
}

export interface ExtractedFields {
  company_name: { value: string; confidence: number };
  tax_id: { value: string; confidence: number };
  contact_name: { value: string; confidence: number };
  email: { value: string; confidence: number };
  phone: { value: string; confidence: number };
  asset_type: { value: string; confidence: number };
  asset_value: { value: string; confidence: number };
  term_months: { value: string; confidence: number };
}

export interface InboxApplication {
  id: string;
  emailId: string;
  status: ApplicationInboxStatus;
  extractedFields: ExtractedFields;
  documents: ApplicationDocument[];
  timeline: TimelineEvent[];
  requiredDocuments: RequiredDoc[];
  communications: Communication[];
  customerType: 'sme' | 'corporate';
  amount: number;
}

export interface ApplicationDocument {
  id: string;
  fileName: string;
  classification: DocClassification;
  validationStatus: DocValidation;
  validationNotes: string[];
  uploadedAt: Date;
  source: 'email' | 'upload_portal';
}

export interface TimelineEvent {
  id: string;
  type: 'email_received' | 'application_created' | 'docs_received' | 'docs_requested' | 'docs_completed' | 'status_change';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RequiredDoc {
  id: string;
  name: string;
  classification: DocClassification;
  status: DocValidation;
  fileName?: string;
}

export interface Communication {
  id: string;
  type: 'missing_docs_request';
  status: CommunicationStatus;
  subject: string;
  body: string;
  sentAt?: Date;
  openedAt?: Date;
  uploadedAt?: Date;
  missingDocs: string[];
}

// ─── DEMO EMAILS ───

export const DEMO_EMAILS: InboxEmail[] = [
  {
    id: 'email-001',
    from: 'juan@constructoraxyz.com',
    fromName: 'Juan Perez',
    subject: 'Leasing request – Excavator',
    body: `Dear Sir/Madam,

We are interested in leasing an excavator for our construction company.

Company: Constructora XYZ S.L.
Tax ID: B-12345678
Asset: Caterpillar 320 Excavator
Value: €95,000
Term: 48 months

Please find attached our financial statements and company documentation.

Best regards,
Juan Perez
CEO, Constructora XYZ
Phone: +34 612 345 678
Email: juan@constructoraxyz.com`,
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'converted',
    attachments: [
      {
        id: 'att-001',
        fileName: 'Constructora_XYZ_Financial_Statement_2024.pdf',
        fileSize: 2_400_000,
        mimeType: 'application/pdf',
        classification: 'financials',
        validationStatus: 'valid',
      },
      {
        id: 'att-002',
        fileName: 'CIF_Constructora_XYZ.pdf',
        fileSize: 450_000,
        mimeType: 'application/pdf',
        classification: 'company_docs',
        validationStatus: 'valid',
      },
      {
        id: 'att-003',
        fileName: 'Caterpillar_320_Quote.pdf',
        fileSize: 1_200_000,
        mimeType: 'application/pdf',
        classification: 'invoice',
        validationStatus: 'valid',
      },
    ],
    extractedData: {
      company_name: { value: 'Constructora XYZ S.L.', confidence: 97 },
      tax_id: { value: 'B-12345678', confidence: 95 },
      contact_name: { value: 'Juan Perez', confidence: 98 },
      email: { value: 'juan@constructoraxyz.com', confidence: 99 },
      phone: { value: '+34 612 345 678', confidence: 92 },
      asset_type: { value: 'Caterpillar 320 Excavator', confidence: 96 },
      asset_value: { value: '€95,000', confidence: 94 },
      term_months: { value: '48', confidence: 98 },
    },
    applicationId: 'app-inbox-001',
  },
  {
    id: 'email-002',
    from: 'maria@logisticaexpress.com',
    fromName: 'Maria Garcia',
    subject: 'Fleet financing request – 5 delivery vans',
    body: `Hello,

We would like to finance 5 delivery vans for our logistics operations.

Company: Logística Express S.A.
Tax ID: A-87654321
Asset: 5x Mercedes Sprinter 316 CDI
Total Value: €175,000
Term: 60 months

I'm attaching our latest financial report.

Kind regards,
Maria Garcia
CFO, Logística Express`,
    receivedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    status: 'processing',
    attachments: [
      {
        id: 'att-004',
        fileName: 'Logistica_Express_Annual_Report_2024.pdf',
        fileSize: 3_100_000,
        mimeType: 'application/pdf',
        classification: 'financials',
        validationStatus: 'valid',
      },
    ],
    extractedData: {
      company_name: { value: 'Logística Express S.A.', confidence: 96 },
      tax_id: { value: 'A-87654321', confidence: 93 },
      contact_name: { value: 'Maria Garcia', confidence: 97 },
      email: { value: 'maria@logisticaexpress.com', confidence: 99 },
      phone: { value: '', confidence: 0 },
      asset_type: { value: '5x Mercedes Sprinter 316 CDI', confidence: 91 },
      asset_value: { value: '€175,000', confidence: 88 },
      term_months: { value: '60', confidence: 95 },
    },
  },
  {
    id: 'email-003',
    from: 'carlos@techsolutions.es',
    fromName: 'Carlos Rodriguez',
    subject: 'IT Equipment Lease Inquiry',
    body: `Good morning,

We're looking to lease IT equipment for our new office expansion.

Company: Tech Solutions Europa S.L.
Equipment: 50x Dell Latitude laptops + 10x Dell servers
Estimated value: €120,000
Preferred term: 36 months

Please let me know what documentation you need.

Thanks,
Carlos Rodriguez
IT Director`,
    receivedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
    status: 'new',
    attachments: [],
  },
];

// ─── DEMO APPLICATION (created from email-001) ───

export const DEMO_INBOX_APPLICATION: InboxApplication = {
  id: 'app-inbox-001',
  emailId: 'email-001',
  status: 'pending_documents',
  customerType: 'sme',
  amount: 95000,
  extractedFields: DEMO_EMAILS[0].extractedData!,
  documents: [
    {
      id: 'doc-001',
      fileName: 'Constructora_XYZ_Financial_Statement_2024.pdf',
      classification: 'financials',
      validationStatus: 'valid',
      validationNotes: ['✓ Financial statements verified', 'Revenue: €2.4M (2024)', 'Net income positive'],
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      source: 'email',
    },
    {
      id: 'doc-002',
      fileName: 'CIF_Constructora_XYZ.pdf',
      classification: 'company_docs',
      validationStatus: 'valid',
      validationNotes: ['✓ Company registration confirmed', 'Entity matches: Constructora XYZ S.L.'],
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      source: 'email',
    },
    {
      id: 'doc-003',
      fileName: 'Caterpillar_320_Quote.pdf',
      classification: 'invoice',
      validationStatus: 'valid',
      validationNotes: ['✓ Equipment quote verified', 'Amount matches: €95,000', 'Vendor: Caterpillar dealer'],
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      source: 'email',
    },
  ],
  timeline: [
    {
      id: 'evt-001',
      type: 'email_received',
      description: 'Email received from juan@constructoraxyz.com',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'evt-002',
      type: 'application_created',
      description: 'Application auto-created from email with 3 attachments',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30_000),
    },
    {
      id: 'evt-003',
      type: 'docs_received',
      description: '3 documents classified and validated',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60_000),
    },
    {
      id: 'evt-004',
      type: 'docs_requested',
      description: 'Missing documents email sent to customer',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      metadata: { missingDocs: ['Personal ID', 'Bank Statements'] },
    },
  ],
  requiredDocuments: [
    { id: 'req-001', name: 'Financial Statements', classification: 'financials', status: 'valid', fileName: 'Constructora_XYZ_Financial_Statement_2024.pdf' },
    { id: 'req-002', name: 'Company Registration / CIF', classification: 'company_docs', status: 'valid', fileName: 'CIF_Constructora_XYZ.pdf' },
    { id: 'req-003', name: 'Equipment Quote / Invoice', classification: 'invoice', status: 'valid', fileName: 'Caterpillar_320_Quote.pdf' },
    { id: 'req-004', name: 'Personal ID (Guarantor)', classification: 'id', status: 'missing' },
    { id: 'req-005', name: 'Bank Statements (6 months)', classification: 'financials', status: 'missing' },
  ],
  communications: [
    {
      id: 'comm-001',
      type: 'missing_docs_request',
      status: 'sent',
      subject: 'Action Required: Missing documents for your leasing application',
      body: `Dear Juan,

Thank you for your leasing application for the Caterpillar 320 Excavator.

To continue processing your application, we still need the following documents:

1. **Personal ID** (passport or government-issued ID of the guarantor)
2. **Bank Statements** (last 6 months)

You can upload these documents securely using the link below:

[Upload Documents](https://upload.example.com/app-inbox-001)

If you have any questions, please don't hesitate to reach out.

Best regards,
Sharpei Leasing Team`,
      sentAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      openedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      missingDocs: ['Personal ID (Guarantor)', 'Bank Statements (6 months)'],
    },
  ],
};

// ─── DOCUMENT REQUIREMENTS BY RULES ───

export function getRequiredDocuments(customerType: 'sme' | 'corporate', amount: number): { name: string; classification: DocClassification }[] {
  const base = [
    { name: 'Financial Statements', classification: 'financials' as DocClassification },
    { name: 'Company Registration', classification: 'company_docs' as DocClassification },
    { name: 'Equipment Quote / Invoice', classification: 'invoice' as DocClassification },
    { name: 'Personal ID (Guarantor)', classification: 'id' as DocClassification },
  ];

  if (amount > 50000) {
    base.push({ name: 'Bank Statements (6 months)', classification: 'financials' as DocClassification });
  }

  if (customerType === 'corporate' || amount > 100000) {
    base.push({ name: 'Articles of Incorporation', classification: 'company_docs' as DocClassification });
    base.push({ name: 'Board Resolution', classification: 'company_docs' as DocClassification });
  }

  if (amount > 200000) {
    base.push({ name: 'Audited Accounts', classification: 'financials' as DocClassification });
  }

  return base;
}

// ─── EMAIL TEMPLATE GENERATOR ───

export function generateMissingDocsEmail(
  contactName: string,
  companyName: string,
  assetDescription: string,
  missingDocs: string[],
  uploadLink: string
): { subject: string; body: string } {
  const docList = missingDocs.map((d, i) => `${i + 1}. **${d}**`).join('\n');

  return {
    subject: `Action Required: Missing documents for your leasing application`,
    body: `Dear ${contactName},

Thank you for your leasing application for the ${assetDescription}.

To continue processing your application, we still need the following documents:

${docList}

You can upload these documents securely using the link below:

[Upload Documents](${uploadLink})

If you have any questions, please don't hesitate to reach out.

Best regards,
Sharpei Leasing Team`,
  };
}
