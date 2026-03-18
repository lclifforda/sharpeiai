import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useAiAgent } from "@/hooks/useAiAgent";
import { agentAPI } from "@/services/ai/agentAPI";
import { generateCryptoId } from "@/lib/idGenerator";
import { getEnabledDocuments } from "@/services/platformConfigMockData";
import { processDocumentOCR } from "@/services/documentOCR";
import { checkQualification } from "@/lib/qualificationCheck";
import { simulateResiduals } from "@/services/ai/offerEngine";
import {
  findCompanyByName,
  maskEmail,
  DEMO_BUSINESS_DATA,
  type CompanyDetail,
  type Representative,
} from "@/data/mockCompanies";

import type { ChatMessage, ChatPhase, FormSectionData, DocumentVerificationResult } from "./helpers";
import { computeMonthly } from "./helpers";
import {
  type ChatSectionId,
  type ResolvedSection,
  getSectionsForFlow,
  isSectionComplete,
} from "./chatSectionConfig";

// ── Config ───────────────────────────────────────────────────────────────

export interface ChatStateMachineConfig {
  flowType: "merchant" | "bank";
  applicationType: string;
  orderDetails?: {
    quantity: number;
    maintenance: boolean;
    insurance: boolean;
    term: number;
    downPayment: number;
  } | null;
  cartTotal?: number;
  cartItems?: { name: string; price: number }[];
}

// ── Auth sub-phase ───────────────────────────────────────────────────────

type AuthSubPhase = "recognized" | "rep_select" | "otp";

// ── Return type ──────────────────────────────────────────────────────────

export interface ChatStateMachineReturn {
  messages: ChatMessage[];
  phase: ChatPhase;
  currentSection: ResolvedSection | null;
  formData: Record<string, string>;
  isTyping: boolean;
  inputValue: string;
  setInputValue: (v: string) => void;

  handleUserMessage: (text: string) => Promise<void>;
  handleSectionSubmit: (sectionId: ChatSectionId, values: Record<string, string>) => void;
  handleFileUpload: (docId: string, file: File | null) => Promise<void>;
  handleRemoveFile: (docId: string) => void;

  uploadedDocs: Record<string, File | null>;
  documentVerification: Record<string, { status: string; extractedData?: any; verificationNotes?: string[] }>;
  uploadAttempts: Record<string, number>;
  requiredDocuments: ReturnType<typeof getEnabledDocuments>;

  // Resolved application type (may be set conversationally in bank flow)
  applicationType: string;

  // Merchant-specific
  lastOffer: { lender: string; rate: number; term: number; down: number; estMonthly: number } | null;
  applicationStep: string;
}

// ── Hook ─────────────────────────────────────────────────────────────────

