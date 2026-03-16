import { useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Zap,
  LayoutTemplate,
  GitBranch,
  Plus,
  Search,
  MessageSquare,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  Users,
  Cloud,
  Globe,
  Server,
  PartyPopper,
  RotateCcw,
  RefreshCcw,
  Mail,
  Webhook,
  ArrowRight,
  Save,
  KeyRound,
  Settings,
  Eye,
  EyeOff,
  Info,
  Shield,
  Send,
  UserCheck,
} from "lucide-react";
import AutomationWorkflowBuilder from "@/components/AutomationWorkflowBuilder";
import EmailTemplateBuilder from "@/components/EmailTemplateBuilder";
import {
  AUTOMATION_TEMPLATES,
  MOCK_CONNECTIONS,
  AVAILABLE_PLATFORMS,
  ACTION_TO_PLATFORMS,
  getActionColor,
  getActionLabel,
  getCategoryColor,
  type AutomationTemplate,
  type Connection,
  type AvailablePlatform,
} from "@/services/automationMockData";

const ICON_MAP: Record<string, any> = {
  MessageSquare,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  Users,
  Cloud,
  Globe,
  PartyPopper,
  RotateCcw,
  RefreshCcw,
  Send,
  UserCheck,
};

const ACTION_ICON_MAP: Record<string, any> = {
  slack: MessageSquare,
  teams: MessageSquare,
  email: Mail,
  webhook: Webhook,
  lender_api: Server,
  crm_update: Users,
  assign_officer: UserCheck,
};

// Platform logos (inline SVG components)
const SlackLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none">
    <path d="M26.9 80.4c0 7.4-6 13.4-13.4 13.4S0 87.8 0 80.4c0-7.4 6-13.4 13.4-13.4h13.4v13.4z" fill="#E01E5A"/>
    <path d="M33.6 80.4c0-7.4 6-13.4 13.4-13.4s13.4 6 13.4 13.4v33.6c0 7.4-6 13.4-13.4 13.4s-13.4-6-13.4-13.4V80.4z" fill="#E01E5A"/>
    <path d="M47 26.9c-7.4 0-13.4-6-13.4-13.4S39.6 0 47 0s13.4 6 13.4 13.4v13.4H47z" fill="#36C5F0"/>
    <path d="M47 33.6c7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4H13.4C6 60.4 0 54.4 0 47s6-13.4 13.4-13.4H47z" fill="#36C5F0"/>
    <path d="M101.1 47c0-7.4 6-13.4 13.4-13.4 7.4 0 13.4 6 13.4 13.4s-6 13.4-13.4 13.4h-13.4V47z" fill="#2EB67D"/>
    <path d="M94.4 47c0 7.4-6 13.4-13.4 13.4-7.4 0-13.4-6-13.4-13.4V13.4C67.6 6 73.6 0 81 0s13.4 6 13.4 13.4V47z" fill="#2EB67D"/>
    <path d="M81 101.1c7.4 0 13.4 6 13.4 13.4 0 7.4-6 13.4-13.4 13.4-7.4 0-13.4-6-13.4-13.4v-13.4H81z" fill="#ECB22E"/>
    <path d="M81 94.4c-7.4 0-13.4-6-13.4-13.4 0-7.4 6-13.4 13.4-13.4h33.6c7.4 0 13.4 6 13.4 13.4 0 7.4-6 13.4-13.4 13.4H81z" fill="#ECB22E"/>
  </svg>
);

const HubSpotLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="none">
    <path d="M371.5 169.6V109c16.8-9.2 28.2-27.2 28.2-47.8 0-30.2-24.5-54.7-54.7-54.7-30.2 0-54.7 24.5-54.7 54.7 0 20.6 11.4 38.6 28.2 47.8v60.6c-23.8 5.8-45.4 17.4-63.2 34l-167-129.8c2-6 3.2-12.4 3.2-19.2C91.5 24.5 67 0 36.8 0S-17.9 24.5-17.9 54.7c0 30.2 24.5 54.7 54.7 54.7 11.8 0 22.6-3.8 31.6-10.2l163.8 127.4c-14.8 22-23.6 48.6-23.6 77.2 0 77.2 62.6 139.8 139.8 139.8s139.8-62.6 139.8-139.8c0-69.4-50.6-127-117-137.9zM345 396.8c-51.4 0-93.2-41.8-93.2-93.2s41.8-93.2 93.2-93.2 93.2 41.8 93.2 93.2-41.8 93.2-93.2 93.2z" fill="#FF7A59" transform="translate(30, 30) scale(0.88)"/>
  </svg>
);

const GmailLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 256 193" fill="none">
    <path d="M58.2 192.1V93.1L0 50.5v125.6c0 8.8 7.2 16 16 16h42.2z" fill="#4285F4"/>
    <path d="M197.8 192.1h42.2c8.8 0 16-7.2 16-16V50.5l-58.2 42.6v99z" fill="#34A853"/>
    <path d="M197.8 16v77.1L256 50.5V24c0-19.8-22.6-31-38.4-19L197.8 16z" fill="#FBBC04"/>
    <path d="M58.2 93.1V16L128 68.7 197.8 16v77.1L128 135.8 58.2 93.1z" fill="#EA4335"/>
    <path d="M0 24v26.5l58.2 42.6V16L38.4 5C22.6-6 0 5.2 0 24z" fill="#C5221F"/>
  </svg>
);

const WebhookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <Webhook className={`${className} text-orange-500`} />
);

const TeamsLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M16.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#5059C9"/>
    <path d="M19 9h-3a1 1 0 0 0-1 1v5a3 3 0 0 0 6 0v-4a2 2 0 0 0-2-2Z" fill="#5059C9"/>
    <path d="M10.5 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" fill="#7B83EB"/>
    <path d="M15 9H6a1 1 0 0 0-1 1v6a4.5 4.5 0 0 0 9 0v-6a1 1 0 0 0-1-1h2Z" fill="#7B83EB"/>
  </svg>
);

const LenderApiIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <Server className={`${className} text-cyan-600`} />
);

const SalesforceLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M10 4.5c1.2-1.2 2.8-2 4.6-2 2.5 0 4.7 1.4 5.8 3.5.9-.4 1.8-.5 2.8-.5C26.4 5.5 29 8.1 29 11.3c0 3.2-2.6 5.8-5.8 5.8-.5 0-1-.1-1.5-.2-1 1.8-2.9 3.1-5.1 3.1-1 0-2-.3-2.8-.7-.9 2-3 3.3-5.3 3.3-3.3 0-5.9-2.6-5.9-5.9 0-1.3.4-2.4 1.1-3.4C2.6 12.3 2 11 2 9.5 2 6.7 4.3 4.5 7 4.5c1.1 0 2.2.4 3 1z" fill="#00A1E0" transform="translate(-2, 1) scale(0.88)"/>
  </svg>
);

const AssignOfficerIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <UserCheck className={`${className} text-teal-600`} />
);

const PLATFORM_LOGO_MAP: Record<string, React.FC<{ className?: string }>> = {
  slack: SlackLogo,
  teams: TeamsLogo,
  email: GmailLogo,
  webhook: WebhookIcon,
  lender_api: LenderApiIcon,
  crm_update: HubSpotLogo,
  assign_officer: AssignOfficerIcon,
};

/** Resolve the correct platform logo for a template (slug-aware for CRM) */
const getTemplateLogo = (template: { actionType: string; slug: string }): React.FC<{ className?: string }> | undefined => {
  if (template.actionType === "crm_update" && template.slug.includes("salesforce")) {
    return SalesforceLogo;
  }
  return PLATFORM_LOGO_MAP[template.actionType];
};

const PLATFORM_NAME_MAP: Record<string, string> = {
  slack: "Slack",
  teams: "Microsoft Teams",
  email: "Email (SMTP)",
  webhook: "Webhook",
  lender_api: "Lender API",
  crm_update: "CRM",
  assign_officer: "Assign Officer",
};

const CATEGORY_LABELS: Record<string, string> = {
  notifications: "Notifications",
  crm: "CRM Integrations",
  operations: "Operations",
};

const AutomationCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const preselectedTemplate = searchParams.get("template");
  const preselectedTemplateObj = preselectedTemplate
    ? AUTOMATION_TEMPLATES.find((t) => t.slug === preselectedTemplate) || null
    : null;
  // All preselected templates now open in the workflow builder
  const preselectedIsWorkflow = !!preselectedTemplateObj;
  const [activeTab, setActiveTab] = useState(preselectedIsWorkflow ? "builder" : "templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Template config dialog — don't open dialog for workflow templates
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(
    preselectedTemplateObj && !preselectedIsWorkflow ? preselectedTemplateObj : null
  );
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [automationName, setAutomationName] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Email template builder
  const [emailBuilderOpen, setEmailBuilderOpen] = useState(false);

  // Connection management
  const [connections, setConnections] = useState<Connection[]>(MOCK_CONNECTIONS);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [showNewConnectionForm, setShowNewConnectionForm] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState("");
  const [newConnectionValues, setNewConnectionValues] = useState<Record<string, string>>({});
  const [selectedNewPlatform, setSelectedNewPlatform] = useState<AvailablePlatform | null>(null);

  const filteredTemplates = useMemo(() => {
    return AUTOMATION_TEMPLATES.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const groupedTemplates = useMemo(() => {
    const groups: Record<string, AutomationTemplate[]> = {};
    filteredTemplates.forEach((t) => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTemplates]);

  // Map template actionType → workflow builder node subtype
  const ACTION_TO_SUBTYPE: Record<string, string> = {
    slack: "slack_message",
    teams: "teams_message",
    email: "send_email",
    webhook: "http_request",
    lender_api: "http_request",
    crm_update: "crm_update",
    assign_officer: "assign_officer",
  };

  // Map template actionType → node label
  const ACTION_TO_LABEL: Record<string, string> = {
    slack: "Slack",
    teams: "Microsoft Teams",
    email: "Send Email",
    webhook: "HTTP Request",
    lender_api: "HTTP Request",
    crm_update: "HubSpot",
    assign_officer: "Sharpei Actions",
  };

  // Build pre-configured workflow nodes from any template
  const buildTemplateNodes = (template: AutomationTemplate) => {
    const triggerEvent = template.eventType;
    const triggerLabel = template.eventLabel;

    // Pick a sensible condition based on the template
    let conditionLabel = "Route by Type";
    let conditions = [{ id: "cond_tpl_1", field: "application.type", operator: "equals", value: "Equipment Financing" }];

    if (template.slug === "reassign-officer-high-value") {
      conditionLabel = "Amount > $50,000";
      conditions = [{ id: "cond_tpl_1", field: "application.requestedAmount", operator: "greater_than", value: "50000" }];
    } else if (template.slug.includes("activated") || template.slug.includes("closed-won")) {
      conditionLabel = "Amount > $25,000";
      conditions = [{ id: "cond_tpl_1", field: "application.requestedAmount", operator: "greater_than", value: "25000" }];
    } else if (template.slug.includes("vendor")) {
      conditionLabel = "Has Vendor";
      conditions = [{ id: "cond_tpl_1", field: "application.vendorName", operator: "not_equals", value: "" }];
    } else if (template.slug.includes("qualified")) {
      conditionLabel = "Revenue > $500k";
      conditions = [{ id: "cond_tpl_1", field: "application.annualRevenue", operator: "greater_than", value: "500000" }];
    }

    // Build action config based on template type and slug
    // Webhook templates can map to either create_task or http_request
    let actionSubtype = ACTION_TO_SUBTYPE[template.actionType] || "http_request";
    let actionLabel = ACTION_TO_LABEL[template.actionType] || template.actionType;
    if (template.actionType === "webhook" && template.slug.includes("task")) {
      actionSubtype = "create_task";
      actionLabel = "Create Task";
    }
    // CRM: use correct label per provider
    if (template.actionType === "crm_update" && template.slug.includes("salesforce")) {
      actionLabel = "Salesforce";
    }
    let actionConfig: Record<string, string> = {};

    switch (template.actionType) {
      case "assign_officer":
        actionConfig = template.slug === "reassign-officer-high-value"
          ? { strategy: "specific", officerId: "user_lucia", officerName: "Lucia Clifford", notifyOfficer: "yes" }
          : template.slug === "assign-officer-completed-app"
          ? { strategy: "specific", officerId: "user_carlos", officerName: "Carlos Rivera", notifyOfficer: "yes" }
          : { strategy: "round_robin", notifyOfficer: "yes" };
        break;
      case "slack":
        actionConfig = {
          channel: template.slug.includes("activated") ? "#wins" : "#applications",
          webhookUrl: "https://hooks.slack.com/services/T00000/B00000/XXXX",
          messageTemplate: template.slug.includes("activated")
            ? "Application {{application_id}} from {{company_name}} has been activated (${{requested_amount}})"
            : "New application {{application_id}} received from {{company_name}} — {{application_type}} (${{requested_amount}})",
        };
        break;
      case "teams":
        actionConfig = {
          webhookUrl: "https://outlook.office.com/webhook/...",
          messageTemplate: template.slug.includes("activated")
            ? "Application {{application_id}} from {{company_name}} has been activated (${{requested_amount}})"
            : "New application {{application_id}} from {{company_name}} — {{application_type}} (${{requested_amount}})",
        };
        break;
      case "email":
        if (template.slug.includes("lender")) {
          actionConfig = {
            emailProvider: "gmail",
            to: "intake@lenderpartner.com",
            subject: "New {{application_type}} Application — {{company_name}} (${{requested_amount}})",
            body: "Please find below a new application for your review.\n\nCompany: {{company_name}}\nAmount: ${{requested_amount}}\nType: {{application_type}}",
          };
        } else if (template.slug.includes("activated")) {
          actionConfig = {
            emailProvider: "gmail",
            to: "{{customer_email}}",
            subject: "Your financing is confirmed — you're all set!",
            body: "Dear {{customer_name}},\n\nGreat news! Your application ({{application_id}}) has been activated.",
          };
        } else if (template.slug.includes("cancelled") || template.slug.includes("declined")) {
          actionConfig = {
            emailProvider: "sendgrid",
            to: "{{customer_email}}",
            subject: "Update on your financing application",
            body: "Dear {{customer_name}},\n\nAfter careful review, we are unable to approve your application ({{application_id}}) at this time.",
          };
        } else if (template.slug.includes("not-prequalified")) {
          actionConfig = {
            emailProvider: "gmail",
            to: "{{customer_email}}",
            subject: "Your application eligibility update",
            body: "Dear {{customer_name}},\n\nUnfortunately, your application does not meet our current qualification criteria.",
          };
        } else if (template.slug.includes("missing-docs")) {
          actionConfig = {
            emailProvider: "outlook",
            to: "{{customer_email}}",
            subject: "Action needed: missing documents for your application",
            body: "Dear {{customer_name}},\n\nYour application ({{application_id}}) is missing required documents. Please upload them at your earliest convenience.",
          };
        } else {
          actionConfig = {
            emailProvider: "gmail",
            to: "{{customer_email}}",
            subject: "Application Update — {{application_id}}",
            body: "Dear {{customer_name}},\n\nAn update regarding your application.",
          };
        }
        break;
      case "lender_api":
        actionConfig = {
          url: "https://api.lenderpartner.com/v1/applications",
          authHeader: "Bearer ••••••••",
          method: "POST",
        };
        break;
      case "crm_update":
        if (template.slug === "salesforce-create-deal") {
          actionConfig = { provider: "salesforce", action: "create_opportunity" };
        } else if (template.slug === "salesforce-deal-qualified") {
          actionConfig = { provider: "salesforce", action: "update_opportunity" };
        } else if (template.slug === "salesforce-deal-closed-won") {
          actionConfig = { provider: "salesforce", action: "update_opportunity" };
        } else if (template.slug === "salesforce-create-lead") {
          actionConfig = { provider: "salesforce", action: "create_lead" };
        } else if (template.slug === "salesforce-create-account") {
          actionConfig = { provider: "salesforce", action: "create_account" };
        } else if (template.slug.includes("deal") && template.slug.includes("qualified")) {
          actionConfig = { provider: "hubspot", action: "update_deal" };
        } else if (template.slug.includes("closed-won")) {
          actionConfig = { provider: "hubspot", action: "update_deal" };
        } else if (template.slug.includes("sync-customer") || template.slug.includes("sync-vendor")) {
          actionConfig = { provider: "hubspot", action: "create_contact" };
        } else {
          actionConfig = { provider: "hubspot", action: "create_deal" };
        }
        break;
      case "webhook":
        if (template.slug.includes("task")) {
          actionConfig = {
            url: "https://api.your-tool.com/tasks",
            method: "POST",
            taskTitle: "Review application {{application_id}} — {{company_name}}",
          };
        } else {
          actionConfig = {
            url: "https://api.your-system.com/status",
            method: "POST",
          };
        }
        break;
    }

    const nodes = [
      {
        id: "tpl_1",
        type: "trigger" as const,
        subtype: "event",
        label: triggerLabel,
        x: 300,
        y: 60,
        config: { event: triggerEvent },
      },
      {
        id: "tpl_2",
        type: "condition" as const,
        subtype: "if_else",
        label: conditionLabel,
        x: 300,
        y: 240,
        config: {},
        conditions,
        conditionLogic: "and" as const,
      },
      {
        id: "tpl_3",
        type: "action" as const,
        subtype: actionSubtype,
        label: actionLabel,
        x: 300,
        y: 440,
        config: actionConfig,
      },
    ];
    const conns = [
      { from: "tpl_1", to: "tpl_2" },
      { from: "tpl_2", to: "tpl_3" },
    ];
    return { nodes, connections: conns };
  };

  // Pre-built workflow nodes — initialize from URL preselection if applicable
  const [builderInitialNodes, setBuilderInitialNodes] = useState<any[] | null>(() => {
    if (preselectedIsWorkflow && preselectedTemplateObj) {
      return buildTemplateNodes(preselectedTemplateObj).nodes;
    }
    return null;
  });
  const [builderInitialConnections, setBuilderInitialConnections] = useState<any[] | null>(() => {
    if (preselectedIsWorkflow && preselectedTemplateObj) {
      return buildTemplateNodes(preselectedTemplateObj).connections;
    }
    return null;
  });

  const handleSelectTemplate = (template: AutomationTemplate) => {
    // All templates now open the workflow builder with pre-configured nodes
    const { nodes, connections } = buildTemplateNodes(template);
    setBuilderInitialNodes(nodes);
    setBuilderInitialConnections(connections);
    setActiveTab("builder");
  };

  const handleSaveTemplate = () => {
    // Validate required fields
    const missing = selectedTemplate?.configFields
      .filter((f) => f.required && !configValues[f.key])
      .map((f) => f.label);

    if (missing && missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missing.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Automation created",
      description: `"${automationName}" has been created and activated.`,
    });
    navigate("/automations");
  };

  const handleSaveWorkflow = () => {
    toast({
      title: "Workflow saved",
      description: "Your custom workflow has been created and activated.",
    });
    navigate("/automations");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <Link
            to="/automations"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Automations
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Create Automation
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a template or build a custom workflow from scratch
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="templates">
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="builder">
              <GitBranch className="w-4 h-4 mr-2" />
              Workflow Builder
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Search and filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10 bg-card border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {["all", "notifications", "crm", "operations"].map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Template cards grouped by category */}
            {Object.entries(groupedTemplates).map(([category, templates]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {CATEGORY_LABELS[category] || category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => {
                    const IconComponent = ICON_MAP[template.icon] || Zap;
                    const ActionIcon = ACTION_ICON_MAP[template.actionType] || Zap;
                    const PlatformLogo = getTemplateLogo(template);
                    return (
                      <Card
                        key={template.slug}
                        className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center flex-shrink-0">
                              {PlatformLogo ? (
                                <PlatformLogo className="w-5.5 h-5.5" />
                              ) : (
                                <IconComponent className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm text-foreground">
                                  {template.name}
                                </p>
                                {template.isPopular && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20"
                                  >
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {template.eventLabel}
                                </Badge>
                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-1.5 py-0 ${getActionColor(template.actionType)}`}
                                >
                                  <ActionIcon className="w-2.5 h-2.5 mr-0.5" />
                                  {getActionLabel(template.actionType)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            size="sm"
                            variant="outline"
                          >
                            Use this template
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Workflow Builder Tab */}
          <TabsContent value="builder" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Visual Workflow Builder</h2>
                <p className="text-sm text-muted-foreground">
                  Drag nodes from the left panel and connect them to build your automation
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveWorkflow}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Workflow
                </Button>
              </div>
            </div>
            <AutomationWorkflowBuilder
              key={builderInitialNodes ? "template" : "default"}
              initialNodes={builderInitialNodes || undefined}
              initialConnections={builderInitialConnections || undefined}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Configuration Dialog */}
      <Dialog
        open={selectedTemplate !== null && !showNewConnectionForm}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTemplate(null);
            setShowPasswords({});
            setSelectedConnectionId(null);
          }
        }}
      >
        {selectedTemplate && (() => {
          const settingFields = selectedTemplate.configFields.filter((f) => f.group === "setting");
          const PlatformLogo = getTemplateLogo(selectedTemplate);
          const platformName = selectedTemplate.slug.includes("salesforce") ? "Salesforce" : PLATFORM_NAME_MAP[selectedTemplate.actionType];

          // Find matching connections for this action type
          const compatiblePlatforms = ACTION_TO_PLATFORMS[selectedTemplate.actionType] || [];
          const matchingConnections = connections.filter(
            (c) => compatiblePlatforms.includes(c.platform) && c.status === "connected"
          );
          const selectedConnection = matchingConnections.find((c) => c.id === selectedConnectionId);

          return (
            <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    {PlatformLogo ? (
                      <PlatformLogo className="w-5 h-5" />
                    ) : (
                      <Zap className="w-4.5 h-4.5 text-primary" />
                    )}
                  </div>
                  <div>
                    <span className="block">{selectedTemplate.name}</span>
                    <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                      {selectedTemplate.description}
                    </span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Automation name */}
                <div>
                  <Label className="text-sm">Automation Name</Label>
                  <Input
                    className="mt-1.5"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="My automation"
                  />
                </div>

                {/* Trigger → Action visual flow */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/15 rounded-lg px-3 py-2 flex-1">
                    <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold text-blue-600 uppercase">Trigger</p>
                      <p className="text-xs font-medium text-foreground truncate">{selectedTemplate.eventLabel}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                  <div className={`flex items-center gap-2 rounded-lg px-3 py-2 flex-1 border ${
                    selectedTemplate.actionType === "slack"
                      ? "bg-green-500/5 border-green-500/15"
                      : selectedTemplate.actionType === "teams"
                      ? "bg-indigo-500/5 border-indigo-500/15"
                      : selectedTemplate.actionType === "email"
                      ? "bg-red-500/5 border-red-500/15"
                      : selectedTemplate.actionType === "webhook"
                      ? "bg-orange-500/5 border-orange-500/15"
                      : "bg-purple-500/5 border-purple-500/15"
                  }`}>
                    <div className="w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      {PlatformLogo ? <PlatformLogo className="w-4 h-4" /> : <Webhook className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[9px] font-semibold uppercase ${
                        selectedTemplate.actionType === "slack" ? "text-green-700"
                        : selectedTemplate.actionType === "teams" ? "text-indigo-600"
                        : selectedTemplate.actionType === "email" ? "text-red-600"
                        : selectedTemplate.actionType === "webhook" ? "text-orange-600"
                        : "text-purple-600"
                      }`}>Action</p>
                      <p className="text-xs font-medium text-foreground truncate">{platformName}</p>
                    </div>
                  </div>
                </div>

                {/* Connection Picker Section */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                    <KeyRound className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Connection
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto">
                      Required
                    </Badge>
                  </div>
                  <div className="p-4">
                    {matchingConnections.length > 0 ? (
                      <div className="space-y-2">
                        {matchingConnections.map((conn) => {
                          const connLogoKey = ["hubspot", "salesforce", "pipedrive", "zoho", "monday", "dynamics"].includes(conn.platform) ? "crm_update" : conn.platform === "oracle" ? "webhook" : conn.platform;
                          const ConnLogo = PLATFORM_LOGO_MAP[connLogoKey];
                          return (
                            <div
                              key={conn.id}
                              onClick={() => setSelectedConnectionId(conn.id)}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedConnectionId === conn.id
                                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                  : "border-border hover:border-primary/30 hover:bg-muted/30"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                {ConnLogo ? <ConnLogo className="w-4.5 h-4.5" /> : <KeyRound className="w-4 h-4 text-muted-foreground" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{conn.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{conn.maskedCredential}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-success" />
                                {selectedConnectionId === conn.id && (
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <button
                          onClick={() => {
                            const platforms = ACTION_TO_PLATFORMS[selectedTemplate.actionType] || [];
                            const platform = AVAILABLE_PLATFORMS.find((p) => platforms.includes(p.platform));
                            if (platform) {
                              setSelectedNewPlatform(platform);
                              setNewConnectionName("");
                              setNewConnectionValues({});
                              setShowNewConnectionForm(true);
                            }
                          }}
                          className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/30 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Add new connection
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                          {PlatformLogo ? <PlatformLogo className="w-6 h-6" /> : <KeyRound className="w-6 h-6 text-muted-foreground" />}
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          No {platformName} connection yet
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Connect your {platformName} account to use this automation
                        </p>
                        <Button
                          size="sm"
                          onClick={() => {
                            const platforms = ACTION_TO_PLATFORMS[selectedTemplate.actionType] || [];
                            const platform = AVAILABLE_PLATFORMS.find((p) => platforms.includes(p.platform));
                            if (platform) {
                              setSelectedNewPlatform(platform);
                              setNewConnectionName("");
                              setNewConnectionValues({});
                              setShowNewConnectionForm(true);
                            }
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Connect {platformName}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Settings Section */}
                {settingFields.length > 0 && (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {selectedTemplate.actionType === "email" ? "Email Content" : "Action Settings"}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      {selectedTemplate.actionType === "email" ? (
                        <>
                          {/* Compact email summary + open builder button */}
                          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                            {configValues.recipients || configValues.subject || configValues.bodyTemplate ? (
                              <>
                                {configValues.recipients && (
                                  <div>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">To</span>
                                    <p className="text-sm text-foreground truncate">{configValues.recipients}</p>
                                  </div>
                                )}
                                {configValues.subject && (
                                  <div>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Subject</span>
                                    <p className="text-sm text-foreground truncate">{configValues.subject}</p>
                                  </div>
                                )}
                                {configValues.bodyTemplate && (
                                  <div>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Body</span>
                                    <p className="text-xs text-muted-foreground line-clamp-3 mt-0.5">{configValues.bodyTemplate}</p>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-3">
                                <Mail className="w-6 h-6 text-muted-foreground/30 mx-auto mb-1.5" />
                                <p className="text-xs text-muted-foreground">No email configured yet</p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setEmailBuilderOpen(true)}
                          >
                            <Mail className="w-3.5 h-3.5 mr-2" />
                            {configValues.recipients ? "Edit Email Template" : "Design Email"}
                          </Button>
                        </>
                      ) : (
                        settingFields.map((field) => (
                          <div key={field.key}>
                            <Label className="text-sm">
                              {field.label}
                              {field.required && (
                                <span className="text-destructive ml-1">*</span>
                              )}
                            </Label>
                            {field.type === "textarea" ? (
                              <Textarea
                                className="mt-1.5 text-sm"
                                placeholder={field.placeholder}
                                value={configValues[field.key] || ""}
                                onChange={(e) =>
                                  setConfigValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                                rows={3}
                              />
                            ) : field.type === "select" ? (
                              <Select
                                value={configValues[field.key] || ""}
                                onValueChange={(v) =>
                                  setConfigValues((prev) => ({ ...prev, [field.key]: v }))
                                }
                              >
                                <SelectTrigger className="mt-1.5">
                                  <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                className="mt-1.5 text-sm"
                                type={field.type}
                                placeholder={field.placeholder}
                                value={configValues[field.key] || ""}
                                onChange={(e) =>
                                  setConfigValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                              />
                            )}
                            {field.helpText && (
                              <p className="text-[11px] text-muted-foreground mt-1 flex items-start gap-1">
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {field.helpText}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  disabled={!selectedConnectionId}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Create & Activate
                </Button>
              </DialogFooter>
            </DialogContent>
          );
        })()}
      </Dialog>

      {/* New Connection Dialog */}
      <Dialog
        open={showNewConnectionForm && selectedNewPlatform !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowNewConnectionForm(false);
            setSelectedNewPlatform(null);
            setShowPasswords({});
          }
        }}
      >
        {selectedNewPlatform && (
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  {(() => {
                    const Logo = PLATFORM_LOGO_MAP[selectedNewPlatform.platform] || PLATFORM_LOGO_MAP["crm_update"];
                    return Logo ? <Logo className="w-5 h-5" /> : <KeyRound className="w-5 h-5 text-muted-foreground" />;
                  })()}
                </div>
                <div>
                  <span className="block">Connect {selectedNewPlatform.name}</span>
                  <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                    {selectedNewPlatform.description}
                  </span>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <Label className="text-sm">Connection Name</Label>
                <Input
                  className="mt-1.5"
                  value={newConnectionName}
                  onChange={(e) => setNewConnectionName(e.target.value)}
                  placeholder={`${selectedNewPlatform.name} - My Account`}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  A friendly name to identify this connection
                </p>
              </div>

              <div className="border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Credentials
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    Encrypted at rest
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {selectedNewPlatform.credentialFields.map((field) => (
                    <div key={field.key}>
                      <Label className="text-sm">
                        {field.label}
                        {field.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>
                      {field.type === "password" ? (
                        <div className="relative mt-1.5">
                          <Input
                            type={showPasswords[field.key] ? "text" : "password"}
                            placeholder={field.placeholder}
                            value={newConnectionValues[field.key] || ""}
                            onChange={(e) =>
                              setNewConnectionValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                            }
                            className="pr-10 font-mono text-sm"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPasswords((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                          >
                            {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      ) : (
                        <Input
                          className="mt-1.5 font-mono text-sm"
                          type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
                          placeholder={field.placeholder}
                          value={newConnectionValues[field.key] || ""}
                          onChange={(e) =>
                            setNewConnectionValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                        />
                      )}
                      {field.helpText && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-start gap-1">
                          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {field.helpText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => {
                setShowNewConnectionForm(false);
                setSelectedNewPlatform(null);
                setShowPasswords({});
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Create the new connection (mock)
                const newConn: Connection = {
                  id: `conn_${Date.now()}`,
                  platform: selectedNewPlatform.platform,
                  name: newConnectionName || `${selectedNewPlatform.name} - New`,
                  status: "connected",
                  createdAt: new Date().toISOString(),
                  lastUsedAt: null,
                  maskedCredential: Object.values(newConnectionValues)[0]?.slice(0, 20) + "..." || "***",
                  automationsUsing: 0,
                };
                setConnections((prev) => [...prev, newConn]);
                setSelectedConnectionId(newConn.id);
                setShowNewConnectionForm(false);
                setSelectedNewPlatform(null);
                setShowPasswords({});
                toast({
                  title: "Connection saved",
                  description: `${newConn.name} has been connected successfully.`,
                });
              }}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Connection
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Email Template Builder Dialog */}
      {selectedTemplate && selectedTemplate.actionType === "email" && (
        <EmailTemplateBuilder
          open={emailBuilderOpen}
          onOpenChange={setEmailBuilderOpen}
          to={configValues.recipients || ""}
          cc={configValues.cc || ""}
          subject={configValues.subject || ""}
          body={configValues.bodyTemplate || ""}
          onSave={(values) => {
            setConfigValues((prev) => ({
              ...prev,
              recipients: values.to,
              cc: values.cc,
              subject: values.subject,
              bodyTemplate: values.body,
            }));
          }}
        />
      )}
    </div>
  );
};

export default AutomationCreate;
