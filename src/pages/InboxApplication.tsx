import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, FileText, CheckCircle2, XCircle, AlertCircle,
  Clock, Mail, Sparkles, Upload, Send, Eye, ExternalLink,
  ChevronRight, MessageSquare, Shield,
} from "lucide-react";
import {
  DEMO_INBOX_APPLICATION,
  DEMO_EMAILS,
  generateMissingDocsEmail,
  type InboxApplication,
  type ApplicationDocument,
  type TimelineEvent,
  type RequiredDoc,
  type Communication,
} from "@/data/mockInboxData";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  received: { label: "Received", color: "bg-blue-100 text-blue-800" },
  pending_documents: { label: "Pending Documents", color: "bg-amber-100 text-amber-800" },
  ready_for_underwriting: { label: "Ready for Underwriting", color: "bg-emerald-100 text-emerald-800" },
};

const DOC_STATUS_ICON: Record<string, React.ReactNode> = {
  valid: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  invalid: <XCircle className="w-4 h-4 text-destructive" />,
  missing: <AlertCircle className="w-4 h-4 text-amber-600" />,
};

const TIMELINE_ICONS: Record<string, React.ReactNode> = {
  email_received: <Mail className="w-4 h-4" />,
  application_created: <Sparkles className="w-4 h-4" />,
  docs_received: <FileText className="w-4 h-4" />,
  docs_requested: <Send className="w-4 h-4" />,
  docs_completed: <CheckCircle2 className="w-4 h-4" />,
  status_change: <Shield className="w-4 h-4" />,
};

export default function InboxApplicationPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [application] = useState<InboxApplication>(DEMO_INBOX_APPLICATION);
  const email = DEMO_EMAILS.find((e) => e.id === application.emailId);
  const [emailDraft, setEmailDraft] = useState("");
  const [showEmailEditor, setShowEmailEditor] = useState(false);

  const missingDocs = application.requiredDocuments.filter((d) => d.status === "missing");
  const validDocs = application.requiredDocuments.filter((d) => d.status === "valid");
  const progress = Math.round((validDocs.length / application.requiredDocuments.length) * 100);

  const handleSendReminder = () => {
    const generated = generateMissingDocsEmail(
      application.extractedFields.contact_name.value,
      application.extractedFields.company_name.value,
      application.extractedFields.asset_type.value,
      missingDocs.map((d) => d.name),
      `https://upload.example.com/${application.id}`
    );
    setEmailDraft(generated.body);
    setShowEmailEditor(true);
  };

  const handleSendEmail = () => {
    setShowEmailEditor(false);
    toast({ title: "Email sent!", description: "Missing documents request has been sent to the customer." });
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/inbox")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                Application {application.id.slice(-6).toUpperCase()}
              </h1>
              <Badge className={STATUS_LABELS[application.status].color}>
                {STATUS_LABELS[application.status].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {application.extractedFields.company_name.value} · {application.extractedFields.asset_type.value}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {missingDocs.length > 0 && (
            <Button size="sm" onClick={handleSendReminder} className="gap-1">
              <Send className="w-4 h-4" />
              Request Missing Docs
            </Button>
          )}
          {missingDocs.length === 0 && (
            <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              Ready for Underwriting
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-8 space-y-6">
          <Tabs defaultValue="documents">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="details">Application Details</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4 mt-4">
              {/* Document Progress */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Document Collection Progress</p>
                    <p className="text-sm text-muted-foreground">
                      {validDocs.length} of {application.requiredDocuments.length} received
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Required Documents Checklist */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Required Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {application.requiredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        doc.status === "valid" ? "bg-emerald-50/50 border-emerald-200" :
                        doc.status === "missing" ? "bg-amber-50/50 border-amber-200" :
                        "bg-destructive/5 border-destructive/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {DOC_STATUS_ICON[doc.status]}
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          {doc.fileName && (
                            <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={doc.status === "valid" ? "outline" : doc.status === "missing" ? "secondary" : "destructive"}
                        className="capitalize text-xs"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Document Intelligence Panel */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Document Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="p-3 rounded-lg border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm font-medium">{doc.fileName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {doc.classification.replace('_', ' ')}
                          </Badge>
                          <Badge
                            variant={doc.validationStatus === "valid" ? "outline" : "destructive"}
                            className="text-xs capitalize"
                          >
                            {doc.validationStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="pl-6">
                        {doc.validationNotes.map((note, i) => (
                          <p key={i} className="text-xs text-muted-foreground">{note}</p>
                        ))}
                      </div>
                      <div className="pl-6 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Source: {doc.source === "email" ? "Email attachment" : "Upload portal"}</span>
                        <span>·</span>
                        <span>{formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Extracted Application Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(application.extractedFields).map(([key, field]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                        <p className="text-sm font-medium">{field.value || "—"}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Customer Type</p>
                      <p className="text-sm font-medium capitalize">{application.customerType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-sm font-medium">€{application.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Source</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="space-y-4 mt-4">
              {/* Email Editor */}
              {showEmailEditor && (
                <Card className="border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Draft Email</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">To: {application.extractedFields.email.value}</p>
                      <p className="text-xs text-muted-foreground mb-2">Subject: Action Required: Missing documents for your leasing application</p>
                    </div>
                    <Textarea
                      value={emailDraft}
                      onChange={(e) => setEmailDraft(e.target.value)}
                      rows={12}
                      className="font-mono text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowEmailEditor(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSendEmail} className="gap-1">
                        <Send className="w-4 h-4" />
                        Send Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sent Communications */}
              {application.communications.map((comm) => (
                <Card key={comm.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{comm.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {comm.status === "sent" && <Badge variant="outline" className="text-xs">Sent</Badge>}
                        {comm.openedAt && <Badge variant="secondary" className="text-xs gap-1"><Eye className="w-3 h-3" /> Opened</Badge>}
                        {comm.uploadedAt && <Badge className="text-xs gap-1 bg-emerald-100 text-emerald-800"><Upload className="w-3 h-3" /> Uploaded</Badge>}
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <pre className="whitespace-pre-wrap text-xs font-sans text-muted-foreground">
                        {comm.body}
                      </pre>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {comm.sentAt && <span>Sent {formatDistanceToNow(comm.sentAt, { addSuffix: true })}</span>}
                      {comm.openedAt && <span>Opened {formatDistanceToNow(comm.openedAt, { addSuffix: true })}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {application.communications.length === 0 && !showEmailEditor && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No communications yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Event Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {application.timeline.map((event) => (
                    <div key={event.id} className="flex gap-3 relative">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center z-10 flex-shrink-0">
                        {TIMELINE_ICONS[event.type]}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Missing Docs Summary */}
          {missingDocs.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                  <AlertCircle className="w-4 h-4" />
                  Missing Documents ({missingDocs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {missingDocs.map((doc) => (
                    <li key={doc.id} className="flex items-center gap-2 text-sm">
                      <XCircle className="w-3.5 h-3.5 text-amber-600" />
                      {doc.name}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3 gap-1"
                  onClick={handleSendReminder}
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Reminder
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Upload Portal Link */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Customer Upload Portal</p>
                  <p className="text-xs text-muted-foreground">Share link with customer</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => navigate(`/inbox/upload/${application.id}`)}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Source Email */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Source Email</p>
                  <p className="text-xs text-muted-foreground truncate">{email?.subject}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/inbox")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
