import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, Plus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll New Merchant</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="merchant-name">Merchant Name</Label>
            <Input
              id="merchant-name"
              placeholder="Enter merchant name"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant-email">Merchant Email</Label>
            <Input
              id="merchant-email"
              type="email"
              placeholder="Enter merchant email"
              value={merchantEmail}
              onChange={(e) => setMerchantEmail(e.target.value)}
            />
          </div>

          <Button 
            onClick={generateEmail} 
            className="w-full"
            variant="secondary"
          >
            <Sparkles className="h-4 w-4" />
            Generate Onboarding Email with AI
          </Button>

          {draftEmail && (
            <div className="space-y-3 pt-4 border-t">
              <Label>Email Preview</Label>
              <Textarea
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy Email
                </Button>
                <Button 
                  onClick={handleSendEmail}
                  className="flex-1"
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
