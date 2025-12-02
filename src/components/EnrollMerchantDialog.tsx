import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export function EnrollMerchantDialog() {
  const [open, setOpen] = useState(false);
  const [merchantName, setMerchantName] = useState("");
  const [merchantEmail, setMerchantEmail] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const { toast } = useToast();

  const generateEmail = () => {
    if (!merchantName || !merchantEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in both merchant name and email.",
        variant: "destructive",
      });
      return;
    }

    const email = `Subject: Welcome to Sharpei - Complete Your Merchant Onboarding

Dear ${merchantName} Team,

Welcome to Sharpei! We're excited to partner with you to provide flexible payment solutions for your customers.

To complete your onboarding, please upload the following required documents through our secure portal:

{{UPLOAD_LINK}}

Required Documents:
• Certificate of Incorporation
• Tax ID / Company Registration Number
• Proof of Address
• Government-issued ID (admin)
• Latest Financial Statements
• Bank Account Verification
• Product Catalog / Asset List
• Return Policy
• Warranty Policy

Once we receive and verify your documents, we'll activate your account and provide access to our merchant dashboard.

If you have any questions, please don't hesitate to reach out to our team.

Best regards,
The Sharpei Team`;

    setDraftEmail(email);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftEmail);
    toast({
      title: "Copied to clipboard",
      description: "Email draft has been copied.",
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Email Ready",
      description: "Email draft is ready to send.",
    });
  };

  const resetForm = () => {
    setMerchantName("");
    setMerchantEmail("");
    setDraftEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Enroll Merchant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Enroll New Merchant</DialogTitle>
          <DialogDescription>
            Enter merchant details to generate a personalized onboarding email with document requirements.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Form Section */}
          <Card className="p-6 border-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="merchant-name" className="text-base font-semibold">
                  Merchant Name *
                </Label>
                <Input
                  id="merchant-name"
                  placeholder="e.g., TechMart Electronics"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchant-email" className="text-base font-semibold">
                  Merchant Email *
                </Label>
                <Input
                  id="merchant-email"
                  type="email"
                  placeholder="e.g., contact@techmart.com"
                  value={merchantEmail}
                  onChange={(e) => setMerchantEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <Button 
                onClick={generateEmail} 
                className="w-full h-12 text-base"
                size="lg"
              >
                <Sparkles className="h-5 w-5" />
                Generate Onboarding Email with AI
              </Button>
            </div>
          </Card>

          {/* Email Preview Section */}
          {draftEmail && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <Label className="text-lg font-semibold">Email Preview</Label>
              </div>
              
              <Card className="p-4 bg-muted/50">
                <Textarea
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  className="min-h-[320px] font-mono text-sm bg-background resize-none"
                />
              </Card>
              
              <div className="flex gap-3">
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1 h-11"
                  size="lg"
                >
                  <Copy className="h-4 w-4" />
                  Copy Email
                </Button>
                <Button 
                  onClick={handleSendEmail}
                  className="flex-1 h-11"
                  size="lg"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
