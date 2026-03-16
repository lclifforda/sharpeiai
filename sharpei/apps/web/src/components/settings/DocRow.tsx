import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bot } from "lucide-react";
import type { DocumentConfig } from "@/services/platformConfigMockData";

function DocRow({ doc, striped, onUpdate }: { doc: DocumentConfig; striped: boolean; onUpdate: (patch: Partial<DocumentConfig>) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${striped ? "bg-muted/20" : ""} ${!doc.enabled ? "opacity-50" : ""} transition-opacity`}>
      <div className="flex items-center gap-4 px-4 py-3">
        <Switch
          checked={doc.enabled}
          onCheckedChange={(checked) => onUpdate({ enabled: checked })}
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{doc.label}</span>
            {doc.aiNote && doc.enabled && (
              <Bot className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-xs text-muted-foreground">Required</span>
            <Switch
              checked={doc.required}
              disabled={!doc.enabled}
              onCheckedChange={(checked) => onUpdate({ required: checked })}
            />
          </label>
          {doc.enabled && (
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

      {expanded && doc.enabled && (
        <div className="px-4 pb-3 pt-0 ml-12">
          <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Note
          </Label>
          <Input
            placeholder="What should the AI look for in this document..."
            value={doc.aiNote}
            onChange={(e) => onUpdate({ aiNote: e.target.value })}
            className="text-sm h-8"
          />
        </div>
      )}
    </div>
  );
}

export default DocRow;
