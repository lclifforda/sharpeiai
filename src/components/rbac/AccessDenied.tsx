import { ShieldAlert } from "lucide-react";
import type { Resource, Action } from "@/types/rbac";
import { useRBAC } from "@/contexts/RBACContext";

interface AccessDeniedProps {
  resource: Resource;
  action?: Action;
}

export default function AccessDenied({ resource, action = "view" }: AccessDeniedProps) {
  const { currentUser, currentRole } = useRBAC();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-6">
        You don't have permission to {action} <span className="font-medium text-foreground">{resource}</span>.
      </p>
      <div className="bg-muted/50 border rounded-xl px-6 py-4 text-sm space-y-1">
        <p>
          <span className="text-muted-foreground">Signed in as:</span>{" "}
          <span className="font-medium text-foreground">{currentUser.name}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Current role:</span>{" "}
          <span className="font-medium text-foreground">{currentRole.name}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Required:</span>{" "}
          <span className="font-medium text-foreground">{action} on {resource}</span>
        </p>
      </div>
      <p className="text-xs text-muted-foreground mt-6">
        Switch to a user with the required permissions using the user switcher in the sidebar.
      </p>
    </div>
  );
}
