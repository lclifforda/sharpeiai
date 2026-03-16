import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import TableFilters from "@/components/TableFilters";
import {
  Search,
  Plus,
  Zap,
  Activity,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  FileCheck,
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
  Send,
  UserCheck,
  Loader2,
} from "lucide-react";
import {
  AUTOMATION_TEMPLATES,
  getActionColor,
  getActionLabel,
  getEventLabel,
  type Automation,
  type AutomationTemplate,
} from "@/services/automationMockData";
import { useAutomations, useUpdateAutomation } from "@/hooks/queries";

// --- Platform Logo Components (SVG) ---

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

const SalesforceLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 256 180" fill="none">
    <path d="M106.7 16.4c13.6-14.2 32.6-23 53.6-23 28.4 0 53.2 16.2 65.4 39.8 10.8-4.8 22.6-7.4 35-7.4 47.6 0 86.2 38.6 86.2 86.2s-38.6 86.2-86.2 86.2c-7.8 0-15.4-1-22.6-3-10.8 18.8-31 31.4-54.2 31.4-11.2 0-21.8-3-30.8-8.2-11.4 21.6-34 36.4-60 36.4-29 0-54-18.4-63.4-44.2-4.8 1-10 1.6-15.2 1.6C16.1 212.2-22.1 174-22.1 127s38.2-85.2 85.2-85.2c15.4 0 29.8 4 42.2 11z" fill="#00A1E0" transform="translate(-14, -10) scale(0.98)"/>
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

const WebhookLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/>
    <path d="m6 17 3.13-5.78c.53-.97.43-2.22-.26-3.07a4 4 0 0 1 6.4-4.76c.47.56.76 1.25.87 1.97"/>
    <path d="m12 6 3.13 5.73c.53.98 1.67 1.55 2.87 1.55a4 4 0 0 1-.88 7.9"/>
  </svg>
);

const TeamsLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M16.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#5059C9"/>
    <path d="M19 9h-3a1 1 0 0 0-1 1v5a3 3 0 0 0 6 0v-4a2 2 0 0 0-2-2Z" fill="#5059C9"/>
    <path d="M10.5 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" fill="#7B83EB"/>
    <path d="M15 9H6a1 1 0 0 0-1 1v6a4.5 4.5 0 0 0 9 0v-6a1 1 0 0 0-1-1h2Z" fill="#7B83EB"/>
  </svg>
);

// Platform logo map
const LenderApiLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <Server className={`${className} text-cyan-600`} />
);

const AssignOfficerLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <UserCheck className={`${className} text-teal-600`} />
);

const PLATFORM_LOGOS: Record<string, React.FC<{ className?: string }>> = {
  slack: SlackLogo,
  teams: TeamsLogo,
  email: GmailLogo,
  webhook: WebhookLogo,
  lender_api: LenderApiLogo,
  crm_update: HubSpotLogo,
  assign_officer: AssignOfficerLogo,
};

/** Resolve the correct logo for CRM items (Salesforce vs HubSpot) */
const getPlatformLogo = (actionType: string, slug?: string): React.FC<{ className?: string }> | undefined => {
  if (actionType === "crm_update" && slug?.includes("salesforce")) {
    return SalesforceLogo;
  }
  return PLATFORM_LOGOS[actionType];
};

// For template cards
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

/** Map an API automation object to the shape the UI expects. */
function mapApiAutomation(raw: any): Automation {
  return {
    id: raw.id,
    pid: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    eventType: raw.event_type,
    eventLabel: getEventLabel(raw.event_type),
    actionType: raw.action_type,
    actionLabel: getActionLabel(raw.action_type),
    actionConfig: raw.action_config ?? {},
    status: raw.status === "active" ? "active" : "paused",
    executionCount: raw.execution_count ?? 0,
    lastExecutedAt: raw.last_executed_at ?? null,
    successRate: raw.success_rate ?? 0,
    createdAt: raw.created_at,
    templateSlug: raw.template_slug ?? null,
  };
}

const Automations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: rawAutomations, isLoading } = useAutomations();
  const updateAutomation = useUpdateAutomation();
  const automations: Automation[] = useMemo(
    () => (rawAutomations ?? []).map(mapApiAutomation),
    [rawAutomations],
  );
  const [filters, setFilters] = useState({
    status: [] as string[],
    action: [] as string[],
  });

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Active", value: "active", checked: filters.status.includes("active") },
        { label: "Paused", value: "paused", checked: filters.status.includes("paused") },
      ],
    },
    {
      label: "Action",
      options: [
        { label: "Email", value: "email", checked: filters.action.includes("email") },
        { label: "Lender API", value: "lender_api", checked: filters.action.includes("lender_api") },
        { label: "CRM", value: "crm_update", checked: filters.action.includes("crm_update") },
        { label: "Webhook", value: "webhook", checked: filters.action.includes("webhook") },
        { label: "Slack", value: "slack", checked: filters.action.includes("slack") },
        { label: "Teams", value: "teams", checked: filters.action.includes("teams") },
        { label: "Assign Officer", value: "assign_officer", checked: filters.action.includes("assign_officer") },
      ],
    },
  ];

  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    const key = groupLabel.toLowerCase() as "status" | "action";
    setFilters((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter((v) => v !== value),
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: [], action: [] });
  };

  const activeFilterCount = filters.status.length + filters.action.length;

  const filteredAutomations = useMemo(() => {
    return automations.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.eventLabel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status.length === 0 || filters.status.includes(a.status);
      const matchesAction = filters.action.length === 0 || filters.action.includes(a.actionType);
      return matchesSearch && matchesStatus && matchesAction;
    });
  }, [automations, searchQuery, filters]);

  const handleToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const automation = automations.find((a) => a.id === id);
    if (automation) {
      updateAutomation.mutate({
        id,
        status: automation.status === "active" ? "paused" : "active",
      });
    }
  };

  const stats = useMemo(() => {
    const total = automations.length;
    const active = automations.filter((a) => a.status === "active").length;
    const totalExecutions = automations.reduce((sum, a) => sum + a.executionCount, 0);
    const avgSuccess =
      total > 0
        ? Math.round(
            (automations.reduce((sum, a) => sum + a.successRate, 0) / total) * 10
          ) / 10
        : 0;
    return {
      totalAutomations: total,
      activeAutomations: active,
      executionsToday: totalExecutions,
      successRate: avgSuccess,
    };
  }, [automations]);
  const popularTemplates = AUTOMATION_TEMPLATES.filter((t) => t.isPopular).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Automations</h1>
                <Badge variant="outline" className="text-xs">Beta</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Automate workflows triggered by platform events
              </p>
            </div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/automations/new")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Automation
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 space-y-6">
          {/* Loading skeleton for stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="w-10 h-10 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Loading skeleton for table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float p-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading automations...</span>
            </div>
          </div>
        </div>
      ) : (
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Automations</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalAutomations}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold mt-1">{stats.activeAutomations}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Executions Today</p>
                  <p className="text-2xl font-bold mt-1">{stats.executionsToday}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold mt-1">{stats.successRate}%</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Templates */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Quick Start</h2>
              <p className="text-sm text-muted-foreground">
                Get started with popular automation templates
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => navigate("/automations/new")}
            >
              View all templates
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularTemplates.map((template) => {
              const IconComponent = ICON_MAP[template.icon] || Zap;
              const PlatformLogo = getPlatformLogo(template.actionType, template.slug);
              const ActionIcon = ACTION_ICON_MAP[template.actionType] || Zap;
              return (
                <Card
                  key={template.slug}
                  className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(`/automations/new?template=${template.slug}`)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-muted/80 flex items-center justify-center flex-shrink-0">
                        {PlatformLogo ? (
                          <PlatformLogo className="w-5 h-5" />
                        ) : (
                          <IconComponent className="w-4.5 h-4.5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {template.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {template.eventLabel}
                          </Badge>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 ${getActionColor(template.actionType)} flex items-center gap-1`}
                          >
                            <ActionIcon className="w-2.5 h-2.5" />
                            {getActionLabel(template.actionType)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search automations..."
              className="pl-10 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <TableFilters
            filters={filterGroups}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearFilters}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Automations Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[minmax(0,2.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,0.5fr)] gap-4 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Automation
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Trigger
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Platform
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Runs
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Last Run
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
              Active
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border">
            {filteredAutomations.map((automation) => {
              const PlatformLogo = getPlatformLogo(automation.actionType, automation.templateSlug);
              return (
                <div
                  key={automation.id}
                  onClick={() => navigate(`/automations/${automation.pid}`)}
                  className="grid grid-cols-[minmax(0,2.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,0.5fr)] gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
                >
                  {/* Name + status dot */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      automation.status === "active" ? "bg-success" : "bg-muted-foreground/30"
                    }`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {automation.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {automation.description}
                      </p>
                    </div>
                  </div>

                  {/* Trigger event */}
                  <div className="flex items-center">
                    <Badge variant="outline" className="text-xs truncate">
                      {automation.eventLabel}
                    </Badge>
                  </div>

                  {/* Platform with logo */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-muted/80 flex items-center justify-center flex-shrink-0">
                      {PlatformLogo ? (
                        <PlatformLogo className="w-4 h-4" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-sm text-foreground">
                      {automation.actionLabel}
                    </span>
                  </div>

                  {/* Execution count */}
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      {automation.executionCount}
                    </span>
                  </div>

                  {/* Last run */}
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">
                      {automation.lastExecutedAt
                        ? new Date(automation.lastExecutedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </span>
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center justify-end">
                    <Switch
                      checked={automation.status === "active"}
                      onCheckedChange={() => {}}
                      onClick={(e) => handleToggle(e, automation.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Automations;
