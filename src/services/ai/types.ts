// Shared types for AI services

export interface AgentResponse {
  message: string;
  type?: 'text' | 'suggestion' | 'qualification_update';
  qualification?: any;
  suggestions?: string[];
  nextStep?: string;
}

export interface AgentInitResponse {
  success: boolean;
  sessionId: string;
  initialMessage?: string;
}

export interface UserProfile {
  customerType?: 'individual' | 'business';
  age?: number;
  ssn?: string;
  fullName?: string;
  representativeName?: string;
  income?: number;
  creditScore?: number;
  employmentStatus?: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  employer?: string;
  email?: string;
  phone?: string;
  dob?: string;
  housingCost?: number;
  location?: {
    country: string;
    state?: string;
    city?: string;
  };
  businessInfo?: {
    companyName?: string;
    nif?: string;
    industry?: string;
    revenue?: number;
    businessType?: 'llc' | 'corporation' | 'sole_proprietorship' | 'partnership' | 's_corp' | 'c_corp';
    stateOfIncorporation?: string;
    yearsInBusiness?: number;
    ownershipPercentage?: number;
  };
  revenueRange?: string;
  revenueRangeRefined?: string;
  guarantorInfo?: {
    ssn?: string;
    personalIncome?: number;
    personalNetWorth?: number;
    address?: string;
    driversLicenseState?: string;
  };
  selectedTerm?: number;
  selectedOfferType?: 'financing' | 'lease';
  financingType?: 'financing' | 'lease';
  tradeInEstimate?: number;
}

export interface RoutingDecision {
  recommendedPath: 'individual' | 'business';
  confidence: number;
  reasons: string[];
  suggestedQuestions: string[];
  requiredFields: string[];
  warningFlags: string[];
  nextSteps: string[];
}

export interface FinancingRecommendation {
  products: string[];
  terms: {
    lender: string;
    interestRate?: number;
    termLength?: number;
    downPayment?: number;
  }[];
  eligibility: 'high' | 'medium' | 'low';
  reasons: string[];
}

export interface AiMessage {
  text: string;
  type?: 'text' | 'suggestion' | 'qualification_update';
  qualification?: any;
  suggestions?: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system' | 'offer' | 'contract' | 'comparison';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
  offerData?: {
    lender: string;
    apr: number;
    termMonths: number;
    downPayment: number;
    monthlyPayment: number;
    totalAmount: number;
    residuals?: { name: string; percentage: number; value: number }[];
  };
}

export type OfferEngineResidual = {
  name: string;
  price: number;
  residualPct: number;
  residualValue: number;
};

export type OfferEngineResult = {
  termMonths: number;
  residuals: OfferEngineResidual[];
  combinedResidual: number;
  summaryText: string;
};
