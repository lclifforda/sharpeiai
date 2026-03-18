import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, Sparkles, CheckCircle2, AlertTriangle, Edit2,
  Save, Loader2, ArrowRight, Brain,
} from "lucide-react";
import { DEMO_EMAILS, type ExtractedFields } from "@/data/mockInboxData";
import { useToast } from "@/hooks/use-toast";

const FIELD_LABELS: Record<keyof ExtractedFields, string> = {
  company_name: "Company Name",
  tax_id: "Tax ID / CIF",
  contact_name: "Contact Name",
  email: "Email Address",
  phone: "Phone Number",
  asset_type: "Asset Type",
  asset_value: "Asset Value",
  term_months: "Term (months)",
};

export default function InboxExtract() {
  const { emailId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = DEMO_EMAILS.find((e) => e.id === emailId);

  const [extracting, setExtracting] = useState(!email?.extractedData);
  const [progress, setProgress] = useState(0);
  const [fields, setFields] = useState<ExtractedFields | null>(email?.extractedData || null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Simulate extraction
  useEffect(() => {
    if (!extracting || fields) return;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setExtracting(false);
          // Generate mock extracted data
          setFields({
            company_name: { value: "Tech Solutions Europa S.L.", confidence: 85 },
            tax_id: { value: "", confidence: 0 },
            contact_name: { value: "Carlos Rodriguez", confidence: 90 },
            email: { value: "carlos@techsolutions.es", confidence: 99 },
            phone: { value: "", confidence: 0 },
            asset_type: { value: "50x Dell Latitude laptops + 10x Dell servers", confidence: 82 },
            asset_value: { value: "€120,000", confidence: 78 },
            term_months: { value: "36", confidence: 95 },
          });
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 400);
    return () => clearInterval(timer);
  }, [extracting, fields]);

  if (!email) {
    return (
      <div className="p-6 text-center">
        <p>Email not found</p>
        <Button variant="outline" onClick={() => navigate("/inbox")} className="mt-4">
          Back to Inbox
        </Button>
      </div>
    );
  }

  const avgConfidence = fields
    ? Math.round(
        Object.values(fields).reduce((sum, f) => sum + f.confidence, 0) /
        Object.values(fields).length
      )
    : 0;

  const handleEdit = (key: string) => {
    setEditing(key);
    setEditValue(fields![key as keyof ExtractedFields].value);
  };

  const handleSave = (key: string) => {
    if (!fields) return;
    setFields({
      ...fields,
      [key]: { ...fields[key as keyof ExtractedFields], value: editValue, confidence: 100 },
    });
    setEditing(null);
    toast({ title: "Field updated", description: `${FIELD_LABELS[key as keyof ExtractedFields]} has been corrected.` });
  };

  const handleCreateApplication = () => {
    toast({ title: "Application created!", description: "Redirecting to the application view..." });
    setTimeout(() => navigate("/inbox/application/app-inbox-001"), 800);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/inbox")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">AI Data Extraction</h1>
          <p className="text-sm text-muted-foreground">{email.subject}</p>
        </div>
      </div>

      {/* Extraction Progress */}
      {extracting && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="font-medium">Extracting data from email...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  AI is analyzing the email content and attachments
                </p>
              </div>
              <div className="w-full max-w-xs">
                <Progress value={Math.min(progress, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {Math.min(Math.round(progress), 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Fields */}
      {fields && !extracting && (
        <>
          {/* Confidence Summary */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Extraction Complete</p>
                    <p className="text-xs text-muted-foreground">
                      {Object.values(fields).filter((f) => f.confidence > 0).length} of {Object.keys(fields).length} fields extracted
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Avg. Confidence</p>
                  <p className={`text-2xl font-semibold ${avgConfidence >= 85 ? "text-emerald-600" : avgConfidence >= 70 ? "text-amber-600" : "text-destructive"}`}>
                    {avgConfidence}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fields Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Extracted Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Object.entries(fields) as [keyof ExtractedFields, { value: string; confidence: number }][]).map(
                ([key, field]) => (
                  <div key={key} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">{FIELD_LABELS[key]}</Label>
                      {editing === key ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleSave(key)}>
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm font-medium mt-0.5">
                          {field.value || <span className="text-muted-foreground italic">Not detected</span>}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {field.confidence > 0 ? (
                        <Badge
                          variant={field.confidence >= 90 ? "outline" : "secondary"}
                          className={`text-xs ${field.confidence >= 90 ? "border-emerald-300 text-emerald-700" : field.confidence >= 70 ? "border-amber-300 text-amber-700" : "border-destructive/30 text-destructive"}`}
                        >
                          {field.confidence >= 90 ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {field.confidence}%
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">Missing</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEdit(key)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Source Email Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Source Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-muted-foreground max-h-40 overflow-auto">
                  {email.body}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate("/inbox")}>
              Cancel
            </Button>
            <Button onClick={handleCreateApplication} className="gap-2">
              <ArrowRight className="w-4 h-4" />
              Create Application
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
