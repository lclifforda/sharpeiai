import { Badge } from "@/components/ui/badge";
import { Shield, Users } from "lucide-react";
import type { Role, Permission, Resource } from "@/types/rbac";
import { DEFAULT_ROLES } from "@/lib/rbacDefaults";

const RESOURCE_LABELS: Record<Resource, string> = {
  ai_assistant: "AI Assistant",
  dashboard: "Dashboard",
  applications: "Applications",
  customers: "Customers",
  contracts: "Contracts",
  payments: "Payments",
  assets: "Assets",
  merchants: "Vendors",
  automations: "Automations",
  settings: "Settings",
  checkout: "Checkout",
  team: "Team Members",
  roles: "Roles",
};

const ALL_ACTIONS = ["view", "create", "edit", "delete", "export"] as const;

function summarizeAccess(permissions: Permission[]): string {
  if (permissions.length === 0) return "No access";

  const allResources = Object.keys(RESOURCE_LABELS) as Resource[];
  const hasAllResources = allResources.every((r) =>
    permissions.some((p) => p.resource === r)
  );
  const allHaveFullActions = permissions.every(
    (p) => ALL_ACTIONS.every((a) => p.actions.includes(a))
  );
  const allViewExportOnly = permissions.every(
    (p) => p.actions.length === 2 && p.actions.includes("view") && p.actions.includes("export")
  );

  if (hasAllResources && allHaveFullActions) return "All resources, all actions";
  if (hasAllResources && allViewExportOnly) return "All resources (view & export only)";

  const parts = permissions.map((p) => {
    const label = RESOURCE_LABELS[p.resource] ?? p.resource;
    if (ALL_ACTIONS.every((a) => p.actions.includes(a))) return label;
    const acts = p.actions.filter((a) => a !== "export").join("/");
    return `${label} (${acts})`;
  });

  const hasVendorScope = permissions.some((p) => p.scope === "vendor");
  const summary = parts.join(", ");
  return hasVendorScope ? `${summary} — vendor-scoped` : summary;
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: "from-purple-500 to-violet-400",
  ops_manager: "from-blue-500 to-cyan-400",
  credit_analyst: "from-amber-500 to-yellow-400",
  vendor_portal: "from-green-500 to-emerald-400",
  readonly_auditor: "from-gray-500 to-slate-400",
};

export default function RoleManagement() {
  // Use the static DEFAULT_ROLES for display (roles are predefined, not dynamic)
  const roles = DEFAULT_ROLES;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-muted-foreground" />
          Roles
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your platform includes 5 predefined roles. Assign them to team members from the Team Members tab.
        </p>
      </div>

      <div className="space-y-3">
        {roles.map((role: Role) => {
          const userCount = 0; // User counts come from the Team Members tab
          const gradient = ROLE_COLORS[role.id] ?? "from-gray-500 to-gray-400";
          const accessSummary = summarizeAccess(role.permissions);

          return (
            <div key={role.id} className="border rounded-xl bg-card overflow-hidden">
              <div className="flex items-stretch">
                <div className={`w-1.5 bg-gradient-to-b ${gradient} flex-shrink-0`} />
                <div className="flex-1 px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{role.name}</span>
                        <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0">
                          System
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-2">{accessSummary}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0 pt-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{userCount} {userCount === 1 ? "user" : "users"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
