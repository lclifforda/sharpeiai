import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import robotImage from "@/assets/humanoid-robot.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAiAgent } from "@/hooks/useAiAgent";
import { agentAPI } from "@/services/ai/agentAPI";
import { UserProfile } from "@/services/ai/types";
import { simulateResiduals } from "@/services/ai/offerEngine";
import { generateCryptoId } from "@/lib/idGenerator";
import OfferCard from "@/components/OfferCard";
import ContractCard from "@/components/ContractCard";

interface ChatMessage {
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

type PromptKind = 'idle' | 'ask_customer_type' | 'ask_company_name' | 'ask_nif' | 'ask_business_type' | 'ask_state_incorporation' | 'ask_years_in_business' | 'ask_ownership_pct' | 'ask_representative' | 'ask_revenue_tranche' | 'ask_revenue_precise' | 'ask_guarantor_ssn' | 'ask_guarantor_income' | 'ask_guarantor_networth' | 'ask_guarantor_address' | 'ask_guarantor_license' | 'ask_ssn' | 'ask_income_tranche' | 'ask_income_precise' | 'ask_rent' | 'ask_employment' | 'choose_offer_type' | 'ask_tradein' | 'ask_tradein_details' | 'confirm_tradein_apply' | 'ask_tradein_value' | 'ready_for_docs' | 'ask_lease_or_finance' | 'ask_term_length' | 'contract_signature' | 'document_upload' | 'done';

type ApplicationStep = 'info' | 'documents' | 'offers' | 'contract' | 'complete';

const AIApplicationChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state || {
    quantity: 1,
    maintenance: false,
    insurance: false,
    term: "24",
    downPayment: 299
  };

  const [sessionId] = useState(() => `session-${Date.now()}`);
  const { sendMessage, isLoading, lastMessage, isConnected } = useAiAgent(sessionId);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Local working copy of customer data to avoid duplication
  const workingDataRef = useRef<Partial<UserProfile>>({});
  
  // Conversation state tracking
  const [currentPrompt, setCurrentPrompt] = useState<PromptKind>('idle');
  const collectedBasicsRef = useRef(false);
  const [lastOffer, setLastOffer] = useState<{ lender: string; rate: number; term: number; down: number; estMonthly: number } | null>(null);
  const offerIssuedRef = useRef(false);
  const defaultOfferTimerRef = useRef<any>(null);
  
  // Application step tracking for business customers
  const [applicationStep, setApplicationStep] = useState<ApplicationStep>('info');

  const monthlyRate = 800;
  const maintenanceCost = 150;
  const insuranceCost = 200;

  const calculateTotal = () => {
    let total = monthlyRate * orderDetails.quantity;
    if (orderDetails.maintenance) total += maintenanceCost;
    if (orderDetails.insurance) total += insuranceCost;
    return total;
  };
  
  const cartTotal = calculateTotal();
  const cartItems = [{
    name: "Humanoid Robot F-02",
    price: cartTotal,
    quantity: orderDetails.quantity
  }];

  // Helper functions
  const computeMonthly = (principal: number, apr: number, months: number) => {
    if (!apr || apr <= 0) return Math.ceil(principal / months);
    const r = apr / 100 / 12;
    const n = months;
    return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };
  
