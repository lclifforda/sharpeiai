import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bot } from "lucide-react";
import type { ApplicationFieldConfig } from "@/services/platformConfigMockData";

function FieldRow({ field, striped, onUpdate }: { field: ApplicationFieldConfig; striped: boolean; onUpdate: (patch: Partial<ApplicationFieldConfig>) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${striped ? "bg-muted/20" : ""} ${!field.enabled ? "opacity-50" : ""} transition-opacity`}>
      <div className="flex items-center gap-4 px-4 py-3">
        <Switch
          checked={field.enabled}
          onCheckedChange={(checked) => onUpdate({ enabled: checked })}
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{field.label}</span>
            <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{field.type}</span>
            {field.aiNote && field.enabled && (
              <Bot className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-xs text-muted-foreground">Required</span>
            <Switch
              checked={field.required}
              disabled={!field.enabled}
              onCheckedChange={(checked) => onUpdate({ required: checked })}
            />
          </label>
          {field.enabled && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                expanded ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {expanded ? "Close" : "Edit"}
            </button>
          )}
        </div>
      </div>

      {expanded && field.enabled && (
        <div className="px-4 pb-3 pt-0 space-y-3 ml-12">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI Note
            </Label>
            <Input
              placeholder="Instructions for the AI on how to ask for this field..."
              value={field.aiNote}
              onChange={(e) => onUpdate({ aiNote: e.target.value })}
              className="text-sm h-8"
            />
          </div>
          {field.type === "number" && (
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">Min Threshold</Label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={field.minThreshold ?? ""}
                  onChange={(e) => onUpdate({ minThreshold: e.target.value ? Number(e.target.value) : undefined })}
                  className="text-sm h-8"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">Max Threshold</Label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={field.maxThreshold ?? ""}
                  onChange={(e) => onUpdate({ maxThreshold: e.target.value ? Number(e.target.value) : undefined })}
                  className="text-sm h-8"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FieldRow;
