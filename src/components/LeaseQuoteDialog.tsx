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
    additionalNotes: ""
  });

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
      additionalNotes: ""
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
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span className="font-semibold">5.5% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Lease Cost</span>
                      <span className="font-semibold">${(parseInt(formData.equipmentValue) * 1.15).toLocaleString()}</span>
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

            {/* Special Offer Section */}
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
                  Offer expires in 7 days
                </div>
              </CardContent>
            </Card>

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
                        <Input value={`Exclusive Lease Offer for ${formData.equipmentType} - Limited Time Special`} readOnly className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Message:</Label>
                        <Textarea 
                          readOnly 
                          className="bg-muted/50 min-h-[280px] font-mono text-sm"
                          value={`Dear ${formData.customerName},

I'm excited to share an exclusive lease opportunity tailored specifically for you.

We've prepared a competitive quote for your ${formData.equipmentType.charAt(0).toUpperCase() + formData.equipmentType.slice(1)} equipment:

• Equipment Value: $${parseInt(formData.equipmentValue).toLocaleString()}
• Monthly Payment: $${(parseInt(formData.equipmentValue) / parseInt(formData.leaseTerm) * 1.15).toFixed(0)}
• Lease Term: ${formData.leaseTerm} months

🎁 SPECIAL LIMITED-TIME OFFER (Expires in 7 days):
✓ First 3 months at 1.8% APR (save on early payments)
✓ Complimentary maintenance package ($5,000 value)
✓ Zero down payment required

This offer represents significant savings and has been structured based on your business profile and our current market analysis. The terms are highly competitive and designed to maximize your cash flow.

To secure this offer, simply reply to this email or call me directly at (555) 123-4567. I'm here to answer any questions and can help finalize the paperwork within 24 hours.

Looking forward to partnering with you!

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