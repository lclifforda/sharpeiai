import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, Shield, Clock, Sparkles } from "lucide-react";
import { useBranding } from "@/contexts/BrandingContext";
import { findCompanyByName, findCompanyByRepEmail } from "@/data/mockCompanies";
import { agentAPI } from "@/services/ai/agentAPI";
import { generateCryptoId } from "@/lib/idGenerator";
import { MarkdownText } from "@/components/MarkdownText";
import CompanyRecognitionCard from "@/components/CompanyRecognitionCard";
import { TypingIndicator } from "@/components/chat";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const BankApplicationChat = () => {
  const { logoSrc, branding } = useBranding();
  // ── Form state ──
  const [formData, setFormData] = useState({
    companyName: "",
    representativeName: "",
    email: "",
    mobile: "",
    ein: "",
    businessType: "",
    stateOfIncorporation: "",
    yearsInBusiness: "",
    ownershipPercentage: "",
  });

  // ── Auth state (for CompanyRecognitionCard) ──
  const [authState, setAuthState] = useState<{
    status: "none" | "recognized" | "verified";
  }>({ status: "none" });

  // ── Chat state ──
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your AI financing assistant. I can help answer any questions while you fill out the application. What would you like to know?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(`bank-assistant-${Date.now()}`);

  // Auto-scroll chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ── Form handlers ──
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanyBlur = () => {
    if (authState.status === "verified") return;
    const match = findCompanyByName(formData.companyName);
    if (match) {
      setAuthState({ status: "recognized" });
    } else {
      setAuthState({ status: "none" });
    }
  };

  const handleEmailBlur = () => {
    if (authState.status === "verified") return;
    if (authState.status === "recognized") return;
    const match = findCompanyByRepEmail(formData.email);
    if (match) {
      setAuthState({ status: "recognized" });
    }
  };

  const handleVerified = (data: { companyId: string; company: any; representative: any }) => {
    const { company, representative } = data;
    setFormData((prev) => ({
      ...prev,
      companyName: company.name,
      representativeName: representative.name,
      email: representative.email,
      mobile: representative.phone,
    }));
    setAuthState({ status: "verified" });
  };

  const handleDismissRecognition = () => {
    setAuthState({ status: "none" });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const successMsg: Message = {
      id: generateCryptoId(),
      role: "assistant",
      content:
        "Your application has been submitted successfully! You'll hear back within 24 hours. Feel free to ask me any questions in the meantime.",
    };
    setChatMessages((prev) => [...prev, successMsg]);
  };

  // ── Chat handlers ──
  const handleChatSend = async (message?: string) => {
    const textToSend = message || chatInput.trim();
    if (!textToSend || isChatLoading) return;

    const userMessage: Message = {
      id: generateCryptoId(),
      role: "user",
      content: textToSend,
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const context = {
        currentStep: "bank-application",
        formData: {
          companyName: formData.companyName,
          businessType: formData.businessType,
          stateOfIncorporation: formData.stateOfIncorporation,
        },
      };

      const response = await agentAPI.sendMessage(
        sessionIdRef.current,
        textToSend,
        context
      );

      const aiMessage: Message = {
        id: generateCryptoId(),
        role: "assistant",
        content: response.message,
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI assistant error:", error);
      const errorMessage: Message = {
        id: generateCryptoId(),
        role: "assistant",
        content:
          "I'm having trouble right now. Please try asking your question again, or contact our support team.",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getQuickQuestions = (): string[] => {
    if (isSubmitted) {
      return [
        "What are the next steps?",
        "When will I hear back?",
        "Can I make changes to my application?",
      ];
    }
    return [
      "What information do I need?",
      "How long does approval take?",
      "Is my data secure?",
      "Lease vs Finance - which is better?",
    ];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 rounded-md bg-background flex items-center justify-center border border-border overflow-hidden">
              <img src={logoSrc} alt={branding.companyName || "Company logo"} className="w-full h-full object-contain" />
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div>
              <h2 className="text-sm md:text-base font-semibold text-foreground leading-tight">
                AI-Powered Application
              </h2>
              <p className="text-xs text-muted-foreground">Fast, secure financing decisions</p>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Need help?</p>
            <p className="text-sm font-mono">800-438-1470</p>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card>
        <CardContent className="p-3 md:p-4 grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Bank-Level Security</p>
              <p className="text-[11px] text-muted-foreground">256-bit encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Quick Decisions</p>
              <p className="text-[11px] text-muted-foreground">As fast as 24 hours</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">AI-Assisted</p>
              <p className="text-[11px] text-muted-foreground">Personalized guidance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-side: Form + Chat */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Traditional Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Business Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Business Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    onBlur={handleCompanyBlur}
                    readOnly={authState.status === "verified"}
                    className={authState.status === "verified" ? "bg-muted" : ""}
                    disabled={isSubmitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representativeName">Representative Name *</Label>
                  <Input
                    id="representativeName"
                    placeholder="Full name of representative"
                    value={formData.representativeName}
                    onChange={(e) => handleInputChange("representativeName", e.target.value)}
                    disabled={isSubmitted}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Recognition Card */}
          {authState.status !== "none" && (
            <CompanyRecognitionCard
              companyName={formData.companyName}
              email={formData.email}
              onVerified={handleVerified}
              onDismiss={handleDismissRecognition}
            />
          )}

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={handleEmailBlur}
                    disabled={isSubmitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    disabled={isSubmitted}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Company Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ein">EIN (Employer Identification Number)</Label>
                  <Input
                    id="ein"
                    placeholder="XX-XXXXXXX"
                    value={formData.ein}
                    onChange={(e) => handleInputChange("ein", e.target.value)}
                    disabled={isSubmitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleInputChange("businessType", value)}
                    disabled={isSubmitted}
                  >
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="c_corp">Corporation (C-Corp)</SelectItem>
                      <SelectItem value="s_corp">S-Corporation</SelectItem>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stateOfIncorporation">State of Incorporation</Label>
                  <Input
                    id="stateOfIncorporation"
                    placeholder="e.g. California"
                    value={formData.stateOfIncorporation}
                    onChange={(e) => handleInputChange("stateOfIncorporation", e.target.value)}
                    disabled={isSubmitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness">Years in Business</Label>
                  <Select
                    value={formData.yearsInBusiness}
                    onValueChange={(value) => handleInputChange("yearsInBusiness", value)}
                    disabled={isSubmitted}
                  >
                    <SelectTrigger id="yearsInBusiness">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">Over 10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownershipPercentage">Ownership Percentage</Label>
                  <Select
                    value={formData.ownershipPercentage}
                    onValueChange={(value) => handleInputChange("ownershipPercentage", value)}
                    disabled={isSubmitted}
                  >
                    <SelectTrigger id="ownershipPercentage">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100%</SelectItem>
                      <SelectItem value="51-99">51-99%</SelectItem>
                      <SelectItem value="26-50">26-50%</SelectItem>
                      <SelectItem value="<=25">25% or less</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitted || !formData.companyName || !formData.representativeName || !formData.email || !formData.mobile}
            className="w-full bg-foreground hover:bg-foreground/90 text-background"
            size="lg"
          >
            {isSubmitted ? "Application Submitted" : "Submit Application"}
          </Button>
        </div>

        {/* Right: AI Chat Assistant */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6 border border-border shadow-sm">
            {/* Chat header */}
            <div className="px-4 py-3 bg-muted rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center border border-border">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Application Copilot</p>
                  <p className="text-xs text-muted-foreground">Your AI financing assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Online</span>
              </div>
            </div>

            {/* Messages area */}
            <CardContent className="p-0 bg-background border-t border-border/60">
              <div className="h-[400px] flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="px-4 py-4 space-y-3">
                    {chatMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            m.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <MarkdownText content={m.content} className="text-sm" />
                        </div>
                      </div>
                    ))}
                    {isChatLoading && <TypingIndicator />}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                {/* Quick questions */}
                <div className="border-t border-border bg-muted/40 px-4 py-2">
                  <p className="text-xs text-muted-foreground mb-1.5">Quick questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {getQuickQuestions().map((q) => (
                      <button
                        key={q}
                        onClick={() => handleChatSend(q)}
                        disabled={isChatLoading}
                        className="px-2.5 py-1 text-xs border border-border rounded-full bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input area */}
                <div className="border-t border-border bg-background px-4 py-3 rounded-b-xl">
                  <div className="flex items-center gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSend();
                        }
                      }}
                      placeholder="Ask me anything..."
                      disabled={isChatLoading}
                      className="flex-1 text-sm bg-muted/40 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="shrink-0"
                      disabled={!chatInput.trim() || isChatLoading}
                      onClick={() => handleChatSend()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Encryption disclaimer */}
      <p className="text-[11px] text-muted-foreground text-center">
        Your information is encrypted and secure. We never share your data.
      </p>
    </div>
  );
};

export default BankApplicationChat;
