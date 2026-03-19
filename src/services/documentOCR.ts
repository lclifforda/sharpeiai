/**
 * Simulate OCR processing and document verification.
 * Extracted from AIApplicationChat so both vendor and bank flows can share it.
 * Without real OCR, we validate by filename to catch wrong document types.
 */

/** Expected filename keywords per document type (any match = pass). Conflicting = suggests wrong type. */
const FILENAME_VALIDATION: Record<string, { expected: string[]; conflicting?: string[][] }> = {
  business_license: {
    expected: ['license', 'permit', 'registration'],
    conflicting: [['tax', 'return'], ['bank', 'statement'], ['income', 'statement'], ['articles', 'incorporation']],
  },
  articles_of_incorporation: {
    expected: ['incorporation', 'articles', 'formation'],
    conflicting: [['tax', 'return'], ['bank', 'statement'], ['license', 'permit']],
  },
  tax_return_year1: { expected: ['tax', 'return', '1120', '1065'], conflicting: [['license', 'permit'], ['bank', 'statement'], ['guarantee', 'guarantor']] },
  tax_return_year2: { expected: ['tax', 'return', '1120', '1065'], conflicting: [['license', 'permit'], ['bank', 'statement']] },
  profit_loss: {
    expected: ['profit', 'loss', 'p&l', 'income', 'p&l'],
    conflicting: [['bank', 'statement']], // income_statement is P&L; bank_statement is not
  },
  bank_statement: {
    expected: [], // Handled by special case in filenameMatchesDocType
    conflicting: [['tax', 'return'], ['income', 'profit'], ['license', 'permit']],
  },
  equipment_quote: { expected: ['quote', 'invoice', 'purchase', 'order'], conflicting: [['tax', 'return'], ['license', 'permit']] },
  personal_guarantee: { expected: ['guarantee', 'guarantor', 'personal'], conflicting: [['tax', 'return'], ['bank', 'statement']] },
  insurance_cert: { expected: ['insurance', 'certificate', 'coverage'], conflicting: [['tax', 'return'], ['bank', 'statement']] },
  personal_tax_return: { expected: ['tax', 'return', '1040'], conflicting: [['license', 'permit'], ['bank', 'statement']] },
  personal_id: { expected: ['id', 'license', 'passport', 'drivers', 'driver'], conflicting: [['tax', 'return'], ['bank', 'statement'], ['business', 'license']] },
  balance_sheet: { expected: ['balance', 'sheet', 'assets', 'liabilities'], conflicting: [['tax', 'return'], ['bank', 'statement']] },
  equipment_spec_sheet: { expected: ['spec', 'equipment', 'datasheet', 'technical'], conflicting: [['tax', 'return'], ['license', 'permit']] },
  ucc_filing: { expected: ['ucc', 'filing', 'financing'], conflicting: [['tax', 'return'], ['license', 'permit']] },
};

function filenameMatchesDocType(fileName: string, docTypeKey: string): { match: boolean; reason?: string } {
  const validation = FILENAME_VALIDATION[docTypeKey];
  if (!validation) return { match: true }; // Unknown type, allow
  const lower = fileName.toLowerCase();

  // Reject if filename strongly suggests a different document type
  for (const pair of validation.conflicting ?? []) {
    if (pair.every(kw => lower.includes(kw))) {
      return { match: false, reason: `Filename suggests ${pair.join(' ')} document, not ${docTypeKey.replace(/_/g, ' ')}` };
    }
  }

  // Special case: bank_statement — avoid income_statement (has "statement" but not bank/account)
  if (docTypeKey === 'bank_statement') {
    const hasBank = lower.includes('bank');
    const hasStatementAndAccount = lower.includes('statement') && lower.includes('account');
    if (!hasBank && !hasStatementAndAccount) {
      return { match: false, reason: 'Filename should include "bank" or both "statement" and "account" (e.g. bank_statement, not income_statement)' };
    }
    return { match: true };
  }

  // Require at least one expected keyword
  const hasExpected = validation.expected.some(kw => lower.includes(kw));
  if (!hasExpected) {
    return { match: false, reason: `Filename should include one of: ${validation.expected.join(', ')}` };
  }
  return { match: true };
}

export interface OCRResult {
  status: 'verified' | 'rejected';
  extractedData?: Record<string, any>;
  verificationNotes?: string[];
}

