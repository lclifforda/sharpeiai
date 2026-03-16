import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, Plus, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function EnrollMerchantDialog() {
  const [open, setOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [draftEmail, setDraftEmail] = useState("");
  const { toast } = useToast();

  const handleAddVendor = () => {
    if (!vendorName || !contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the vendor name and contact email.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Vendor Added",
      description: `${vendorName} has been added to the platform.`,
    });
    setOpen(false);
  };

  const generateEmail = () => {
    if (!vendorName || !contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the vendor name and contact email.",
        variant: "destructive",
      });
      return;
    }

    const email = `Subject: Welcome to Sharpei - Your Vendor Partnership Setup

Dear ${vendorName} Team,

Welcome to Sharpei! We're excited to partner with you to offer flexible financing solutions to your customers.

To get started, we'll set up your referral integration so customers coming through your website can seamlessly apply for financing via Sharpei.

Once we have everything configured, we'll generate your unique referral link and provide integration instructions for your website.

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
    setVendorName("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setWebsite("");
    setShowEmailSection(false);
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
          Add Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Vendor</DialogTitle>
          <DialogDescription>
            Add a vendor or broker to the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vendor Details Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vendor-name" className="text-sm font-medium">
                Vendor Name *
              </Label>
              <Input
                id="vendor-name"
                placeholder="e.g., TechMart Electronics"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-sm font-medium">
                  Contact Name
                </Label>
                <Input
                  id="contact-name"
                  placeholder="e.g., Sarah Johnson"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-sm font-medium">
                  Contact Email *
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="e.g., sarah@techmart.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="e.g., +1 (555) 123-4567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-website" className="text-sm font-medium">
                  Website
                </Label>
                <Input
                  id="vendor-website"
                  placeholder="e.g., www.techmart.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Primary Action */}
          <Button
            onClick={handleAddVendor}
            className="w-full h-11"
            size="lg"
          >
            Add Vendor
          </Button>

          {/* Optional Email Section */}
          <Collapsible open={showEmailSection} onOpenChange={setShowEmailSection}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
                <Mail className="h-4 w-4" />
                <span>Send a welcome email</span>
                {showEmailSection ? (
                  <ChevronUp className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {!draftEmail ? (
                <Button
                  onClick={generateEmail}
                  variant="outline"
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Welcome Email with AI
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <Label className="text-sm font-medium">Email Preview</Label>
                  </div>

                  <Card className="p-3 bg-muted/50">
                    <Textarea
                      value={draftEmail}
                      onChange={(e) => setDraftEmail(e.target.value)}
                      className="min-h-[240px] font-mono text-sm bg-background resize-none"
                    />
                  </Card>

                  <div className="flex gap-3">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
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
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  );
}
