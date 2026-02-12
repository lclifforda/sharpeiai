import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Zap,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Play,
  Settings,
  Trash2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Mail,
  MessageSquare,
  Webhook,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  MOCK_AUTOMATIONS,
  MOCK_EXECUTIONS,
  getActionColor,
  getActionLabel,
  type Automation,
  type AutomationExecution,
} from "@/services/automationMockData";

const ACTION_ICON_MAP: Record<string, any> = {
  slack: MessageSquare,
  email: Mail,
  webhook: Webhook,
  crm_update: Users,
};

const AutomationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const automation = MOCK_AUTOMATIONS.find((a) => a.pid === id) || MOCK_AUTOMATIONS[0];
  const executions = MOCK_EXECUTIONS.filter((e) => e.automationId === automation.id);

  const [isActive, setIsActive] = useState(automation.status === "active");
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);

  const ActionIcon = ACTION_ICON_MAP[automation.actionType] || Zap;

  const handleToggle = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Automation paused" : "Automation activated",
      description: isActive
        ? `"${automation.name}" has been paused.`
        : `"${automation.name}" is now active.`,
    });
  };

  const handleTest = () => {
    toast({
      title: "Test triggered",
      description: "A test execution has been started with sample data.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Automation deleted",
      description: `"${automation.name}" has been deleted.`,
      variant: "destructive",
    });
    navigate("/automations");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case "running":
        return (
          <Badge className="bg-blue-500 text-white hover:bg-blue-500/90">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Running
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
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
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {automation.name}
                  </h1>
                  {isActive ? (
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                  ) : (
                    <Badge variant="outline">Paused</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {automation.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isActive ? "Active" : "Paused"}
                </span>
                <Switch checked={isActive} onCheckedChange={handleToggle} />
              </div>
              <Button variant="outline" size="sm" onClick={handleTest}>
                <Play className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trigger</p>
                  <p className="text-sm font-medium">{automation.eventLabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getActionColor(automation.actionType)}`}>
                  <ActionIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Action</p>
                  <p className="text-sm font-medium">{automation.actionLabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Executions</p>
                  <p className="text-sm font-medium">{automation.executionCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="text-sm font-medium">{automation.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="executions">
              <Activity className="w-4 h-4 mr-2" />
              Execution Log ({executions.length})
            </TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="overview" className="mt-6 space-y-4">
            {/* Workflow visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {/* Trigger node */}
                  <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 min-w-[180px]">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                        Trigger
                      </p>
                      <p className="text-sm font-medium">{automation.eventLabel}</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-muted-foreground/20" />
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 -ml-1" />
                  </div>

                  {/* Action node */}
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 min-w-[180px] border ${
                    automation.actionType === "slack"
                      ? "bg-green-500/10 border-green-500/20"
                      : automation.actionType === "email"
                      ? "bg-blue-500/10 border-blue-500/20"
                      : automation.actionType === "webhook"
                      ? "bg-orange-500/10 border-orange-500/20"
                      : "bg-purple-500/10 border-purple-500/20"
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      automation.actionType === "slack"
                        ? "bg-green-500"
                        : automation.actionType === "email"
                        ? "bg-blue-500"
                        : automation.actionType === "webhook"
                        ? "bg-orange-500"
                        : "bg-purple-500"
                    }`}>
                      <ActionIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${
                        automation.actionType === "slack"
                          ? "text-green-700"
                          : automation.actionType === "email"
                          ? "text-blue-700"
                          : automation.actionType === "webhook"
                          ? "text-orange-700"
                          : "text-purple-700"
                      }`}>
                        Action
                      </p>
                      <p className="text-sm font-medium">{automation.actionLabel}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Action Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(automation.actionConfig).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-4">
                      <p className="text-sm text-muted-foreground w-32 flex-shrink-0 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="text-sm font-medium text-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
                        {value.includes("***") ? value : value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(automation.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Executed</p>
                    <p className="text-sm font-medium">
                      {automation.lastExecutedAt
                        ? new Date(automation.lastExecutedAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Template</p>
                    <p className="text-sm font-medium">
                      {automation.templateSlug || "Custom"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="text-sm font-medium font-mono">{automation.pid}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution Log Tab */}
          <TabsContent value="executions" className="mt-6">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
              {/* Table Header */}
              <div className="grid grid-cols-[0.3fr_1.2fr_0.8fr_0.8fr_0.8fr_2fr] gap-4 px-6 py-4 border-b border-border bg-muted/50">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider" />
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Timestamp
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duration
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Event
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Details
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border">
                {executions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No executions yet. This automation hasn't been triggered.
                    </p>
                  </div>
                ) : (
                  executions.map((exec) => (
                    <div key={exec.id}>
                      <div
                        className="grid grid-cols-[0.3fr_1.2fr_0.8fr_0.8fr_0.8fr_2fr] gap-4 px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() =>
                          setExpandedExecution(
                            expandedExecution === exec.id ? null : exec.id
                          )
                        }
                      >
                        <div className="flex items-center">
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              expandedExecution === exec.id ? "rotate-0" : "-rotate-90"
                            }`}
                          />
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-foreground">
                            {new Date(exec.startedAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(exec.status)}
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-muted-foreground">
                            {exec.durationMs ? `${exec.durationMs}ms` : "-"}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-xs">
                            {exec.eventType
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          {exec.errorMessage ? (
                            <p className="text-sm text-destructive truncate">
                              {exec.errorMessage}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground truncate">
                              {Object.entries(exec.triggerData)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Expanded row */}
                      {expandedExecution === exec.id && (
                        <div className="px-6 pb-4 pl-14">
                          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">
                                TRIGGER DATA
                              </p>
                              <pre className="text-xs bg-background rounded p-3 overflow-x-auto font-mono">
                                {JSON.stringify(exec.triggerData, null, 2)}
                              </pre>
                            </div>
                            {exec.errorMessage && (
                              <div>
                                <p className="text-xs font-semibold text-destructive mb-1">
                                  ERROR
                                </p>
                                <div className="text-xs bg-destructive/5 border border-destructive/20 text-destructive rounded p-3">
                                  {exec.errorMessage}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                Started:{" "}
                                {new Date(exec.startedAt).toLocaleString()}
                              </span>
                              {exec.completedAt && (
                                <span>
                                  Completed:{" "}
                                  {new Date(exec.completedAt).toLocaleString()}
                                </span>
                              )}
                              {exec.durationMs && (
                                <span>Duration: {exec.durationMs}ms</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AutomationDetail;