export const processDocumentOCR = async (
  docId: string,
  file: File,
  attemptNumber: number,
  context?: { cartTotal?: number; representativeName?: string }
): Promise<OCRResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const docTypeMap: Record<string, string> = {
    businessLicense: 'business_license',
    business_license: 'business_license',
    articlesOfIncorporation: 'articles_of_incorporation',
    articles_of_incorporation: 'articles_of_incorporation',
    taxReturn: 'tax_return_year1',
    tax_return_year1: 'tax_return_year1',
    tax_return_year2: 'tax_return_year2',
    profitLoss: 'profit_loss',
    profit_loss: 'profit_loss',
    bankStatements: 'bank_statement',
    bank_statement: 'bank_statement',
    equipmentQuote: 'equipment_quote',
    equipment_quote: 'equipment_quote',
    personalGuarantee: 'personal_guarantee',
    personal_guarantee: 'personal_guarantee',
    personal_id: 'personal_id',
    insuranceCertificate: 'insurance_cert',
    insurance_cert: 'insurance_cert',
  };

  const docType = docTypeMap[docId] ?? docId;
  const fileName = file.name;

  let extractedData: Record<string, any> = {};
  let verificationNotes: string[] = [];
  let status: 'verified' | 'rejected' = 'verified';

  const ocrConfidence = Math.floor(Math.random() * 13) + 85;
  verificationNotes.push(`OCR confidence: ${ocrConfidence}%`);

  const isLenientValidation = attemptNumber >= 2;

  // Filename validation (no real OCR — we check filename to catch wrong document types)
  const filenameCheck = filenameMatchesDocType(fileName, docType);
  if (!isLenientValidation && !filenameCheck.match) {
    status = 'rejected';
    verificationNotes.push(`⚠ Document type mismatch - ${filenameCheck.reason}`);
    verificationNotes.push('💡 Tip: Use a filename that clearly indicates the document type (e.g. business_license.pdf, bank_statement.pdf)');
    return { status, extractedData, verificationNotes };
  }

  // Extract based on document type (support both camelCase and snake_case docIds)
  if (docType === 'business_license') {
    extractedData = {
      licenseNumber: `BL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      state: 'California',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    verificationNotes.push('✓ Document validated successfully');
    verificationNotes.push('Extracted: 3 fields');
  } else if (docType === 'articles_of_incorporation') {
    extractedData = {
      incorporationDate: '2020-03-15',
      entityType: 'Corporation',
      state: 'Delaware',
    };
    verificationNotes.push('✓ Document validated successfully');
  } else if (docType === 'tax_return_year1' || docType === 'tax_return_year2') {
    extractedData = {
      taxYear: '2024',
      grossRevenue: Math.floor(Math.random() * 5000000) + 1000000,
      netIncome: Math.floor(Math.random() * 1000000) + 100000,
    };
    verificationNotes.push('✓ Document validated successfully');
    verificationNotes.push('Extracted: 3 fields');
  } else if (docType === 'profit_loss') {
    extractedData = {
      period: '2024 YTD',
      revenue: Math.floor(Math.random() * 3000000) + 500000,
      expenses: Math.floor(Math.random() * 2000000) + 300000,
    };
    verificationNotes.push('✓ Document validated successfully');
  } else if (docType === 'bank_statement') {
    extractedData = {
      accountType: 'Business Checking',
      averageBalance: Math.floor(Math.random() * 500000) + 10000,
      statementPeriod: 'Last 3 months',
    };
    verificationNotes.push('✓ Document validated successfully');
  } else if (docType === 'equipment_quote') {
    extractedData = {
      vendor: 'Equipment Supplier',
      totalAmount: context?.cartTotal ?? 0,
      quoteDate: new Date().toISOString().split('T')[0],
    };
    verificationNotes.push('✓ Document validated successfully');
  } else if (docType === 'personal_guarantee') {
    extractedData = {
      guarantorName: context?.representativeName || 'N/A',
      signedDate: new Date().toISOString().split('T')[0],
    };
    verificationNotes.push('✓ Document validated successfully');
  } else if (docType === 'personal_id') {
    extractedData = {
      documentType: 'Driver License',
      fullName: context?.representativeName || 'N/A',
      state: 'California',
      expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    verificationNotes.push('✓ Document validated successfully');
  } else if (docType === 'insurance_cert') {
    extractedData = {
      coverageAmount: '$1,000,000',
      policyNumber: `POL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    verificationNotes.push('✓ Document validated successfully');
  } else {
    verificationNotes.push('✓ Document uploaded successfully');
  }

  if (isLenientValidation) {
    verificationNotes.push('✓ Accepted on retry - manual review may be required');
  }

  return { status, extractedData, verificationNotes };
};

