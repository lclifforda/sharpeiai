import { useState, useRef, useEffect } from "react";
import { Send, Building2, Shield, Sparkles, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import sharpeiLogo from "@/assets/sharpei-logo.png";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={sharpeiLogo} alt="Sharpei" className="h-8" />
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="font-semibold text-foreground">Leasing Copilot</h1>
              <p className="text-xs text-muted-foreground">AI-powered equipment financing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Bank-Level Security</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">$2B+ Financed</span>
          </div>
        </div>

        {/* Chat Card */}
        <Card className="border-2 shadow-lg">
          <CardContent className="p-0">
            {/* Chat Messages */}
            <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                    
                    {/* OTP Input */}
                    {message.showOTP && currentStep === "otp_sent" && (
                      <div className="mt-4 flex flex-col items-center gap-3">
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
                          disabled={otpValue.length !== 6}
                          size="sm"
                        >
                          Verify Code
                        </Button>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 ml-2">
                        {message.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleActionClick(action)}
                            className="text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                🔒 Your data is encrypted and secure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeasingCopilotChat;
