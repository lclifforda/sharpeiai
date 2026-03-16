import type { ReactNode } from "react";
import type { Resource } from "@/types/rbac";
import { useRBAC } from "@/contexts/RBACContext";
import AccessDenied from "./AccessDenied";

interface ProtectedRouteProps {
  resource: Resource;
  children: ReactNode;
}

export default function ProtectedRoute({ resource, children }: ProtectedRouteProps) {
  const { can } = useRBAC();

  if (!can(resource, "view")) {
    return <AccessDenied resource={resource} />;
  }

  return <>{children}</>;
}
