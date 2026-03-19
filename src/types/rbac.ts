export type Resource =
  | "ai_assistant"
  | "dashboard"
  | "applications"
  | "customers"
  | "contracts"
  | "payments"
  | "assets"
  | "vendors"
  | "automations"
  | "settings"
  | "checkout"
  | "team"
  | "roles"
  | "inbox";

export type Action = "view" | "create" | "edit" | "delete" | "export";

export type PermissionScope = "all" | "vendor";

export interface Permission {
  resource: Resource;
  actions: Action[];
  scope: PermissionScope;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean; // system roles can't be deleted
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  initials: string;
  roleId: string;
  vendorIds: string[]; // empty = all vendors; populated = vendor-scoped
  isSystem: boolean; // system users can't be deleted
}

export interface RBACState {
  currentUserId: string;
  users: UserAccount[];
  roles: Role[];
}

export interface PermissionCheck {
  allowed: boolean;
  resource: Resource;
  action: Action;
  role: string;
  reason?: string;
}
