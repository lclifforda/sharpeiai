import type { ReactNode } from "react";
import type { Resource, Action } from "@/types/rbac";
import { useRBAC } from "@/contexts/RBACContext";

interface CanViewProps {
  resource: Resource;
  action?: Action;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function CanView({ resource, action = "view", children, fallback = null }: CanViewProps) {
  const { can } = useRBAC();

  if (!can(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
