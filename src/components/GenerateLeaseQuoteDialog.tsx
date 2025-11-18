import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp, Calendar, DollarSign } from "lucide-react";

interface LeaseQuoteDialogProps {
  merchantName: string;
}

export const GenerateLeaseQuoteDialog = ({ merchantName }: LeaseQuoteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [formData, setFormData] = useState({
    assetType: "",
    assetValue: "",
    leaseTerm: "",
    creditScore: "",
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      setShowQuote(true);
    }, 2000);
  };

  const resetDialog = () => {
    setShowQuote(false);
    setFormData({
      assetType: "",
      assetValue: "",
      leaseTerm: "",
      creditScore: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Lease Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Lease Quote Generator
          </DialogTitle>
          <DialogDescription>
            Generate an AI-powered lease quote for {merchantName}
          </DialogDescription>
        </DialogHeader>

        {!showQuote ? (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Select
                  value={formData.assetType}
                  onValueChange={(value) => setFormData({ ...formData, assetType: value })}
                >
                  <SelectTrigger id="assetType">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="e-bike">E-Bike</SelectItem>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="equipment">Industrial Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetValue">Asset Value ($)</Label>
                <Input
                  id="assetValue"
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.assetValue}
                  onChange={(e) => setFormData({ ...formData, assetValue: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leaseTerm">Lease Term (months)</Label>
                <Select
                  value={formData.leaseTerm}
                  onValueChange={(value) => setFormData({ ...formData, leaseTerm: value })}
                >
                  <SelectTrigger id="leaseTerm">
                    <SelectValue placeholder="Select lease term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditScore">Customer Credit Score</Label>
                <Select
                  value={formData.creditScore}
                  onValueChange={(value) => setFormData({ ...formData, creditScore: value })}
                >
                  <SelectTrigger id="creditScore">
                    <SelectValue placeholder="Select credit tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent (750+)</SelectItem>
                    <SelectItem value="good">Good (700-749)</SelectItem>
                    <SelectItem value="fair">Fair (650-699)</SelectItem>
                    <SelectItem value="poor">Poor (&lt;650)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!formData.assetType || !formData.assetValue || !formData.leaseTerm || !formData.creditScore || isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Generating Quote...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Quote
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <Card className="border-primary/20 bg-gradient-to-br from-background to-accent/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Generated Lease Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Asset Type</p>
                    <p className="font-semibold capitalize">{formData.assetType.replace("-", " ")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Asset Value</p>
                    <p className="font-semibold">${formData.assetValue}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lease Term</p>
                    <p className="font-semibold">{formData.leaseTerm} months</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Credit Tier</p>
                    <p className="font-semibold capitalize">{formData.creditScore}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Payment</p>
                        <p className="text-2xl font-bold">${Math.round(parseInt(formData.assetValue) / parseInt(formData.leaseTerm) * 1.15)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-accent rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                      </div>
                      <p className="text-lg font-semibold">
                        {formData.creditScore === "excellent" ? "5.9%" :
                         formData.creditScore === "good" ? "7.5%" :
                         formData.creditScore === "fair" ? "9.2%" : "12.5%"}
                      </p>
                    </div>

                    <div className="p-3 bg-accent rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                      </div>
                      <p className="text-lg font-semibold">
                        ${Math.round(parseInt(formData.assetValue) * 1.15)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold">AI Recommendations:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Competitive rate based on credit profile and asset type</li>
                    <li>• Option to upgrade after 12 months with 80% residual value</li>
                    <li>• Buy-back guarantee at end of term for {formData.assetType === "e-bike" ? "70%" : "65%"} value</li>
                    <li>• Early payment discount available (5% off remaining balance)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetDialog} className="flex-1">
                Generate New Quote
              </Button>
              <Button className="flex-1">
                Export Quote
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
