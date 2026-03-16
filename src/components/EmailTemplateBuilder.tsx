import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Eye,
  Minus,
} from "lucide-react";
import { TEMPLATE_VARIABLES } from "@/services/automationMockData";

// Sample data to resolve variables in the preview
const SAMPLE_DATA: Record<string, string> = {
  "{{company_name}}": "TechCorp Industries",
  "{{application_type}}": "Equipment Financing",
  "{{requested_amount}}": "42,500",
  "{{equipment_cost}}": "38,000",
  "{{application_id}}": "APP-084",
  "{{application_status}}": "Completed",
  "{{customer_name}}": "John Smith",
  "{{customer_email}}": "john@techcorp.com",
  "{{entity_type}}": "Corporation",
  "{{industry}}": "Technology",
  "{{annual_revenue}}": "2,400,000",
  "{{state}}": "California",
  "{{equipment_type}}": "CNC Milling Machine",
  "{{guarantor_name}}": "John Smith",
};

interface EmailTemplateBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  to: string;
  cc: string;
  subject: string;
  body: string;
  onSave: (values: { to: string; cc: string; subject: string; body: string }) => void;
}

// Resolve template variables with sample data
function resolveVariables(text: string): string {
  let result = text;
  for (const [variable, value] of Object.entries(SAMPLE_DATA)) {
    result = result.replaceAll(variable, value);
  }
  return result;
}

// Group variables by category for organized display
const VARIABLE_GROUPS = [
  {
    label: "Application",
    vars: TEMPLATE_VARIABLES.filter((v) =>
      ["{{application_type}}", "{{application_id}}", "{{application_status}}", "{{requested_amount}}", "{{equipment_cost}}", "{{equipment_type}}"].includes(v.variable)
    ),
  },
  {
    label: "Company",
    vars: TEMPLATE_VARIABLES.filter((v) =>
      ["{{company_name}}", "{{entity_type}}", "{{industry}}", "{{annual_revenue}}", "{{state}}"].includes(v.variable)
    ),
  },
  {
    label: "Contact",
    vars: TEMPLATE_VARIABLES.filter((v) =>
      ["{{customer_name}}", "{{customer_email}}", "{{guarantor_name}}"].includes(v.variable)
    ),
  },
];

