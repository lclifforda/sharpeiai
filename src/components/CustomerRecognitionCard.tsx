import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Building2, ArrowRight, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import {
  findCompanyByName,
  findCompanyByRepEmail,
  maskEmail,
  type CustomerDetail,
  type Representative,
} from "@/data/mockCustomers";

type CardStep = "recognized" | "selectRep" | "otp" | "verified";

interface VerifiedData {
  companyId: string;
  company: CustomerDetail;
  representative: Representative;
}

interface CustomerRecognitionCardProps {
  companyName: string;
  email: string;
  onVerified: (data: VerifiedData) => void;
  onDismiss: () => void;
}

function formatRepName(name: string): string {
  const parts = name.split(" ");
  if (parts.length < 2) return name;
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

const CustomerRecognitionCard = ({
  companyName,
  email,
  onVerified,
  onDismiss,
}: CustomerRecognitionCardProps) => {
  const [step, setStep] = useState<CardStep>("recognized");
  const [matchedCompanyId, setMatchedCompanyId] = useState<string | null>(null);
  const [matchedCompany, setMatchedCompany] = useState<CustomerDetail | null>(null);
  const [selectedRepId, setSelectedRepId] = useState<string>("");
  const [otpValue, setOtpValue] = useState("");
  const [verifiedRep, setVerifiedRep] = useState<Representative | null>(null);

  useEffect(() => {
    const byName = findCompanyByName(companyName);
    if (byName) {
      setMatchedCompanyId(byName.id);
      setMatchedCompany(byName.company);
      return;
    }
    const byEmail = findCompanyByRepEmail(email);
    if (byEmail) {
      setMatchedCompanyId(byEmail.id);
      setMatchedCompany(byEmail.company);
      return;
    }
  }, [companyName, email]);

  const handleAuthenticate = () => {
    setStep("selectRep");
  };

  const handleSendVerification = () => {
    if (!selectedRepId || !matchedCompany) return;
    setStep("otp");
  };

  const handleVerify = () => {
    if (otpValue.length !== 6 || !matchedCompany || !matchedCompanyId) return;
    const rep = matchedCompany.representatives.find((r) => r.id === selectedRepId);
    if (!rep) return;
    setVerifiedRep(rep);
    setStep("verified");
    onVerified({ companyId: matchedCompanyId, company: matchedCompany, representative: rep });
  };

  const handleResendCode = () => {
    setOtpValue("");
  };

  const selectedRep = matchedCompany?.representatives.find((r) => r.id === selectedRepId);

  if (!matchedCompany) return null;

  if (step === "verified" && verifiedRep) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Verified as {verifiedRep.name} &mdash; {matchedCompany.name}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your application has been pre-filled.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "otp") {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Enter verification code</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">
                {selectedRep ? maskEmail(selectedRep.email) : ""}
              </span>
            </span>
          </div>

          <div className="flex justify-center py-2">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Didn't receive it?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-primary hover:underline font-medium"
            >
              Resend code
            </button>
          </p>

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOtpValue("");
                setStep("selectRep");
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              type="button"
              onClick={handleVerify}
              disabled={otpValue.length !== 6}
            >
              Verify
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "selectRep") {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Select your account</h3>

          <RadioGroup
            value={selectedRepId}
            onValueChange={setSelectedRepId}
            className="space-y-3"
          >
            {matchedCompany.representatives.map((rep) => (
              <label
                key={rep.id}
                htmlFor={`rep-${rep.id}`}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRepId === rep.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <RadioGroupItem value={rep.id} id={`rep-${rep.id}`} className="mt-1" />
                <div>
                  <p className="font-medium">
                    {formatRepName(rep.name)} &mdash; {rep.role}
                  </p>
                  <p className="text-sm text-muted-foreground">{maskEmail(rep.email)}</p>
                </div>
              </label>
            ))}
          </RadioGroup>

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedRepId("");
                setStep("recognized");
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              type="button"
              onClick={handleSendVerification}
              disabled={!selectedRepId}
            >
              Send Verification
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // step === "recognized"
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold">We found your company in our system</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We already have information about your company. Authenticate to your email to
              auto-fill your application, or continue as a guest.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onDismiss}>
            Continue as Guest
          </Button>
          <Button type="button" onClick={handleAuthenticate}>
            Authenticate
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerRecognitionCard;
