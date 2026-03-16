import { useState, useMemo, useCallback } from "react";
import type { EquipmentItem } from "@/components/EquipmentChat";
import type { QualificationResult } from "@/lib/qualificationCheck";
import { checkQualification } from "@/lib/qualificationCheck";
import { processDocumentOCR } from "@/services/documentOCR";
import { simulateResiduals } from "@/services/ai/offerEngine";
import { generateCryptoId } from "@/lib/idGenerator";
import { saveApplication } from "@/lib/applicationStorage";
import { getOrCreateCustomerFromApplication } from "@/lib/customerStorage";
import { agentAPI } from "@/services/ai/agentAPI";
import { findCompanyByName, findCompanyByRepEmail, DEMO_BUSINESS_DATA, COMPANY_DETAILS } from "@/data/mockCompanies";
import { getEnabledFields, getEnabledDocuments, getPreQualDocuments, US_STATES, type EnabledField } from "@/services/platformConfigMockData";
import type { AuthState, DocumentVerificationState, FlowConfig, OrderDetails } from "./types";

export function useFormState(flowConfig: FlowConfig, orderDetails: OrderDetails | null) {
  const [applicationType, setApplicationType] = useState("equipment-financing");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auth / company recognition
  const [authState, setAuthState] = useState<AuthState>({ status: "none" });

  // Documents
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({});
  const [documentVerification, setDocumentVerification] = useState<Record<string, DocumentVerificationState>>({});
  const [uploadAttempts, setUploadAttempts] = useState<Record<string, number>>({});
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  // Equipment (bank)
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
  const [equipmentTotalValue, setEquipmentTotalValue] = useState(0);

  // Offers (merchant)
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [generatedOffers, setGeneratedOffers] = useState<any[]>([]);
  const [isGeneratingOffers, setIsGeneratingOffers] = useState(false);
  const [offerTypeFilter, setOfferTypeFilter] = useState<"financing" | "lease">("lease");
  const [revenue, setRevenue] = useState<number | null>(500000);

  // Qualification (bank)
  const [disqualification, setDisqualification] = useState<QualificationResult | null>(null);
  const [disqualifiedEmail, setDisqualifiedEmail] = useState("");
  const [inlineWarning, setInlineWarning] = useState<string | null>(null);
  const [qualificationPassed, setQualificationPassed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Config-driven fields/docs
  const enabledFields = useMemo(() => getEnabledFields(applicationType), [applicationType]);
  const requiredDocuments = useMemo(() => getEnabledDocuments(applicationType), [applicationType]);
  const preQualDocuments = useMemo(() => getPreQualDocuments(applicationType), [applicationType]);
  const stateOptions = useMemo(() => US_STATES.filter((s) => s !== "Nationwide"), []);

  const fieldsByCategory = useMemo(() => {
    const grouped: Record<string, EnabledField[]> = {};
    for (const field of enabledFields) {
      if (!grouped[field.category]) grouped[field.category] = [];
      grouped[field.category].push(field);
    }
    return grouped;
  }, [enabledFields]);

  const hasEquipmentSection = useMemo(
    () => applicationType !== "working-capital",
    [applicationType]
  );

  const needsGuarantor = useMemo(() => {
    const eqCost = parseFloat(formData.equipmentCost || "0");
    const reqAmt = parseFloat(formData.requestedAmount || "0");
    return Math.max(eqCost, reqAmt, equipmentTotalValue) > 50000;
  }, [formData.equipmentCost, formData.requestedAmount, equipmentTotalValue]);

  const equipmentDesc = equipmentItems.map((i) => i.quantity + "x " + i.name).join(", ") || "Equipment";

  // ── Field changes ──────────────────────────────────────────────────

  const updateField = useCallback((fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      if (prev[fieldId]) { const next = { ...prev }; delete next[fieldId]; return next; }
      return prev;
    });

    // Inline qualification checks (bank flow)
    if (flowConfig.features.enablePreQual) {
      if (fieldId === "dateEstablished" && value) {
        const result = checkQualification({ dateEstablished: value });
        setInlineWarning(result.qualified ? null : result.reason || null);
      } else if (fieldId === "annualRevenue" && value) {
        const num = parseFloat(value);
        if (num > 0) {
          const result = checkQualification({ annualRevenue: num });
          setInlineWarning(result.qualified ? null : result.reason || null);
        }
      } else if ((fieldId === "requestedAmount" || fieldId === "equipmentCost") && value) {
        const num = parseFloat(value);
        if (num > 0) {
          const result = checkQualification({ [fieldId]: num });
          setInlineWarning(result.qualified ? null : result.reason || null);
        }
      }
    }
  }, [flowConfig.features.enablePreQual]);

  // ── Company recognition ────────────────────────────────────────────

  const handleCompanyBlur = useCallback(() => {
    if (authState.status === "verified") return;
    const match = findCompanyByName(formData.companyName || "");
    setAuthState(match ? { status: "recognized" } : { status: "none" });
  }, [authState.status, formData.companyName]);

  const handleEmailBlur = useCallback(() => {
    if (authState.status === "verified" || authState.status === "recognized") return;
    const match = findCompanyByRepEmail(formData.contactEmail || "");
    if (match) setAuthState({ status: "recognized" });
  }, [authState.status, formData.contactEmail]);

  const handleVerified = useCallback((data: { companyId: string; company: any; representative: any }) => {
    const { company, representative } = data;
    const demoData = DEMO_BUSINESS_DATA[data.companyId];

    if (flowConfig.flowType === "bank") {
      // Bank: full pre-fill from COMPANY_DETAILS
      const companyDetail = COMPANY_DETAILS[data.companyId];
      const bi = companyDetail?.businessInfo;
      const newData: Record<string, string> = {
        companyName: company.name,
        contactName: representative.name,
        contactEmail: representative.email,
        contactPhone: representative.phone,
      };
      if (bi) {
        if (bi.dba) newData.dba = bi.dba;
        newData.ein = bi.ein;
        newData.entityType = bi.entityType;
        newData.dateEstablished = bi.dateEstablished;
        newData.industry = bi.industryCode;
        newData.numberOfEmployees = String(bi.numberOfEmployees);
        newData.ownershipPercentage = String(bi.ownershipPercentage);
        newData.annualRevenue = String(bi.annualRevenue);
        newData.fiscalYearEnd = bi.fiscalYearEnd;
        newData.streetAddress = bi.streetAddress;
        if (bi.suite) newData.suite = bi.suite;
        newData.city = bi.city;
        newData.state = bi.state;
        newData.zipCode = bi.zipCode;
        newData.country = bi.country;
      }
      if (companyDetail?.guarantor) {
        newData.guarantorName = companyDetail.guarantor.name;
        newData.guarantorIdNumber = companyDetail.guarantor.idNumber;
        newData.guarantorDOB = companyDetail.guarantor.dob;
      }
      if (demoData?.guarantor?.ssn) {
        newData.guarantorSSN = demoData.guarantor.ssn;
      }
      setFormData((prev) => ({ ...prev, ...newData }));
    } else {
      // Merchant: lighter pre-fill
      const addressParts = company.address.split(",").map((s: string) => s.trim());
      const streetAddress = addressParts[0] || "";
      const cityPart = addressParts[1] || "";
      const lastPart = addressParts[addressParts.length - 1] || "";
      const stateMatch = lastPart.match(/^([A-Z]{2})\s/);
      const statePart = stateMatch ? stateMatch[1] : "";
      const zipMatch = lastPart.match(/\d{5}(-\d{4})?$/);
      const zip = zipMatch ? zipMatch[0] : "";
      const stateFullName = stateOptions.find((s) => s === statePart || s.startsWith(statePart)) || "";

      setFormData((prev) => ({
        ...prev,
        companyName: company.name,
        contactName: representative.name,
        contactEmail: representative.email,
        contactPhone: representative.phone,
        streetAddress,
        city: cityPart,
        state: stateFullName,
        zipCode: zip,
        ein: demoData?.ein || "",
        entityType: demoData?.businessType === "c_corp" ? "Corporation" : demoData?.businessType === "llc" ? "LLC" : demoData?.businessType === "s_corp" ? "S-Corporation" : "",
        yearsInBusiness: demoData ? String(demoData.yearsInBusiness) : "",
        annualRevenue: demoData ? "500000" : "",
      }));
    }
    setAuthState({ status: "verified", companyId: data.companyId, repId: representative.id });
  }, [flowConfig.flowType, stateOptions]);

  const handleDismissRecognition = useCallback(() => setAuthState({ status: "none" }), []);

  const handleChangeCompany = useCallback(() => {
    setFormData({});
    setAuthState({ status: "none" });
  }, []);

  // ── Equipment ──────────────────────────────────────────────────────

  const handleEquipmentChange = useCallback((items: EquipmentItem[], totalValue: number) => {
    setEquipmentItems(items);
    setEquipmentTotalValue(totalValue);
  }, []);

  // ── Document upload ────────────────────────────────────────────────

  const handleFileUpload = useCallback(async (docId: string, file: File | null) => {
    if (!file) { setUploadedDocs((prev) => ({ ...prev, [docId]: null })); return; }

    const attemptNumber = (uploadAttempts[docId] || 0) + 1;
    setUploadAttempts((prev) => ({ ...prev, [docId]: attemptNumber }));
    setUploadedDocs((prev) => ({ ...prev, [docId]: file }));

    if (flowConfig.features.enableOCR) {
      setDocumentVerification((prev) => ({ ...prev, [docId]: { status: "processing" } }));
      try {
        const result = await processDocumentOCR(docId, file, attemptNumber, {
          cartTotal: equipmentTotalValue,
          representativeName: formData.contactName || "",
        });
        setDocumentVerification((prev) => ({ ...prev, [docId]: result }));
      } catch {
        setDocumentVerification((prev) => ({
          ...prev,
          [docId]: { status: "rejected", verificationNotes: ["Processing error \u2014 please try again."] },
        }));
      }
    }
  }, [flowConfig.features.enableOCR, uploadAttempts, equipmentTotalValue, formData.contactName]);

  const handleRemoveFile = useCallback((docId: string) => {
    setUploadedDocs((prev) => ({ ...prev, [docId]: null }));
    setDocumentVerification((prev) => { const next = { ...prev }; delete next[docId]; return next; });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDraggedOver(docId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDraggedOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(docId, file);
  }, [handleFileUpload]);

  // ── Merchant: offer generation ─────────────────────────────────────

  const equipmentPurchasePrice = 350;
  const equipmentTotal = equipmentPurchasePrice * (orderDetails?.quantity || 1);

  const computeMonthly = (principal: number, apr: number, months: number) => {
    if (!apr || apr <= 0) return Math.ceil(principal / months);
    const r = apr / 100 / 12;
    return Math.round(principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const generateOffers = useCallback(() => {
    const revenueToUse = revenue || 500000;
    setIsGeneratingOffers(true);

    setTimeout(() => {
      let rate = 10.99;
      let lender = "Standard Lender";

      if (revenueToUse > 250000) { rate = 0; lender = "Premium Elite Lender"; }
      else if (revenueToUse >= 120000) { rate = 7.99; lender = "Preferred Lender"; }
      else if (revenueToUse < 50000) { rate = 15.99; lender = "Alt Lender"; }

      const offers: any[] = [];
      const terms = [12, 24, 36];

      terms.forEach((term) => {
        const down = Math.min(equipmentTotal * 0.1, 500);
        const monthlyPayment = computeMonthly(Math.max(0, equipmentTotal - down), rate, term);
        const residuals = simulateResiduals([{ name: "Equipment", price: equipmentTotal }], term);
        offers.push({
          id: generateCryptoId(),
          type: "financing",
          lender,
          apr: rate,
          termMonths: term,
          downPayment: down,
          monthlyPayment,
          totalAmount: equipmentTotal,
          residuals: residuals.residuals.map((r) => ({ name: r.name, percentage: Math.round(r.residualPct * 100), value: r.residualValue })),
        });
      });

      terms.forEach((term) => {
        const depreciationFactor = 1.15;
        const monthlyPayment = Math.round((equipmentTotal * depreciationFactor) / term);
        const residuals = simulateResiduals([{ name: "Equipment", price: equipmentTotal }], term);
        offers.push({
          id: generateCryptoId(),
          type: "lease",
          lender: "Commercial Lease Co.",
          apr: 0,
          termMonths: term,
          downPayment: 0,
          monthlyPayment,
          totalAmount: equipmentTotal,
          residuals: residuals.residuals.map((r) => ({ name: r.name, percentage: Math.round(r.residualPct * 100), value: r.residualValue })),
        });
      });

      setGeneratedOffers(offers);
      setIsGeneratingOffers(false);
    }, 1500);
  }, [revenue, equipmentTotal]);

  // ── Merchant: validate + submit → generate offers ──────────────────

  const handleMerchantSubmit = useCallback(() => {
    const newErrors: Record<string, string> = {};
    for (const field of enabledFields) {
      if (field.required && !(formData[field.id] || "").trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (field.type === "email" && formData[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.id])) {
        newErrors[field.id] = "Invalid email format";
      }
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return false; }

    const atLeastOneDocUploaded = Object.values(uploadedDocs).some((doc) => doc !== null);
    if (!atLeastOneDocUploaded) { alert("Please upload at least one document before continuing."); return false; }

    if (!revenue) setRevenue(500000);
    generateOffers();
    return true;
  }, [enabledFields, formData, uploadedDocs, revenue, generateOffers]);

  // ── Bank: pre-qual check ───────────────────────────────────────────

  const handlePreQualCheck = useCallback((): boolean => {
    const result = checkQualification({
      dateEstablished: formData.dateEstablished || formData.prequalTimeInMarket,
      annualRevenue: parseFloat(formData.annualRevenue || formData.prequalRevenue || "0") || undefined,
      requestedAmount: parseFloat(formData.requestedAmount || formData.prequalAmount || "0") || undefined,
      equipmentCost: parseFloat(formData.equipmentCost || formData.prequalAmount || equipmentTotalValue?.toString() || "0") || undefined,
    });
    if (!result.qualified) {
      setDisqualification(result);
      return false;
    }
    setQualificationPassed(true);
    setInlineWarning(null);
    setTimeout(() => setQualificationPassed(false), 1200);
    return true;
  }, [formData, equipmentTotalValue]);

  // ── Bank: full submit ──────────────────────────────────────────────

  const handleBankSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const appId = `APP-${String(Date.now()).slice(-6)}`;
    const docs = preQualDocuments.map((d) => ({
      id: d.id,
      type: d.id,
      fileName: uploadedDocs[d.id]?.name || "",
      status: documentVerification[d.id]?.status === "verified" ? "verified" : "pending",
    }));
    const docsVerified = docs.filter((d) => d.status === "verified").length;
    const docsTotal = docs.length;

    let aiSummary;
    try {
      aiSummary = await agentAPI.assessApplication({
        company: formData.companyName || "Unknown",
        contact: formData.contactName || undefined,
        entityType: formData.entityType,
        entitySize: formData.numberOfEmployees,
        dateEstablished: formData.dateEstablished,
        annualRevenue: formData.annualRevenue,
        requestedAmount: formData.requestedAmount || String(equipmentTotalValue),
        equipment: equipmentDesc,
        equipmentItems: equipmentItems.map((i) => ({ description: i.name, quantity: i.quantity, unitCost: i.unitValue })),
        documentsVerified: docsVerified,
        documentsTotal: docsTotal,
      });
    } catch { aiSummary = undefined; }

    const companyId = getOrCreateCustomerFromApplication(formData);
    saveApplication({
      id: appId,
      companyId,
      company: formData.companyName || "Unknown",
      contact: formData.contactName || "",
      type: applicationType,
      equipment: equipmentDesc,
      amount: `$${equipmentTotalValue.toLocaleString()}`,
      vendor: "\u2014",
      status: "completed",
      date: new Date().toISOString().split("T")[0],
      formData: { ...formData },
      equipmentItems: equipmentItems.map((i) => ({ description: i.name, vendor: "\u2014", quantity: i.quantity, unitCost: i.unitValue })),
      documents: docs,
      aiSummary,
    });

    setIsSubmitting(false);
    return true;
  }, [isSubmitting, preQualDocuments, uploadedDocs, documentVerification, formData, equipmentTotalValue, equipmentDesc, equipmentItems, applicationType]);

  const handleDisqualifiedSubmit = useCallback(({ email }: { email: string }) => {
    const appId = `UNQ-${String(Date.now()).slice(-6)}`;
    const amountStr = formData.equipmentCost || formData.requestedAmount || "";
    const amountNum = parseFloat(amountStr);
    const amountDisplay = amountStr && !isNaN(amountNum) ? `$${amountNum.toLocaleString()}` : "\u2014";
    const companyId = getOrCreateCustomerFromApplication({ ...formData, contactEmail: email });
    saveApplication({
      id: appId,
      companyId,
      company: formData.companyName || "Unknown",
      contact: email,
      type: applicationType,
      equipment: "\u2014",
      amount: amountDisplay,
      vendor: "\u2014",
      status: "unqualified",
      date: new Date().toISOString().split("T")[0],
      formData: { ...formData, contactEmail: email },
    });
    window.location.href = "/";
  }, [formData, applicationType]);

  return {
    // State
    applicationType, setApplicationType,
    formData, setFormData,
    errors, setErrors,
    authState, setAuthState,
    uploadedDocs,
    documentVerification,
    draggedOver,
    equipmentItems, equipmentTotalValue,
    selectedOffer, setSelectedOffer,
    generatedOffers, isGeneratingOffers,
    offerTypeFilter, setOfferTypeFilter,
    revenue,
    disqualification, setDisqualification,
    disqualifiedEmail, setDisqualifiedEmail,
    inlineWarning, setInlineWarning,
    qualificationPassed, setQualificationPassed,
    isSubmitting,

    // Derived
    enabledFields, requiredDocuments, preQualDocuments,
    fieldsByCategory, stateOptions,
    hasEquipmentSection, needsGuarantor,
    equipmentDesc, equipmentTotal,

    // Handlers
    updateField,
    handleCompanyBlur, handleEmailBlur,
    handleVerified, handleDismissRecognition, handleChangeCompany,
    handleEquipmentChange,
    handleFileUpload, handleRemoveFile,
    handleDragOver, handleDragLeave, handleDrop,
    handleMerchantSubmit,
    handlePreQualCheck,
    handleBankSubmit,
    handleDisqualifiedSubmit,
    generateOffers,
  };
}