export default function EmailTemplateBuilder({
  open,
  onOpenChange,
  to: initialTo,
  cc: initialCc,
  subject: initialSubject,
  body: initialBody,
  onSave,
}: EmailTemplateBuilderProps) {
  const [to, setTo] = useState(initialTo);
  const [cc, setCc] = useState(initialCc);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [activeField, setActiveField] = useState<"subject" | "body">("body");

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  // Sync state when props change (dialog reopens)
  useEffect(() => {
    if (open) {
      setTo(initialTo);
      setCc(initialCc);
      setSubject(initialSubject);
      setBody(initialBody);
    }
  }, [open, initialTo, initialCc, initialSubject, initialBody]);

  const insertVariable = useCallback(
    (variable: string) => {
      if (activeField === "body") {
        const textarea = bodyRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
          body.substring(0, start) + variable + body.substring(end);
        setBody(newValue);
        requestAnimationFrame(() => {
          textarea.focus();
          const pos = start + variable.length;
          textarea.setSelectionRange(pos, pos);
        });
      } else {
        const input = subjectRef.current;
        if (!input) return;
        const start = input.selectionStart || subject.length;
        const end = input.selectionEnd || subject.length;
        const newValue =
          subject.substring(0, start) + variable + subject.substring(end);
        setSubject(newValue);
        requestAnimationFrame(() => {
          input.focus();
          const pos = start + variable.length;
          input.setSelectionRange(pos, pos);
        });
      }
    },
    [activeField, body, subject]
  );

  const insertSnippet = useCallback(
    (snippet: string) => {
      const textarea = bodyRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        body.substring(0, start) + snippet + body.substring(end);
      setBody(newValue);
      setActiveField("body");
      requestAnimationFrame(() => {
        textarea.focus();
        const pos = start + snippet.length;
        textarea.setSelectionRange(pos, pos);
      });
    },
    [body]
  );

  const handleSave = () => {
    onSave({ to, cc, subject, body });
    onOpenChange(false);
  };

  const resolvedSubject = resolveVariables(subject);
  const resolvedBody = resolveVariables(body);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Mail className="w-4.5 h-4.5 text-green-700" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Email Template Builder
              </h2>
              <p className="text-xs text-muted-foreground">
                Compose your email and use variables to personalize content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Email
            </Button>
          </div>
        </div>

        {/* Main content: two columns */}
        <div className="flex flex-1 overflow-hidden" style={{ height: "calc(90vh - 73px)" }}>
          {/* Left: Editor */}
          <div className="flex-1 flex flex-col border-r overflow-y-auto">
            {/* To / CC row */}
            <div className="px-5 pt-4 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    To
                  </Label>
                  <Input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="h-9 text-sm"
                    placeholder="recipient@lender.com or {{customer_email}}"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    CC
                  </Label>
                  <Input
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="h-9 text-sm"
                    placeholder="cc@company.com (optional)"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Subject
                </Label>
                <Input
                  ref={subjectRef}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onFocus={() => setActiveField("subject")}
                  className="h-9 text-sm font-medium"
                  placeholder="New {{application_type}} — {{company_name}}"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-5 py-2 border-b border-t mt-4 bg-muted/20">
              <button
                type="button"
                onClick={() =>
                  insertSnippet("\n\n---\n\n")
                }
                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Insert divider"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  insertSnippet(
                    "\n\nCompany: {{company_name}}\nEntity Type: {{entity_type}}\nIndustry: {{industry}}\nAnnual Revenue: ${{annual_revenue}}\nState: {{state}}\n"
                  )
                }
                className="px-2 py-1 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
                title="Insert company info block"
              >
                + Company Info
              </button>
              <button
                type="button"
                onClick={() =>
                  insertSnippet(
                    "\n\nApplication ID: {{application_id}}\nType: {{application_type}}\nRequested Amount: ${{requested_amount}}\nEquipment Cost: ${{equipment_cost}}\nEquipment Type: {{equipment_type}}\n"
                  )
                }
                className="px-2 py-1 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
                title="Insert application details block"
              >
                + Application Details
              </button>
              <button
                type="button"
                onClick={() =>
                  insertSnippet(
                    "\n\nGuarantor: {{guarantor_name}}\nCustomer: {{customer_name}}\nEmail: {{customer_email}}\n"
                  )
                }
                className="px-2 py-1 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
                title="Insert contact block"
              >
                + Contact Info
              </button>
            </div>

            {/* Body editor */}
            <div className="flex-1 px-5 py-3">
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Message Body
              </Label>
              <Textarea
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onFocus={() => setActiveField("body")}
                className="text-sm min-h-[300px] h-full resize-none font-mono leading-relaxed"
                placeholder={
                  "Dear Lender,\n\nPlease find below a new application for your review.\n\nCompany: {{company_name}}\nType: {{application_type}}\nRequested Amount: ${{requested_amount}}\nEquipment: {{equipment_type}}\n\nApplication ID: {{application_id}}\n\nBest regards"
                }
              />
            </div>

            {/* Variable tags */}
            <div className="px-5 py-3 border-t bg-muted/20">
              <p className="text-[11px] text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                Click to insert into{" "}
                {activeField === "subject" ? "subject" : "body"}
              </p>
              <div className="space-y-2">
                {VARIABLE_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-1">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {group.vars.map((tv) => (
                        <button
                          key={tv.variable}
                          type="button"
                          onClick={() => insertVariable(tv.variable)}
                          className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 text-[11px] font-mono hover:bg-blue-500/20 transition-colors border border-blue-200/60 cursor-pointer"
                          title={tv.label}
                        >
                          {tv.variable}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="w-[420px] flex-shrink-0 flex flex-col bg-muted/20 overflow-y-auto">
            <div className="px-5 py-3 border-b flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Live Preview
              </span>
              <Badge
                variant="outline"
                className="ml-auto text-[10px] px-1.5 py-0"
              >
                Sample Data
              </Badge>
            </div>

            {/* Email preview card */}
            <div className="p-5">
              <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
                {/* Email header */}
                <div className="px-5 py-4 border-b bg-card space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] text-muted-foreground w-10 flex-shrink-0">
                      To
                    </span>
                    <span className="text-sm text-foreground">
                      {resolveVariables(to) || (
                        <span className="text-muted-foreground/50 italic">
                          No recipient
                        </span>
                      )}
                    </span>
                  </div>
                  {cc && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] text-muted-foreground w-10 flex-shrink-0">
                        CC
                      </span>
                      <span className="text-sm text-foreground">
                        {resolveVariables(cc)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] text-muted-foreground w-10 flex-shrink-0">
                      Subj
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {resolvedSubject || (
                        <span className="text-muted-foreground/50 italic font-normal">
                          No subject
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Email body */}
                <div className="px-5 py-5">
                  {resolvedBody ? (
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {resolvedBody}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Mail className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground/50 italic">
                        Start typing to see your email preview
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample data reference */}
              <div className="mt-4 rounded-lg border bg-background/50 p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                  Sample values used in preview
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {Object.entries(SAMPLE_DATA).map(([key, value]) => (
                    <div key={key} className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-mono text-blue-600 truncate">
                        {key}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
