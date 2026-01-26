import { useState, useRef, useEffect } from "react";
import { MessageSquare, Paperclip, Plus, User, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hard-coded customer data
const EXISTING_CUSTOMER = {
  company_name: "Elaxtik Inc",
  default_email: "finance@elaxtik.com",
  status: "Active customer",
  contact_name: "Sarah Chen",
  active_leases: 3,
  credit_limit: "$500,000"
};

const NEW_CUSTOMER = {
  company_name: "Acme Inc",
  status: "Not found"
};

type FlowType = "unknown" | "existing" | "new";
type StepType = 
  | "welcome" 
  | "ask_company" 
  | "confirm_customer_type"
  | "otp_sent" 
  | "otp_verify" 
  | "authenticated" 
  | "self_serve_menu"
  | "new_lease_flow"
  | "renewal_flow"
  | "return_flow"
  | "onboarding_company"
  | "onboarding_contact"
  | "onboarding_revenue"
  | "onboarding_equipment"
  | "onboarding_complete";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; value: string }[];
  showOTP?: boolean;
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey there! 👋 I'm your Sharpei Leasing Copilot. Ready to help you with equipment financing.\n\nWhat's your company name?"
    }
  ]);
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleCompanyInput = async (companyName: string) => {
    addMessage({ role: "user", content: companyName });
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
      setOnboardingData(prev => ({ ...prev, companyName: "Acme Inc" }));
      setCurrentStep("onboarding_contact");
      addMessage({
        role: "assistant",
        content: "Nice to meet you! 🎉 Acme Inc isn't in our system yet, but that's easy to fix.\n\nLet's get you set up. What's your name and role?"
      });
    } else {
      // Unknown company - ask
      setOnboardingData(prev => ({ ...prev, companyName: companyName.trim() }));
      setCurrentStep("confirm_customer_type");
      addMessage({
        role: "assistant",
        content: `I don't see "${companyName}" in our records. Are you already a Sharpei customer?`,
        actions: [
          { label: "✅ I'm a customer", value: "existing_customer" },
          { label: "🆕 I'm new", value: "new_customer" }
        ]
      });
    }
  };

  const handleCustomerTypeSelection = async (isExisting: boolean) => {
    addMessage({ role: "user", content: isExisting ? "I'm a customer" : "I'm new" });
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
    
    addMessage({ role: "user", content: `Code: ${otpValue}` });
    await simulateTyping(1200);
    
    // Accept any 6-digit code
    setCurrentStep("authenticated");
    addMessage({
      role: "assistant",
      content: `🔒 Verified! Welcome back, ${EXISTING_CUSTOMER.contact_name}.\n\n**Your Account:**\n• Active Leases: ${EXISTING_CUSTOMER.active_leases}\n• Credit Limit: ${EXISTING_CUSTOMER.credit_limit}\n• Status: ${EXISTING_CUSTOMER.status}\n\nWhat would you like to do today?`,
      actions: [
        { label: "📦 New Lease", value: "new_lease" },
        { label: "🔄 Renewal", value: "renewal" },
        { label: "↩️ Return Equipment", value: "return" },
        { label: "💬 Talk to Human", value: "talk_human" }
      ]
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
    
    addMessage({ role: "user", content: actionLabels[action] || action });
    await simulateTyping(1000);

    switch (action) {
      case "new_lease":
        setCurrentStep("new_lease_flow");
        addMessage({
          role: "assistant",
          content: "Great choice! ⚡️ Let's set up a new lease.\n\nWhat equipment are you looking to lease? (e.g., IT hardware, medical devices, vehicles)",
        });
        break;
      case "renewal":
        setCurrentStep("renewal_flow");
        addMessage({
          role: "assistant",
          content: "🔄 You have 3 active leases eligible for renewal:\n\n1. **Dell Servers (x12)** - Expires Feb 2026\n2. **MacBook Pro Fleet (x25)** - Expires Mar 2026\n3. **Medical Imaging Suite** - Expires Apr 2026\n\nWhich one would you like to renew?",
          actions: [
            { label: "Dell Servers", value: "renew_dell" },
            { label: "MacBook Fleet", value: "renew_macbook" },
            { label: "Medical Suite", value: "renew_medical" }
          ]
        });
        break;
      case "return":
        setCurrentStep("return_flow");
        addMessage({
          role: "assistant",
          content: "↩️ Ready to return equipment? Here's your process:\n\n1. Select items to return\n2. Schedule pickup\n3. We inspect & process\n\nI can help you start a return request or schedule a call with our asset team.",
          actions: [
            { label: "Start Return", value: "start_return" },
            { label: "Schedule Call", value: "schedule_call" }
          ]
        });
        break;
      case "talk_human":
        addMessage({
          role: "assistant",
          content: "📞 No problem! Our team is available:\n\n• **Phone:** 1-800-SHARPEI\n• **Email:** support@sharpei.com\n• **Hours:** Mon-Fri 8am-6pm EST\n\nWant me to schedule a callback instead?",
          actions: [
            { label: "📅 Schedule Callback", value: "schedule_callback" },
            { label: "← Back to Menu", value: "back_menu" }
          ]
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
    addMessage({ role: "user", content: value });
    await simulateTyping(800);

    switch (currentStep) {
      case "onboarding_contact":
        setOnboardingData(prev => ({ ...prev, contactName: value }));
        setCurrentStep("onboarding_revenue");
        addMessage({
          role: "assistant",
          content: `Nice to meet you, ${value.split(" ")[0]}! 👋\n\nQuick question: What's your approximate annual revenue? This helps us match you with the right financing options.`,
          actions: [
            { label: "Under $1M", value: "revenue_under_1m" },
            { label: "$1M - $10M", value: "revenue_1m_10m" },
            { label: "$10M - $50M", value: "revenue_10m_50m" },
            { label: "$50M+", value: "revenue_50m_plus" }
          ]
        });
        break;
      case "onboarding_revenue":
        setOnboardingData(prev => ({ ...prev, annualRevenue: value }));
        setCurrentStep("onboarding_equipment");
        addMessage({
          role: "assistant",
          content: "Perfect! Last question: What type of equipment are you looking to lease?\n\nAnd roughly how much are you looking to finance?",
          actions: [
            { label: "IT / Tech", value: "equip_it" },
            { label: "Medical", value: "equip_medical" },
            { label: "Industrial", value: "equip_industrial" },
            { label: "Vehicles", value: "equip_vehicles" }
          ]
        });
        break;
      case "onboarding_equipment":
        setOnboardingData(prev => ({ ...prev, equipmentType: value }));
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
          actions: [
            { label: "📅 Book a Call", value: "book_call" },
            { label: "✉️ I'll Wait for Email", value: "wait_email" }
          ]
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

  const handleActionClick = async (action: { label: string; value: string }) => {
    if (currentStep === "confirm_customer_type") {
      handleCustomerTypeSelection(action.value === "existing_customer");
    } else if (currentStep === "self_serve_menu" || currentStep === "authenticated") {
      handleSelfServeAction(action.value);
    } else if (action.value === "back_menu") {
      addMessage({ role: "user", content: "Back to Menu" });
      await simulateTyping(500);
      addMessage({
        role: "assistant",
        content: "What else can I help you with?",
        actions: [
          { label: "📦 New Lease", value: "new_lease" },
          { label: "🔄 Renewal", value: "renewal" },
          { label: "↩️ Return Equipment", value: "return" },
          { label: "💬 Talk to Human", value: "talk_human" }
        ]
      });
      setCurrentStep("self_serve_menu");
    } else if (action.value === "book_call" || action.value === "schedule_callback" || action.value === "schedule_call") {
      addMessage({ role: "user", content: action.label });
      await simulateTyping(800);
      addMessage({
        role: "assistant",
        content: "📅 Great! I've opened our scheduling tool. Pick a time that works for you:\n\n**Available This Week:**\n• Tomorrow 10am EST\n• Tomorrow 2pm EST\n• Thursday 11am EST\n• Friday 9am EST\n\nOr type a preferred time!",
        actions: [
          { label: "Tomorrow 10am", value: "book_tomorrow_10" },
          { label: "Tomorrow 2pm", value: "book_tomorrow_2" },
          { label: "Thursday 11am", value: "book_thursday" }
        ]
      });
    } else if (action.value.startsWith("book_")) {
      addMessage({ role: "user", content: action.label });
      await simulateTyping(1000);
      addMessage({
        role: "assistant",
        content: `✅ **Call Scheduled!**\n\n📅 ${action.label} EST\n📞 We'll call you at the number on file\n\nYou'll receive a calendar invite shortly. Anything else I can help with?`,
        actions: [
          { label: "← Back to Menu", value: "back_menu" },
          { label: "That's all, thanks!", value: "done" }
        ]
      });
    } else if (action.value === "wait_email") {
      addMessage({ role: "user", content: "I'll wait for email" });
      await simulateTyping(600);
      addMessage({
        role: "assistant",
        content: "Sounds good! 📩 Keep an eye on your inbox. We typically respond within 24 hours.\n\nThanks for choosing Sharpei! Have a great day. 👋"
      });
    } else if (action.value === "done") {
      addMessage({ role: "user", content: "That's all, thanks!" });
      await simulateTyping(600);
      addMessage({
        role: "assistant",
        content: "You're all set! 🎉 Thanks for using Sharpei. Have a great day!\n\n*Chat ended. Refresh to start a new conversation.*"
      });
    } else if (action.value.startsWith("renew_") || action.value.startsWith("equip_") || action.value.startsWith("revenue_")) {
      handleOnboardingInput(action.label);
    } else if (action.value === "start_return") {
      addMessage({ role: "user", content: "Start Return" });
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
      addMessage({ role: "user", content: value });
      simulateTyping(1000).then(() => {
        addMessage({
          role: "assistant",
          content: `Got it - ${value}! 📦\n\nBased on your account history, here are your pre-approved options:\n\n**Option A:** 36-month lease @ $2,450/mo\n**Option B:** 24-month lease @ $3,200/mo\n**Option C:** 48-month lease @ $1,950/mo\n\nAll include standard maintenance. Want me to generate a formal quote?`,
          actions: [
            { label: "Generate Quote", value: "generate_quote" },
            { label: "Adjust Terms", value: "adjust_terms" },
            { label: "← Back", value: "back_menu" }
          ]
        });
      });
    } else {
      // Generic input handling
      addMessage({ role: "user", content: value });
      simulateTyping(800).then(() => {
        addMessage({
          role: "assistant",
          content: "Thanks for that info! Is there anything specific I can help you with?",
          actions: [
            { label: "← Back to Menu", value: "back_menu" }
          ]
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'assistant' 
                      ? 'gradient-sharpei' 
                      : 'bg-muted'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="max-w-[75%] space-y-3">
                    <div className={`${
                      message.role === 'user' 
                        ? 'bg-foreground text-background rounded-2xl rounded-tr-md' 
                        : 'bg-muted rounded-2xl rounded-tl-md'
                    } px-4 py-3`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action)}
                            disabled={isTyping}
                            className="px-3 py-1.5 text-sm border border-border rounded-full hover:bg-accent transition-colors bg-background disabled:opacity-50"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* OTP Input */}
                    {message.showOTP && (
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                        <InputOTP
                          maxLength={6}
                          value={otpValue}
                          onChange={setOtpValue}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        <Button
                          onClick={handleOTPVerification}
                          disabled={otpValue.length !== 6 || isTyping}
                          size="sm"
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-sharpei flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
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
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about equipment financing, risk, contracts, or assets..."
                  disabled={isTyping}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground" 
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-3 rounded-full gradient-sharpei text-white hover:opacity-90 transition-opacity shadow-float disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeasingCopilotChat;