export function useChatStateMachine(config: ChatStateMachineConfig): ChatStateMachineReturn {
  const { flowType, applicationType: configApplicationType, orderDetails, cartTotal = 0, cartItems = [] } = config;

  // Bank flow: applicationType can be set conversationally, overriding the prop
  const [applicationTypeOverride, setApplicationTypeOverride] = useState<string | null>(null);
  const applicationType = applicationTypeOverride || configApplicationType;

  const [sessionId] = useState(() => `session-${Date.now()}`);
  const { sendMessage, isLoading } = useAiAgent(sessionId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<ChatPhase>("greeting");
  const [authSubPhase, setAuthSubPhase] = useState<AuthSubPhase>("recognized");
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Form data (flat key-value)
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    // Merchant: pre-fill equipmentCost from cart
    if (flowType === "merchant" && cartTotal > 0) {
      initial.equipmentCost = String(cartTotal);
    }
    return initial;
  });

  // Section tracking
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const equipmentValueRef = useRef(0);

  // Company auth refs
  const matchedCompanyRef = useRef<{ id: string; company: CompanyDetail } | null>(null);
  const selectedRepRef = useRef<Representative | null>(null);

  // Documents
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({});
  const [documentVerification, setDocumentVerification] = useState<Record<string, DocumentVerificationResult>>({});
  const [uploadAttempts, setUploadAttempts] = useState<Record<string, number>>({});
  const requiredDocuments = useMemo(() => getEnabledDocuments(applicationType), [applicationType]);

  // Merchant offer state
  const [lastOffer, setLastOffer] = useState<ChatStateMachineReturn["lastOffer"]>(null);
  const [applicationStep, setApplicationStep] = useState("info");
  const [offerSubPhase, setOfferSubPhase] = useState<"choose_type" | "choose_term" | "display" | "ready_for_docs">("choose_type");

  // ── Computed sections ──────────────────────────────────────────────────

  const sections = useMemo(
    () => getSectionsForFlow(flowType, applicationType, formData, equipmentValueRef.current),
    // Re-derive when formData changes (guarantor might appear/disappear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flowType, applicationType, formData]
  );

  const currentSection = activeSectionIndex < sections.length ? sections[activeSectionIndex] : null;

  // ── Helpers ────────────────────────────────────────────────────────────

  const pushMessage = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const message: ChatMessage = {
      ...msg,
      id: generateCryptoId(),
      timestamp: new Date(),
    } as ChatMessage;
    setMessages((prev) => {
      // Prevent duplicate consecutive AI messages
      const last = prev[prev.length - 1];
      if (last && last.type === "ai" && msg.type === "ai" && last.content === msg.content) return prev;
      return [...prev, message];
    });
  }, []);

  const pushAI = useCallback(
    (content: string, suggestions?: string[]) => {
      pushMessage({ type: "ai", content, suggestions });
    },
    [pushMessage]
  );

  const pushFormSection = useCallback(
    (section: ResolvedSection, initialValues: Record<string, string>, submitted: boolean, stepLabel: string) => {
      const formSectionData: FormSectionData = {
        sectionId: section.section.id,
        title: section.section.title,
        fields: section.fields,
        initialValues,
        isSubmitted: submitted,
        submittedValues: submitted ? initialValues : undefined,
        stepLabel,
      };
      pushMessage({
        type: "form_section",
        content: section.section.title,
        formSectionData,
      });
    },
    [pushMessage]
  );

  const markFormSectionSubmitted = useCallback((sectionId: ChatSectionId, values: Record<string, string>) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.type === "form_section" && m.formSectionData?.sectionId === sectionId) {
          return {
            ...m,
            formSectionData: {
              ...m.formSectionData!,
              isSubmitted: true,
              submittedValues: values,
            },
          };
        }
        return m;
      })
    );
  }, []);

  // ── Scroll to bottom ──────────────────────────────────────────────────

  // (Parent component handles scroll via messagesEndRef)

  // ── Init: greeting ─────────────────────────────────────────────────────

  useEffect(() => {
    if (flowType === "merchant") {
      pushAI(`Hi! I'm your AI lending assistant. I'll guide you through your application.\n\nI'll present a few short forms — fill them in and click **Continue**. You can ask me questions at any time.\n\nLet's get started!`);
      setTimeout(() => {
        setPhase("company_name");
        pushAI("What's your company name?");
      }, 800);
    } else {
      // Bank flow: ask financing type first
      pushAI("Hi! I'm your AI lending assistant. I'll guide you through your financing application.\n\nI'll present a few short forms — fill them in and click **Continue**. You can ask me questions at any time.");
      setTimeout(() => {
        setPhase("financing_type");
        pushAI("What type of financing are you looking for?", [
          "Equipment Financing",
          "Equipment Leasing",
          "Working Capital",
        ]);
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Section progression ────────────────────────────────────────────────

  const advanceToSection = useCallback(
    (startIndex: number, currentFormData: Record<string, string>) => {
      // Re-derive sections with latest formData (guarantor might now be needed)
      const latestSections = getSectionsForFlow(flowType, applicationType, currentFormData, equipmentValueRef.current);
      const totalSections = latestSections.length;

      for (let i = startIndex; i < totalSections; i++) {
        const s = latestSections[i];
        const stepLabel = `Step ${i + 1} of ${totalSections}`;
        const sectionInitialValues: Record<string, string> = {};
        for (const f of s.fields) {
          if (currentFormData[f.id]) sectionInitialValues[f.id] = currentFormData[f.id];
        }

        const complete = isSectionComplete(s.fields, currentFormData);

        // Run qualification gate even for pre-filled (complete) sections
        if (complete && s.section.qualificationGate) {
          const qualData: any = {};
          if (currentFormData.dateEstablished) qualData.dateEstablished = currentFormData.dateEstablished;
          if (currentFormData.annualRevenue) qualData.annualRevenue = parseFloat(currentFormData.annualRevenue);
          if (currentFormData.requestedAmount) qualData.requestedAmount = parseFloat(currentFormData.requestedAmount);
          if (currentFormData.equipmentCost) qualData.equipmentCost = parseFloat(currentFormData.equipmentCost);

          const result = checkQualification(qualData);
          if (!result.qualified) {
            // Show this section as submitted summary, then disqualify
            pushFormSection(s, sectionInitialValues, true, stepLabel);
            setPhase("disqualified");
            pushMessage({
              type: "disqualified",
              content: result.reason || "Your application does not meet our current criteria.",
            });
            return;
          }
        }

        if (complete) {
          // Show as already-submitted summary
          pushFormSection(s, sectionInitialValues, true, stepLabel);
          continue;
        }

        // Show as editable form card
        pushAI(s.section.intro);
        pushFormSection(s, sectionInitialValues, false, stepLabel);
        setActiveSectionIndex(i);
        setPhase("section_form");
        return;
      }

      // All sections complete → documents
      pushAI("All information collected! Now I need a few documents to complete your application.");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        initiateDocumentUpload();
      }, 800);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flowType, applicationType, pushAI, pushFormSection, pushMessage]
  );

  // ── Handle section form submit ─────────────────────────────────────────

  const handleSectionSubmit = useCallback(
    (sectionId: ChatSectionId, values: Record<string, string>) => {
      // Merge into form data
      const merged = { ...formData, ...values };
      setFormData(merged);

      // Track equipment value
      if (values.equipmentValue) {
        equipmentValueRef.current = parseFloat(values.equipmentValue) || 0;
      }
      if (values.equipmentCost) {
        const cost = parseFloat(values.equipmentCost) || 0;
        if (cost > equipmentValueRef.current) equipmentValueRef.current = cost;
      }

      // Mark the form card as submitted
      markFormSectionSubmitted(sectionId, values);

      // Run qualification gate if applicable
      const currentSec = sections.find((s) => s.section.id === sectionId);
      if (currentSec?.section.qualificationGate) {
        const qualData: any = {};
        if (merged.dateEstablished) qualData.dateEstablished = merged.dateEstablished;
        if (merged.annualRevenue) qualData.annualRevenue = parseFloat(merged.annualRevenue);
        if (merged.requestedAmount) qualData.requestedAmount = parseFloat(merged.requestedAmount);
        if (merged.equipmentCost) qualData.equipmentCost = parseFloat(merged.equipmentCost);

        const result = checkQualification(qualData);
        if (!result.qualified) {
          setPhase("disqualified");
          pushMessage({
            type: "disqualified",
            content: result.reason || "Your application does not meet our current criteria.",
          });
          return;
        }
      }

      // Advance to next section
      const currentIndex = sections.findIndex((s) => s.section.id === sectionId);
      advanceToSection(currentIndex + 1, merged);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData, sections, markFormSectionSubmitted, advanceToSection, pushMessage]
  );

  // ── Document upload ────────────────────────────────────────────────────

  const initiateDocumentUpload = useCallback(() => {
    setPhase("document_upload");
    setApplicationStep("documents");
    pushMessage({
      type: "document_upload",
      content: "Please upload the required documents below. You can upload them one by one.",
      suggestions: flowType === "merchant" ? ["Continue to contract", "What documents do I need?"] : ["Submit application", "What documents do I need?"],
    });
    setTimeout(() => pushAI("Upload at least one document, then proceed when ready."), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowType, pushMessage, pushAI]);

  const handleFileUpload = useCallback(
    async (docId: string, file: File | null) => {
      if (!file) {
        setUploadedDocs((prev) => ({ ...prev, [docId]: null }));
        setDocumentVerification((prev) => {
          const s = { ...prev };
          delete s[docId];
          return s;
        });
        return;
      }

      const attemptNumber = (uploadAttempts[docId] || 0) + 1;
      setUploadAttempts((prev) => ({ ...prev, [docId]: attemptNumber }));
      setUploadedDocs((prev) => ({ ...prev, [docId]: file }));
      setDocumentVerification((prev) => ({ ...prev, [docId]: { status: "processing" } }));

      try {
        const result = await processDocumentOCR(docId, file, attemptNumber, {
          cartTotal: equipmentValueRef.current || cartTotal,
          representativeName: formData.contactName,
        });
        setDocumentVerification((prev) => ({ ...prev, [docId]: result }));

        const docName = requiredDocuments.find((d) => d.id === docId)?.name || "Document";
        if (result.status === "verified") {
          pushAI(`\u2713 **${docName}** verified${attemptNumber > 1 ? " on retry" : ""} successfully!\n\n${result.verificationNotes?.join("\n") || ""}`);
        } else {
          pushAI(`\u26a0 **${docName}** verification failed. ${attemptNumber === 1 ? "Try uploading again \u2014 we'll be more lenient on the second attempt." : "Please ensure this is the correct document type."}`);
        }
      } catch {
        setDocumentVerification((prev) => ({
          ...prev,
          [docId]: { status: "rejected", verificationNotes: ["Error processing document."] },
        }));
        pushAI("\u274c Error processing document. Please try uploading again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadAttempts, cartTotal, formData.contactName, requiredDocuments, pushAI]
  );

  const handleRemoveFile = useCallback((docId: string) => {
    setUploadedDocs((prev) => ({ ...prev, [docId]: null }));
  }, []);

  // ── Merchant: offer logic ──────────────────────────────────────────────

  const proposeOffers = useCallback(() => {
    setPhase("offers");
    setApplicationStep("offers");
    setOfferSubPhase("choose_type");

    pushAI(
      `Great news! Based on your profile, here are your options:\n\n**Option 1: Equipment Financing**\n\u2022 Own the equipment\n\u2022 Build equity with payments\n\u2022 Tax benefits through depreciation\n\n**Option 2: Equipment Lease**\n\u2022 Lower upfront costs\n\u2022 Flexible upgrade options\n\u2022 Off-balance sheet (for businesses)\n\nWhich option interests you more?`,
      ["Show me Financing options", "Show me Lease options", "Compare side-by-side"]
    );
  }, [pushAI]);

  const calculateOffer = useCallback(
    (offerType: string, term: number) => {
      let rate = 10.99;
      let lender = "Standard Lender";
      const income = parseFloat(formData.annualRevenue || "0");

      if (income > 250000) {
        rate = 0;
        lender = "Premium Elite Lender";
      } else if (income >= 120000) {
        rate = 7.99;
        lender = "Preferred Lender";
      }

      let est: number;
      let down: number;

      if (offerType === "lease") {
        lender = "Commercial Lease Co.";
        down = 0;
        est = Math.round((cartTotal * 1.15) / term);
        rate = 0;
      } else {
        down = Math.min(cartTotal * 0.1, 500);
        est = computeMonthly(Math.max(0, cartTotal - down), rate, term);
      }

      return { lender, rate, term, down, estMonthly: est };
    },
    [formData.annualRevenue, cartTotal]
  );

  const showSelectedOffer = useCallback(
    (offerType: string, term: number) => {
      const offer = calculateOffer(offerType, term);
      setLastOffer(offer);
      setOfferSubPhase("display");

      const residuals = simulateResiduals(
        cartItems.map((i) => ({ name: i.name, price: i.price })),
        term
      );

      pushMessage({
        type: "offer",
        content: `Here's your personalized ${offerType === "lease" ? "Lease" : "Financing"} offer:`,
        suggestions: ["Apply this offer", "See other terms", "Talk to sales"],
        offerData: {
          id: generateCryptoId(),
          type: offerType === "lease" ? "lease" : "financing",
          lender: offer.lender,
          apr: offer.rate,
          termMonths: term,
          downPayment: offer.down,
          monthlyPayment: offer.estMonthly,
          totalAmount: cartTotal,
          residuals: residuals.residuals.map((r) => ({
            name: r.name,
            percentage: Math.round(r.residualPct * 100),
            value: r.residualValue,
          })),
        },
      });

      setTimeout(() => pushAI("Ready to proceed? I'll need a few documents to complete your application."), 500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calculateOffer, cartItems, cartTotal, pushMessage, pushAI]
  );

  const showComparison = useCallback(() => {
    const term = 36;
    const fin = calculateOffer("financing", term);
    const lea = calculateOffer("lease", term);
    const finTotal = fin.estMonthly * term + fin.down;
    const leaTotal = lea.estMonthly * term;
    const diff = finTotal - leaTotal;
    const diffText = diff > 0
      ? `Lease saves $${Math.abs(diff).toLocaleString()} over ${term} months`
      : `Financing saves $${Math.abs(diff).toLocaleString()} over ${term} months`;

    pushMessage({
      type: "comparison",
      content: "Here's a side-by-side comparison of your options:",
      suggestions: ["Choose Financing", "Choose Lease", "See other terms"],
      comparisonData: {
        financing: { lender: fin.lender, apr: fin.rate, monthlyPayment: fin.estMonthly, downPayment: fin.down, totalCost: finTotal },
        lease: { lender: lea.lender, monthlyPayment: lea.estMonthly, downPayment: lea.down, totalCost: leaTotal },
        difference: diffText,
        term,
      },
    });
  }, [calculateOffer, pushMessage]);

  const initiateContractSignature = useCallback(() => {
    setPhase("contract");
    setApplicationStep("contract");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const offer = lastOffer;
      if (!offer) return;
      const docusignId = generateCryptoId().substring(0, 16);

      pushMessage({
        type: "contract",
        content: "Perfect! Now let's finalize your contract.",
        suggestions: ["Sign contract", "Explain payment terms", "Review all clauses"],
        contractData: {
          lender: offer.lender,
          customerName: formData.contactName || "Customer",
          customerEmail: formData.contactEmail || "customer@example.com",
          totalFinanced: cartTotal,
          downPayment: offer.down,
          apr: offer.rate,
          termMonths: offer.term,
          monthlyPayment: offer.estMonthly,
          docusignLink: `https://docusign.com/sign/${docusignId}`,
          offerType: (formData._selectedOfferType as "financing" | "lease") || "financing",
        },
      });

      setTimeout(() => pushAI("You can ask me to explain any clause, or proceed to sign when ready."), 1000);
    }, 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastOffer, formData, cartTotal, pushMessage, pushAI]);

  // ── Question detection ─────────────────────────────────────────────────

  const isQuestion = (text: string): boolean => {
    const lower = text.toLowerCase();
    return (
      lower.includes("?") ||
      /\bwhat\b/.test(lower) ||
      /\bwhy\b/.test(lower) ||
      /\bhow\b/.test(lower) ||
      lower.includes("explain") ||
      lower.includes("tell me") ||
      lower.includes("can you") ||
      lower.includes("difference")
    );
  };

  // ── Main message handler ───────────────────────────────────────────────

  const handleUserMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      const trimmed = text.trim();
      const lower = trimmed.toLowerCase();

      // Push user message
      pushMessage({ type: "user", content: trimmed });
      setInputValue("");

      // ── Questions: answer + keep form card alive ────────────────────

      if (isQuestion(trimmed) && phase !== "company_auth" && phase !== "financing_type") {
        setIsTyping(true);
        try {
          const response = await agentAPI.sendMessage(sessionId, trimmed, {
            aiType: 'checkout' as const,
            customerData: formData,
            lastOffer,
            cartTotal,
            currentPrompt: phase,
          });
          setIsTyping(false);
          // Answer the question, then remind about the current step (not for terminal phases)
          let ctaSuggestions: string[] = [];
          if (phase === "section_form") {
            ctaSuggestions = ["\u2190 Back to application"];
          } else if (phase === "document_upload") {
            ctaSuggestions = flowType === "merchant" ? ["Continue to contract"] : ["Submit application"];
          } else if (phase !== "disqualified" && phase !== "submitted" && phase !== "complete") {
            ctaSuggestions = response.suggestions || [];
          }
          pushAI(response.message, ctaSuggestions);
        } catch {
          setIsTyping(false);
          const isTerminal = phase === "disqualified" || phase === "submitted" || phase === "complete";
          pushAI(
            "I'm not sure about that. Would you like to talk to a sales representative?",
            isTerminal ? ["Talk to sales"] : ["Talk to sales", "\u2190 Back to application"]
          );
        }
        return;
      }

      // ── Phase-specific handlers ────────────────────────────────────

      // FINANCING TYPE (bank flow)
      if (phase === "financing_type") {
        let selectedType: string | null = null;
        if (lower.includes("lease") || lower.includes("leasing")) {
          selectedType = "lease-financing";
        } else if (lower.includes("working capital") || lower.includes("working-capital") || lower.includes("capital")) {
          selectedType = "working-capital";
        } else if (lower.includes("financ") || lower.includes("equipment") || lower.includes("loan")) {
          selectedType = "equipment-financing";
        }

        if (!selectedType) {
          pushAI("Please select a financing type:", [
            "Equipment Financing",
            "Equipment Leasing",
            "Working Capital",
          ]);
          return;
        }

        const typeLabels: Record<string, string> = {
          "equipment-financing": "Equipment Financing",
          "lease-financing": "Equipment Leasing",
          "working-capital": "Working Capital",
        };

        setApplicationTypeOverride(selectedType);
        pushAI(`Great, let's get your **${typeLabels[selectedType]}** application started!`);
        setTimeout(() => {
          setPhase("company_name");
          pushAI("What's your company name?");
        }, 600);
        return;
      }

      // COMPANY NAME
      if (phase === "company_name") {
        const match = findCompanyByName(trimmed);
        if (match) {
          matchedCompanyRef.current = match;
          setFormData((prev) => ({ ...prev, companyName: match.company.name }));
          setPhase("company_auth");
          setAuthSubPhase("recognized");
          pushAI(
            `We found **${match.company.name}** in our system! We can auto-fill your application if you verify your identity. Would you like to authenticate?`,
            ["Authenticate", "Continue as Guest"]
          );
        } else {
          setFormData((prev) => ({ ...prev, companyName: trimmed }));
          // Start section progression
          advanceToSection(0, { ...formData, companyName: trimmed });
        }
        return;
      }

      // COMPANY AUTH
      if (phase === "company_auth") {
        if (authSubPhase === "recognized") {
          if (lower.includes("authenticate") || lower.includes("auth") || lower.includes("verify")) {
            const company = matchedCompanyRef.current?.company;
            if (!company) return;
            const formatName = (name: string) => {
              const parts = name.split(" ");
              return parts.length >= 2 ? `${parts[0]} ${parts[1][0]}.` : name;
            };
            const repLines = company.representatives
              .map((rep, i) => `${i + 1}. **${formatName(rep.name)}** \u2014 ${rep.role} (${maskEmail(rep.email)})`)
              .join("\n");
            setAuthSubPhase("rep_select");
            pushAI(
              `Select your account:\n\n${repLines}`,
              company.representatives.map((rep) => {
                const parts = rep.name.split(" ");
                return parts.length >= 2 ? `${parts[0]} ${parts[1][0]}.` : rep.name;
              })
            );
          } else {
            // Continue as guest
            matchedCompanyRef.current = null;
            advanceToSection(0, formData);
          }
          return;
        }

        if (authSubPhase === "rep_select") {
          const company = matchedCompanyRef.current?.company;
          if (!company) return;
          const reps = company.representatives;
          let selectedRep: Representative | undefined;
          const numMatch = trimmed.match(/^(\d+)$/);
          if (numMatch) {
            const idx = parseInt(numMatch[1], 10) - 1;
            if (idx >= 0 && idx < reps.length) selectedRep = reps[idx];
          }
          if (!selectedRep) {
            selectedRep = reps.find(
              (r) => r.name.toLowerCase().includes(lower) || lower.includes(r.name.split(" ")[0].toLowerCase())
            );
          }
          if (!selectedRep) {
            pushAI("Please select one of the accounts listed above.");
            return;
          }
          selectedRepRef.current = selectedRep;
          setAuthSubPhase("otp");
          pushAI(`We sent a 6-digit code to **${maskEmail(selectedRep.email)}**. Enter it below.`);
          return;
        }

        if (authSubPhase === "otp") {
          const digits = trimmed.replace(/\D/g, "");
          if (digits.length !== 6) {
            pushAI("Please enter a valid 6-digit verification code.");
            return;
          }

          const rep = selectedRepRef.current;
          const matched = matchedCompanyRef.current;
          if (!rep || !matched) return;

          // Pre-fill from demo data
          const demoData = DEMO_BUSINESS_DATA[matched.id];
          const newFormData: Record<string, string> = { ...formData, companyName: matched.company.name };

          if (demoData) {
            const fieldMap: Record<string, any> = {
              ein: demoData.ein,
              entityType: demoData.entityType || demoData.businessType,
              dateEstablished: demoData.dateEstablished,
              industry: demoData.industry,
              numberOfEmployees: demoData.numberOfEmployees,
              ownershipPercentage: demoData.ownershipPercentage,
              annualRevenue: demoData.annualRevenue,
              fiscalYearEnd: demoData.fiscalYearEnd,
              streetAddress: demoData.streetAddress,
              suite: demoData.suite,
              city: demoData.city,
              state: demoData.state || demoData.stateOfIncorporation,
              zipCode: demoData.zipCode,
              country: demoData.country,
              contactName: demoData.contactName || rep.name,
              contactEmail: demoData.contactEmail || rep.email,
              contactPhone: demoData.contactPhone || rep.phone,
              requestedAmount: demoData.equipment?.value,
              guarantorName: demoData.guarantorName,
              guarantorIdNumber: demoData.guarantorIdNumber,
              guarantorSSN: demoData.guarantor?.ssn,
              guarantorDOB: demoData.guarantorDOB,
              equipmentDescription: demoData.equipment?.description,
              equipmentValue: demoData.equipment?.value,
              equipmentCost: demoData.equipment?.value,
            };
            for (const [key, val] of Object.entries(fieldMap)) {
              if (val !== undefined && val !== null && String(val).trim()) {
                newFormData[key] = String(val);
              }
            }
            equipmentValueRef.current = demoData.equipment?.value || 0;
          }

          setFormData(newFormData);
          pushAI(`\u2713 Verified as **${rep.name}** \u2014 **${matched.company.name}**.\n\nYour application has been pre-filled with your company data.`);

          matchedCompanyRef.current = null;
          selectedRepRef.current = null;

          // Advance through sections (pre-filled ones show as summaries)
          setTimeout(() => advanceToSection(0, newFormData), 600);
          return;
        }
        return;
      }

      // SECTION FORM — user typed instead of using form card
      if (phase === "section_form") {
        // "Continue" / "back to application" → re-show the current form card at the bottom
        if (lower.includes("continue") || lower.includes("go back") || lower.includes("back to application") || lower === "application") {
          if (currentSection) {
            const totalSections = sections.length;
            const stepLabel = `Step ${activeSectionIndex + 1} of ${totalSections}`;
            const sectionValues: Record<string, string> = {};
            for (const f of currentSection.fields) {
              if (formData[f.id]) sectionValues[f.id] = formData[f.id];
            }
            pushAI(currentSection.section.intro);
            pushFormSection(currentSection, sectionValues, false, stepLabel);
          } else {
            pushAI("Please fill in the form above and click **Continue** when you're ready.");
          }
          return;
        }

        // Anything else — direct to AI, always offer a way back
        setIsTyping(true);
        try {
          const response = await agentAPI.sendMessage(sessionId, trimmed, {
            aiType: 'checkout' as const,
            customerData: formData,
            cartTotal,
            currentPrompt: "section_form",
          });
          setIsTyping(false);
          pushAI(response.message, ["\u2190 Back to application"]);
        } catch {
          setIsTyping(false);
          pushAI("I'm not sure about that, but I'm here to help with your financing application!", ["\u2190 Back to application"]);
        }
        return;
      }

      // DOCUMENT UPLOAD
      if (phase === "document_upload") {
        if (lower.includes("submit") || lower.includes("continue") || lower.includes("proceed") || lower.includes("next") || lower.includes("contract") || lower.includes("done")) {
          const atLeastOneDoc = Object.values(uploadedDocs).some((d) => d !== null);
          if (!atLeastOneDoc) {
            pushAI("Please upload at least one document before proceeding.", ["Upload documents"]);
            return;
          }
          const isProcessing = Object.values(documentVerification).some((v) => v.status === "processing");
          if (isProcessing) {
            pushAI("Please wait for all documents to finish processing.");
            return;
          }
          const rejectedDocs = Object.entries(documentVerification).filter(([, v]) => v.status === "rejected");
          if (rejectedDocs.length > 0) {
            const names = rejectedDocs.map(([docId]) => requiredDocuments.find((d) => d.id === docId)?.name).filter(Boolean).join(", ");
            pushAI(`Some documents failed verification (${names}). You can still proceed, but they may need manual review.`, ["Yes, proceed anyway", "Upload documents again"]);
            return;
          }

          if (flowType === "merchant") {
            if (!lastOffer) {
              // Show offers first
              proposeOffers();
            } else {
              initiateContractSignature();
            }
          } else {
            // Bank: submit
            submitBankApplication();
          }
          return;
        }
        if (lower.includes("yes") && (lower.includes("proceed") || lower.includes("submit") || lower.includes("anyway"))) {
          if (flowType === "merchant") {
            if (!lastOffer) proposeOffers();
            else initiateContractSignature();
          } else {
            submitBankApplication();
          }
          return;
        }
        if (lower.includes("what") && lower.includes("document")) {
          const docList = requiredDocuments.map((doc, i) => `${i + 1}. **${doc.name}** - ${doc.description}`).join("\n");
          pushAI(`Here are the documents we need:\n\n${docList}\n\nUpload at least one to proceed.`, flowType === "merchant" ? ["Continue to contract"] : ["Submit application"]);
          return;
        }
        return;
      }

      // OFFERS (merchant)
      if (phase === "offers") {
        if (offerSubPhase === "choose_type") {
          if (lower.includes("compare") || lower.includes("side-by-side")) {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              showComparison();
            }, 800);
            return;
          }
          if (lower.includes("financ")) {
            setFormData((prev) => ({ ...prev, _selectedOfferType: "financing" }));
            setOfferSubPhase("choose_term");
            pushAI("What financing term works best for you?", ["12 months", "24 months", "36 months", "48 months"]);
            return;
          }
          if (lower.includes("lease")) {
            setFormData((prev) => ({ ...prev, _selectedOfferType: "lease" }));
            setOfferSubPhase("choose_term");
            pushAI("What lease term works best for you?", ["12 months", "24 months", "36 months", "48 months"]);
            return;
          }
          pushAI("Which option would you like?", ["Show me Financing options", "Show me Lease options", "Compare side-by-side"]);
          return;
        }

        if (offerSubPhase === "choose_term") {
          const termMatch = trimmed.match(/\d+/);
          if (termMatch) {
            const term = parseInt(termMatch[0]);
            if ([12, 24, 36, 48].includes(term)) {
              const offerType = formData._selectedOfferType || "financing";
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                showSelectedOffer(offerType, term);
                setOfferSubPhase("display");
              }, 800);
              return;
            }
          }
          pushAI("Please select a term: 12, 24, 36, or 48 months.", ["12 months", "24 months", "36 months", "48 months"]);
          return;
        }

        if (offerSubPhase === "display" || offerSubPhase === "ready_for_docs") {
          if (lower.includes("apply") || lower.includes("accept") || lower.includes("proceed")) {
            initiateDocumentUpload();
            return;
          }
          if (lower.includes("other term")) {
            setOfferSubPhase("choose_term");
            pushAI("What term would you prefer?", ["12 months", "24 months", "36 months", "48 months"]);
            return;
          }
        }
        return;
      }

      // CONTRACT (merchant)
      if (phase === "contract") {
        if (lower.includes("sign") || lower.includes("agree") || lower.includes("accept")) {
          setIsTyping(true);
          setPhase("complete");
          setApplicationStep("complete");
          setTimeout(() => {
            setIsTyping(false);
            pushMessage({
              type: "completion",
              content: "Contract signed successfully!",
              data: {
                offerType: formData._selectedOfferType || "financing",
                term: lastOffer?.term,
                monthlyPayment: lastOffer?.estMonthly,
              },
            });
          }, 1500);
          return;
        }
        if (lower.includes("payment")) {
          pushAI(`**Payment Terms:**\n\n\u2022 Fixed monthly payment of $${lastOffer?.estMonthly}\n\u2022 Due on the same date each month\n\u2022 Auto-pay or manual payment\n\u2022 Early payment allowed without penalty\n\nReady to sign?`, ["Sign contract", "Ask another question"]);
          return;
        }
        pushAI("You can ask me to explain any clause, or proceed to sign.", ["Sign contract", "Review clauses"]);
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      phase, authSubPhase, formData, lastOffer, cartTotal, isLoading, sessionId,
      uploadedDocs, documentVerification, requiredDocuments, flowType, offerSubPhase,
      pushMessage, pushAI, advanceToSection, proposeOffers, showSelectedOffer,
      showComparison, initiateContractSignature, initiateDocumentUpload,
    ]
  );

  // ── Bank: submit application ───────────────────────────────────────────

  const submitBankApplication = useCallback(() => {
    setPhase("submitted");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const equipVal = equipmentValueRef.current || parseFloat(formData.equipmentCost || "0");
      pushMessage({
        type: "submitted",
        content: `Your application has been submitted for review.\n\n**${formData.companyName || "Company"}** \u2014 $${equipVal.toLocaleString()}\n\nOur underwriting team will review your application within 1-2 business days. You'll receive a decision with financing terms once approved.`,
      });
    }, 1500);
  }, [formData, pushMessage]);

  return {
    messages,
    phase,
    currentSection,
    formData,
    isTyping,
    inputValue,
    setInputValue,
    handleUserMessage,
    handleSectionSubmit,
    handleFileUpload,
    handleRemoveFile,
    uploadedDocs,
    documentVerification,
    uploadAttempts,
    requiredDocuments,
    applicationType,
    lastOffer,
    applicationStep,
  };
}
