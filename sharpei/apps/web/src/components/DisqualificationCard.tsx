import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import type { QualificationResult } from "@/lib/qualificationCheck";

interface DisqualificationCardProps {
  result: QualificationResult;
  email?: string;
  onEmailChange?: (email: string) => void;
  onSubmit?: (data: { email: string }) => void;
  onReturnHome?: () => void;
}

const DisqualificationCard = ({
  result,
  email = "",
  onEmailChange,
  onSubmit,
  onReturnHome,
}: DisqualificationCardProps) => {
  const [localEmail, setLocalEmail] = useState(email);
  const refNumber = `REF-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const currentEmail = onEmailChange !== undefined ? email : localEmail;
  const setEmail = onEmailChange ?? setLocalEmail;

  const handleGoBack = () => {
    if (onSubmit && currentEmail.trim()) {
      onSubmit({ email: currentEmail.trim() });
    } else if (onReturnHome) {
      onReturnHome();
    } else {
      window.location.href = "/";
    }
  };

  const canSubmit = currentEmail.trim().length > 0;

  return (
    <Card className="border-2 border-red-500 dark:border-red-500">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">We&apos;d Like to Help</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.reason}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            A member of our team will contact you within 1 business day to explore alternatives.
          </p>
          <div className="space-y-2">
            <Label htmlFor="disqualified-email">Email address *</Label>
            <Input
              id="disqualified-email"
              type="email"
              placeholder="you@company.com"
              value={currentEmail}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleGoBack}
            disabled={onSubmit && !canSubmit}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            Go Back Home
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Reference: {refNumber}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisqualificationCard;
