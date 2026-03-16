import { useState, useMemo, useCallback } from "react";
import type { SectionId, FlowConfig } from "./types";
import { FIELD_CATEGORY_LABELS } from "@/services/platformConfigMockData";

interface UseSectionProgressionParams {
  flowConfig: FlowConfig;
  hasEquipmentSection: boolean;
  needsGuarantor: boolean;
  guarantorFieldCount: number;
}

export function useSectionProgression({
  flowConfig,
  hasEquipmentSection,
  needsGuarantor,
  guarantorFieldCount,
}: UseSectionProgressionParams) {
  const [currentSection, setCurrentSection] = useState<SectionId>("company_name");
  const [completedSections, setCompletedSections] = useState<Set<SectionId>>(new Set());

  const activeSections = useMemo(() => {
    if (flowConfig.flowType === "merchant") {
      // Merchant: company_name → prequal → info → offers → contract
      const sections: SectionId[] = ["company_name", "prequal", "info"];
      if (flowConfig.features.enableOffers) sections.push("offers");
      if (flowConfig.features.enableContract) sections.push("contract");
      return sections;
    }

    // Bank: progressive sections
    const sections: SectionId[] = ["company_name", "prequal"];
    if (flowConfig.features.enableLightweightDocs) sections.push("docs_lightweight");
    sections.push("identity", "contact", "financial");
    if (hasEquipmentSection) sections.push("equipment");
    if (needsGuarantor && guarantorFieldCount > 0) sections.push("guarantor");
    return sections;
  }, [flowConfig, hasEquipmentSection, needsGuarantor, guarantorFieldCount]);

  const goToNextSection = useCallback(() => {
    const currentIdx = activeSections.indexOf(currentSection);
    if (currentIdx < activeSections.length - 1) {
      setCompletedSections((prev) => new Set([...prev, currentSection]));
      setCurrentSection(activeSections[currentIdx + 1]);
    }
  }, [activeSections, currentSection]);

  const goToSection = useCallback((sectionId: SectionId) => {
    setCurrentSection(sectionId);
  }, []);

  const markCompleted = useCallback((sectionId: SectionId) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  }, []);

  const isLastSection = useCallback((sectionId: SectionId) => {
    return activeSections[activeSections.length - 1] === sectionId;
  }, [activeSections]);

  const resetProgression = useCallback(() => {
    setCurrentSection("company_name");
    setCompletedSections(new Set());
  }, []);

  // Section labels and summaries
  const getSectionLabel = useCallback((sectionId: SectionId): string => {
    switch (sectionId) {
      case "company_name": return "Company Name";
      case "prequal": return "Pre-Qualification";
      case "docs_lightweight": return "Required Documents";
      case "info": return "Info & Docs";
      case "identity": return FIELD_CATEGORY_LABELS["identity"] || "Identity & Business Info";
      case "contact": return FIELD_CATEGORY_LABELS["contact"] || "Contact Information";
      case "financial": return FIELD_CATEGORY_LABELS["financial"] || "Financial Details";
      case "equipment": return "Equipment Details";
      case "guarantor": return FIELD_CATEGORY_LABELS["guarantor"] || "Guarantor / Personal";
      case "documents": return "Documents";
      case "offers": return "Offers";
      case "contract": return "Sign";
      default: return "";
    }
  }, []);

  return {
    currentSection, setCurrentSection,
    completedSections, setCompletedSections,
    activeSections,
    goToNextSection,
    goToSection,
    markCompleted,
    isLastSection,
    resetProgression,
    getSectionLabel,
  };
}
