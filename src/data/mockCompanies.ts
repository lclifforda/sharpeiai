export interface Representative {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
}

export interface Application {
  id: string;
  type: string;
  equipment: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'unqualified' | 'incomplete' | 'completed' | 'declined' | 'funded';
  amount: number;
}

export interface Contract {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
  value: number;
}

export interface CompanyDocument {
  id: string;
  type: string;
  label: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'verified' | 'pending' | 'rejected';
  source: string; // which application it came from
  ocrConfidence?: number;
  extractedData?: Record<string, string>;
  verificationNotes?: string[];
}

export interface BusinessInfo {
  dba?: string;
  ein: string;
  entityType: string;
  dateEstablished: string;
  industryCode: string;
  numberOfEmployees: number;
  ownershipPercentage: number;
  annualRevenue: number;
  fiscalYearEnd: string;
  streetAddress: string;
  suite?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface GuarantorInfo {
  name: string;
  idNumber: string;
  dob: string;
}

export interface AIHighlight {
  label: string;
  value: string;
  positive: boolean;
}

export interface AIAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  highlights: AIHighlight[];
  lastUpdated: string;
}

export interface CompanyDetail {
  name: string;
  industry: string;
  location: string;
  address: string;
  founded: string;
  status: string;
  businessInfo: BusinessInfo;
  guarantor: GuarantorInfo;
  aiAssessment: AIAssessment;
  kpis: {
    totalRevenue: number;
    activeApplications: number;
    totalEquipment: number;
    paymentStatus: string;
    customerSince: string;
    totalFunded: number;
  };
  representatives: Representative[];
  applications: Application[];
  contracts: Contract[];
  documents: CompanyDocument[];
}

