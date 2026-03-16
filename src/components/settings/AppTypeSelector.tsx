import React from "react";
import { APP_TYPE_GRADIENTS } from "./settingsConstants";
import type { ApplicationTypeConfig } from "@/services/platformConfigMockData";

function AppTypeSelector({ appTypes, selected, onSelect }: { appTypes: ApplicationTypeConfig[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg w-fit">
      {appTypes.map((at) => {
        const active = selected === at.id;
        const gradient = APP_TYPE_GRADIENTS[at.id] || "from-gray-500 to-gray-400";
        return (
          <button
            key={at.id}
            onClick={() => onSelect(at.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              active ? "bg-card shadow-subtle font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`} />
            {at.name}
          </button>
        );
      })}
    </div>
  );
}

export default React.memo(AppTypeSelector);
