import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Mail, Paperclip, Clock, Search, Sparkles, ArrowRight,
  CheckCircle2, Loader2, AlertCircle, FileText, Eye } from
"lucide-react";
import { DEMO_EMAILS, type InboxEmail, type EmailStatus } from "@/data/mockInboxData";
import gmailLogo from "@/assets/gmail-logo.png";
import { formatDistanceToNow } from "date-fns";

const STATUS_CONFIG: Record<EmailStatus, {label: string;variant: "default" | "secondary" | "destructive" | "outline";icon: React.ReactNode;}> = {
  new: { label: "New", variant: "default", icon: <Mail className="w-3 h-3" /> },
  processing: { label: "Processing", variant: "secondary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  converted: { label: "Converted", variant: "outline", icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" /> },
  failed: { label: "Failed", variant: "destructive", icon: <AlertCircle className="w-3 h-3" /> }
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

export default function Inbox() {
  const navigate = useNavigate();
  const [emails] = useState<InboxEmail[]>(DEMO_EMAILS);
  const [selectedId, setSelectedId] = useState<string>(DEMO_EMAILS[0].id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return emails.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (search && !e.subject.toLowerCase().includes(search.toLowerCase()) && !e.fromName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [emails, statusFilter, search]);

  const selected = emails.find((e) => e.id === selectedId);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Email Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Incoming leasing requests are automatically processed by AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-200/60 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-600 tracking-wide">Connected</span>
            <Separator orientation="vertical" className="h-3 bg-emerald-200/60" />
            <img src={gmailLogo} alt="Gmail" className="h-4 w-4" />
            <span className="text-xs font-semibold text-foreground/70">Gmail</span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground">luciaclifford@gosharpei.com</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
        { label: "New Emails", value: emails.filter((e) => e.status === "new").length, color: "text-primary" },
        { label: "Processing", value: emails.filter((e) => e.status === "processing").length, color: "text-muted-foreground" },
        { label: "Converted", value: emails.filter((e) => e.status === "converted").length, color: "text-emerald-600" },
        { label: "Total Today", value: emails.length, color: "text-foreground" }].
        map((s) =>
        <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4 min-h-[600px]">
        {/* Email List */}
        <div className="col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9" />
                
              </div>
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mt-2">
                <TabsList className="w-full grid grid-cols-4 h-8">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="new" className="text-xs">New</TabsTrigger>
                  <TabsTrigger value="processing" className="text-xs">Processing</TabsTrigger>
                  <TabsTrigger value="converted" className="text-xs">Converted</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filtered.map((email) => {
                  const cfg = STATUS_CONFIG[email.status];
                  return (
                    <div
                      key={email.id}
                      onClick={() => setSelectedId(email.id)}
                      className={`px-4 py-3 cursor-pointer border-b transition-colors hover:bg-muted/50 ${
                      selectedId === email.id ? "bg-accent" : ""}`
                      }>
                      
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{email.fromName}</p>
                        <Badge variant={cfg.variant} className="gap-1 text-[10px] flex-shrink-0">
                          {cfg.icon}
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-sm truncate text-foreground">{email.subject}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(email.receivedAt, { addSuffix: true })}
                        </span>
                        {email.attachments.length > 0 &&
                        <span className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            {email.attachments.length}
                          </span>
                        }
                      </div>
                    </div>);

                })}
                {filtered.length === 0 &&
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Mail className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-sm">No emails found</p>
                  </div>
                }
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Email Preview */}
        <div className="col-span-8">
          {selected ?
          <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selected.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: <span className="text-foreground">{selected.fromName}</span> &lt;{selected.from}&gt;
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selected.receivedAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.status === "new" &&
                  <Button
                    size="sm"
                    onClick={() => navigate(`/inbox/${selected.id}/extract`)}
                    className="gap-1">
                    
                        <Sparkles className="w-4 h-4" />
                        Extract & Process
                      </Button>
                  }
                    {selected.status === "processing" &&
                  <Button
                    size="sm"
                    onClick={() => navigate(`/inbox/${selected.id}/extract`)}
                    className="gap-1">
                    
                        <Eye className="w-4 h-4" />
                        View Extraction
                      </Button>
                  }
                    {selected.applicationId &&
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/inbox/application/${selected.applicationId}`)}
                    className="gap-1">
                    
                        <ArrowRight className="w-4 h-4" />
                        View Application
                      </Button>
                  }
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                {/* Email Body */}
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed text-foreground">
                    {selected.body}
                  </pre>
                </div>

                {/* Attachments */}
                {selected.attachments.length > 0 &&
              <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4" />
                      Attachments ({selected.attachments.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selected.attachments.map((att) =>
                  <div
                    key={att.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                    
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{att.fileName}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(att.fileSize)}</p>
                          </div>
                          {att.classification &&
                    <Badge variant="secondary" className="text-[10px] capitalize">
                              {att.classification.replace('_', ' ')}
                            </Badge>
                    }
                        </div>
                  )}
                    </div>
                  </div>
              }

                {/* Extracted Data Preview */}
                {selected.extractedData &&
              <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      AI Extracted Fields
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selected.extractedData).map(([key, { value, confidence }]) =>
                  <div key={key} className="flex items-center justify-between p-2 rounded border bg-background">
                          <div>
                            <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                            <p className="text-sm font-medium">{value || '—'}</p>
                          </div>
                          {confidence > 0 &&
                    <Badge variant={confidence >= 90 ? "outline" : "secondary"} className="text-[10px]">
                              {confidence}%
                            </Badge>
                    }
                        </div>
                  )}
                    </div>
                  </div>
              }
              </CardContent>
            </Card> :

          <Card className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select an email to preview</p>
              </div>
            </Card>
          }
        </div>
      </div>
    </div>);

}