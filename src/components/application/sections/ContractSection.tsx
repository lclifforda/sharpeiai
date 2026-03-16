import { Card, CardContent } from "@/components/ui/card";
import ContractCard from "@/components/ContractCard";

interface ContractSectionProps {
  selectedOffer: any;
  onSign: () => void;
}

export default function ContractSection({ selectedOffer, onSign }: ContractSectionProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Review & Sign Contract</h2>
          <p className="text-muted-foreground">Please review your financing agreement and sign below</p>
        </div>
        <ContractCard offer={selectedOffer} onSign={onSign} />
      </CardContent>
    </Card>
  );
}
