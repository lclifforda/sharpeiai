import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import EquipmentChat from "@/components/EquipmentChat";
import type { EquipmentItem } from "@/components/EquipmentChat";

interface EquipmentSectionProps {
  applicationType: string;
  equipmentItems: EquipmentItem[];
  equipmentTotalValue: number;
  isLastSection: boolean;
  isSubmitting: boolean;
  onEquipmentChange: (items: EquipmentItem[], totalValue: number) => void;
  onContinue: () => void;
  onSubmit: () => void;
}

export default function EquipmentSection({
  applicationType,
  equipmentItems,
  equipmentTotalValue,
  isLastSection,
  isSubmitting,
  onEquipmentChange,
  onContinue,
  onSubmit,
}: EquipmentSectionProps) {
  if (applicationType === "working-capital") {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Working Capital Amount</h2>
          <p className="text-sm text-muted-foreground">How much working capital are you looking for?</p>
          <Input
            type="number"
            placeholder="Enter amount"
            value={equipmentTotalValue || ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              onEquipmentChange(
                [{ id: "1", name: "Working Capital", quantity: 1, unitValue: val, totalValue: val, year: new Date().getFullYear().toString(), condition: "new" as const }],
                val
              );
            }}
            className="text-lg"
          />
          <Button
            onClick={isLastSection ? onSubmit : onContinue}
            disabled={!equipmentTotalValue || equipmentTotalValue <= 0 || isSubmitting}
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

  return (
    <div className="space-y-4">
      <EquipmentChat onEquipmentChange={onEquipmentChange} />
      <Button
        onClick={() => {
          if (equipmentItems.length === 0 || equipmentTotalValue <= 0) {
            alert("Please add at least one equipment item.");
            return;
          }
          if (isLastSection) onSubmit();
          else onContinue();
        }}
        disabled={equipmentItems.length === 0 || equipmentTotalValue <= 0 || isSubmitting}
        className="w-full bg-foreground hover:bg-foreground/90 text-background"
        size="lg"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Assessing...</>
        ) : isLastSection ? "Submit Application" : "Continue"}
      </Button>
    </div>
  );
}