export const COMPANY_DETAILS: Record<string, CompanyDetail> = {
  '1': {
    name: 'TechCorp Industries',
    industry: 'Manufacturing',
    location: 'San Francisco, CA',
    address: '1234 Innovation Drive, San Francisco, CA 94105',
    founded: '2018',
    status: 'active',
    businessInfo: {
      dba: 'TechCorp',
      ein: '12-3456789',
      entityType: 'Corporation',
      dateEstablished: '2018-06-15',
      industryCode: 'Technology / SIC 7372',
      numberOfEmployees: 85,
      ownershipPercentage: 100,
      annualRevenue: 2500000,
      fiscalYearEnd: 'December 2024',
      streetAddress: '1234 Innovation Drive',
      suite: 'Suite 400',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94105',
      country: 'United States',
    },
    guarantor: {
      name: 'John A. Martinez',
      idNumber: 'D7842951',
      dob: '1985-03-22',
    },
    aiAssessment: {
      riskLevel: 'low',
      summary: 'TechCorp Industries is a strong borrower with 7+ years in business, $2.5M annual revenue, and a clean payment history across 3 applications. All 8 documents verified via OCR with no discrepancies. Revenue-to-debt ratio is healthy at 50:1. The guarantor has been consistent across applications with verified ID. Recommend continued lending relationship with potential for increased limits.',
      highlights: [
        { label: 'Time in Business', value: '7+ years', positive: true },
        { label: 'Revenue-to-Debt', value: '50:1', positive: true },
        { label: 'Payment History', value: 'Always on time', positive: true },
        { label: 'Document Verification', value: '8/8 verified', positive: true },
        { label: 'Applications', value: '3 (2 funded, 1 unqualified)', positive: true },
        { label: 'Ownership Clarity', value: '100% single owner', positive: true },
      ],
      lastUpdated: '2025-02-20T14:30:00Z',
    },
    kpis: {
      totalRevenue: 67500,
      activeApplications: 2,
      totalEquipment: 35,
      paymentStatus: 'current',
      customerSince: '2023-01-15',
      totalFunded: 50500,
    },
    representatives: [
      {
        id: '1',
        name: 'John Martinez',
        email: 'john.martinez@techcorp.com',
        phone: '(415) 555-0123',
        role: 'Operations Manager',
        joinDate: '2021-03-15',
      },
      {
        id: '2',
        name: 'Sarah Chen',
        email: 'sarah.chen@techcorp.com',
        phone: '(415) 555-0124',
        role: 'Technical Lead',
        joinDate: '2022-01-10',
      },
    ],
    applications: [
      {
        id: 'APP-001',
        type: 'Equipment Financing',
        equipment: 'IoT Sensor Kit (Model S-400)',
        quantity: 15,
        startDate: '2025-01-15',
        endDate: '2025-07-15',
        status: 'funded',
        amount: 22500,
      },
      {
        id: 'APP-008',
        type: 'Equipment Financing',
        equipment: 'Edge Computing Device (EC-Pro)',
        quantity: 12,
        startDate: '2025-02-01',
        endDate: '2025-08-01',
        status: 'completed',
        amount: 28000,
      },
      {
        id: 'APP-015',
        type: 'Equipment Leasing',
        equipment: 'Industrial Camera System',
        quantity: 8,
        startDate: '2024-11-01',
        endDate: '2025-05-01',
        status: 'unqualified',
        amount: 17000,
      },
    ],
    contracts: [],
    documents: [
      {
        id: 'cd-1', type: 'business_license', label: 'Business License', fileName: 'TechCorp_Business_License.pdf', fileSize: '1.2 MB',
        uploadDate: '2025-01-08', status: 'verified', source: 'APP-001', ocrConfidence: 95,
        extractedData: { 'License Number': 'BL-CA-789456', 'State': 'California', 'Business Name': 'TechCorp Industries', 'Issue Date': '01/15/2023', 'Expiry Date': '12/31/2026', 'Status': 'Active' },
        verificationNotes: ['Business name matches application', 'License is current and valid', 'State matches registered address'],
      },
      {
        id: 'cd-2', type: 'articles_of_incorporation', label: 'Articles of Incorporation', fileName: 'Articles_of_Incorporation_2020.pdf', fileSize: '2.4 MB',
        uploadDate: '2025-01-08', status: 'verified', source: 'APP-001', ocrConfidence: 92,
        extractedData: { 'Company Name': 'TechCorp Industries Inc.', 'Incorporation Date': '06/15/2018', 'Entity Type': 'Corporation', 'State': 'Delaware', 'Registered Agent': 'CT Corporation System', 'File Number': 'FC-7284913' },
        verificationNotes: ['Entity type matches application (Corporation)', 'Incorporation date consistent with Date Established'],
      },
      {
        id: 'cd-3', type: 'tax_return_year1', label: 'Business Tax Return (2024)', fileName: 'TechCorp_2024_Tax_Return.pdf', fileSize: '4.8 MB',
        uploadDate: '2025-01-08', status: 'verified', source: 'APP-001', ocrConfidence: 89,
        extractedData: { 'Form': '1120', 'Tax Year': '2024', 'Business Name': 'TechCorp Industries', 'EIN': '12-3456789', 'Gross Revenue': '$2,500,000', 'Net Income': '$450,000', 'Total Deductions': '$825,000' },
        verificationNotes: ['EIN matches application', 'Revenue consistent with reported annual revenue ($2.5M)', 'Filed return, not draft'],
      },
      {
        id: 'cd-4', type: 'bank_statement', label: 'Bank Statements (6 mo)', fileName: 'TechCorp_Bank_Statements_Jul-Dec2024.pdf', fileSize: '3.1 MB',
        uploadDate: '2025-01-09', status: 'verified', source: 'APP-001', ocrConfidence: 91,
        extractedData: { 'Bank': 'Chase Business', 'Account Type': 'Business Checking', 'Period': 'Jul–Dec 2024', 'Avg Monthly Balance': '$340,000', 'Total Deposits': '$1,480,000', 'NSF Events': '0' },
        verificationNotes: ['No NSF/overdraft events detected', '6 consecutive months provided', 'Average balance supports loan amount'],
      },
      {
        id: 'cd-5', type: 'equipment_quote', label: 'Equipment Quote / Invoice', fileName: 'IoT_Sensor_Kit_Quote.pdf', fileSize: '890 KB',
        uploadDate: '2025-01-08', status: 'verified', source: 'APP-001', ocrConfidence: 97,
        extractedData: { 'Vendor': 'SensorTech Inc.', 'Quote Number': 'Q-ST-2025-0142', 'Date': '01/05/2025', 'Total Amount': '$22,500', 'Items': '15x IoT Sensor Kit S-400', 'Valid Until': '03/05/2025' },
        verificationNotes: ['Total matches requested equipment cost ($22,500)', 'Quote is current and valid'],
      },
      {
        id: 'cd-6', type: 'personal_id', label: 'Government-Issued ID', fileName: 'JMartinez_DriversLicense.jpg', fileSize: '420 KB',
        uploadDate: '2025-01-08', status: 'verified', source: 'APP-001', ocrConfidence: 94,
        extractedData: { 'Document Type': 'Driver License', 'Full Name': 'John A. Martinez', 'State': 'California', 'ID Number': 'D7842951', 'Date of Birth': '03/22/1985', 'Expiry': '03/22/2027' },
        verificationNotes: ['Name matches guarantor on application', 'ID is not expired', 'State matches business address'],
      },
      {
        id: 'cd-7', type: 'balance_sheet', label: 'Balance Sheet', fileName: 'TechCorp_BalanceSheet_2024.pdf', fileSize: '1.6 MB',
        uploadDate: '2025-01-10', status: 'verified', source: 'APP-008', ocrConfidence: 90,
        extractedData: { 'Period': 'Year Ending Dec 2024', 'Total Assets': '$1,850,000', 'Total Liabilities': '$620,000', 'Owners Equity': '$1,230,000', 'Current Ratio': '2.15' },
        verificationNotes: ['Current ratio above 1.5 — healthy', 'Dated within last 90 days'],
      },
      {
        id: 'cd-8', type: 'profit_loss', label: 'Profit & Loss Statement', fileName: 'TechCorp_PnL_2024.pdf', fileSize: '1.4 MB',
        uploadDate: '2025-01-10', status: 'verified', source: 'APP-008', ocrConfidence: 93,
        extractedData: { 'Period': 'Jan–Dec 2024', 'Revenue': '$2,480,000', 'Cost of Goods': '$1,116,000', 'Operating Expenses': '$744,000', 'Net Profit': '$446,400', 'Profit Margin': '18.0%' },
        verificationNotes: ['Revenue consistent with tax return and reported annual revenue', 'Healthy profit margin (18%)'],
      },
    ],
  },
  '2': {
    name: 'DataFlow Systems',
    industry: 'Logistics',
    location: 'Austin, TX',
    address: '5678 Tech Boulevard, Austin, TX 78701',
    founded: '2019',
    status: 'active',
    businessInfo: {
      ein: '74-9876543',
      entityType: 'LLC',
      dateEstablished: '2019-09-10',
      industryCode: 'Logistics / SIC 4731',
      numberOfEmployees: 42,
      ownershipPercentage: 80,
      annualRevenue: 1800000,
      fiscalYearEnd: 'December 2024',
      streetAddress: '5678 Tech Boulevard',
      city: 'Austin',
      state: 'Texas',
      zipCode: '78701',
      country: 'United States',
    },
    guarantor: {
      name: 'Michael R. Johnson',
      idNumber: 'D5219834',
      dob: '1980-11-05',
    },
    aiAssessment: {
      riskLevel: 'medium',
      summary: 'DataFlow Systems is a 5-year-old LLC in the logistics sector with $1.8M revenue and 80% single-owner structure. One funded application performing well, one currently in review. Payment status is pending on the latest invoice. The 20% unaccounted ownership should be clarified. Overall a solid mid-tier borrower — recommend proceeding with standard terms.',
      highlights: [
        { label: 'Time in Business', value: '5 years', positive: true },
        { label: 'Revenue', value: '$1.8M', positive: true },
        { label: 'Payment Status', value: 'Pending', positive: false },
        { label: 'Ownership Clarity', value: '80% — verify remaining', positive: false },
        { label: 'Document Verification', value: '5/5 verified', positive: true },
        { label: 'Applications', value: '2 (1 funded, 1 in review)', positive: true },
      ],
      lastUpdated: '2025-02-18T10:15:00Z',
    },
    kpis: {
      totalRevenue: 44500,
      activeApplications: 2,
      totalEquipment: 18,
      paymentStatus: 'pending',
      customerSince: '2023-06-20',
      totalFunded: 25000,
    },
    representatives: [
      {
        id: '3',
        name: 'Michael Johnson',
        email: 'mjohnson@dataflow.com',
        phone: '(512) 555-0198',
        role: 'Logistics Director',
        joinDate: '2020-06-20',
      },
    ],
    applications: [
      {
        id: 'APP-002',
        type: 'Equipment Financing',
        equipment: 'Edge Computing Device (EC-Pro)',
        quantity: 8,
        startDate: '2025-02-01',
        endDate: '2025-08-01',
        status: 'funded',
        amount: 16000,
      },
      {
        id: 'APP-009',
        type: 'Equipment Leasing',
        equipment: 'GPS Tracking Module',
        quantity: 10,
        startDate: '2025-01-15',
        endDate: '2025-07-15',
        status: 'incomplete',
        amount: 9000,
      },
    ],
    contracts: [],
    documents: [
      {
        id: 'cd-10', type: 'business_license', label: 'Business License', fileName: 'DataFlow_Business_License.pdf', fileSize: '980 KB',
        uploadDate: '2024-12-15', status: 'verified', source: 'APP-002', ocrConfidence: 93,
        extractedData: { 'License Number': 'BL-TX-452310', 'State': 'Texas', 'Business Name': 'DataFlow Systems LLC', 'Expiry Date': '12/31/2025' },
        verificationNotes: ['Business name matches application', 'License is current'],
      },
      {
        id: 'cd-11', type: 'tax_return_year1', label: 'Business Tax Return (2024)', fileName: 'DataFlow_2024_Tax_Return.pdf', fileSize: '3.9 MB',
        uploadDate: '2024-12-15', status: 'verified', source: 'APP-002', ocrConfidence: 88,
        extractedData: { 'Form': '1065', 'Tax Year': '2024', 'EIN': '74-9876543', 'Gross Revenue': '$1,800,000', 'Net Income': '$285,000' },
        verificationNotes: ['EIN matches application', 'Revenue consistent with reported $1.8M'],
      },
      {
        id: 'cd-12', type: 'bank_statement', label: 'Bank Statements (6 mo)', fileName: 'DataFlow_Bank_Statements.pdf', fileSize: '2.7 MB',
        uploadDate: '2024-12-16', status: 'verified', source: 'APP-002', ocrConfidence: 90,
        extractedData: { 'Bank': 'Wells Fargo Business', 'Period': 'Jul–Dec 2024', 'Avg Monthly Balance': '$185,000', 'NSF Events': '0' },
        verificationNotes: ['No NSF events', '6 consecutive months provided'],
      },
      {
        id: 'cd-13', type: 'equipment_quote', label: 'Equipment Quote / Invoice', fileName: 'EC_Pro_Quote.pdf', fileSize: '650 KB',
        uploadDate: '2024-12-15', status: 'verified', source: 'APP-002', ocrConfidence: 96,
        extractedData: { 'Vendor': 'EdgeTech Solutions', 'Total Amount': '$16,000', 'Items': '8x Edge Computing Device EC-Pro', 'Valid Until': '02/15/2025' },
        verificationNotes: ['Amount matches requested equipment cost'],
      },
      {
        id: 'cd-14', type: 'personal_id', label: 'Government-Issued ID', fileName: 'MJohnson_ID.jpg', fileSize: '380 KB',
        uploadDate: '2024-12-15', status: 'verified', source: 'APP-002', ocrConfidence: 92,
        extractedData: { 'Document Type': 'Driver License', 'Full Name': 'Michael R. Johnson', 'State': 'Texas', 'ID Number': 'D5219834', 'Expiry': '11/05/2026' },
        verificationNotes: ['Name matches guarantor', 'ID is not expired'],
      },
    ],
  },
};

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return local + '@' + domain;
  return local[0] + '\u2022\u2022\u2022' + local[local.length - 1] + '@' + domain;
}

