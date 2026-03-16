import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import FieldRenderer from "../FieldRenderer";
import type { EnabledField } from "@/services/platformConfigMockData";

const ENTITY_TYPE_OPTIONS = ["LLC", "Corporation", "S-Corporation", "Sole Proprietor", "Partnership", "Non-Profit"];
const COMPANY_SIZE_OPTIONS = [
  { value: "5", label: "1\u201310 employees" },
  { value: "30", label: "11\u201350 employees" },
  { value: "125", label: "51\u2013200 employees" },
  { value: "250", label: "201+ employees" },
];

interface PreQualSectionProps {
  formData: Record<string, string>;
  errors: Record<string, string>;
  applicationType: string;
  inlineWarning: string | null;
  qualificationPassed: boolean;
  onFieldChange: (fieldId: string, value: string) => void;
  onContinue: () => void;
}

export default function PreQualSection({
  formData,
  errors,
  applicationType,
  inlineWarning,
  qualificationPassed,
  onFieldChange,
  onContinue,
}: PreQualSectionProps) {
  const dateField: EnabledField = {
    id: "dateEstablished",
    label: "Date Established",
    type: "date",
    category: "identity",
    required: true,
    aiNote: "When was your business founded?",
  } as EnabledField;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Pre-Qualification</h2>
        <p className="text-sm text-muted-foreground">A few quick questions to see if we can help</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Entity Type *</Label>
            <Select value={formData.entityType || ""} onValueChange={(v) => onFieldChange("entityType", v)}>
              <SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger>
              <SelectContent>
                {ENTITY_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Company Size *</Label>
            <Select value={formData.numberOfEmployees || ""} onValueChange={(v) => onFieldChange("numberOfEmployees", v)}>
              <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
              <SelectContent>
                {COMPANY_SIZE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <FieldRenderer
              field={dateField}
              value={formData.dateEstablished || ""}
              error={errors.dateEstablished}
              onChange={onFieldChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Approximate Annual Revenue ($) *</Label>
            <Input
              type="number"
              placeholder="e.g. 500000"
              value={formData.annualRevenue || ""}
              onChange={(e) => onFieldChange("annualRevenue", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{applicationType === "working-capital" ? "Requested amount ($) *" : "Total financing amount ($) *"}</Label>
            {applicationType === "working-capital" ? (
              <Input
                type="number"
                placeholder="e.g. 50000"
                value={formData.requestedAmount || ""}
                onChange={(e) => onFieldChange("requestedAmount", e.target.value)}
              />
            ) : (
              <>
                <Input
                  type="number"
                  placeholder="e.g. 75000"
                  value={formData.equipmentCost || formData.requestedAmount || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    onFieldChange("equipmentCost", v);
                    onFieldChange("requestedAmount", v);
                  }}
                />
                <p className="text-xs text-muted-foreground">Enter the total dollar amount you need &mdash; you&apos;ll add equipment details in the next step.</p>
              </>
            )}
          </div>
        </div>
        {inlineWarning && (
          <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500/50 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">{inlineWarning}</p>
          </div>
        )}
        {qualificationPassed && (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-500/50 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">Pre-qualification passed &mdash; looking good!</p>
          </div>
        )}
        <Button
          onClick={onContinue}
          disabled={qualificationPassed}
          className="w-full bg-foreground hover:bg-foreground/90 text-background"
          size="lg"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
