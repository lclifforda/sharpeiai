import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, RefreshCw } from "lucide-react";

interface RenewalOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockCustomers = [
  { name: "TechCorp Solutions", riskScore: 92, currentLease: "Laptop Dell XPS 15", leaseValue: 45000, remainingMonths: 6, currentUnits: 15 },
  { name: "Innovation Labs", riskScore: 78, currentLease: "MacBook Pro 16", leaseValue: 62000, remainingMonths: 12, currentUnits: 8 },
  { name: "Global Industries", riskScore: 85, currentLease: "HP Workstation Z8", leaseValue: 89000, remainingMonths: 8, currentUnits: 25 },
  { name: "Startup Ventures", riskScore: 65, currentLease: "Surface Laptop 5", leaseValue: 28000, remainingMonths: 4, currentUnits: 5 },
];

const newEquipmentOptions = [
  { name: "MacBook Pro M3 Max", value: 95000, upgrade: true },
  { name: "Dell XPS 17 (2024)", value: 52000, upgrade: true },
  { name: "HP Workstation Z9", value: 125000, upgrade: true },
  { name: "Lenovo ThinkPad P1 Gen 6", value: 68000, upgrade: true },
];

const RenewalOfferDialog = ({ open, onOpenChange }: RenewalOfferDialogProps) => {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [newUnits, setNewUnits] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("36");
  const [includeInsurance, setIncludeInsurance] = useState("yes");
  const [includeMaintenance, setIncludeMaintenance] = useState("comprehensive");

  const customerData = mockCustomers.find(c => c.name === customerName);
  const newEquipmentData = newEquipmentOptions.find(e => e.name === newEquipment);

  const calculateTradeInValue = () => {
    if (!customerData) return 0;
    const remainingValue = (customerData.leaseValue * customerData.remainingMonths) / 36;
    return Math.round(remainingValue * 0.6); // 60% trade-in value
  };

  const calculateRenewalOffer = () => {
    if (!customerData || !newEquipmentData || !newUnits) return null;

    const units = parseInt(newUnits);
    const tradeInValue = calculateTradeInValue();
    const totalNewEquipmentCost = newEquipmentData.value * units;
    const netEquipmentCost = totalNewEquipmentCost - tradeInValue;
    const monthlyBase = netEquipmentCost / parseInt(leaseTerm);
    
    const insuranceCost = includeInsurance === "yes" ? monthlyBase * 0.03 : 0;
    const maintenanceCost = includeMaintenance === "comprehensive" ? monthlyBase * 0.05 : 
                           includeMaintenance === "basic" ? monthlyBase * 0.02 : 0;
    
    const monthlyTotal = monthlyBase + insuranceCost + maintenanceCost;
    
    // Loyalty discount for high risk scores
    const loyaltyDiscount = customerData.riskScore >= 80 ? monthlyTotal * 0.10 : 
                           customerData.riskScore >= 70 ? monthlyTotal * 0.05 : 0;
    
    const finalMonthly = monthlyTotal - loyaltyDiscount;

    return {
      units,
      totalNewEquipmentCost,
      tradeInValue,
      netEquipmentCost,
      monthlyBase: Math.round(monthlyBase),
      insuranceCost: Math.round(insuranceCost),
      maintenanceCost: Math.round(maintenanceCost),
      monthlyTotal: Math.round(monthlyTotal),
      loyaltyDiscount: Math.round(loyaltyDiscount),
      finalMonthly: Math.round(finalMonthly),
      totalCost: Math.round(finalMonthly * parseInt(leaseTerm)),
    };
  };

  const offer = calculateRenewalOffer();
  const riskLevel = customerData && customerData.riskScore >= 80 ? "Low Risk" : 
                    customerData && customerData.riskScore >= 70 ? "Medium Risk" : "High Risk";

  const handleGenerateOffer = () => {
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setCustomerName("");
    setNewEquipment("");
    setNewUnits("");
    setLeaseTerm("36");
    setIncludeInsurance("yes");
    setIncludeMaintenance("comprehensive");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-gradient-start" />
            Generate Renewal & Upgrade Offer
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer" className="mb-3 block">Select Existing Customer</Label>
                <Select value={customerName} onValueChange={setCustomerName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose customer with active lease" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.name} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {customerData && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Current Lease Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equipment:</span>
                      <span className="font-medium">{customerData.currentLease}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Units:</span>
                      <span className="font-medium">{customerData.currentUnits} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Lease Value:</span>
                      <span className="font-medium">${customerData.leaseValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining Months:</span>
                      <span className="font-medium">{customerData.remainingMonths} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Score:</span>
                      <Badge variant={customerData.riskScore >= 80 ? "default" : customerData.riskScore >= 70 ? "secondary" : "destructive"}>
                        {customerData.riskScore}/100 - {riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Trade-In Value:</span>
                      <span className="font-semibold text-gradient-start">${calculateTradeInValue().toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div>
                <Label htmlFor="newEquipment">New Equipment (Upgrade)</Label>
                <Select value={newEquipment} onValueChange={setNewEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new equipment" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {newEquipmentOptions.map((equipment) => (
                      <SelectItem key={equipment.name} value={equipment.name}>
                        {equipment.name} - ${equipment.value.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="newUnits">Number of Units</Label>
                <Input
                  id="newUnits"
                  type="number"
                  min="1"
                  placeholder="Enter number of units"
                  value={newUnits}
                  onChange={(e) => setNewUnits(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="leaseTerm">New Lease Term (months)</Label>
                <Select value={leaseTerm} onValueChange={setLeaseTerm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insurance">Insurance Coverage</Label>
                  <Select value={includeInsurance} onValueChange={setIncludeInsurance}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="yes">Yes (+3%)</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maintenance">Maintenance Plan</Label>
                  <Select value={includeMaintenance} onValueChange={setIncludeMaintenance}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="comprehensive">Comprehensive (+5%)</SelectItem>
                      <SelectItem value="basic">Basic (+2%)</SelectItem>
                      <SelectItem value="no">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerateOffer} 
              className="w-full"
              disabled={!customerName || !newEquipment || !newUnits}
            >
              Generate Renewal Offer
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-gradient-start/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gradient-start" />
                  Upgrade Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Current</p>
                    <p className="font-medium">{customerData?.currentLease}</p>
                    <p className="text-xs text-muted-foreground mt-1">{customerData?.currentUnits} units</p>
                    <p className="text-xs text-muted-foreground">${customerData?.leaseValue.toLocaleString()}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gradient-start" />
                  <div className="text-center flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Upgrade To</p>
                    <p className="font-medium">{newEquipment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{offer?.units} units</p>
                    <p className="text-xs text-muted-foreground">${newEquipmentData?.value.toLocaleString()} per unit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Renewal Offer Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New Equipment ({offer?.units} units × ${newEquipmentData?.value.toLocaleString()}):</span>
                  <span>${offer?.totalNewEquipmentCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gradient-start font-medium">
                  <span>Trade-In Credit:</span>
                  <span>-${offer?.tradeInValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Net Equipment Cost:</span>
                  <span className="font-medium">${offer?.netEquipmentCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Monthly Payment:</span>
                  <span>${offer?.monthlyBase.toLocaleString()}/mo</span>
                </div>
                {includeInsurance === "yes" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance:</span>
                    <span>+${offer?.insuranceCost.toLocaleString()}/mo</span>
                  </div>
                )}
                {includeMaintenance !== "no" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maintenance ({includeMaintenance}):</span>
                    <span>+${offer?.maintenanceCost.toLocaleString()}/mo</span>
                  </div>
                )}
                {offer && offer.loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-sm text-gradient-start font-medium">
                    <span>Loyalty Discount:</span>
                    <span>-${offer.loyaltyDiscount.toLocaleString()}/mo</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                  <span>Final Monthly Payment:</span>
                  <span className="gradient-sharpei-text">${offer?.finalMonthly.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total over {leaseTerm} months:</span>
                  <span>${offer?.totalCost.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {customerData && customerData.riskScore >= 80 && (
              <Card className="bg-gradient-to-br from-gradient-start/10 to-gradient-end/10 border-gradient-start/20">
                <CardHeader>
                  <CardTitle className="text-sm gradient-sharpei-text">🎉 Special Renewal Incentive</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    As a valued customer with excellent payment history, enjoy an additional 10% loyalty discount
                    and expedited approval for this upgrade!
                  </p>
                </CardContent>
              </Card>
            )}

            {customerData && customerData.riskScore < 70 && (
              <Card className="bg-muted border-muted-foreground/20">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Risk Assessment Notice</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    This renewal requires additional review due to risk score. Consider requiring deposit or 
                    offering shorter lease terms with higher monthly payments.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Generate Another
              </Button>
              <Button className="flex-1">
                Send Renewal Offer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RenewalOfferDialog;