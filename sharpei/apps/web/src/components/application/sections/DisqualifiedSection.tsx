import DisqualificationCard from "@/components/DisqualificationCard";
import type { QualificationResult } from "@/lib/qualificationCheck";

interface DisqualifiedSectionProps {
  result: QualificationResult;
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (data: { email: string }) => void;
}

export default function DisqualifiedSection({
  result,
  email,
  onEmailChange,
  onSubmit,
}: DisqualifiedSectionProps) {
  return (
    <DisqualificationCard
      result={result}
      email={email}
      onEmailChange={onEmailChange}
      onSubmit={onSubmit}
    />
  );
}
