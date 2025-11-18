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
    setFormData({
      equipmentType: "",
      equipmentValue: "",
      leaseTerm: "",
      customerName: "",
      additionalNotes: ""
    });
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

            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Generate Another Quote
              </Button>
              <Button className="flex-1 gradient-sharpei text-white">
                Save & Send Quote
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeaseQuoteDialog;