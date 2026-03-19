import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileCheck, FileText, Truck, DollarSign } from "lucide-react";
import ApplicationMethodSelector from "@/components/ApplicationMethodSelector";
import AIApplicationChat from "@/components/AIApplicationChat";
import BankAIApplicationChat from "@/components/BankAIApplicationChat";
import CustomerRecognitionCard from "@/components/CustomerRecognitionCard";
import { DEFAULT_PLATFORM_CONFIG, FIELD_CATEGORY_LABELS, getPreQualDocuments } from "@/services/platformConfigMockData";
import { COMPANY_DETAILS } from "@/data/mockCustomers";
import { useAssistantContext } from "@/contexts/AssistantContext";

import type { OrderDetails, SectionId } from "@/components/application/types";
import { useFlowConfig } from "@/components/application/useFlowConfig";
import { useFormState } from "@/components/application/useFormState";
import { useSectionProgression } from "@/components/application/useSectionProgression";

import ProgressIndicator from "@/components/application/ProgressIndicator";
import OrderSummary from "@/components/application/OrderSummary";
import SectionShell from "@/components/application/SectionShell";

// Sections
import CompanyNameSection from "@/components/application/sections/CompanyNameSection";
import PreQualSection from "@/components/application/sections/PreQualSection";
import InfoSection from "@/components/application/sections/InfoSection";
import IdentitySection from "@/components/application/sections/IdentitySection";
import ContactSection from "@/components/application/sections/ContactSection";
import FinancialSection from "@/components/application/sections/FinancialSection";
import EquipmentSection from "@/components/application/sections/EquipmentSection";
import GuarantorSection from "@/components/application/sections/GuarantorSection";
import DocumentsSection from "@/components/application/sections/DocumentsSection";
import OffersSection from "@/components/application/sections/OffersSection";
import ContractSection from "@/components/application/sections/ContractSection";
import CompletionSection from "@/components/application/sections/CompletionSection";
import SubmittedSection from "@/components/application/sections/SubmittedSection";
import DisqualifiedSection from "@/components/application/sections/DisqualifiedSection";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Truck, DollarSign, FileText };

interface UnifiedApplicationFormProps {
  embedded?: boolean;
  applicationType?: string;
  initialMethod?: "ai" | "traditional";
}

