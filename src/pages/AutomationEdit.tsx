import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import AutomationWorkflowBuilder from "@/components/AutomationWorkflowBuilder";
import {
  MOCK_AUTOMATIONS,
  getEventLabel,
} from "@/services/automationMockData";
import {
  automationToWorkflow,
  workflowToAutomation,
} from "@/lib/workflowConversion";

const AutomationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const automation = MOCK_AUTOMATIONS.find((a) => a.pid === id);

  const { nodes, connections } = useMemo(() => {
    if (!automation) return { nodes: [], connections: [] };
    return automationToWorkflow(automation, (eventType) =>
      getEventLabel(eventType)
    );
  }, [automation?.id]);

  const [automationName, setAutomationName] = useState(automation?.name ?? "");

  useEffect(() => {
    if (automation) setAutomationName(automation.name);
  }, [automation?.id]);

  const handleSave = (savedNodes: any[], savedConnections: any[]) => {
    if (!automation) return;

    const updated = workflowToAutomation(
      savedNodes,
      savedConnections,
      {
        name: automationName,
        description: automation.description,
        eventType: automation.eventType,
        eventLabel: automation.eventLabel,
        actionType: automation.actionType,
        actionLabel: automation.actionLabel,
      }
    );

    toast({
      title: "Automation updated",
      description: `"${updated.name}" has been saved.`,
    });
    navigate(`/automations/${automation.pid}`);
  };

  if (!automation) {
    return (
      <div className="min-h-screen bg-background p-6">
        <p className="text-muted-foreground">Automation not found.</p>
        <Link to="/automations" className="text-primary hover:underline mt-2 inline-block">
          Back to Automations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <Link
            to={`/automations/${automation.pid}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Automation
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Edit Automation
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Modify the workflow — add nodes, change conditions, or update actions
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-xs text-muted-foreground">Automation Name</Label>
            <Input
              className="mt-1 max-w-md"
              value={automationName}
              onChange={(e) => setAutomationName(e.target.value)}
              placeholder="My automation"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <AutomationWorkflowBuilder
          initialNodes={nodes}
          initialConnections={connections}
          mode="edit"
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default AutomationEdit;
