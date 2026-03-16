import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronDown } from "lucide-react";
import type { SectionId } from "./types";

interface SectionShellProps {
  sectionId: SectionId;
  label: string;
  summary?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  onReopen: () => void;
  children: React.ReactNode;
}

export default function SectionShell({
  sectionId,
  label,
  summary,
  isCompleted,
  isCurrent,
  onReopen,
  children,
}: SectionShellProps) {
  // Completed: collapsed summary
  if (isCompleted && !isCurrent) {
    return (
      <Card className="border-green-200 dark:border-green-900/50">
        <CardContent className="p-4">
          <button
            type="button"
            onClick={onReopen}
            className="w-full flex items-center gap-3 text-left"
          >
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{label}</p>
              {summary && <p className="text-xs text-muted-foreground truncate">{summary}</p>}
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        </CardContent>
      </Card>
    );
  }

  // Current: expanded children
  if (isCurrent) {
    return <>{children}</>;
  }

  // Future: hidden
  return null;
}
