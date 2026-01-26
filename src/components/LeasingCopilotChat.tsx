import { useState, useRef, useEffect } from "react";
import { MessageSquare, Paperclip, Plus, User, ChevronDown, Sparkles, Upload, PlusCircle, RefreshCw, RotateCcw, FileText, Check, Pen, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Hard-coded customer data
const EXISTING_CUSTOMER = {
  company_name: "Elaxtik Inc",
  default_email: "finance@elaxtik.com",
  status: "Active customer",
  contact_name: "Sarah Chen",
  active_leases: 3,
  credit_limit: "$500,000"
};
const LEASED_PRODUCTS = [{
  name: "Dell PowerEdge Servers",
  quantity: 12,
  monthlyRate: "$2,450",
  image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=200&fit=crop",
  expires: "Feb 2026"
}, {
  name: "MacBook Pro Fleet",
  quantity: 25,
  monthlyRate: "$3,200",
  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
  expires: "Mar 2026"
}, {
  name: "Medical Imaging Suite",
  quantity: 1,
  monthlyRate: "$8,500",
  image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&h=200&fit=crop",
  expires: "Apr 2026"
}];
const NEW_CUSTOMER = {
  company_name: "Acme Inc",
  status: "Not found"
};
type FlowType = "unknown" | "existing" | "new";
type StepType = "welcome" | "ask_company" | "confirm_customer_type" | "otp_sent" | "otp_verify" | "authenticated" | "self_serve_menu" | "new_lease_flow" | "renewal_flow" | "return_flow" | "onboarding_company" | "onboarding_contact" | "onboarding_revenue" | "onboarding_equipment" | "onboarding_complete" | "invoice_uploaded" | "term_selection" | "final_offer" | "contract_review" | "contract_signed";

interface ExtractedInvoiceData {
  vendor: string;
  equipment: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  term: number;
  monthlyPayment: number;
}

interface TermOption {
  term: number;
  monthlyPayment: number;
  totalCost: number;
  apr: number;
}

interface SelectedOffer {
  term: number;
  monthlyPayment: number;
  totalCost: number;
  apr: number;
  equipment: string;
  quantity: number;
  totalPrice: number;
  vendor: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: {
    label: string;
    value: string;
  }[];
  showOTP?: boolean;
  showProducts?: boolean;
  showInvoiceUpload?: boolean;
  showExtractedData?: ExtractedInvoiceData;
  showTermOptions?: TermOption[];
  showFinalOffer?: SelectedOffer;
  showContract?: SelectedOffer;
  showSignedContract?: SelectedOffer;
}
interface OnboardingData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  annualRevenue: string;
  yearsInBusiness: string;
  equipmentType: string;
  estimatedValue: string;
}
const LeasingCopilotChat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    role: "assistant",
    content: "Hey there! 👋 I'm your Sharpei Leasing Copilot. Ready to help you with equipment financing.\n\nWhat's your company name?"
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [flowType, setFlowType] = useState<FlowType>("unknown");
  const [currentStep, setCurrentStep] = useState<StepType>("ask_company");
  const [otpValue, setOtpValue] = useState("");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    annualRevenue: "",
    yearsInBusiness: "",
    equipmentType: "",
    estimatedValue: ""
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<SelectedOffer | null>(null);
  const [isSigningContract, setIsSigningContract] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const addMessage = (message: Omit<Message, "id">) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  const simulateTyping = async (delay = 800) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
  };

  // Handle file upload for invoice
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessingFile(true);
    
    addMessage({
      role: "user",
      content: `📄 Uploaded: ${file.name}`
    });
    
    await simulateTyping(2000);
    
    // Simulate extracting data from the PDF
    const mockExtractedData: ExtractedInvoiceData = {
      vendor: "Dell Technologies",
      equipment: "PowerEdge R750 Servers",
      quantity: 8,
      unitPrice: 12500,
      totalPrice: 100000,
      term: 36,
      monthlyPayment: 2950
    };
    
    setExtractedData(mockExtractedData);
    setIsProcessingFile(false);
    setCurrentStep("invoice_uploaded");
    
    addMessage({
      role: "assistant",
      content: "✅ Invoice processed! Here's what I extracted:",
      showExtractedData: mockExtractedData
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleConfirmInvoiceData = async () => {
    if (!extractedData) return;
    
    addMessage({
      role: "user",
      content: "✓ Data looks correct, proceed"
    });
    
    await simulateTyping(1200);
    setCurrentStep("term_selection");
    
    // Generate 3 term options
    const termOptions: TermOption[] = [
      { term: 24, monthlyPayment: 4500, totalCost: 108000, apr: 7.9 },
      { term: 36, monthlyPayment: 2950, totalCost: 106200, apr: 6.9 },
      { term: 48, monthlyPayment: 2350, totalCost: 112800, apr: 8.5 },
    ];
    
    addMessage({
      role: "assistant",
      content: "Based on your profile and equipment value, here are your financing options:",
      showTermOptions: termOptions
    });
  };

  const handleSelectTerm = async (option: TermOption) => {
    if (!extractedData) return;
    
    addMessage({
      role: "user",
      content: `Selected: ${option.term} months @ $${option.monthlyPayment.toLocaleString()}/mo`
    });
    
    await simulateTyping(1000);
    setCurrentStep("final_offer");
    
    const offer: SelectedOffer = {
      term: option.term,
      monthlyPayment: option.monthlyPayment,
      totalCost: option.totalCost,
      apr: option.apr,
      equipment: extractedData.equipment,
      quantity: extractedData.quantity,
      totalPrice: extractedData.totalPrice,
      vendor: extractedData.vendor
    };
    
    setSelectedOffer(offer);
    
    addMessage({
      role: "assistant",
      content: "🎯 Here's your final offer:",
      showFinalOffer: offer
    });
  };

  const handleAcceptOffer = async () => {
    if (!selectedOffer) return;
    
    addMessage({
      role: "user",
      content: "✓ Accept offer"
    });
    
    await simulateTyping(1200);
    setCurrentStep("contract_review");
    
    addMessage({
      role: "assistant",
      content: "📝 Excellent! I've prepared your contract. Sign securely via DocuSign:",
      showContract: selectedOffer
    });
  };

  const handleSignContract = async () => {
    if (!selectedOffer) return;
    
    setIsSigningContract(true);
    await simulateTyping(2000);
    setIsSigningContract(false);
    
    addMessage({
      role: "user",
      content: "✍️ Contract signed via DocuSign"
    });
    
    await simulateTyping(1000);
    setCurrentStep("contract_signed");
    
    addMessage({
      role: "assistant",
      content: "🎉 Contract activated!",
      showSignedContract: selectedOffer
    });
  };

  const handleUpdateContract = async () => {
    addMessage({
      role: "user",
      content: "📝 Request contract update"
    });
    
    await simulateTyping(800);
    
    addMessage({
      role: "assistant",
      content: "No problem! What would you like to change?",
      actions: [
        { label: "Change term length", value: "update_term" },
        { label: "Adjust quantity", value: "update_quantity" },
        { label: "Add maintenance", value: "update_maintenance" },
        { label: "Other changes", value: "update_other" }
      ]
    });
  };
  const handleCompanyInput = async (companyName: string) => {
    addMessage({
      role: "user",
      content: companyName
    });
    await simulateTyping(1000);
    const normalizedName = companyName.trim().toLowerCase();
    if (normalizedName === "elaxtik inc" || normalizedName === "elaxtik") {
      // Existing customer flow
      setFlowType("existing");
      setCurrentStep("otp_sent");
      addMessage({
        role: "assistant",
        content: `✅ Found you! Welcome back, ${EXISTING_CUSTOMER.company_name}.\n\n📩 I just sent a 6-digit code to ${EXISTING_CUSTOMER.default_email}\n\nEnter it below to continue.`,
        showOTP: true
      });
    } else if (normalizedName === "acme inc" || normalizedName === "acme") {
      // New customer flow
      setFlowType("new");
      setOnboardingData(prev => ({
        ...prev,
        companyName: "Acme Inc"
      }));
      setCurrentStep("onboarding_contact");
      addMessage({
        role: "assistant",
        content: "Nice to meet you! 🎉 Acme Inc isn't in our system yet, but that's easy to fix.\n\nLet's get you set up. What's your name and role?"
      });
    } else {
      // Unknown company - ask
      setOnboardingData(prev => ({
        ...prev,
        companyName: companyName.trim()
      }));
      setCurrentStep("confirm_customer_type");
      addMessage({
        role: "assistant",
        content: `I don't see "${companyName}" in our records. Are you already a Sharpei customer?`,
        actions: [{
          label: "✅ I'm a customer",
          value: "existing_customer"
        }, {
          label: "🆕 I'm new",
          value: "new_customer"
        }]
      });
    }
  };
  const handleCustomerTypeSelection = async (isExisting: boolean) => {
    addMessage({
      role: "user",
      content: isExisting ? "I'm a customer" : "I'm new"
    });
    await simulateTyping(800);
    if (isExisting) {
      setFlowType("existing");
      setCurrentStep("otp_sent");
      addMessage({
        role: "assistant",
        content: `Got it! Let me verify your account.\n\n📩 Enter the email on file and I'll send you a verification code.`
      });
      setCurrentStep("otp_sent");
    } else {
      setFlowType("new");
      setCurrentStep("onboarding_contact");
      addMessage({
        role: "assistant",
        content: "Welcome aboard! 🎉 Let's get you set up.\n\nWhat's your name and role at the company?"
      });
    }
  };
  const handleOTPVerification = async () => {
    if (otpValue.length !== 6) return;
    addMessage({
      role: "user",
      content: `Code: ${otpValue}`
    });
    await simulateTyping(1200);

    // Accept any 6-digit code
    setCurrentStep("authenticated");
    addMessage({
      role: "assistant",
      content: `🔒 Verified. Welcome back, ${EXISTING_CUSTOMER.contact_name}.`,
      showProducts: true
    });
    setCurrentStep("self_serve_menu");
    setOtpValue("");
  };
  const handleSelfServeAction = async (action: string) => {
    const actionLabels: Record<string, string> = {
      new_lease: "New Lease",
      renewal: "Renewal",
      return: "Return Equipment",
      talk_human: "Talk to Human"
    };
    addMessage({
      role: "user",
      content: actionLabels[action] || action
    });
    await simulateTyping(1000);
    switch (action) {
      case "new_lease":
        setCurrentStep("new_lease_flow");
        addMessage({
          role: "assistant",
          content: "Great choice! ⚡️ Let's set up a new lease.\n\nWhat equipment are you looking to lease? (e.g., IT hardware, medical devices, vehicles)"
        });
        break;
      case "renewal":
        setCurrentStep("renewal_flow");
        addMessage({
          role: "assistant",
          content: "🔄 You have 3 active leases eligible for renewal:\n\n1. **Dell Servers (x12)** - Expires Feb 2026\n2. **MacBook Pro Fleet (x25)** - Expires Mar 2026\n3. **Medical Imaging Suite** - Expires Apr 2026\n\nWhich one would you like to renew?",
          actions: [{
            label: "Dell Servers",
            value: "renew_dell"
          }, {
            label: "MacBook Fleet",
            value: "renew_macbook"
          }, {
            label: "Medical Suite",
            value: "renew_medical"
          }]
        });
        break;
      case "return":
        setCurrentStep("return_flow");
        addMessage({
          role: "assistant",
          content: "↩️ Ready to return equipment? Here's your process:\n\n1. Select items to return\n2. Schedule pickup\n3. We inspect & process\n\nI can help you start a return request or schedule a call with our asset team.",
          actions: [{
            label: "Start Return",
            value: "start_return"
          }, {
            label: "Schedule Call",
            value: "schedule_call"
          }]
        });
        break;
      case "talk_human":
        addMessage({
          role: "assistant",
          content: "📞 No problem! Our team is available:\n\n• **Phone:** 1-800-SHARPEI\n• **Email:** support@sharpei.com\n• **Hours:** Mon-Fri 8am-6pm EST\n\nWant me to schedule a callback instead?",
          actions: [{
            label: "📅 Schedule Callback",
            value: "schedule_callback"
          }, {
            label: "← Back to Menu",
            value: "back_menu"
          }]
        });
        break;
      default:
        addMessage({
          role: "assistant",
          content: "Got it! Let me help you with that. What specific details can you share?"
        });
    }
  };
  const handleOnboardingInput = async (value: string) => {
    addMessage({
      role: "user",
      content: value
    });
    await simulateTyping(800);
    switch (currentStep) {
      case "onboarding_contact":
        setOnboardingData(prev => ({
          ...prev,
          contactName: value
        }));
        setCurrentStep("onboarding_revenue");
        addMessage({
          role: "assistant",
          content: `Nice to meet you, ${value.split(" ")[0]}! 👋\n\nQuick question: What's your approximate annual revenue? This helps us match you with the right financing options.`,
          actions: [{
            label: "Under $1M",
            value: "revenue_under_1m"
          }, {
            label: "$1M - $10M",
            value: "revenue_1m_10m"
          }, {
            label: "$10M - $50M",
            value: "revenue_10m_50m"
          }, {
            label: "$50M+",
            value: "revenue_50m_plus"
          }]
        });
        break;
      case "onboarding_revenue":
        setOnboardingData(prev => ({
          ...prev,
          annualRevenue: value
        }));
        setCurrentStep("onboarding_equipment");
        addMessage({
          role: "assistant",
          content: "Perfect! Last question: What type of equipment are you looking to lease?\n\nAnd roughly how much are you looking to finance?",
          actions: [{
            label: "IT / Tech",
            value: "equip_it"
          }, {
            label: "Medical",
            value: "equip_medical"
          }, {
            label: "Industrial",
            value: "equip_industrial"
          }, {
            label: "Vehicles",
            value: "equip_vehicles"
          }]
        });
        break;
      case "onboarding_equipment":
        setOnboardingData(prev => ({
          ...prev,
          equipmentType: value
        }));
        setCurrentStep("onboarding_complete");

        // Show summary
        const summary = `
✅ **Application Received!**

Here's what we have:
• **Company:** ${onboardingData.companyName}
• **Contact:** ${onboardingData.contactName}
• **Revenue:** ${onboardingData.annualRevenue || value}
• **Equipment Interest:** ${value}

**What's Next:**
Our team will review your info and reach out within 24 hours with financing options tailored to your business.

Want to schedule a call now to discuss your needs?`;
        addMessage({
          role: "assistant",
          content: summary,
          actions: [{
            label: "📅 Book a Call",
            value: "book_call"
          }, {
            label: "✉️ I'll Wait for Email",
            value: "wait_email"
          }]
        });
        break;
      default:
        // Generic response for other inputs
        addMessage({
          role: "assistant",
          content: "Thanks for that info! Let me process this..."
        });
    }
  };
  const handleActionClick = async (action: {
    label: string;
    value: string;
  }) => {
    if (currentStep === "confirm_customer_type") {
      handleCustomerTypeSelection(action.value === "existing_customer");
    } else if (currentStep === "self_serve_menu" || currentStep === "authenticated") {
      handleSelfServeAction(action.value);
    } else if (action.value === "back_menu") {
      addMessage({
        role: "user",
        content: "Back to Menu"
      });
      await simulateTyping(500);
      addMessage({
        role: "assistant",
        content: "What else can I help you with?",
        actions: [{
          label: "📦 New Lease",
          value: "new_lease"
        }, {
          label: "🔄 Renewal",
          value: "renewal"
        }, {
          label: "↩️ Return Equipment",
          value: "return"
        }, {
          label: "💬 Talk to Human",
          value: "talk_human"
        }]
      });
      setCurrentStep("self_serve_menu");
    } else if (action.value === "book_call" || action.value === "schedule_callback" || action.value === "schedule_call") {
      addMessage({
        role: "user",
        content: action.label
      });
      await simulateTyping(800);
      addMessage({
        role: "assistant",
        content: "📅 Great! I've opened our scheduling tool. Pick a time that works for you:\n\n**Available This Week:**\n• Tomorrow 10am EST\n• Tomorrow 2pm EST\n• Thursday 11am EST\n• Friday 9am EST\n\nOr type a preferred time!",
        actions: [{
          label: "Tomorrow 10am",
          value: "book_tomorrow_10"
        }, {
          label: "Tomorrow 2pm",
          value: "book_tomorrow_2"
        }, {
          label: "Thursday 11am",
          value: "book_thursday"
        }]
      });
    } else if (action.value.startsWith("book_")) {
      addMessage({
        role: "user",
        content: action.label
      });
      await simulateTyping(1000);
      addMessage({
        role: "assistant",
        content: `✅ **Call Scheduled!**\n\n📅 ${action.label} EST\n📞 We'll call you at the number on file\n\nYou'll receive a calendar invite shortly. Anything else I can help with?`,
        actions: [{
          label: "← Back to Menu",
          value: "back_menu"
        }, {
          label: "That's all, thanks!",
          value: "done"
        }]
      });
    } else if (action.value === "wait_email") {
      addMessage({
        role: "user",
        content: "I'll wait for email"
      });
      await simulateTyping(600);
      addMessage({
        role: "assistant",
        content: "Sounds good! 📩 Keep an eye on your inbox. We typically respond within 24 hours.\n\nThanks for choosing Sharpei! Have a great day. 👋"
      });
    } else if (action.value === "done") {
      addMessage({
        role: "user",
        content: "That's all, thanks!"
      });
      await simulateTyping(600);
      addMessage({
        role: "assistant",
        content: "You're all set! 🎉 Thanks for using Sharpei. Have a great day!\n\n*Chat ended. Refresh to start a new conversation.*"
      });
    } else if (action.value.startsWith("renew_") || action.value.startsWith("equip_") || action.value.startsWith("revenue_")) {
      handleOnboardingInput(action.label);
    } else if (action.value === "start_return") {
      addMessage({
        role: "user",
        content: "Start Return"
      });
      await simulateTyping(800);
      addMessage({
        role: "assistant",
        content: "📋 **Return Request Started**\n\nI'll need a few details:\n\n1. Which lease/equipment are you returning?\n2. Preferred pickup date?\n3. Any condition notes?\n\nLet's start with the equipment - what are you returning?"
      });
    } else {
      handleOnboardingInput(action.label);
    }
  };
  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const value = input.trim();
    setInput("");
    if (currentStep === "ask_company") {
      handleCompanyInput(value);
    } else if (currentStep === "onboarding_contact" || currentStep === "onboarding_revenue" || currentStep === "onboarding_equipment") {
      handleOnboardingInput(value);
    } else if (flowType === "existing" && currentStep === "new_lease_flow") {
      // Handle new lease equipment input
      addMessage({
        role: "user",
        content: value
      });
      simulateTyping(1000).then(() => {
        addMessage({
          role: "assistant",
          content: `Got it - ${value}! 📦\n\nBased on your account history, here are your pre-approved options:\n\n**Option A:** 36-month lease @ $2,450/mo\n**Option B:** 24-month lease @ $3,200/mo\n**Option C:** 48-month lease @ $1,950/mo\n\nAll include standard maintenance. Want me to generate a formal quote?`,
          actions: [{
            label: "Generate Quote",
            value: "generate_quote"
          }, {
            label: "Adjust Terms",
            value: "adjust_terms"
          }, {
            label: "← Back",
            value: "back_menu"
          }]
        });
      });
    } else {
      // Generic input handling
      addMessage({
        role: "user",
        content: value
      });
      simulateTyping(800).then(() => {
        addMessage({
          role: "assistant",
          content: "Thanks for that info! Is there anything specific I can help you with?",
          actions: [{
            label: "← Back to Menu",
            value: "back_menu"
          }]
        });
      });
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col px-6 py-8">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          {/* Chat Header with Mini Orb */}
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full gradient-sharpei opacity-30 blur-md" />
              <div className="relative w-full h-full rounded-full gradient-sharpei shadow-lg flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-medium text-foreground">Sharpei AI</h2>
              <p className="text-xs text-muted-foreground">Equipment financing copilot</p>
            </div>
            
            {/* Quick Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quick Actions
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleSelfServeAction('new_lease')} className="gap-2">
                  📦 New Lease
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSelfServeAction('renewal')} className="gap-2">
                  🔄 Renewal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSelfServeAction('return')} className="gap-2">
                  ↩️ Return Equipment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSelfServeAction('talk_human')} className="gap-2">
                  💬 Talk to Human
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-6 pb-4">
              {messages.map(message => <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'assistant' ? 'gradient-sharpei' : 'bg-muted'}`}>
                    {message.role === 'assistant' ? <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" /> : <User className="w-4 h-4 text-muted-foreground" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="max-w-[75%] space-y-3">
                    <div className={`${message.role === 'user' ? 'bg-foreground text-background rounded-2xl rounded-tr-md' : 'bg-muted rounded-2xl rounded-tl-md'} px-4 py-3`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0}

                    {/* OTP Input */}
                    {message.showOTP && <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                        <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        <Button onClick={handleOTPVerification} disabled={otpValue.length !== 6 || isTyping} size="sm">
                          Verify
                        </Button>
                      </div>}

                    {/* Currently Leasing Products - Enhanced UX */}
                    {message.showProducts && <div className="mt-4 space-y-5">
                        {/* Company Header */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Company:</span>
                          <span className="text-sm font-semibold text-foreground">{EXISTING_CUSTOMER.company_name}</span>
                        </div>

                        {/* Active Leases Section */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">Active Leases</h4>
                            <p className="text-xs text-muted-foreground">Manage your existing contracts:</p>
                          </div>
                          
                          <div className="space-y-3">
                            {LEASED_PRODUCTS.map((product, idx) => <div key={idx} className="bg-background border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                                <div className="flex gap-4">
                                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground">{product.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {product.quantity} units · {product.monthlyRate}/mo · Expires {product.expires}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => handleSelfServeAction("new_lease")}>
                                        <PlusCircle className="w-3.5 h-3.5" />
                                        Add more units
                                      </Button>
                                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => handleSelfServeAction("renewal")}>
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Extend lease
                                      </Button>
                                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => handleSelfServeAction("return")}>
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Return
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>)}
                          </div>
                        </div>

                        {/* Lease New Equipment Section */}
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">Lease New Equipment</h4>
                            <p className="text-xs text-muted-foreground">Upload a proforma invoice and provider details.</p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          <Button 
                            variant="outline" 
                            className="w-full h-12 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 gap-2" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessingFile}
                          >
                            {isProcessingFile ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Upload Invoice</span>
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">
                            We'll automatically extract asset and pricing information for you.
                          </p>
                        </div>
                      </div>}

                    {/* Extracted Invoice Data */}
                    {message.showExtractedData && (
                      <div className="mt-4 space-y-4">
                        <div className="bg-background border border-border rounded-xl overflow-hidden">
                          <div className="bg-success/10 border-b border-success/20 px-4 py-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-success" />
                            <span className="text-sm font-semibold text-success">Extracted Invoice Data</span>
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-muted-foreground text-xs">Vendor</span>
                                <p className="font-medium text-foreground">{message.showExtractedData.vendor}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Equipment</span>
                                <p className="font-medium text-foreground">{message.showExtractedData.equipment}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Quantity</span>
                                <p className="font-medium text-foreground">{message.showExtractedData.quantity} units</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Unit Price</span>
                                <p className="font-medium text-foreground">${message.showExtractedData.unitPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Total Value</span>
                                <p className="font-semibold text-foreground">${message.showExtractedData.totalPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Lease Term</span>
                                <p className="font-medium text-foreground">{message.showExtractedData.term} months</p>
                              </div>
                            </div>
                            <div className="bg-primary/10 rounded-lg p-3 text-center">
                              <span className="text-xs text-muted-foreground">Estimated Monthly Payment</span>
                              <p className="text-xl font-bold text-primary">${message.showExtractedData.monthlyPayment.toLocaleString()}/mo</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleConfirmInvoiceData} 
                            className="flex-1 gap-2"
                            disabled={isTyping}
                          >
                            <Check className="w-4 h-4" />
                            Data looks correct
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Re-upload
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Term Selection Options */}
                    {message.showTermOptions && (
                      <div className="mt-4 space-y-3">
                        <div className="grid gap-3">
                          {message.showTermOptions.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectTerm(option)}
                              className="bg-background border-2 border-border hover:border-primary/50 rounded-xl p-4 text-left transition-all hover:shadow-md group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary">{option.term}</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">{option.term} months</p>
                                    <p className="text-xs text-muted-foreground">{option.apr}% APR</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-foreground">${option.monthlyPayment.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                                  <p className="text-xs text-muted-foreground">Total: ${option.totalCost.toLocaleString()}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          Select a term that works best for your business
                        </p>
                      </div>
                    )}

                    {/* Final Offer */}
                    {message.showFinalOffer && (
                      <div className="mt-4 space-y-4">
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl overflow-hidden">
                          <div className="bg-primary/20 px-4 py-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">Your Final Offer</span>
                          </div>
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-muted-foreground text-xs">Equipment</span>
                                <p className="font-medium text-foreground">{message.showFinalOffer.equipment}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Quantity</span>
                                <p className="font-medium text-foreground">{message.showFinalOffer.quantity} units</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Total Value</span>
                                <p className="font-medium text-foreground">${message.showFinalOffer.totalPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Term</span>
                                <p className="font-medium text-foreground">{message.showFinalOffer.term} months @ {message.showFinalOffer.apr}% APR</p>
                              </div>
                            </div>
                            <div className="bg-primary/10 rounded-lg p-4 text-center">
                              <span className="text-xs text-muted-foreground">Your Monthly Payment</span>
                              <p className="text-2xl font-bold text-primary">${message.showFinalOffer.monthlyPayment.toLocaleString()}<span className="text-base font-normal">/mo</span></p>
                              <p className="text-xs text-muted-foreground mt-1">Total cost: ${message.showFinalOffer.totalCost.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleAcceptOffer}
                            className="flex-1 gap-2 bg-success hover:bg-success/90"
                            disabled={isTyping}
                          >
                            <Check className="w-4 h-4" />
                            Accept Offer
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={handleUpdateContract}
                            className="gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Adjust Terms
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Contract Review with DocuSign */}
                    {message.showContract && (
                      <div className="mt-4 space-y-4">
                        <div className="bg-background border-2 border-primary/30 rounded-xl overflow-hidden">
                          {/* DocuSign Header */}
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                                <Pen className="w-3 h-3 text-blue-600" />
                              </div>
                              <span className="text-sm font-semibold text-white">DocuSign</span>
                            </div>
                            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">Awaiting Signature</span>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            {/* Contract Parties */}
                            <div className="grid grid-cols-2 gap-3 text-sm border-b border-border pb-3">
                              <div>
                                <span className="text-muted-foreground text-xs">Lessor</span>
                                <p className="font-medium text-foreground">Sharpei Financial Services</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Lessee</span>
                                <p className="font-medium text-foreground">{EXISTING_CUSTOMER.company_name}</p>
                              </div>
                            </div>
                            
                            {/* Contract Details */}
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Equipment</span>
                                <span className="font-medium text-foreground">{message.showContract.equipment}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Quantity</span>
                                <span className="font-medium text-foreground">{message.showContract.quantity} units</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Total Value</span>
                                <span className="font-medium text-foreground">${message.showContract.totalPrice.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Lease Term</span>
                                <span className="font-medium text-foreground">{message.showContract.term} months @ {message.showContract.apr}% APR</span>
                              </div>
                              <div className="flex justify-between py-1 border-t border-border pt-2">
                                <span className="text-muted-foreground font-medium">Monthly Payment</span>
                                <span className="font-bold text-primary">${message.showContract.monthlyPayment.toLocaleString()}/mo</span>
                              </div>
                            </div>

                            {/* Key Terms */}
                            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-xs">
                              <p className="font-semibold text-foreground">Key Terms:</p>
                              <ul className="space-y-1 text-muted-foreground">
                                <li>• Payment due on 1st of each month</li>
                                <li>• Equipment maintenance included</li>
                                <li>• End-of-term purchase option at 10% residual</li>
                                <li>• 30-day early termination notice required</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSignContract}
                            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                            disabled={isSigningContract || isTyping}
                          >
                            {isSigningContract ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Signing via DocuSign...
                              </>
                            ) : (
                              <>
                                <Pen className="w-4 h-4" />
                                Sign with DocuSign
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={handleUpdateContract}
                            className="gap-2"
                            disabled={isTyping}
                          >
                            <X className="w-4 h-4" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Signed Contract - Contract Activated */}
                    {message.showSignedContract && (
                      <div className="mt-4 space-y-4">
                        <div className="bg-success/10 border-2 border-success/30 rounded-xl p-5 space-y-4">
                          <div className="text-center space-y-2">
                            <div className="w-14 h-14 bg-success rounded-full flex items-center justify-center mx-auto">
                              <Check className="w-7 h-7 text-success-foreground" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-foreground">Contract Activated! 🎉</h4>
                              <p className="text-sm text-muted-foreground mt-1">Contract #SHP-2026-00847</p>
                            </div>
                          </div>
                          
                          <div className="bg-background rounded-lg p-4 text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Equipment</span>
                              <span className="font-medium text-foreground">{message.showSignedContract.equipment}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Quantity</span>
                              <span className="font-medium text-foreground">{message.showSignedContract.quantity} units</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Monthly Payment</span>
                              <span className="font-bold text-success">${message.showSignedContract.monthlyPayment.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">First Payment Due</span>
                              <span className="font-medium text-foreground">Feb 1, 2026</span>
                            </div>
                          </div>

                          {/* Merchant Shipping Notice */}
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">Next Steps</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  We've notified <strong>{message.showSignedContract.vendor}</strong> to ship your equipment ASAP. 
                                  You'll receive tracking information within 24-48 hours.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 gap-2">
                            <FileText className="w-4 h-4" />
                            Download Contract
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={handleUpdateContract}
                            className="gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Need Changes?
                          </Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          📧 A copy has been sent to {EXISTING_CUSTOMER.default_email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>)}

              {/* Typing Indicator */}
              {isTyping && <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-sharpei flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{
                    animationDelay: '0ms'
                  }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{
                    animationDelay: '150ms'
                  }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{
                    animationDelay: '300ms'
                  }} />
                    </div>
                  </div>
                </div>}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Floating Chat Input */}
          <div className="w-full max-w-3xl mx-auto mt-6">
            <div className="relative">
              <div className="flex items-center gap-3 p-2 bg-white rounded-full border border-border shadow-float-lg hover:shadow-float transition-all duration-300">
                <button className="p-3 hover:bg-muted/50 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 hover:bg-muted/50 rounded-full transition-colors">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">Sources</span>
                </button>
                <Input value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask me anything about equipment financing, risk, contracts, or assets..." disabled={isTyping} className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground" />
                <button onClick={handleSend} disabled={!input.trim() || isTyping} className="p-3 rounded-full gradient-sharpei text-white hover:opacity-90 transition-opacity shadow-float disabled:opacity-50 disabled:cursor-not-allowed">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default LeasingCopilotChat;