import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  PartyPopper,
  RotateCcw,
  RefreshCcw,
  Mail,
  Webhook,
  ArrowRight,
} from "lucide-react";
import {
  MOCK_AUTOMATIONS,
  MOCK_STATS,
  AUTOMATION_TEMPLATES,
  getActionColor,
  getActionLabel,
  type Automation,
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

const Automations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
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
        { label: "Slack", value: "slack", checked: filters.action.includes("slack") },
        { label: "Email", value: "email", checked: filters.action.includes("email") },
        { label: "Webhook", value: "webhook", checked: filters.action.includes("webhook") },
        { label: "CRM", value: "crm_update", checked: filters.action.includes("crm_update") },
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

  const handleToggle = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a
      )
    );
  };

  const stats = MOCK_STATS;
  const popularTemplates = AUTOMATION_TEMPLATES.filter((t) => t.isPopular);

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
              const ActionIcon = ACTION_ICON_MAP[template.actionType] || Zap;
              return (
                <Card
                  key={template.slug}
                  className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(`/automations/new?template=${template.slug}`)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4.5 h-4.5 text-primary" />
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
                            className={`text-[10px] px-1.5 py-0 ${getActionColor(template.actionType)}`}
                          >
                            <ActionIcon className="w-2.5 h-2.5 mr-0.5" />
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
          <div className="grid grid-cols-[2fr_1.5fr_1fr_0.8fr_0.8fr_1fr_0.6fr] gap-6 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Name
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Trigger
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Action
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Executions
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Last Run
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Toggle
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredAutomations.map((automation) => {
              const ActionIcon = ACTION_ICON_MAP[automation.actionType] || Zap;
              return (
                <div
                  key={automation.id}
                  className="grid grid-cols-[2fr_1.5fr_1fr_0.8fr_0.8fr_1fr_0.6fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/automations/${automation.pid}`)}
                  >
                    <p className="font-semibold text-foreground text-sm">{automation.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {automation.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="text-xs">
                      {automation.eventLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getActionColor(automation.actionType)}`}
                    >
                      <ActionIcon className="w-3 h-3 mr-1" />
                      {automation.actionLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    {automation.status === "active" ? (
                      <Badge className="bg-success text-success-foreground hover:bg-success/90">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">Paused</Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-foreground">
                      {automation.executionCount}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground">
                      {automation.lastExecutedAt
                        ? new Date(automation.lastExecutedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      checked={automation.status === "active"}
                      onCheckedChange={() => handleToggle(automation.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automations;