/** Demo-friendly business data for pre-filling after authentication */
export interface DemoBusinessData {
  ein: string;
  businessType: string;
  stateOfIncorporation: string;
  yearsInBusiness: number;
  ownershipPercentage: number;
  equipment: { description: string; value: number };
  guarantor: {
    ssn: string;
    personalIncome: number;
    personalNetWorth: number;
    address: string;
    driversLicenseState: string;
  };
  // Extended fields matching config field set
  dba?: string;
  entityType?: string;
  dateEstablished?: string;
  industry?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  fiscalYearEnd?: string;
  streetAddress?: string;
  suite?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  guarantorName?: string;
  guarantorIdNumber?: string;
  guarantorDOB?: string;
}

export const DEMO_BUSINESS_DATA: Record<string, DemoBusinessData> = {
  '1': {
    ein: '82-1234567',
    businessType: 'c_corp',
    stateOfIncorporation: 'California',
    yearsInBusiness: 7,
    ownershipPercentage: 100,
    equipment: { description: '50x MacBook Pro M4, 20x Standing Desks, 10x 4K Monitors', value: 175000 },
    guarantor: {
      ssn: '123-45-6789',
      personalIncome: 225000,
      personalNetWorth: 750000,
      address: '1234 Innovation Drive, San Francisco, CA 94105',
      driversLicenseState: 'California',
    },
    // Extended fields from COMPANY_DETAILS['1']
    dba: 'TechCorp',
    entityType: 'Corporation',
    dateEstablished: '2018-06-15',
    industry: 'Technology / SIC 7372',
    numberOfEmployees: 85,
    annualRevenue: 2500000,
    fiscalYearEnd: 'December 2024',
    streetAddress: '1234 Innovation Drive',
    suite: 'Suite 400',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94105',
    country: 'United States',
    contactName: 'John Martinez',
    contactEmail: 'john.martinez@techcorp.com',
    contactPhone: '(415) 555-0123',
    guarantorName: 'John A. Martinez',
    guarantorIdNumber: 'D7842951',
    guarantorDOB: '1985-03-22',
  },
  '2': {
    ein: '74-9876543',
    businessType: 'llc',
    stateOfIncorporation: 'Texas',
    yearsInBusiness: 5,
    ownershipPercentage: 80,
    equipment: { description: '25x GPS Tracking Modules, 15x Edge Routers', value: 62000 },
    guarantor: {
      ssn: '987-65-4321',
      personalIncome: 180000,
      personalNetWorth: 500000,
      address: '5678 Tech Boulevard, Austin, TX 78701',
      driversLicenseState: 'Texas',
    },
    // Extended fields from COMPANY_DETAILS['2']
    entityType: 'LLC',
    dateEstablished: '2019-09-10',
    industry: 'Logistics / SIC 4731',
    numberOfEmployees: 42,
    annualRevenue: 1800000,
    fiscalYearEnd: 'December 2024',
    streetAddress: '5678 Tech Boulevard',
    city: 'Austin',
    state: 'Texas',
    zipCode: '78701',
    country: 'United States',
    contactName: 'Michael Johnson',
    contactEmail: 'mjohnson@dataflow.com',
    contactPhone: '(512) 555-0198',
    guarantorName: 'Michael R. Johnson',
    guarantorIdNumber: 'D5219834',
    guarantorDOB: '1980-11-05',
  },
};

export function findCompanyByName(name: string): { id: string; company: CompanyDetail } | null {
  const lower = name.toLowerCase().trim();
  for (const [id, company] of Object.entries(COMPANY_DETAILS)) {
    // Exact match or partial match (e.g. "techcorp" matches "TechCorp Industries")
    if (company.name.toLowerCase() === lower || company.name.toLowerCase().includes(lower) || lower.includes(company.name.toLowerCase().split(' ')[0])) {
      return { id, company };
    }
  }
  return null;
}

export function findCompanyByRepEmail(email: string): { id: string; company: CompanyDetail } | null {
  const lower = email.toLowerCase().trim();
  for (const [id, company] of Object.entries(COMPANY_DETAILS)) {
    if (company.representatives.some(rep => rep.email.toLowerCase() === lower)) {
      return { id, company };
    }
  }
  return null;
}
