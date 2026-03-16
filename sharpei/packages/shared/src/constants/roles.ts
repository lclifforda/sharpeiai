/**
 * RBAC constants — ported from existing rbacDefaults.ts
 */

export const RESOURCES = [
  'ai_assistant',
  'dashboard',
  'applications',
  'customers',
  'merchants',
  'automations',
  'settings',
  'team',
] as const;

export type Resource = (typeof RESOURCES)[number];

export const ACTIONS = ['view', 'create', 'edit', 'delete', 'export'] as const;
export type Action = (typeof ACTIONS)[number];

export type PermissionScope = 'all' | 'vendor';

export interface Permission {
  resource: Resource;
  actions: Action[];
  scope: PermissionScope;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Permission[];
}

function fullAccess(resource: Resource): Permission {
  return { resource, actions: [...ACTIONS], scope: 'all' };
}

function viewOnly(resource: Resource): Permission {
  return { resource, actions: ['view', 'export'], scope: 'all' };
}

export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to everything',
    isSystem: true,
    permissions: RESOURCES.map(fullAccess),
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Day-to-day operations — everything except Settings & Team management',
    isSystem: true,
    permissions: [
      ...RESOURCES.filter((r) => r !== 'settings' && r !== 'team').map(fullAccess),
      { resource: 'team', actions: ['view'], scope: 'all' },
    ],
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access — view & export everything, edit nothing',
    isSystem: true,
    permissions: RESOURCES.map(viewOnly),
  },
  {
    id: 'vendor',
    name: 'Vendor',
    description: 'External vendor partner — only their own data',
    isSystem: true,
    permissions: [
      { resource: 'merchants', actions: ['view', 'edit'], scope: 'vendor' },
      { resource: 'applications', actions: ['view', 'create'], scope: 'vendor' },
      { resource: 'dashboard', actions: ['view'], scope: 'vendor' },
    ],
  },
];

/**
 * Check if a role has permission to perform an action on a resource.
 */
export function hasPermission(
  roleId: string,
  resource: Resource,
  action: Action,
): boolean {
  const role = DEFAULT_ROLES.find((r) => r.id === roleId);
  if (!role) return false;
  const perm = role.permissions.find((p) => p.resource === resource);
  if (!perm) return false;
  return perm.actions.includes(action);
}

/**
 * Get the permission scope for a role on a resource.
 */
export function getPermissionScope(
  roleId: string,
  resource: Resource,
): PermissionScope | null {
  const role = DEFAULT_ROLES.find((r) => r.id === roleId);
  if (!role) return null;
  const perm = role.permissions.find((p) => p.resource === resource);
  return perm?.scope ?? null;
}
