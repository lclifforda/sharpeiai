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
  Search,
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
  Mail,
  Webhook,
  ArrowRight,
  Save,
  Play,
} from "lucide-react";
import AutomationWorkflowBuilder from "@/components/AutomationWorkflowBuilder";
import {
  AUTOMATION_TEMPLATES,
  getActionColor,
  getActionLabel,
  getCategoryColor,
  type AutomationTemplate,
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
};

const ACTION_ICON_MAP: Record<string, any> = {
  slack: MessageSquare,
  email: Mail,
  webhook: Webhook,
  crm_update: Users,
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
  const [activeTab, setActiveTab] = useState(preselectedTemplate ? "templates" : "templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Template config dialog
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(
    preselectedTemplate
      ? AUTOMATION_TEMPLATES.find((t) => t.slug === preselectedTemplate) || null
      : null
  );
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [automationName, setAutomationName] = useState("");

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

  const handleSelectTemplate = (template: AutomationTemplate) => {
    setSelectedTemplate(template);
    setAutomationName(template.name);
    setConfigValues({});
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
                    return (
                      <Card
                        key={template.slug}
                        className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-5 h-5 text-primary" />
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
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Test Run
                </Button>
                <Button size="sm" onClick={handleSaveWorkflow}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Workflow
                </Button>
              </div>
            </div>
            <AutomationWorkflowBuilder />
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Configuration Dialog */}
      <Dialog
        open={selectedTemplate !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTemplate(null);
        }}
      >
        {selectedTemplate && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {(() => {
                  const Icon = ICON_MAP[selectedTemplate.icon] || Zap;
                  return (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  );
                })()}
                Set up: {selectedTemplate.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Automation name */}
              <div>
                <Label>Automation Name</Label>
                <Input
                  className="mt-1.5"
                  value={automationName}
                  onChange={(e) => setAutomationName(e.target.value)}
                  placeholder="My automation"
                />
              </div>

              {/* Trigger info */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  TRIGGER
                </p>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    When "{selectedTemplate.eventLabel}" occurs
                  </span>
                </div>
              </div>

              {/* Action config fields */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3">
                  ACTION CONFIGURATION
                </p>
                <div className="space-y-3">
                  {selectedTemplate.configFields.map((field) => (
                    <div key={field.key}>
                      <Label className="text-sm">
                        {field.label}
                        {field.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          className="mt-1.5"
                          placeholder={field.placeholder}
                          value={configValues[field.key] || ""}
                          onChange={(e) =>
                            setConfigValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          rows={3}
                        />
                      ) : field.type === "select" ? (
                        <Select
                          value={configValues[field.key] || ""}
                          onValueChange={(v) =>
                            setConfigValues((prev) => ({
                              ...prev,
                              [field.key]: v,
                            }))
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
                          className="mt-1.5"
                          type={field.type}
                          placeholder={field.placeholder}
                          value={configValues[field.key] || ""}
                          onChange={(e) =>
                            setConfigValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Zap className="w-4 h-4 mr-2" />
                Create Automation
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AutomationCreate;
