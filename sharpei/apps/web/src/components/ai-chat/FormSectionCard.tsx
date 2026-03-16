import { useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Pencil, ArrowRight, Bot, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { EnabledField } from "@/services/platformConfigMockData";
import type { ChatSectionId } from "./chatSectionConfig";
import { checkQualification } from "@/lib/qualificationCheck";
import FieldRenderer from "@/components/application/FieldRenderer";

interface FormSectionCardProps {
  sectionId: ChatSectionId;
  title: string;
  fields: EnabledField[];
  initialValues: Record<string, string>;
  onSubmit: (sectionId: ChatSectionId, values: Record<string, string>) => void;
  isSubmitted: boolean;
  submittedValues?: Record<string, string>;
  stepLabel?: string;
  applicationType?: string;
}

// ── Summary formatter ────────────────────────────────────────────────────

const SUMMARY_FORMATTERS: Record<string, (val: string) => string> = {
  annualRevenue: (v) => `Rev: $${formatCompactNumber(v)}`,
  equipmentCost: (v) => `Equip: $${formatCompactNumber(v)}`,
  requestedAmount: (v) => `Requested: $${formatCompactNumber(v)}`,
  downPayment: (v) => `Down: $${formatCompactNumber(v)}`,
  equipmentValue: (v) => `Value: $${formatCompactNumber(v)}`,
  numberOfEmployees: (v) => `${v} employees`,
  ownershipPercentage: (v) => `${v}% ownership`,
  dateEstablished: (v) => `Est. ${v.slice(0, 7)}`,
  guarantorDOB: (v) => `DOB: ${v}`,
  guarantorSSN: () => `SSN: ***-**-****`,
};

function formatCompactNumber(val: string): string {
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toLocaleString();
}

function buildSummaryLine(fields: EnabledField[], values: Record<string, string>): string {
  const parts: string[] = [];
  for (const field of fields) {
    const val = values[field.id];
    if (!val || !val.trim()) continue;
    const formatter = SUMMARY_FORMATTERS[field.id];
    if (formatter) {
      parts.push(formatter(val));
    } else {
      // Use short value, truncate if too long
      const display = val.length > 20 ? val.slice(0, 18) + "..." : val;
      parts.push(display);
    }
  }
  return parts.join("  \u00b7  ");
}

// ── Component ────────────────────────────────────────────────────────────

export default function FormSectionCard({
  sectionId,
  title,
  fields,
  initialValues,
  onSubmit,
  isSubmitted,
  submittedValues,
  stepLabel,
  applicationType = "equipment-financing",
}: FormSectionCardProps) {
  const [localValues, setLocalValues] = useState<Record<string, string>>(() => ({
    ...initialValues,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(!isSubmitted);

  // ── Inline qualification warning (prequal section only) ────────────
  const inlineWarning = useMemo(() => {
    if (sectionId !== "prequal") return null;

    const qualData: any = {};
    if (localValues.dateEstablished) qualData.dateEstablished = localValues.dateEstablished;
    if (localValues.annualRevenue) qualData.annualRevenue = parseFloat(localValues.annualRevenue);
    if (localValues.requestedAmount) qualData.requestedAmount = parseFloat(localValues.requestedAmount);
    if (localValues.equipmentCost) qualData.equipmentCost = parseFloat(localValues.equipmentCost);

    // Only check if at least one field has a value
    const hasAnyValue = Object.values(qualData).some((v) => v !== undefined && v !== null);
    if (!hasAnyValue) return null;

    const result = checkQualification(qualData);
    return result.qualified ? null : result.reason || null;
  }, [sectionId, localValues]);

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setLocalValues((prev) => {
      const next = { ...prev, [fieldId]: value };

      // Prequal: sync equipmentCost ↔ requestedAmount (non working-capital)
      if (sectionId === "prequal" && applicationType !== "working-capital") {
        if (fieldId === "equipmentCost") {
          next.requestedAmount = value;
        } else if (fieldId === "requestedAmount") {
          next.equipmentCost = value;
        }
      }

      return next;
    });

    // Clear error on change
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, [sectionId, applicationType]);

  const handleSubmit = useCallback(() => {
    // Validate required fields
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required) {
        const val = localValues[field.id];
        if (!val || !val.trim()) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
    }

    // Email validation for contact section
    if (sectionId === "contact" && localValues.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(localValues.contactEmail)) {
        newErrors.contactEmail = "Please enter a valid email address";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsEditing(false);
    onSubmit(sectionId, localValues);
  }, [fields, localValues, onSubmit, sectionId]);

  const handleEdit = useCallback(() => {
    // Re-open the form for editing
    if (submittedValues) {
      setLocalValues({ ...submittedValues });
    }
    setIsEditing(true);
  }, [submittedValues]);

  // ── Summary mode ─────────────────────────────────────────────────────

  if (isSubmitted && !isEditing) {
    const displayValues = submittedValues || localValues;
    const summaryText = buildSummaryLine(fields, displayValues);

    return (
      <div className="flex gap-2 mb-1">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-2 max-w-full">
            <span className="text-xs font-medium text-foreground truncate">{title}</span>
            <span className="text-xs text-muted-foreground truncate">{summaryText}</span>
            <button
              onClick={handleEdit}
              className="ml-1 p-1 rounded hover:bg-accent flex-shrink-0 transition-colors"
              title="Edit this section"
            >
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Edit mode ────────────────────────────────────────────────────────

  return (
    <div className="flex gap-2 mb-2">
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
        <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
      </div>
      <Card className="flex-1 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%] border-primary/20">
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {stepLabel && (
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {stepLabel}
              </span>
            )}
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div
                key={field.id}
                className={
                  // Full-width fields: addresses, descriptions, use of funds
                  ["streetAddress", "equipmentDescription", "useOfFunds"].includes(field.id)
                    ? "md:col-span-2"
                    : ""
                }
              >
                <FieldRenderer
                  field={field}
                  value={localValues[field.id] || ""}
                  error={errors[field.id]}
                  onChange={handleFieldChange}
                />
              </div>
            ))}
          </div>

          {/* Inline qualification warning (prequal) */}
          {inlineWarning && (
            <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500/50">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">{inlineWarning}</p>
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end pt-1">
            <Button
              onClick={handleSubmit}
              size="sm"
              className="gap-1.5"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
