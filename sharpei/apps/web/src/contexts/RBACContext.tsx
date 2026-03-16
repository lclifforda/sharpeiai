import { createContext, useContext, useCallback, useMemo, type ReactNode } from "react";
import type { Resource, Action, Role, UserAccount, PermissionCheck } from "@/types/rbac";
import { DEFAULT_ROLES } from "@/lib/rbacDefaults";
import { useAuth } from "@/contexts/AuthContext";

// Map API roles to RBAC role IDs
const ROLE_MAP: Record<string, string> = {
  admin: "super_admin",
  manager: "ops_manager",
  viewer: "readonly_auditor",
  vendor: "vendor_portal",
};

interface RBACContextValue {
  currentUser: UserAccount;
  currentRole: Role;
  can: (resource: Resource, action: Action, vendorId?: string) => boolean;
  check: (resource: Resource, action: Action, vendorId?: string) => PermissionCheck;
}

const RBACContext = createContext<RBACContextValue | null>(null);

export function RBACProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const currentUser: UserAccount = useMemo(() => ({
    id: user?.id ?? "anonymous",
    name: user?.name ?? "Anonymous",
    email: user?.email ?? "",
    initials: (user?.name ?? "A").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
    roleId: ROLE_MAP[user?.role ?? "viewer"] ?? "readonly_auditor",
    vendorIds: user?.vendor_id ? [user.vendor_id] : [],
    isSystem: false,
  }), [user]);

  const currentRole = useMemo(
    () => DEFAULT_ROLES.find((r) => r.id === currentUser.roleId) ?? DEFAULT_ROLES[0],
    [currentUser.roleId]
  );

  const check = useCallback(
    (resource: Resource, action: Action, vendorId?: string): PermissionCheck => {
      const perm = currentRole.permissions.find((p) => p.resource === resource);
      if (!perm) {
        return { allowed: false, resource, action, role: currentRole.name, reason: `No access to ${resource}` };
      }
      if (!perm.actions.includes(action)) {
        return { allowed: false, resource, action, role: currentRole.name, reason: `Cannot ${action} ${resource}` };
      }
      if (perm.scope === "all") {
        return { allowed: true, resource, action, role: currentRole.name };
      }
      // vendor scope
      if (!vendorId) {
        return { allowed: true, resource, action, role: currentRole.name };
      }
      if (currentUser.vendorIds.length > 0 && currentUser.vendorIds.includes(vendorId)) {
        return { allowed: true, resource, action, role: currentRole.name };
      }
      return { allowed: false, resource, action, role: currentRole.name, reason: "Vendor not in scope" };
    },
    [currentRole, currentUser]
  );

  const can = useCallback(
    (resource: Resource, action: Action, vendorId?: string) => check(resource, action, vendorId).allowed,
    [check]
  );

  return (
    <RBACContext.Provider
      value={{
        currentUser,
        currentRole,
        can,
        check,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const ctx = useContext(RBACContext);
  if (!ctx) throw new Error("useRBAC must be used within <RBACProvider>");
  return ctx;
}