const UnifiedApplicationForm = ({
  embedded,
  applicationType: propApplicationType,
  initialMethod,
}: UnifiedApplicationFormProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine order details from navigation state (vendor flow)
  const orderDetails: OrderDetails | null = useMemo(() => {
    if (embedded) return null;
    const s = location.state;
    return s?.quantity ? s as OrderDetails : null;
  }, [embedded, location.state]);

  const hasOrderDetails = !!orderDetails;
  const flowConfig = useFlowConfig({ embedded, orderDetails });

  // Method selection gate
  const [selectedMethod, setSelectedMethod] = useState<"ai" | "traditional" | null>(() => {
    if (embedded && initialMethod) return initialMethod;
    const s = location.state;
    if (s?.formType === "application") return "traditional";
    if (s?.formType === "ai") return "ai";
    return null;
  });

  // Core state
  const formState = useFormState(flowConfig, orderDetails);
  const {
    applicationType, setApplicationType,
    formData, errors,
    authState,
    uploadedDocs, documentVerification, draggedOver,
    equipmentItems, equipmentTotalValue,
    selectedOffer, setSelectedOffer,
    generatedOffers, isGeneratingOffers,
    offerTypeFilter, setOfferTypeFilter,
    disqualification, disqualifiedEmail, setDisqualifiedEmail,
    inlineWarning, qualificationPassed, isSubmitting,
    enabledFields, requiredDocuments, preQualDocuments,
    fieldsByCategory,
    hasEquipmentSection, needsGuarantor,
    equipmentDesc,
    updateField,
    handleCompanyBlur, handleEmailBlur,
    handleVerified, handleDismissRecognition, handleChangeCompany,
    handleEquipmentChange,
    handleFileUpload, handleRemoveFile,
    handleDragOver, handleDragLeave, handleDrop,
    handleVendorSubmit,
    handlePreQualCheck,
    handleBankSubmit,
    handleDisqualifiedSubmit,
  } = formState;

  // Section progression
  const progression = useSectionProgression({
    flowConfig,
    hasEquipmentSection,
    needsGuarantor,
    guarantorFieldCount: fieldsByCategory["guarantor"]?.length ?? 0,
  });
  const {
    currentSection, setCurrentSection,
    completedSections, setCompletedSections,
    activeSections,
    goToNextSection,
    goToSection,
    markCompleted,
    isLastSection,
    resetProgression,
    getSectionLabel,
  } = progression;

  // Initialize application type from props
  useEffect(() => {
    if (embedded && propApplicationType) setApplicationType(propApplicationType);
    else if (!embedded && location.state?.applicationType) setApplicationType(location.state.applicationType);
  }, []);

  // Sync assistant context
  const { updateContext } = useAssistantContext();
  useEffect(() => {
    updateContext({
      page: flowConfig.flowType === "vendor" ? "vendor-application-form" : "bank-application-form",
      applicationType,
      currentStep: currentSection,
      companyName: formData.companyName || undefined,
      revenue: formState.revenue || undefined,
      selectedOffer: selectedOffer ? { lender: selectedOffer.lender, rate: selectedOffer.rate, term: selectedOffer.term, monthly: selectedOffer.estMonthly } : undefined,
      offersCount: generatedOffers.length || undefined,
      equipmentSummary: equipmentItems.length > 0 ? equipmentDesc : undefined,
      equipmentTotal: equipmentTotalValue > 0 ? equipmentTotalValue : undefined,
    });
  }, [applicationType, currentSection, formData.companyName, formState.revenue, selectedOffer, generatedOffers.length, equipmentItems, equipmentTotalValue]);

  // ── Section continue handler ───────────────────────────────────────

  const handleSectionContinue = (sectionId: SectionId) => {
    if (sectionId === "prequal") {
      const passed = handlePreQualCheck();
      if (!passed) {
        setCurrentSection("disqualified");
        return;
      }
      // Wait for qualification animation before advancing
      setTimeout(() => goToNextSection(), 1200);
      return;
    }

    if (sectionId === "info") {
      // Vendor combined info+docs: validate, then generate offers
      const success = handleVendorSubmit();
      if (success) {
        markCompleted("info");
        setCurrentSection("offers");
      }
      return;
    }

    goToNextSection();
  };

  // ── Bank submit (last section) ─────────────────────────────────────

  const handleFinalSubmit = async () => {
    if (flowConfig.flowType === "bank") {
      const success = await handleBankSubmit();
      if (success) {
        markCompleted(currentSection);
        setCurrentSection("submitted");
      }
    }
  };

  // ── Change company resets progression (bank) ───────────────────────

  const handleChangeCompanyAndReset = () => {
    handleChangeCompany();
    resetProgression();
  };

  // ── Application type change resets form (bank) ─────────────────────

  const handleApplicationTypeChange = (val: string) => {
    setApplicationType(val);
    formState.setFormData({});
    formState.setErrors({});
    resetProgression();
  };

  // ── Section summary text ───────────────────────────────────────────

  const getSectionSummary = (sectionId: SectionId): string => {
    switch (sectionId) {
      case "company_name": return formData.companyName || "Company name";
      case "prequal": return [formData.entityType, formData.numberOfEmployees, formData.dateEstablished].filter(Boolean).join(" \u00b7 ") || "Pre-qualification";
      case "docs_lightweight": return `${preQualDocuments.filter((d) => uploadedDocs[d.id]).length} of ${preQualDocuments.length} documents`;
      case "info": return "Application info & documents";
      case "identity": return [formData.entityType, formData.ein].filter(Boolean).join(" \u00b7 ") || "Business information";
      case "contact": return [formData.contactName, formData.contactEmail].filter(Boolean).join(" \u00b7 ") || "Contact details";
      case "financial": {
        const parts: string[] = [];
        if (formData.annualRevenue) parts.push(`Revenue: $${parseFloat(formData.annualRevenue).toLocaleString()}`);
        if (formData.requestedAmount) parts.push(`Amount: $${parseFloat(formData.requestedAmount).toLocaleString()}`);
        return parts.join(" \u00b7 ") || "Financial details";
      }
      case "equipment": return equipmentTotalValue > 0 ? `${equipmentDesc} \u2014 $${equipmentTotalValue.toLocaleString()}` : "Equipment details";
      case "guarantor": return formData.guarantorName || "Guarantor details";
      default: return "";
    }
  };

  // ── Verified flow render (bank) ────────────────────────────────────

  const renderVerifiedSummary = () => {
    const categories = ["identity", "contact", "financial", "guarantor"] as const;
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Company Details</h2>
            <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full">Verified</span>
          </div>
          <p className="text-sm text-muted-foreground">Please confirm these details are still up to date.</p>
          {categories.map((cat) => {
            const fields = fieldsByCategory[cat];
            if (!fields || fields.length === 0) return null;
            const fieldsWithValues = fields.filter((f) => formData[f.id]);
            if (fieldsWithValues.length === 0) return null;
            return (
              <div key={cat} className="pt-3 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{FIELD_CATEGORY_LABELS[cat] || cat}</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                  {fieldsWithValues.map((f) => (
                    <div key={f.id}>
                      <p className="text-xs text-muted-foreground">{f.label}</p>
                      <p className="text-sm font-medium text-foreground">
                        {f.type === "number" && formData[f.id] ? `$${parseFloat(formData[f.id]).toLocaleString()}` : formData[f.id]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t border-border">
            <button type="button" onClick={handleChangeCompanyAndReset} className="text-xs text-primary hover:underline">Not you? Change company</button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ── Method selection gate ───────────────────────────────────────────

  if (!selectedMethod) {
    return <ApplicationMethodSelector onSelectMethod={setSelectedMethod} />;
  }

  if (selectedMethod === "ai") {
    if (flowConfig.flowType === "bank") return <BankAIApplicationChat />;
    return <AIApplicationChat applicationType={applicationType} />;
  }

  // ── Terminal states ────────────────────────────────────────────────

  const isTerminal = currentSection === "complete" || currentSection === "submitted" || currentSection === "disqualified";

  // ── Main render ────────────────────────────────────────────────────

  return (
    <div className={flowConfig.flowType === "vendor" ? "min-h-screen bg-background p-6" : ""}>
      <div className={flowConfig.flowType === "vendor" ? "max-w-7xl mx-auto" : ""}>
        {/* Back Button (vendor standalone) */}
        {flowConfig.flowType === "vendor" && !embedded && (
          <Button variant="ghost" onClick={() => navigate("/checkout")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Checkout
          </Button>
        )}

        {/* Application Type Selector (embedded bank flow) */}
        {embedded && flowConfig.flowType === "vendor" && (
          <div className="flex gap-2 flex-wrap mb-6">
            {DEFAULT_PLATFORM_CONFIG.applicationTypes.filter((t) => t.enabled).map((appType) => {
              const Icon = iconMap[appType.icon] || FileText;
              return (
                <button
                  key={appType.id}
                  onClick={() => setApplicationType(appType.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                    applicationType === appType.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {appType.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Application</h1>
          <p className="text-muted-foreground">Complete your information to finalize your application</p>
        </div>

        {/* Progress Indicator */}
        {!isTerminal && (
          <ProgressIndicator
            flowType={flowConfig.flowType}
            activeSections={activeSections}
            currentSection={currentSection}
            completedSections={completedSections}
          />
        )}

        {/* Layout: 2-column (vendor with order details) or single-column */}
        <div className={hasOrderDetails ? "grid lg:grid-cols-3 gap-6" : flowConfig.flowType === "bank" ? "max-w-4xl mx-auto space-y-4" : "max-w-4xl mx-auto"}>
          <div className={`${hasOrderDetails ? "lg:col-span-2" : ""} space-y-6`}>

            {/* ── Terminal sections ── */}
            {currentSection === "disqualified" && disqualification && (
              <DisqualifiedSection
                result={disqualification}
                email={disqualifiedEmail}
                onEmailChange={setDisqualifiedEmail}
                onSubmit={handleDisqualifiedSubmit}
              />
            )}

            {currentSection === "submitted" && (
              <SubmittedSection
                companyName={formData.companyName}
                equipmentDesc={equipmentDesc}
                equipmentTotalValue={equipmentTotalValue}
              />
            )}

            {currentSection === "complete" && selectedOffer && (
              <CompletionSection selectedOffer={selectedOffer} />
            )}

            {/* ── Active form ── */}
            {!isTerminal && (
              <>
                {/* Bank verified flow */}
                {flowConfig.flowType === "bank" && authState.status === "verified" ? (
                  <>
                    {renderVerifiedSummary()}

                    {/* Application Type */}
                    <Card>
                      <CardContent className="p-6 space-y-3">
                        <Label htmlFor="applicationType">Application Type *</Label>
                        <Select value={applicationType} onValueChange={setApplicationType}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {DEFAULT_PLATFORM_CONFIG.applicationTypes.filter((t) => t.enabled).map((appType) => (
                              <SelectItem key={appType.id} value={appType.id}>{appType.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    {/* Documents on file */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {authState.companyId && COMPANY_DETAILS[authState.companyId]?.documents
                                ? `${COMPANY_DETAILS[authState.companyId].documents.length} documents on file`
                                : `${requiredDocuments.length} documents on file`}
                            </p>
                            <p className="text-xs text-muted-foreground">All required documents have been previously submitted and verified.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Equipment */}
                    <EquipmentSection
                      applicationType={applicationType}
                      equipmentItems={equipmentItems}
                      equipmentTotalValue={equipmentTotalValue}
                      isLastSection={true}
                      isSubmitting={isSubmitting}
                      onEquipmentChange={handleEquipmentChange}
                      onContinue={() => {}}
                      onSubmit={async () => {
                        if (equipmentItems.length === 0 || equipmentTotalValue <= 0) {
                          alert(applicationType === "working-capital" ? "Please enter a working capital amount." : "Please add at least one equipment item.");
                          return;
                        }
                        markCompleted(currentSection);
                        setCurrentSection("submitted");
                      }}
                    />
                  </>
                ) : flowConfig.flowType === "vendor" ? (
                  /* ── Vendor form ── */
                  <>
                    {(currentSection === "company_name") && (
                      <CompanyNameSection
                        formData={formData}
                        errors={errors}
                        authState={authState}
                        onFieldChange={updateField}
                        onCompanyBlur={handleCompanyBlur}
                        onVerified={handleVerified}
                        onDismissRecognition={handleDismissRecognition}
                        onContinue={() => handleSectionContinue("company_name")}
                      />
                    )}

                    {(currentSection === "prequal") && (
                      <PreQualSection
                        formData={formData}
                        errors={errors}
                        applicationType={applicationType}
                        inlineWarning={inlineWarning}
                        qualificationPassed={qualificationPassed}
                        onFieldChange={updateField}
                        onContinue={() => handleSectionContinue("prequal")}
                      />
                    )}

                    {(currentSection === "info" || currentSection === "documents") && (
                      <InfoSection
                        formData={formData}
                        errors={errors}
                        authState={authState}
                        fieldsByCategory={fieldsByCategory}
                        requiredDocuments={requiredDocuments}
                        uploadedDocs={uploadedDocs}
                        draggedOver={draggedOver}
                        onFieldChange={updateField}
                        onCompanyBlur={handleCompanyBlur}
                        onEmailBlur={handleEmailBlur}
                        onVerified={handleVerified}
                        onDismissRecognition={handleDismissRecognition}
                        onChangeCompany={handleChangeCompanyAndReset}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={handleRemoveFile}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onSubmit={() => handleSectionContinue("info")}
                      />
                    )}

                    {currentSection === "offers" && (
                      <OffersSection
                        generatedOffers={generatedOffers}
                        selectedOffer={selectedOffer}
                        isGeneratingOffers={isGeneratingOffers}
                        offerTypeFilter={offerTypeFilter}
                        onSelectOffer={setSelectedOffer}
                        onSetOfferTypeFilter={setOfferTypeFilter}
                        onContinue={() => {
                          markCompleted("offers");
                          setCurrentSection("contract");
                        }}
                      />
                    )}

                    {currentSection === "contract" && selectedOffer && (
                      <ContractSection
                        selectedOffer={selectedOffer}
                        onSign={() => {
                          markCompleted("contract");
                          setCurrentSection("complete");
                        }}
                      />
                    )}
                  </>
                ) : (
                  /* ── Bank non-verified flow — progressive sections ── */
                  <>
                    {/* Application Type (always visible at top) */}
                    <Card>
                      <CardContent className="p-6 space-y-3">
                        <Label htmlFor="applicationType">Application Type *</Label>
                        <Select value={applicationType} onValueChange={handleApplicationTypeChange}>
                          <SelectTrigger id="applicationType"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {DEFAULT_PLATFORM_CONFIG.applicationTypes.filter((t) => t.enabled).map((appType) => (
                              <SelectItem key={appType.id} value={appType.id}>{appType.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {(() => {
                          const selected = DEFAULT_PLATFORM_CONFIG.applicationTypes.find((t) => t.id === applicationType);
                          return selected?.description ? <p className="text-xs text-muted-foreground">{selected.description}</p> : null;
                        })()}
                      </CardContent>
                    </Card>

                    {/* Progressive sections */}
                    {activeSections.map((sectionId) => {
                      const isCompleted = completedSections.has(sectionId);
                      const isCurrent = sectionId === currentSection;
                      const sectionIdx = activeSections.indexOf(sectionId);
                      const currentIdx = activeSections.indexOf(currentSection);
                      const isFuture = sectionIdx > currentIdx;

                      if (isFuture) return null;

                      const lastSection = isLastSection(sectionId);

                      return (
                        <SectionShell
                          key={sectionId}
                          sectionId={sectionId}
                          label={getSectionLabel(sectionId)}
                          summary={getSectionSummary(sectionId)}
                          isCompleted={isCompleted && !isCurrent}
                          isCurrent={isCurrent}
                          onReopen={() => goToSection(sectionId)}
                        >
                          {sectionId === "company_name" && (
                            <CompanyNameSection
                              formData={formData}
                              errors={errors}
                              authState={authState}
                              onFieldChange={updateField}
                              onCompanyBlur={handleCompanyBlur}
                              onVerified={handleVerified}
                              onDismissRecognition={handleDismissRecognition}
                              onContinue={() => goToNextSection()}
                            />
                          )}

                          {sectionId === "prequal" && (
                            <PreQualSection
                              formData={formData}
                              errors={errors}
                              applicationType={applicationType}
                              inlineWarning={inlineWarning}
                              qualificationPassed={qualificationPassed}
                              onFieldChange={updateField}
                              onContinue={() => handleSectionContinue("prequal")}
                            />
                          )}

                          {sectionId === "docs_lightweight" && (
                            <DocumentsSection
                              documents={preQualDocuments}
                              uploadedDocs={uploadedDocs}
                              documentVerification={documentVerification}
                              draggedOver={draggedOver}
                              enableOCR={flowConfig.features.enableOCR}
                              isLastSection={lastSection}
                              isSubmitting={isSubmitting}
                              subtitle="Upload these documents to verify your application. Additional documents may be requested during underwriting."
                              onFileUpload={handleFileUpload}
                              onRemoveFile={handleRemoveFile}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              onContinue={() => goToNextSection()}
                              onSubmit={handleFinalSubmit}
                            />
                          )}

                          {sectionId === "identity" && (
                            <IdentitySection
                              formData={formData}
                              errors={errors}
                              authState={authState}
                              fields={fieldsByCategory["identity"] || []}
                              isLastSection={lastSection}
                              isSubmitting={isSubmitting}
                              onFieldChange={updateField}
                              onContinue={lastSection ? handleFinalSubmit : () => handleSectionContinue("identity")}
                            />
                          )}

                          {sectionId === "contact" && (
                            <ContactSection
                              formData={formData}
                              errors={errors}
                              authState={authState}
                              fields={fieldsByCategory["contact"] || []}
                              isLastSection={lastSection}
                              isSubmitting={isSubmitting}
                              onFieldChange={updateField}
                              onEmailBlur={handleEmailBlur}
                              onContinue={lastSection ? handleFinalSubmit : () => handleSectionContinue("contact")}
                            />
                          )}

                          {sectionId === "financial" && (
                            <FinancialSection
                              formData={formData}
                              errors={errors}
                              fields={fieldsByCategory["financial"] || []}
                              hasEquipmentSection={hasEquipmentSection}
                              isLastSection={lastSection}
                              isSubmitting={isSubmitting}
                              onFieldChange={updateField}
                              onContinue={lastSection ? handleFinalSubmit : () => handleSectionContinue("financial")}
                            />
                          )}

                          {sectionId === "equipment" && (
                            <EquipmentSection
                              applicationType={applicationType}
                              equipmentItems={equipmentItems}
                              equipmentTotalValue={equipmentTotalValue}
                              isLastSection={lastSection}
                              isSubmitting={isSubmitting}
                              onEquipmentChange={handleEquipmentChange}
                              onContinue={() => goToNextSection()}
                              onSubmit={handleFinalSubmit}
                            />
                          )}

                          {sectionId === "guarantor" && (
                            <GuarantorSection
                              formData={formData}
                              errors={errors}
                              fields={fieldsByCategory["guarantor"] || []}
                              isLastSection={lastSection}
                              isSubmitting={isSubmitting}
                              onFieldChange={updateField}
                              onContinue={lastSection ? handleFinalSubmit : () => handleSectionContinue("guarantor")}
                            />
                          )}
                        </SectionShell>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>

          {/* Right sidebar: Order Summary (vendor with order details only) */}
          {hasOrderDetails && orderDetails && (
            <div className="lg:col-span-1">
              <OrderSummary orderDetails={orderDetails} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedApplicationForm;
