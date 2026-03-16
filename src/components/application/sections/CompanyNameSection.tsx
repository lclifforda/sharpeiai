import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FieldRenderer from "../FieldRenderer";
import CompanyRecognitionCard from "@/components/CompanyRecognitionCard";
import type { AuthState } from "../types";
import type { EnabledField } from "@/services/platformConfigMockData";

interface CompanyNameSectionProps {
  formData: Record<string, string>;
  errors: Record<string, string>;
  authState: AuthState;
  onFieldChange: (fieldId: string, value: string) => void;
  onCompanyBlur: () => void;
  onVerified: (data: { companyId: string; company: any; representative: any }) => void;
  onDismissRecognition: () => void;
  onContinue: () => void;
}

export default function CompanyNameSection({
  formData,
  errors,
  authState,
  onFieldChange,
  onCompanyBlur,
  onVerified,
  onDismissRecognition,
  onContinue,
}: CompanyNameSectionProps) {
  const companyField: EnabledField = {
    id: "companyName",
    label: "Company Legal Name",
    type: "text",
    category: "identity",
    required: true,
    aiNote: "",
  } as EnabledField;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Company Name</h2>
        <p className="text-sm text-muted-foreground">Enter your company legal name to get started</p>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldRenderer
            field={companyField}
            value={formData.companyName || ""}
            error={errors.companyName}
            onChange={onFieldChange}
            onBlur={onCompanyBlur}
            authState={authState}
          />
        </div>
        {authState.status === "recognized" && (
          <CompanyRecognitionCard
            companyName={formData.companyName || ""}
            email={formData.contactEmail || ""}
            onVerified={onVerified}
            onDismiss={onDismissRecognition}
          />
        )}
        {!formData.companyName?.trim() && (
          <p className="text-xs text-muted-foreground">Please enter your company name to continue</p>
        )}
        <Button
          onClick={onContinue}
          disabled={!formData.companyName?.trim()}
          className="w-full bg-foreground hover:bg-foreground/90 text-background"
          size="lg"
        >
          {authState.status === "recognized" ? "I'm a new applicant \u2014 Continue" : "Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}
