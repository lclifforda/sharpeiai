import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, TrendingUp, RefreshCw, Mail, Send } from "lucide-react";

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
  const [emailDraft, setEmailDraft] = useState("");

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

  const generateEmailDraft = () => {
    if (!customerData || !offer || !newEquipment) return "";
    
    return `Subject: Exciting Equipment Upgrade Opportunity - Renewal Offer for ${customerData.name}

Dear ${customerData.name} Team,

We're pleased to present an exclusive renewal and upgrade offer tailored specifically for your business needs.

CURRENT LEASE SUMMARY
Equipment: ${customerData.currentLease} (${customerData.currentUnits} units)
Remaining Term: ${customerData.remainingMonths} months
Trade-In Value: $${calculateTradeInValue().toLocaleString()}

UPGRADE PROPOSAL
New Equipment: ${newEquipment} (${offer.units} units)
Lease Term: ${leaseTerm} months
${includeInsurance === "yes" ? "Insurance Coverage: Included\n" : ""}${includeMaintenance !== "no" ? `Maintenance Plan: ${includeMaintenance.charAt(0).toUpperCase() + includeMaintenance.slice(1)}\n` : ""}
PRICING BREAKDOWN
Equipment Cost: $${offer.totalNewEquipmentCost.toLocaleString()}
Trade-In Credit: -$${offer.tradeInValue.toLocaleString()}
Base Monthly Payment: $${offer.monthlyBase.toLocaleString()}/month
${offer.insuranceCost > 0 ? `Insurance: +$${offer.insuranceCost.toLocaleString()}/month\n` : ""}${offer.maintenanceCost > 0 ? `Maintenance: +$${offer.maintenanceCost.toLocaleString()}/month\n` : ""}${offer.loyaltyDiscount > 0 ? `Loyalty Discount: -$${offer.loyaltyDiscount.toLocaleString()}/month\n` : ""}
FINAL MONTHLY PAYMENT: $${offer.finalMonthly.toLocaleString()}/month
Total Investment: $${offer.totalCost.toLocaleString()} over ${leaseTerm} months

${customerData.riskScore >= 80 ? "🎉 SPECIAL OFFER: As a valued customer with excellent payment history, you qualify for our expedited approval process and enhanced loyalty benefits!\n\n" : ""}This offer is valid for 30 days and includes our standard warranty and support services. We're confident this upgrade will enhance your operational efficiency and provide excellent value for your investment.

Please let us know if you have any questions or would like to discuss this proposal further. We're here to support your business growth.

Best regards,
Sharpei AI Leasing Team`;
  };

  const handlePrepareEmail = () => {
    const draft = generateEmailDraft();
    setEmailDraft(draft);
    setStep(3);
  };

  const handleSendEmail = () => {
    // Mock send - in real implementation would call backend
    alert("Email sent successfully!");
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setStep(1);
    setCustomerName("");
    setNewEquipment("");
    setNewUnits("");
    setLeaseTerm("36");
    setIncludeInsurance("yes");
    setIncludeMaintenance("comprehensive");
    setEmailDraft("");
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
        ) : step === 2 ? (
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
              <Button onClick={handlePrepareEmail} className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Draft Email
              </Button>
            </div>
          </div>
        ) : step === 3 ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gradient-start" />
                  Email Draft - Renewal Offer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient" className="mb-2 block">To:</Label>
                  <Input 
                    id="recipient" 
                    value={`${customerData?.name} <contact@${customerData?.name.toLowerCase().replace(/\s+/g, '')}.com>`}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emailBody" className="mb-2 block">Message:</Label>
                  <Textarea 
                    id="emailBody"
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>This email includes the complete renewal offer with pricing breakdown and customer-specific benefits.</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                Back to Offer
              </Button>
              <Button onClick={handleSendEmail} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default RenewalOfferDialog;