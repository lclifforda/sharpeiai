import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";

interface LeaseQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeaseQuoteDialog = ({ open, onOpenChange }: LeaseQuoteDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showEmailDraft, setShowEmailDraft] = useState(false);
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [formData, setFormData] = useState({
    equipmentType: "",
    equipmentValue: "",
    leaseTerm: "",
    customerName: "",
    additionalNotes: "",
    includeInsurance: "yes",
    includeMaintenance: "no",
    creditScore: "",
    yearsInBusiness: "",
    annualRevenue: ""
  });

  // Calculate risk score based on customer data
  const calculateRiskScore = () => {
    let score = 0;
    const creditScore = parseInt(formData.creditScore);
    const years = parseInt(formData.yearsInBusiness);
    const revenue = parseInt(formData.annualRevenue);
    
    // Credit score assessment (40% weight)
    if (creditScore >= 750) score += 40;
    else if (creditScore >= 700) score += 30;
    else if (creditScore >= 650) score += 20;
    else score += 10;
    
    // Business history (30% weight)
    if (years >= 10) score += 30;
    else if (years >= 5) score += 20;
    else if (years >= 2) score += 10;
    else score += 5;
    
    // Revenue (30% weight)
    if (revenue >= 5000000) score += 30;
    else if (revenue >= 1000000) score += 20;
    else if (revenue >= 500000) score += 10;
    else score += 5;
    
    return score;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Low", color: "text-green-600", bgColor: "bg-green-50" };
    if (score >= 60) return { level: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { level: "High", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowResult(false);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsGenerating(false);
    setShowResult(true);
  };

  const resetForm = () => {
    setShowResult(false);
    setShowEmailDraft(false);
    setFormData({
      equipmentType: "",
      equipmentValue: "",
      leaseTerm: "",
      customerName: "",
      additionalNotes: "",
      includeInsurance: "yes",
      includeMaintenance: "no",
      creditScore: "",
      yearsInBusiness: "",
      annualRevenue: ""
    });
  };

  const handleSaveAndSend = async () => {
    setIsDraftingEmail(true);
    setShowEmailDraft(true);
    
    // Simulate AI drafting email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsDraftingEmail(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-gradient-start" />
            Generate Lease Quote with AI
          </DialogTitle>
        </DialogHeader>

        {!showResult ? (
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentType">Equipment Type</Label>
                <Select
                  value={formData.equipmentType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentType: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction Equipment</SelectItem>
                    <SelectItem value="medical">Medical Equipment</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing Equipment</SelectItem>
                    <SelectItem value="technology">Technology & IT</SelectItem>
                    <SelectItem value="transportation">Transportation & Vehicles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipmentValue">Equipment Value ($)</Label>
                <Input
                  id="equipmentValue"
                  type="number"
                  placeholder="250000"
                  value={formData.equipmentValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipmentValue: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leaseTerm">Lease Term (months)</Label>
                <Select
                  value={formData.leaseTerm}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, leaseTerm: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="ABC Corporation"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="includeInsurance">Equipment Insurance</Label>
                  <Select
                    value={formData.includeInsurance}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, includeInsurance: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Include Insurance</SelectItem>
                      <SelectItem value="no">No Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="includeMaintenance">Maintenance Package</Label>
                  <Select
                    value={formData.includeMaintenance}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, includeMaintenance: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Maintenance</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      <SelectItem value="no">No Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Customer Risk Assessment</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="creditScore">Credit Score</Label>
                    <Input
                      id="creditScore"
                      type="number"
                      placeholder="720"
                      value={formData.creditScore}
                      onChange={(e) => setFormData(prev => ({ ...prev, creditScore: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsInBusiness">Years in Business</Label>
                    <Input
                      id="yearsInBusiness"
                      type="number"
                      placeholder="5"
                      value={formData.yearsInBusiness}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearsInBusiness: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
                    <Input
                      id="annualRevenue"
                      type="number"
                      placeholder="2500000"
                      value={formData.annualRevenue}
                      onChange={(e) => setFormData(prev => ({ ...prev, annualRevenue: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any special requirements or considerations..."
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-sharpei text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI is generating your quote...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Quote
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Quote generated successfully!</span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lease Quote Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-semibold">{formData.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Equipment Type</p>
                    <p className="font-semibold capitalize">{formData.equipmentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Equipment Value</p>
                    <p className="font-semibold">${parseInt(formData.equipmentValue).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lease Term</p>
                    <p className="font-semibold">{formData.leaseTerm} months</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Recommended Lease Structure</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Payment</span>
                      <span className="font-semibold">${(parseInt(formData.equipmentValue) / parseInt(formData.leaseTerm) * 1.15).toFixed(0)}</span>
                    </div>
                    {formData.includeInsurance === "yes" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Equipment Insurance</span>
                        <span className="font-semibold">${(parseInt(formData.equipmentValue) * 0.015).toFixed(0)}/mo</span>
                      </div>
                    )}
                    {formData.includeMaintenance !== "no" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Maintenance ({formData.includeMaintenance === "comprehensive" ? "Comprehensive" : "Basic"})
                        </span>
                        <span className="font-semibold">
                          ${formData.includeMaintenance === "comprehensive" ? "850" : "450"}/mo
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span className="font-semibold">5.5% APR</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Total Monthly Payment</span>
                      <span className="text-primary text-lg">
                        ${(
                          parseInt(formData.equipmentValue) / parseInt(formData.leaseTerm) * 1.15 +
                          (formData.includeInsurance === "yes" ? parseInt(formData.equipmentValue) * 0.015 : 0) +
                          (formData.includeMaintenance === "comprehensive" ? 850 : formData.includeMaintenance === "basic" ? 450 : 0)
                        ).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Residual Value</span>
                      <span className="font-semibold">${(parseInt(formData.equipmentValue) * 0.2).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on current market conditions and the equipment type, this lease structure offers competitive rates with flexible end-of-term options. The equipment category shows strong residual value retention, making this an attractive financing option.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment Card */}
            <Card className={`border-2 ${getRiskLevel(calculateRiskScore()).bgColor}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Customer Risk Assessment</span>
                  <span className={`text-lg font-bold ${getRiskLevel(calculateRiskScore()).color}`}>
                    {getRiskLevel(calculateRiskScore()).level} Risk
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Credit Score:</span>
                    <span className="font-semibold ml-2">{formData.creditScore}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Years in Business:</span>
                    <span className="font-semibold ml-2">{formData.yearsInBusiness}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Annual Revenue:</span>
                    <span className="font-semibold ml-2">${parseInt(formData.annualRevenue).toLocaleString()}</span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Risk Score</span>
                    <span className={`text-2xl font-bold ${getRiskLevel(calculateRiskScore()).color}`}>
                      {calculateRiskScore()}/100
                    </span>
                  </div>
                </div>
                <div className="bg-background/50 p-3 rounded text-sm">
                  <p className="font-medium mb-1">Bank Recommendation:</p>
                  <p className="text-muted-foreground">
                    {calculateRiskScore() >= 80 
                      ? "✅ Approve with special offers - Low risk customer with excellent creditworthiness."
                      : calculateRiskScore() >= 60
                      ? "⚠️ Approve with standard terms - Medium risk, monitor payment history."
                      : "❌ Requires additional review - High risk profile, consider higher interest rate or collateral."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Special Offer Section - Only for Low Risk */}
            {calculateRiskScore() >= 80 && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Special Offer - Limited Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">First 3 months at 1.8% APR (regular 5.5%)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Free maintenance package worth $5,000</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">No down payment required</span>
                  </div>
                  <div className="pt-2 border-t text-sm text-muted-foreground">
                    Offer expires in 7 days • Only available for low-risk customers
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternative Message for Medium/High Risk */}
            {calculateRiskScore() < 80 && (
              <Card className="border-muted">
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {calculateRiskScore() >= 60 
                      ? "Standard terms apply. Special offers are available for customers with risk scores above 80."
                      : "This application requires additional review. Please contact our risk management team for further evaluation."}
                  </p>
                </CardContent>
              </Card>
            )}

            {!showEmailDraft ? (
              <div className="flex gap-3">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Generate Another Quote
                </Button>
                <Button className="flex-1" onClick={handleSaveAndSend}>
                  Save & Send Quote
                </Button>
              </div>
            ) : (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {isDraftingEmail ? "AI is drafting your email..." : "Email Draft Ready"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isDraftingEmail ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Personalizing your offer...</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>To:</Label>
                        <Input value={`${formData.customerName} <${formData.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com>`} readOnly className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Subject:</Label>
                        <Input 
                          value={calculateRiskScore() >= 80 
                            ? `Exclusive Lease Offer for ${formData.equipmentType} - Limited Time Special`
                            : `Lease Quote for ${formData.equipmentType} - ${formData.customerName}`
                          } 
                          readOnly 
                          className="bg-muted/50" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message:</Label>
                        <Textarea 
                          readOnly 
                          className="bg-muted/50 min-h-[320px] font-mono text-sm"
                          value={calculateRiskScore() >= 80 ? `Dear ${formData.customerName},

I'm excited to share an exclusive lease opportunity tailored specifically for you.

We've prepared a competitive quote for your ${formData.equipmentType.charAt(0).toUpperCase() + formData.equipmentType.slice(1)} equipment:

• Equipment Value: $${parseInt(formData.equipmentValue).toLocaleString()}
• Base Monthly Payment: $${(parseInt(formData.equipmentValue) / parseInt(formData.leaseTerm) * 1.15).toFixed(0)}
${formData.includeInsurance === "yes" ? `• Equipment Insurance: $${(parseInt(formData.equipmentValue) * 0.015).toFixed(0)}/month` : ''}
${formData.includeMaintenance !== "no" ? `• ${formData.includeMaintenance === "comprehensive" ? "Comprehensive" : "Basic"} Maintenance: $${formData.includeMaintenance === "comprehensive" ? "850" : "450"}/month` : ''}
• Total Monthly Payment: $${(
  parseInt(formData.equipmentValue) / parseInt(formData.leaseTerm) * 1.15 +
  (formData.includeInsurance === "yes" ? parseInt(formData.equipmentValue) * 0.015 : 0) +
  (formData.includeMaintenance === "comprehensive" ? 850 : formData.includeMaintenance === "basic" ? 450 : 0)
).toFixed(0)}
• Lease Term: ${formData.leaseTerm} months

🎁 SPECIAL LIMITED-TIME OFFER (Expires in 7 days):
✓ First 3 months at 1.8% APR (save on early payments)
✓ Complimentary maintenance package ($5,000 value)
✓ Zero down payment required

Based on your excellent credit profile and business history, you've been pre-approved for our premium terms. This offer represents significant savings and has been structured to maximize your cash flow.

To secure this offer, simply reply to this email or call me directly at (555) 123-4567. I'm here to answer any questions and can help finalize the paperwork within 24 hours.

Looking forward to partnering with you!

Best regards,
Your Leasing Team
Sharpei AI Finance` : `Dear ${formData.customerName},

Thank you for your interest in our leasing services. We've prepared a quote for your ${formData.equipmentType.charAt(0).toUpperCase() + formData.equipmentType.slice(1)} equipment:

• Equipment Value: $${parseInt(formData.equipmentValue).toLocaleString()}
• Base Monthly Payment: $${(parseInt(formData.equipmentValue) / parseInt(formData.leaseTerm) * 1.15).toFixed(0)}
${formData.includeInsurance === "yes" ? `• Equipment Insurance: $${(parseInt(formData.equipmentValue) * 0.015).toFixed(0)}/month` : ''}
${formData.includeMaintenance !== "no" ? `• ${formData.includeMaintenance === "comprehensive" ? "Comprehensive" : "Basic"} Maintenance: $${formData.includeMaintenance === "comprehensive" ? "850" : "450"}/month` : ''}
• Total Monthly Payment: $${(
  parseInt(formData.equipmentValue) / parseInt(formData.leaseTerm) * 1.15 +
  (formData.includeInsurance === "yes" ? parseInt(formData.equipmentValue) * 0.015 : 0) +
  (formData.includeMaintenance === "comprehensive" ? 850 : formData.includeMaintenance === "basic" ? 450 : 0)
).toFixed(0)}
• Lease Term: ${formData.leaseTerm} months
• Interest Rate: 5.5% APR

This quote has been prepared based on your business profile and current market conditions. ${calculateRiskScore() >= 60 ? "We're pleased to offer you standard terms with competitive rates." : "Please note that additional documentation and review will be required to finalize this lease."}

To proceed with this application, please reply to this email or call us at (555) 123-4567. Our team will be happy to discuss the next steps and answer any questions.

Best regards,
Your Leasing Team
Sharpei AI Finance`}
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button variant="outline" onClick={() => setShowEmailDraft(false)} className="flex-1">
                          Edit Quote
                        </Button>
                        <Button className="flex-1">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeaseQuoteDialog;