import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Zap,
  Mail,
  MessageSquare,
  Globe,
  GitBranch,
  Filter,
  Clock,
  Webhook,
  Users,
  Trash2,
  GripVertical,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import { EVENT_CATEGORIES } from "@/services/automationMockData";

// Node types for the builder
interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  subtype: string;
  label: string;
  x: number;
  y: number;
  config: Record<string, string>;
}

interface Connection {
  from: string;
  to: string;
}

const NODE_PALETTE = {
  triggers: [
    { subtype: "event", label: "Platform Event", icon: Zap, color: "bg-blue-500" },
    { subtype: "schedule", label: "Schedule", icon: Clock, color: "bg-blue-500" },
    { subtype: "webhook_receive", label: "Webhook Received", icon: Webhook, color: "bg-blue-500" },
  ],
  conditions: [
    { subtype: "if_else", label: "If / Else", icon: GitBranch, color: "bg-amber-500" },
    { subtype: "filter", label: "Filter", icon: Filter, color: "bg-amber-500" },
  ],
  actions: [
    { subtype: "send_email", label: "Send Email", icon: Mail, color: "bg-green-500" },
    { subtype: "slack_message", label: "Slack Message", icon: MessageSquare, color: "bg-green-500" },
    { subtype: "http_request", label: "HTTP Request", icon: Globe, color: "bg-green-500" },
    { subtype: "crm_update", label: "Update CRM", icon: Users, color: "bg-green-500" },
  ],
};

const getNodeColor = (type: string) => {
  switch (type) {
    case "trigger": return { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-700", dot: "bg-blue-500" };
    case "condition": return { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-700", dot: "bg-amber-500" };
    case "action": return { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-700", dot: "bg-green-500" };
    default: return { bg: "bg-muted", border: "border-border", text: "text-foreground", dot: "bg-muted-foreground" };
  }
};

const getNodeIcon = (subtype: string) => {
  const all = [...NODE_PALETTE.triggers, ...NODE_PALETTE.conditions, ...NODE_PALETTE.actions];
  const found = all.find((n) => n.subtype === subtype);
  return found?.icon || Zap;
};

let nodeIdCounter = 0;

export default function AutomationWorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: "node_1", type: "trigger", subtype: "event", label: "Platform Event", x: 300, y: 80, config: { event: "order_created" } },
    { id: "node_2", type: "action", subtype: "slack_message", label: "Slack Message", x: 300, y: 280, config: { channel: "#orders" } },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { from: "node_1", to: "node_2" },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>("node_1");
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingNode || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNode ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n))
      );
    },
    [draggingNode, dragOffset]
  );

  const handleCanvasMouseUp = useCallback(() => {
    setDraggingNode(null);
  }, []);

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
    setDraggingNode(nodeId);
    setSelectedNode(nodeId);
  };

  const addNode = (type: "trigger" | "condition" | "action", subtype: string, label: string) => {
    nodeIdCounter++;
    const newId = `node_new_${nodeIdCounter}`;
    const lastNode = nodes[nodes.length - 1];
    const newNode: WorkflowNode = {
      id: newId,
      type,
      subtype,
      label,
      x: lastNode ? lastNode.x : 300,
      y: lastNode ? lastNode.y + 180 : 80,
      config: {},
    };
    setNodes((prev) => [...prev, newNode]);

    // Auto-connect to last node if it makes sense
    if (lastNode) {
      setConnections((prev) => [...prev, { from: lastNode.id, to: newId }]);
    }
    setSelectedNode(newId);
  };

  const removeNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
  };

  const updateNodeConfig = (nodeId: string, key: string, value: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, config: { ...n.config, [key]: value } } : n
      )
    );
  };

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  // SVG path for connections
  const getConnectionPath = (from: WorkflowNode, to: WorkflowNode) => {
    const fromX = from.x + 100;
    const fromY = from.y + 70;
    const toX = to.x + 100;
    const toY = to.y;
    const midY = (fromY + toY) / 2;
    return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
  };

  return (
    <div className="flex h-[600px] border rounded-xl overflow-hidden bg-card">
      {/* Left Panel - Node Palette */}
      <div className="w-56 border-r bg-muted/30 p-4 overflow-y-auto flex-shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Triggers
        </p>
        {NODE_PALETTE.triggers.map((node) => (
          <button
            key={node.subtype}
            onClick={() => addNode("trigger", node.subtype, node.label)}
            className="w-full flex items-center gap-2.5 px-3 py-2 mb-1.5 rounded-lg text-sm text-foreground hover:bg-blue-500/10 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <node.icon className="w-3.5 h-3.5 text-blue-600" />
            </div>
            {node.label}
          </button>
        ))}

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5">
          Conditions
        </p>
        {NODE_PALETTE.conditions.map((node) => (
          <button
            key={node.subtype}
            onClick={() => addNode("condition", node.subtype, node.label)}
            className="w-full flex items-center gap-2.5 px-3 py-2 mb-1.5 rounded-lg text-sm text-foreground hover:bg-amber-500/10 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <node.icon className="w-3.5 h-3.5 text-amber-600" />
            </div>
            {node.label}
          </button>
        ))}

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5">
          Actions
        </p>
        {NODE_PALETTE.actions.map((node) => (
          <button
            key={node.subtype}
            onClick={() => addNode("action", node.subtype, node.label)}
            className="w-full flex items-center gap-2.5 px-3 py-2 mb-1.5 rounded-lg text-sm text-foreground hover:bg-green-500/10 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <node.icon className="w-3.5 h-3.5 text-green-600" />
            </div>
            {node.label}
          </button>
        ))}
      </div>

      {/* Center - Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-auto bg-[radial-gradient(circle,_hsl(var(--border))_1px,_transparent_1px)] [background-size:24px_24px] cursor-default"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onClick={() => setSelectedNode(null)}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: "100%", minWidth: "100%" }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" className="fill-muted-foreground/40" />
            </marker>
          </defs>
          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            return (
              <path
                key={`${conn.from}-${conn.to}`}
                d={getConnectionPath(fromNode, toNode)}
                fill="none"
                stroke="hsl(var(--muted-foreground) / 0.3)"
                strokeWidth="2"
                strokeDasharray="6 3"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const colors = getNodeColor(node.type);
          const Icon = getNodeIcon(node.subtype);
          return (
            <div
              key={node.id}
              className={`absolute w-[200px] rounded-xl border-2 shadow-sm transition-shadow cursor-grab active:cursor-grabbing select-none ${
                colors.bg
              } ${
                selectedNode === node.id
                  ? `${colors.border} shadow-md ring-2 ring-primary/20`
                  : "border-transparent hover:shadow-md"
              }`}
              style={{ left: node.x, top: node.y }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(node.id);
              }}
            >
              <div className="px-3 py-2.5 flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg ${colors.dot} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${colors.text} uppercase tracking-wider`}>
                    {node.type}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">{node.label}</p>
                </div>
              </div>
              {/* Node config preview */}
              {Object.keys(node.config).length > 0 && (
                <div className="px-3 pb-2.5 pt-0">
                  <div className="text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-1 truncate">
                    {Object.entries(node.config)
                      .slice(0, 1)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </div>
                </div>
              )}
              {/* Connection dot at bottom */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background bg-muted-foreground/30" />
              {/* Connection dot at top */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background bg-muted-foreground/30" />
            </div>
          );
        })}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Add nodes from the left panel to build your workflow
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Node Configuration */}
      <div className="w-72 border-l bg-muted/30 p-4 overflow-y-auto flex-shrink-0">
        {selectedNodeData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Configure Node</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeNode(selectedNodeData.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Node Type</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={getNodeColor(selectedNodeData.type).text}
                >
                  {selectedNodeData.type}
                </Badge>
                <span className="text-sm">{selectedNodeData.label}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Label
              </Label>
              <Input
                value={selectedNodeData.label}
                onChange={(e) =>
                  setNodes((prev) =>
                    prev.map((n) =>
                      n.id === selectedNodeData.id
                        ? { ...n, label: e.target.value }
                        : n
                    )
                  )
                }
                className="h-8 text-sm"
              />
            </div>

            {/* Dynamic config fields based on node subtype */}
            {selectedNodeData.subtype === "event" && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Event Type
                </Label>
                <Select
                  value={selectedNodeData.config.event || ""}
                  onValueChange={(v) =>
                    updateNodeConfig(selectedNodeData.id, "event", v)
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <div key={cat.label}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          {cat.label}
                        </div>
                        {cat.events.map((evt) => (
                          <SelectItem
                            key={evt.value}
                            value={evt.value}
                            className="text-sm"
                          >
                            {evt.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedNodeData.subtype === "schedule" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Frequency
                  </Label>
                  <Select
                    value={selectedNodeData.config.frequency || ""}
                    onValueChange={(v) =>
                      updateNodeConfig(selectedNodeData.id, "frequency", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Every day</SelectItem>
                      <SelectItem value="weekly">Every week</SelectItem>
                      <SelectItem value="monthly">Every month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Time
                  </Label>
                  <Input
                    type="time"
                    value={selectedNodeData.config.time || "09:00"}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "time", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "webhook_receive" && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Webhook Path
                </Label>
                <Input
                  value={selectedNodeData.config.path || "/incoming"}
                  onChange={(e) =>
                    updateNodeConfig(selectedNodeData.id, "path", e.target.value)
                  }
                  className="h-8 text-sm"
                  placeholder="/my-webhook"
                />
              </div>
            )}

            {selectedNodeData.subtype === "if_else" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Field
                  </Label>
                  <Input
                    value={selectedNodeData.config.field || ""}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "field", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="e.g. order.amount"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Operator
                  </Label>
                  <Select
                    value={selectedNodeData.config.operator || ""}
                    onValueChange={(v) =>
                      updateNodeConfig(selectedNodeData.id, "operator", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Value
                  </Label>
                  <Input
                    value={selectedNodeData.config.value || ""}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "value", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="e.g. 10000"
                  />
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "filter" && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Filter Expression
                </Label>
                <Input
                  value={selectedNodeData.config.expression || ""}
                  onChange={(e) =>
                    updateNodeConfig(selectedNodeData.id, "expression", e.target.value)
                  }
                  className="h-8 text-sm"
                  placeholder="e.g. status == 'active'"
                />
              </div>
            )}

            {selectedNodeData.subtype === "send_email" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    To
                  </Label>
                  <Input
                    value={selectedNodeData.config.to || ""}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "to", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="team@company.com"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Subject
                  </Label>
                  <Input
                    value={selectedNodeData.config.subject || ""}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "subject", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="New event: {{event_type}}"
                  />
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "slack_message" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Channel
                  </Label>
                  <Input
                    value={selectedNodeData.config.channel || ""}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "channel", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="#general"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Webhook URL
                  </Label>
                  <Input
                    value={selectedNodeData.config.webhookUrl || ""}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "webhookUrl", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="https://hooks.slack.com/..."
                  />
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "http_request" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    URL
                  </Label>
                  <Input
                    value={selectedNodeData.config.url || ""}
                    onChange={(e) =>
                      updateNodeConfig(selectedNodeData.id, "url", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="https://api.example.com/webhook"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Method
                  </Label>
                  <Select
                    value={selectedNodeData.config.method || "POST"}
                    onValueChange={(v) =>
                      updateNodeConfig(selectedNodeData.id, "method", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedNodeData.subtype === "crm_update" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    CRM Provider
                  </Label>
                  <Select
                    value={selectedNodeData.config.provider || ""}
                    onValueChange={(v) =>
                      updateNodeConfig(selectedNodeData.id, "provider", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select CRM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Action
                  </Label>
                  <Select
                    value={selectedNodeData.config.action || ""}
                    onValueChange={(v) =>
                      updateNodeConfig(selectedNodeData.id, "action", v)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create_contact">Create Contact</SelectItem>
                      <SelectItem value="update_contact">Update Contact</SelectItem>
                      <SelectItem value="create_deal">Create Deal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ChevronRight className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Select a node to configure it
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
