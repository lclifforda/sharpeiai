import { useMemo } from "react";
import { useRBAC } from "@/contexts/RBACContext";
import type { Resource, Action } from "@/types/rbac";

export function useAuth() {
  const { currentUser, currentRole } = useRBAC();
  return { user: currentUser, role: currentRole };
}

export function useCanAccess(resource: Resource, action: Action = "view") {
  const { can } = useRBAC();
  return can(resource, action);
}

export function useVendorScope() {
  const { currentUser, currentRole } = useRBAC();
  const isVendorScoped = useMemo(
    () => currentRole.permissions.some((p) => p.scope === "vendor"),
    [currentRole]
  );
  return {
    isVendorScoped,
    vendorIds: currentUser.vendorIds,
  };
}

export function usePermissionCheck(resource: Resource, action: Action) {
  const { check } = useRBAC();
  return check(resource, action);
}