/**
 * Context-aware OCR for documents uploaded by bank/lender staff.
 *
 * The admin selects what type of document they're uploading (or "other").
 * OCR validates the document matches that type, extracts type-specific fields,
 * and cross-references extracted data against the application to flag
 * consistencies and inconsistencies.
 */

export interface ApplicationContext {
  companyName?: string;
  entityType?: string;
  state?: string;
  ein?: string;
  annualRevenue?: string;
  requestedAmount?: string;
  equipmentCost?: string;
  guarantorName?: string;
  contactName?: string;
}

export interface AdminOCRResult extends OCRResult {
  crossValidation?: { field: string; extracted: string; application: string; match: boolean }[];
}

export const processAdminDocumentOCR = async (
  file: File,
  selectedDocType: string,  // e.g. "business_license", "tax_return_year1", or "other"
  applicationContext: ApplicationContext,
): Promise<AdminOCRResult> => {
  // Simulate processing delay (2–4 s — slightly longer for deeper analysis)
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

  const ocrConfidence = Math.floor(Math.random() * 8) + 90; // 90-97
  const verificationNotes: string[] = [`OCR confidence: ${ocrConfidence}%`];
  let extractedData: Record<string, any> = {};
  let status: 'verified' | 'rejected' = 'verified';
  const crossValidation: AdminOCRResult['crossValidation'] = [];

  // Filename validation (no real OCR — check filename matches selected document type)
  if (selectedDocType !== 'other') {
    const filenameCheck = filenameMatchesDocType(file.name, selectedDocType);
    if (!filenameCheck.match) {
      status = 'rejected';
      verificationNotes.push(`⚠ Document type mismatch - ${filenameCheck.reason}`);
      verificationNotes.push('💡 Tip: Use a filename that matches the selected document type, or choose "Other" for unclassified documents.');
      return { status, extractedData, verificationNotes, crossValidation };
    }
  }

  // ── Type-specific extraction patterns ──

  if (selectedDocType === 'business_license') {
    extractedData = {
      licenseNumber: `BL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      businessName: applicationContext.companyName || 'N/A',
      state: applicationContext.state || 'California',
      issueDate: '2023-01-15',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
    };
    verificationNotes.push('✓ Business license pattern detected');
    if (applicationContext.companyName) {
      crossValidation.push({ field: 'Business Name', extracted: extractedData.businessName, application: applicationContext.companyName, match: true });
    }
    if (applicationContext.state) {
      crossValidation.push({ field: 'State', extracted: extractedData.state, application: applicationContext.state, match: true });
    }
  } else if (selectedDocType === 'articles_of_incorporation') {
    const extractedEntity = applicationContext.entityType || 'Corporation';
    extractedData = {
      companyName: applicationContext.companyName || 'N/A',
      incorporationDate: '2018-06-15',
      entityType: extractedEntity,
      stateOfIncorporation: 'Delaware',
      registeredAgent: 'CT Corporation System',
      fileNumber: `FC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    verificationNotes.push('✓ Articles of incorporation pattern detected');
    if (applicationContext.companyName) {
      crossValidation.push({ field: 'Company Name', extracted: extractedData.companyName, application: applicationContext.companyName, match: true });
    }
    if (applicationContext.entityType) {
      crossValidation.push({ field: 'Entity Type', extracted: extractedEntity, application: applicationContext.entityType, match: extractedEntity === applicationContext.entityType });
    }
  } else if (selectedDocType === 'tax_return_year1' || selectedDocType === 'tax_return_year2') {
    const isYear1 = selectedDocType === 'tax_return_year1';
    const extractedRevenue = Math.floor(Math.random() * 2000000) + 1500000;
    extractedData = {
      formType: 'Form 1120',
      taxYear: isYear1 ? '2024' : '2023',
      businessName: applicationContext.companyName || 'N/A',
      ein: applicationContext.ein || 'N/A',
      grossRevenue: `$${extractedRevenue.toLocaleString()}`,
      netIncome: `$${Math.floor(extractedRevenue * (0.15 + Math.random() * 0.15)).toLocaleString()}`,
      totalDeductions: `$${Math.floor(extractedRevenue * (0.3 + Math.random() * 0.2)).toLocaleString()}`,
    };
    verificationNotes.push(`✓ Tax return (${isYear1 ? 'most recent' : 'prior year'}) pattern detected`);
    if (applicationContext.ein) {
      crossValidation.push({ field: 'EIN', extracted: extractedData.ein, application: applicationContext.ein, match: true });
    }
    if (applicationContext.annualRevenue) {
      const appRev = parseInt(applicationContext.annualRevenue);
      const diff = Math.abs(extractedRevenue - appRev) / appRev;
      crossValidation.push({ field: 'Annual Revenue', extracted: extractedData.grossRevenue, application: `$${appRev.toLocaleString()}`, match: diff < 0.2 });
    }
  } else if (selectedDocType === 'balance_sheet') {
    extractedData = {
      period: 'Year Ending Dec 2024',
      totalAssets: `$${(Math.floor(Math.random() * 3000000) + 500000).toLocaleString()}`,
      totalLiabilities: `$${(Math.floor(Math.random() * 1500000) + 200000).toLocaleString()}`,
      ownersEquity: `$${(Math.floor(Math.random() * 1500000) + 300000).toLocaleString()}`,
      currentRatio: (1.5 + Math.random() * 1.5).toFixed(2),
    };
    verificationNotes.push('✓ Balance sheet pattern detected');
  } else if (selectedDocType === 'profit_loss') {
    const revenue = Math.floor(Math.random() * 3000000) + 800000;
    extractedData = {
      period: 'Jan–Dec 2024',
      revenue: `$${revenue.toLocaleString()}`,
      costOfGoods: `$${Math.floor(revenue * 0.45).toLocaleString()}`,
      operatingExpenses: `$${Math.floor(revenue * 0.3).toLocaleString()}`,
      netProfit: `$${Math.floor(revenue * 0.18).toLocaleString()}`,
      profitMargin: `${(18 + Math.random() * 10).toFixed(1)}%`,
    };
    verificationNotes.push('✓ Profit & loss statement pattern detected');
    if (applicationContext.annualRevenue) {
      const appRev = parseInt(applicationContext.annualRevenue);
      const diff = Math.abs(revenue - appRev) / appRev;
      crossValidation.push({ field: 'Revenue', extracted: extractedData.revenue, application: `$${appRev.toLocaleString()}`, match: diff < 0.2 });
    }
  } else if (selectedDocType === 'bank_statement') {
    extractedData = {
      bank: 'Chase Business',
      accountType: 'Business Checking',
      statementPeriod: 'Jul–Dec 2024',
      averageMonthlyBalance: `$${(Math.floor(Math.random() * 400000) + 50000).toLocaleString()}`,
      totalDeposits: `$${(Math.floor(Math.random() * 2000000) + 300000).toLocaleString()}`,
      totalWithdrawals: `$${(Math.floor(Math.random() * 1800000) + 250000).toLocaleString()}`,
      nsfCount: 0,
    };
    verificationNotes.push('✓ Bank statement pattern detected');
    verificationNotes.push('✓ No NSF/overdraft events detected');
  } else if (selectedDocType === 'equipment_quote') {
    const eqCost = applicationContext.equipmentCost ? parseInt(applicationContext.equipmentCost) : (Math.floor(Math.random() * 50000) + 10000);
    extractedData = {
      vendor: 'SensorTech Inc.',
      quoteNumber: `Q-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      quoteDate: new Date().toISOString().split('T')[0],
      totalAmount: `$${eqCost.toLocaleString()}`,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: '15x IoT Sensor Kit S-400',
    };
    verificationNotes.push('✓ Equipment quote/invoice pattern detected');
    if (applicationContext.equipmentCost) {
      crossValidation.push({ field: 'Equipment Cost', extracted: extractedData.totalAmount, application: `$${parseInt(applicationContext.equipmentCost).toLocaleString()}`, match: true });
    }
  } else if (selectedDocType === 'personal_guarantee') {
    extractedData = {
      guarantorName: applicationContext.guarantorName || 'N/A',
      signedDate: new Date().toISOString().split('T')[0],
      guaranteeAmount: applicationContext.requestedAmount ? `$${parseInt(applicationContext.requestedAmount).toLocaleString()}` : 'N/A',
      personalNetWorth: `$${(Math.floor(Math.random() * 3000000) + 500000).toLocaleString()}`,
    };
    verificationNotes.push('✓ Personal guarantee form pattern detected');
    if (applicationContext.guarantorName) {
      crossValidation.push({ field: 'Guarantor Name', extracted: extractedData.guarantorName, application: applicationContext.guarantorName, match: true });
    }
  } else if (selectedDocType === 'personal_tax_return') {
    extractedData = {
      formType: 'Form 1040',
      taxYear: '2024',
      filerName: applicationContext.guarantorName || applicationContext.contactName || 'N/A',
      adjustedGrossIncome: `$${(Math.floor(Math.random() * 400000) + 80000).toLocaleString()}`,
      taxableIncome: `$${(Math.floor(Math.random() * 350000) + 60000).toLocaleString()}`,
    };
    verificationNotes.push('✓ Personal tax return pattern detected');
    if (applicationContext.guarantorName) {
      crossValidation.push({ field: 'Filer Name', extracted: extractedData.filerName, application: applicationContext.guarantorName, match: true });
    }
  } else if (selectedDocType === 'insurance_cert') {
    extractedData = {
      insurer: 'Hartford Financial Services',
      policyNumber: `POL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      coverageType: 'Commercial General Liability',
      coverageAmount: '$1,000,000',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      namedInsured: applicationContext.companyName || 'N/A',
    };
    verificationNotes.push('✓ Insurance certificate pattern detected');
    if (applicationContext.companyName) {
      crossValidation.push({ field: 'Named Insured', extracted: extractedData.namedInsured, application: applicationContext.companyName, match: true });
    }
  } else if (selectedDocType === 'personal_id') {
    extractedData = {
      documentType: 'Driver License',
      fullName: applicationContext.guarantorName || applicationContext.contactName || 'N/A',
      state: applicationContext.state || 'California',
      dateOfBirth: '1985-03-22',
      expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      idNumber: `D${Math.floor(Math.random() * 9000000) + 1000000}`,
    };
    verificationNotes.push('✓ Government-issued ID pattern detected');
    if (applicationContext.guarantorName || applicationContext.contactName) {
      const expected = applicationContext.guarantorName || applicationContext.contactName || '';
      crossValidation.push({ field: 'Full Name', extracted: extractedData.fullName, application: expected, match: true });
    }
  } else if (selectedDocType === 'equipment_spec_sheet') {
    extractedData = {
      manufacturer: 'SensorTech Inc.',
      model: 'S-400 IoT Sensor Kit',
      category: 'Industrial IoT / Sensors',
      dimensions: '15cm x 10cm x 5cm',
      weight: '2.5 kg',
      powerSource: 'Battery + USB-C',
      connectivity: 'WiFi, Bluetooth 5.0, LoRaWAN',
      operatingTemp: '-20°C to 60°C',
      certifications: 'CE, FCC, IP67',
      estimatedLifespan: '7–10 years',
    };
    verificationNotes.push('✓ Equipment spec sheet pattern detected');
    verificationNotes.push('✓ Manufacturer and model identified');
  } else if (selectedDocType === 'ucc_filing') {
    extractedData = {
      filingType: 'UCC-1 Financing Statement',
      filingNumber: `UCC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      debtorName: applicationContext.companyName || 'N/A',
      securedParty: 'Your Institution',
      collateralDescription: 'All equipment described in attached schedule',
      filingDate: new Date().toISOString().split('T')[0],
    };
    verificationNotes.push('✓ UCC filing pattern detected');
    if (applicationContext.companyName) {
      crossValidation.push({ field: 'Debtor Name', extracted: extractedData.debtorName, application: applicationContext.companyName, match: true });
    }
  } else {
    // "other" — AI tries to classify and extract what it can
    const fileName = file.name.toLowerCase();
    if (fileName.includes('contract') || fileName.includes('agreement')) {
      extractedData = { documentType: 'Contract / Agreement', parties: applicationContext.companyName || 'Unknown', pages: Math.floor(Math.random() * 15) + 3, signedDate: new Date().toISOString().split('T')[0] };
      verificationNotes.push('✓ Contract/agreement pattern detected');
    } else if (fileName.includes('appraisal') || fileName.includes('valuation')) {
      extractedData = { documentType: 'Appraisal / Valuation', appraiser: 'Independent Valuation Services', estimatedValue: `$${(Math.floor(Math.random() * 100000) + 20000).toLocaleString()}`, date: new Date().toISOString().split('T')[0] };
      verificationNotes.push('✓ Appraisal document detected');
    } else {
      extractedData = { documentType: 'Unclassified', pages: Math.floor(Math.random() * 8) + 1, language: 'English' };
      verificationNotes.push('⚠ Could not match to a known document type');
      verificationNotes.push('Manual review recommended');
    }
  }

  // Summary
  verificationNotes.push(`Extracted: ${Object.keys(extractedData).length} fields`);
  if (crossValidation.length > 0) {
    const matches = crossValidation.filter(c => c.match).length;
    const total = crossValidation.length;
    if (matches === total) {
      verificationNotes.push(`✓ Cross-validation: ${matches}/${total} fields match application data`);
    } else {
      verificationNotes.push(`⚠ Cross-validation: ${matches}/${total} fields match — review flagged items`);
      status = 'verified'; // still verified, but with warnings
    }
  }

  return { status, extractedData, verificationNotes, crossValidation };
};
