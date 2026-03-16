import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FieldRenderer from "../FieldRenderer";
import { FIELD_CATEGORY_LABELS, type EnabledField } from "@/services/platformConfigMockData";

interface FinancialSectionProps {
  formData: Record<string, string>;
  errors: Record<string, string>;
  fields: EnabledField[];
  hasEquipmentSection: boolean;
  isLastSection: boolean;
  isSubmitting: boolean;
  onFieldChange: (fieldId: string, value: string) => void;
  onContinue: () => void;
}

export default function FinancialSection({
  formData,
  errors,
  fields,
  hasEquipmentSection,
  isLastSection,
  isSubmitting,
  onFieldChange,
  onContinue,
}: FinancialSectionProps) {
  // If equipment section exists, hide equipmentCost and downPayment (handled later)
  const visibleFields = hasEquipmentSection
    ? fields.filter((f) => f.id !== "equipmentCost" && f.id !== "downPayment")
    : fields;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{FIELD_CATEGORY_LABELS["financial"] || "Financial Details"}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {visibleFields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={formData[field.id] || ""}
              error={errors[field.id]}
              onChange={onFieldChange}
            />
          ))}
        </div>
        <Button
          onClick={onContinue}
          disabled={isSubmitting}
          className="w-full bg-foreground hover:bg-foreground/90 text-background"
          size="lg"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Assessing...</>
          ) : isLastSection ? "Submit Application" : "Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}