  const estimateTradeIn = (details: string): number | null => {
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
  
  const pushAI = (content: string, suggestions?: string[]) => {
    const aiMessage: ChatMessage = {
      id: generateCryptoId(),
      type: 'ai',
      content,
      timestamp: new Date(),
      suggestions,
    };
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.content === content) return prev; // dedupe
      return [...prev, aiMessage];
    });
  };
  
  // Initialize conversation
  useEffect(() => {
    const greeting: ChatMessage = {
      id: 'greet',
      type: 'ai',
      content: `Hi! 👋 I'll guide you through a few quick questions to find your best financing option.\n\n💡 **How this works:**\n• I'll ask you a few simple questions\n• You can type your answers or click the suggestion buttons\n• Based on your profile, I'll find you a personalized rate\n• The whole process takes about 2 minutes\n\nLet's get started!`,
      timestamp: new Date(),
    };
    setMessages([greeting]);
    setTimeout(() => queueFirstPrompt(), 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const queueFirstPrompt = () => {
    collectedBasicsRef.current = true;
    // Default to business for this application
    workingDataRef.current = { customerType: 'business' };
    askNextFrom(workingDataRef.current);
  };
  
  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const askNextFrom = (data: Partial<UserProfile>) => {
    const customerType = (data as any).customerType;
    
    // Business flow
    if (customerType === 'business') {
      if (!(data as any).businessInfo?.companyName) {
        setCurrentPrompt('ask_company_name');
        pushAI(`What's your company name?`);
        return;
      }
      if (!(data as any).businessInfo?.nif || String((data as any).businessInfo?.nif).replace(/\D/g, '').length !== 9) {
        setCurrentPrompt('ask_nif');
        pushAI(`What's your Employer Identification Number (EIN)?\n\nFormat: XX-XXXXXXX (9 digits)`);
        return;
      }
      if (!(data as any).businessInfo?.businessType) {
        setCurrentPrompt('ask_business_type');
        pushAI(`What type of business entity is your company?`, [
          'LLC',
          'Corporation (C-Corp)',
          'S-Corporation',
          'Sole Proprietorship',
          'Partnership'
        ]);
        return;
      }
      if (!(data as any).businessInfo?.stateOfIncorporation) {
        setCurrentPrompt('ask_state_incorporation');
        pushAI(`What state is your business incorporated in?`);
        return;
      }
      if (!(data as any).businessInfo?.yearsInBusiness) {
        setCurrentPrompt('ask_years_in_business');
        pushAI(`How many years has your business been operating?`, [
          'Less than 1 year',
          '1-3 years',
          '3-5 years',
          '5-10 years',
          'Over 10 years'
        ]);
        return;
      }
      if (!(data as any).businessInfo?.ownershipPercentage) {
        setCurrentPrompt('ask_ownership_pct');
        pushAI(`What percentage of the business do you own?`, [
          '100%',
          '51-99%',
          '26-50%',
          '25% or less'
        ]);
        return;
      }
      if (!(data as any).representativeName) {
        setCurrentPrompt('ask_representative');
        pushAI(`Who is the authorized representative for this application?`);
        return;
      }
      if (!data.income) {
        setCurrentPrompt('ask_revenue_tranche');
        pushAI(`What range does your company's annual revenue fall into?`, [
          'Under $500K',
          '$500K - $5M',
          '$5M - $50M',
          'Over $50M'
        ]);
        return;
      }
      
      // Conditional: Guarantor info required if financing amount > $50K
      const needsGuarantor = cartTotal > 50000;
      
      if (needsGuarantor) {
        if (!(data as any).guarantorInfo?.ssn || String((data as any).guarantorInfo?.ssn).replace(/\D/g, '').length !== 9) {
          setCurrentPrompt('ask_guarantor_ssn');
          pushAI(`For equipment financing over $50,000, we need a personal guarantee.\n\nWhat's your Social Security Number (SSN)?\n\nFormat: XXX-XX-XXXX (9 digits)`);
          return;
        }
        if (!(data as any).guarantorInfo?.personalIncome) {
          setCurrentPrompt('ask_guarantor_income');
          pushAI(`What's your personal annual income?`, [
            'Under $75K',
            '$75K - $150K',
            '$150K - $300K',
            'Over $300K'
          ]);
          return;
        }
        if (!(data as any).guarantorInfo?.personalNetWorth) {
          setCurrentPrompt('ask_guarantor_networth');
          pushAI(`What's your estimated personal net worth (assets minus liabilities)?`, [
            'Under $100K',
            '$100K - $500K',
            '$500K - $1M',
            'Over $1M'
          ]);
          return;
        }
        if (!(data as any).guarantorInfo?.address) {
          setCurrentPrompt('ask_guarantor_address');
          pushAI(`What's your personal address (for the guarantee)?`);
          return;
        }
        if (!(data as any).guarantorInfo?.driversLicenseState) {
          setCurrentPrompt('ask_guarantor_license');
          pushAI(`What state was your driver's license issued in?`);
          return;
        }
      }
    }
    
    // Finalize guided prompts - show offers
    pushAI('Perfect! Let me show you your financing options...');
    setCurrentPrompt('done');
    
    if (!offerIssuedRef.current && !lastOffer) {
      offerIssuedRef.current = true;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        proposeMultipleOffers();
      }, 800);
    }
  };
  
  const proposeMultipleOffers = () => {
    const data = workingDataRef.current as any;
    const isBusinessCustomer = data.customerType === 'business';
    
    pushAI(`Great news! Based on your profile, here are your options:\n\n**Option 1: Equipment Financing**\n• Own the equipment\n• Build equity with payments\n• Tax benefits through depreciation\n\n**Option 2: Equipment Lease**\n• Lower upfront costs\n• Flexible upgrade options\n• Off-balance sheet (for businesses)\n\nWhich option interests you more?`, [
      'Show me Financing options',
      'Show me Lease options',
      'Compare side-by-side'
    ]);
    
    setCurrentPrompt('choose_offer_type');
  };
  
  const proposeSelectedOffer = (offerType: string, term: number) => {
    const data = workingDataRef.current as any;
    const isBusinessCustomer = data.customerType === 'business';
    
    // Calculate rate based on profile
    let rate = 10.99;
    let lender = 'Standard Lender';
    
    if (data.income && data.income > 250000) {
      rate = 0;
      lender = 'Premium Elite Lender';
    } else if ((data.creditScore && data.creditScore >= 750) || (data.income && data.income >= 120000)) {
      rate = 7.99;
      lender = 'Preferred Lender';
    } else if (data.creditScore && data.creditScore < 650) {
      rate = 15.99;
      lender = 'Alt Lender';
    }
    
    let est;
    let down;
    
    if (offerType === 'lease') {
      lender = isBusinessCustomer ? 'Commercial Lease Co.' : 'Lease Solutions';
      down = 0;
      const depreciationFactor = 1.15;
      est = Math.round((cartTotal * depreciationFactor) / term);
      rate = 0;
    } else {
      down = Math.min(cartTotal * 0.1, 500);
      est = computeMonthly(Math.max(0, cartTotal - down), rate, term);
    }
    
    const offer = { lender, rate, term, down, estMonthly: est };
    setLastOffer(offer);
    setCurrentPrompt(isBusinessCustomer ? 'ready_for_docs' : 'ask_tradein');
    
    const residuals = simulateResiduals(cartItems.map(i => ({ name: i.name, price: i.price })), term);
    
    const offerMessage: ChatMessage = {
      id: generateCryptoId(),
      type: 'offer',
      content: `Here's your personalized ${offerType === 'lease' ? 'Lease' : 'Financing'} offer:`,
      timestamp: new Date(),
      suggestions: isBusinessCustomer
        ? ['Apply this offer', 'See other terms', 'Talk to sales']
        : ['I have a trade-in', 'No trade-in', 'Apply this offer'],
      offerData: {
        lender,
        apr: rate,
        termMonths: term,
        downPayment: down,
        monthlyPayment: est,
        totalAmount: cartTotal,
        residuals: residuals.residuals.map(r => ({
          name: r.name,
          percentage: Math.round(r.residualPct * 100),
          value: r.residualValue
        }))
      }
    };
    setMessages((prev) => [...prev, offerMessage]);
    
    if (!isBusinessCustomer) {
      setTimeout(() => {
        pushAI('Would you like to add a trade‑in to lower your payment?');
      }, 500);
    } else {
      setTimeout(() => {
        pushAI('Ready to proceed? I\'ll need a few documents to complete your application.');
      }, 500);
    }
  };
  
  const initiateContractSignature = () => {
    const offer = lastOffer;
    if (!offer) return;

    const data = workingDataRef.current as any;
    const customerName = data.representativeName || data.fullName || 'Customer';
    const customerEmail = data.email || 'customer@example.com';
    
    setCurrentPrompt('contract_signature');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const docusignId = generateCryptoId().substring(0, 16);
      const docusignLink = `https://docusign.com/sign/${docusignId}`;
      
      const contractMessage: ChatMessage = {
        id: generateCryptoId(),
        type: 'contract',
        content: 'Perfect! Now let\'s finalize your contract.',
        timestamp: new Date(),
        suggestions: [
          'Sign contract',
          'Explain payment terms',
          'Explain default terms',
          'Review all clauses'
        ],
        contractData: {
          lender: offer.lender,
          customerName,
          customerEmail,
          totalFinanced: cartTotal,
          downPayment: offer.down,
          apr: offer.rate,
          termMonths: offer.term,
          monthlyPayment: offer.estMonthly,
          docusignLink
        }
      };
      setMessages((prev) => [...prev, contractMessage]);
      
      setTimeout(() => {
        pushAI('You can ask me to explain any clause in detail, or proceed to sign when ready.');
      }, 1000);
    }, 1200);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const text = content.trim();
    const lower = text.toLowerCase();
    const isQuestion = lower.includes('?') ||
                      /\bwhat\b/.test(lower) ||
                      /\bwhy\b/.test(lower) ||
                      /\bhow\b/.test(lower) ||
                      lower.includes('explain') ||
                      lower.includes('tell me') ||
                      lower.includes('can you') ||
                      lower.includes('difference');
    
    const userMessage: ChatMessage = {
      id: generateCryptoId(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Allow off-script questions at any point
    if (isQuestion) {
      setIsTyping(true);
      try {
        const response = await agentAPI.sendMessage(sessionId, text, {
          customerData: workingDataRef.current,
          lastOffer,
          cartTotal,
          currentPrompt
        });
        setIsTyping(false);
        pushAI(response.message, response.suggestions);
        return;
      } catch (error) {
        setIsTyping(false);
        pushAI('I\'m not sure about that. Would you like to talk to a sales representative?', ['Talk to sales', 'Continue']);
        return;
      }
    }
    
    // Handle structured prompts locally
    const updateAndNext = (patch: any) => {
      const merged = { ...workingDataRef.current, ...patch } as any;
      workingDataRef.current = merged;
      askNextFrom(merged);
    };
    
    // Business flow handlers
    if (currentPrompt === 'ask_company_name') {
      const businessInfo = (workingDataRef.current as any).businessInfo || {};
      businessInfo.companyName = text;
      updateAndNext({ businessInfo });
      return;
    }
    
    if (currentPrompt === 'ask_nif') {
      const digits = lower.replace(/\D/g, '');
      if (digits.length === 9) {
        const businessInfo = (workingDataRef.current as any).businessInfo || {};
        businessInfo.nif = `${digits.slice(0, 2)}-${digits.slice(2)}`;
        updateAndNext({ businessInfo });
      } else {
        pushAI('Please enter exactly 9 digits for your EIN (format: XX-XXXXXXX).');
      }
      return;
    }
    
    if (currentPrompt === 'ask_business_type') {
      const businessInfo = (workingDataRef.current as any).businessInfo || {};
      if (lower.includes('llc')) {
        businessInfo.businessType = 'llc';
      } else if (lower.includes('corp') || lower.includes('c-corp')) {
        businessInfo.businessType = 'c_corp';
      } else if (lower.includes('s-corp') || lower.includes('s corp')) {
        businessInfo.businessType = 's_corp';
      } else if (lower.includes('sole')) {
        businessInfo.businessType = 'sole_proprietorship';
      } else if (lower.includes('partner')) {
        businessInfo.businessType = 'partnership';
      }
      if (businessInfo.businessType) {
        updateAndNext({ businessInfo });
      } else {
        pushAI('Please select a business type from the options above.');
      }
      return;
    }
    
    if (currentPrompt === 'ask_state_incorporation') {
      const businessInfo = (workingDataRef.current as any).businessInfo || {};
      businessInfo.stateOfIncorporation = text;
      updateAndNext({ businessInfo });
      return;
    }
    
    if (currentPrompt === 'ask_years_in_business') {
      const businessInfo = (workingDataRef.current as any).businessInfo || {};
      if (lower.includes('less') || lower.includes('1')) {
        businessInfo.yearsInBusiness = 0.5;
      } else if (lower.includes('1-3') || lower.includes('1') || lower.includes('3')) {
        businessInfo.yearsInBusiness = 2;
      } else if (lower.includes('3-5') || lower.includes('5')) {
        businessInfo.yearsInBusiness = 4;
      } else if (lower.includes('5-10') || lower.includes('10')) {
        businessInfo.yearsInBusiness = 7;
      } else if (lower.includes('over')) {
        businessInfo.yearsInBusiness = 15;
      }
      if (businessInfo.yearsInBusiness) {
        updateAndNext({ businessInfo });
      } else {
        pushAI('Please select from the options above.');
      }
      return;
    }
    
    if (currentPrompt === 'ask_ownership_pct') {
      const businessInfo = (workingDataRef.current as any).businessInfo || {};
      const match = text.match(/\d+/);
      if (match) {
        businessInfo.ownershipPercentage = parseInt(match[0]);
        updateAndNext({ businessInfo });
      } else {
        pushAI('Please select an ownership percentage from the options.');
      }
      return;
    }
    
    if (currentPrompt === 'ask_representative') {
      updateAndNext({ representativeName: text });
      return;
    }
    
    if (currentPrompt === 'ask_revenue_tranche') {
      if (lower.includes('under') || (lower.includes('500') && !lower.includes('5m'))) {
        setCurrentPrompt('ask_revenue_precise');
        pushAI('Got it! Can you narrow it down?', ['$100K - $250K', '$250K - $500K']);
      } else if (lower.includes('500k') && lower.includes('5m')) {
        setCurrentPrompt('ask_revenue_precise');
        pushAI('Perfect! Can you narrow it down?', ['$500K - $2M', '$2M - $5M']);
      } else if (lower.includes('5m') && lower.includes('50m')) {
        setCurrentPrompt('ask_revenue_precise');
        pushAI('Excellent! Can you narrow it down?', ['$5M - $20M', '$20M - $50M']);
      } else if (lower.includes('over') || lower.includes('50m')) {
        pushAI('Excellent! High revenue company.');
        updateAndNext({ income: 75000000 });
      } else {
        pushAI('Please select a revenue range from the options above.');
      }
      return;
    }
    
    if (currentPrompt === 'ask_revenue_precise') {
      const match = text.match(/\$?([\d.,]+)\s*([KkMm])?/g);
      if (match && match.length >= 2) {
        const parseAmount = (str: string): number => {
          const num = parseFloat(str.replace(/[^0-9.]/g, ''));
          if (str.toLowerCase().includes('m')) return num * 1000000;
          if (str.toLowerCase().includes('k')) return num * 1000;
          return num;
        };
        const low = parseAmount(match[0]);
        const high = parseAmount(match[1]);
        const midpoint = Math.round((low + high) / 2);
        pushAI(`Got it. Annual revenue ~ $${midpoint.toLocaleString()}.`);
        updateAndNext({ income: midpoint });
      } else {
        pushAI('Please select a range option.');
      }
      return;
    }
    
    if (currentPrompt === 'ask_guarantor_ssn') {
      const digits = lower.replace(/\D/g, '');
      if (digits.length === 9) {
        pushAI('SSN received for personal guarantee.');
        const guarantorInfo = (workingDataRef.current as any).guarantorInfo || {};
        guarantorInfo.ssn = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
        updateAndNext({ guarantorInfo });
      } else {
        pushAI('Please enter exactly 9 digits for your SSN (format: XXX-XX-XXXX).');
      }
      return;
    }
    
    if (currentPrompt === 'ask_guarantor_income') {
      const guarantorInfo = (workingDataRef.current as any).guarantorInfo || {};
      let income = 0;
      if (lower.includes('under') || (lower.includes('75') && !lower.includes('150'))) {
        income = 60000;
      } else if (lower.includes('75') && lower.includes('150')) {
        income = 112500;
      } else if (lower.includes('150') && lower.includes('300')) {
        income = 225000;
      } else if (lower.includes('over') || lower.includes('300')) {
        income = 400000;
      }
      if (income > 0) {
        guarantorInfo.personalIncome = income;
        pushAI(`Personal income noted: $${income.toLocaleString()}.`);
        updateAndNext({ guarantorInfo });
      } else {
        pushAI('Please select from the options.');
      }
      return;
    }
    
    if (currentPrompt === 'ask_guarantor_networth') {
      const guarantorInfo = (workingDataRef.current as any).guarantorInfo || {};
      let networth = 0;
      if (lower.includes('under') || (lower.includes('100') && !lower.includes('500'))) {
        networth = 75000;
      } else if (lower.includes('100') && lower.includes('500')) {
        networth = 300000;
      } else if (lower.includes('500') && lower.includes('1m')) {
        networth = 750000;
      } else if (lower.includes('over') || lower.includes('1m')) {
        networth = 1500000;
      }
      if (networth > 0) {
        guarantorInfo.personalNetWorth = networth;
        pushAI(`Net worth noted: $${networth.toLocaleString()}.`);
        updateAndNext({ guarantorInfo });
      } else {
        pushAI('Please select from the options.');
      }
      return;
    }
    
    if (currentPrompt === 'ask_guarantor_address') {
      const guarantorInfo = (workingDataRef.current as any).guarantorInfo || {};
      guarantorInfo.address = text;
      updateAndNext({ guarantorInfo });
      return;
    }
    
    if (currentPrompt === 'ask_guarantor_license') {
      const guarantorInfo = (workingDataRef.current as any).guarantorInfo || {};
      guarantorInfo.driversLicenseState = text;
      updateAndNext({ guarantorInfo });
      return;
    }
    
    // Offer selection handlers
    if (currentPrompt === 'choose_offer_type') {
      if (lower.includes('financ') && !lower.includes('compare')) {
        (workingDataRef.current as any).selectedOfferType = 'financing';
        setCurrentPrompt('ask_term_length');
        pushAI(`Perfect! What financing term works best for you?`, ['12 months', '24 months', '36 months', '48 months']);
        return;
      }
      if (lower.includes('lease') && !lower.includes('compare')) {
        (workingDataRef.current as any).selectedOfferType = 'lease';
        setCurrentPrompt('ask_term_length');
        pushAI(`Perfect! What lease term works best for you?`, ['12 months', '24 months', '36 months', '48 months']);
        return;
      }
      pushAI('Which option would you like to see?', ['Show me Financing options', 'Show me Lease options']);
      return;
    }
    
    if (currentPrompt === 'ask_term_length') {
      const termMatch = text.match(/\d+/);
      if (termMatch) {
        const term = parseInt(termMatch[0]);
        if ([12, 24, 36, 48].includes(term)) {
          (workingDataRef.current as any).selectedTerm = term;
          const offerType = (workingDataRef.current as any).selectedOfferType || 'financing';
          pushAI(`Perfect! ${term}-month ${offerType} selected. Let me show you your personalized offer...`);
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            proposeSelectedOffer(offerType, term);
          }, 800);
          return;
        }
      }
      pushAI('Please select a term: 12, 24, 36, or 48 months.', ['12 months', '24 months', '36 months', '48 months']);
      return;
    }
    
    // Apply button for business customers
    if (currentPrompt === 'done' && lower.includes('apply')) {
      initiateContractSignature();
      return;
    }
    
    // Contract signature handlers
    if (currentPrompt === 'contract_signature') {
      if (lower.includes('sign') || lower.includes('agree') || lower.includes('accept')) {
        setIsTyping(true);
        setApplicationStep('complete');
        setTimeout(() => {
          setIsTyping(false);
          pushAI('🎉 **Contract signed successfully!**\n\nYour financing application has been submitted. You should receive confirmation within 24-48 hours.\n\nNext steps:\n• We\'ll verify your information\n• Final approval notification\n• Equipment delivery coordination\n\nThank you for choosing us!');
          setCurrentPrompt('done');
        }, 1500);
        return;
      }
      if (lower.includes('payment')) {
        const offer = lastOffer;
        pushAI(`**Payment Terms Explained:**\n\n• Your monthly payment is fixed at $${offer?.estMonthly}\n• Payments are due on the same date each month\n• You can choose auto-pay or manual payment\n• Early payment is allowed without penalty\n• Late payments may incur fees\n\nReady to sign?`, ['Sign contract', 'Ask another question']);
        return;
      }
      if (lower.includes('interest') || lower.includes('apr')) {
        const offer = lastOffer;
        pushAI(`**Interest & APR Explained:**\n\n• Your APR is ${offer?.rate}% - this is your yearly interest rate\n• This rate is fixed for the entire ${offer?.term}-month term\n• Interest is calculated daily on your remaining balance\n\nReady to sign?`, ['Sign contract', 'Ask another question']);
        return;
      }
      pushAI('I\'m here to help. You can ask me to explain any section, or proceed to sign the contract.', ['Sign contract', 'Review clauses']);
      return;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSendMessage(inputValue);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI-Guided Application</h1>
          <p className="text-muted-foreground">Complete your leasing application through conversation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={message.id || index}>
                        {/* Offer Card */}
                        {message.type === 'offer' && message.offerData && (
                          <div className="mb-4">
                            <div className="flex gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <div className="bg-muted text-foreground rounded-2xl p-4 max-w-[80%]">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              </div>
                            </div>
                            <OfferCard {...message.offerData} />
                            {message.suggestions && message.suggestions.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {message.suggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors bg-background"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Contract Card */}
                        {message.type === 'contract' && message.contractData && (
                          <div className="mb-4">
                            <div className="flex gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <div className="bg-muted text-foreground rounded-2xl p-4 max-w-[80%]">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              </div>
                            </div>
                            <ContractCard {...message.contractData} />
                            {message.suggestions && message.suggestions.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {message.suggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors bg-background"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Regular messages */}
                        {message.type !== 'offer' && message.type !== 'contract' && (
                          <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                            {message.type === "ai" && (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-primary-foreground" />
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] rounded-2xl p-4 ${
                                message.type === "ai"
                                  ? "bg-muted text-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              
                              {/* Suggestion buttons for AI messages */}
                              {message.type === "ai" && message.suggestions && message.suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {message.suggestions.map((suggestion, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => handleSendMessage(suggestion)}
                                      className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors bg-background"
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            {message.type === "user" && (
                              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-foreground" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-2xl p-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={() => {
                        if (inputValue.trim()) {
                          handleSendMessage(inputValue);
                        }
                      }} 
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Same as traditional form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 pb-4 border-b border-border">
                    <div className="flex gap-4">
                      <img 
                        src={robotImage} 
                        alt="Humanoid Robot"
                        className="w-20 h-20 object-contain rounded-md bg-muted"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Humanoid Robot F-02</h3>
                        <p className="text-sm text-muted-foreground">SKU: HR-F02-2024</p>
                        <p className="text-sm text-muted-foreground mt-1">Qty: {orderDetails.quantity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 py-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Equipment Lease</span>
                      <span className="font-medium text-foreground">${monthlyRate * orderDetails.quantity}/mo</span>
                    </div>
                    {orderDetails.maintenance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Maintenance Package</span>
                        <span className="font-medium text-foreground">${maintenanceCost}/mo</span>
                      </div>
                    )}
                    {orderDetails.insurance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Insurance Coverage</span>
                        <span className="font-medium text-foreground">${insuranceCost}/mo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Lease Term</span>
                      <span className="font-medium text-foreground">{orderDetails.term} months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Down Payment</span>
                      <span className="font-medium text-foreground">${orderDetails.downPayment}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="font-semibold text-foreground">Total Monthly Payment</span>
                      <span className="font-bold text-xl text-primary">${calculateTotal()}/mo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIApplicationChat;
