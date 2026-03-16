import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { RBACState, Resource, Action, Role, UserAccount, PermissionCheck } from "@/types/rbac";
import { getRBACState, saveRBACState, resetRBACState } from "@/lib/rbacStorage";

interface RBACContextValue {
  state: RBACState;
  currentUser: UserAccount;
  currentRole: Role;
  can: (resource: Resource, action: Action, vendorId?: string) => boolean;
  check: (resource: Resource, action: Action, vendorId?: string) => PermissionCheck;
  switchUser: (userId: string) => void;
  // User CRUD
  addUser: (user: UserAccount) => void;
  updateUser: (userId: string, patch: Partial<Omit<UserAccount, "id">>) => void;
  removeUser: (userId: string) => void;
  // Reset
  resetToDefaults: () => void;
}

const RBACContext = createContext<RBACContextValue | null>(null);

export function RBACProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RBACState>(getRBACState);

  const persist = useCallback((next: RBACState) => {
    setState(next);
    saveRBACState(next);
  }, []);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? state.users[0];
  const currentRole = state.roles.find((r) => r.id === currentUser.roleId) ?? state.roles[0];

  const check = useCallback(
    (resource: Resource, action: Action, vendorId?: string): PermissionCheck => {
      const role = state.roles.find((r) => r.id === currentUser.roleId);
      if (!role) {
        return { allowed: false, resource, action, role: "unknown", reason: "Role not found" };
      }
      const perm = role.permissions.find((p) => p.resource === resource);
      if (!perm) {
        return { allowed: false, resource, action, role: role.name, reason: `No access to ${resource}` };
      }
      if (!perm.actions.includes(action)) {
        return { allowed: false, resource, action, role: role.name, reason: `Cannot ${action} ${resource}` };
      }
      if (perm.scope === "all") {
        return { allowed: true, resource, action, role: role.name };
      }
      // vendor scope
      if (!vendorId) {
        return { allowed: true, resource, action, role: role.name };
      }
      if (currentUser.vendorIds.length > 0 && currentUser.vendorIds.includes(vendorId)) {
        return { allowed: true, resource, action, role: role.name };
      }
      return { allowed: false, resource, action, role: role.name, reason: "Vendor not in scope" };
    },
    [state.roles, currentUser]
  );

  const can = useCallback(
    (resource: Resource, action: Action, vendorId?: string) => check(resource, action, vendorId).allowed,
    [check]
  );

  const switchUser = useCallback(
    (userId: string) => {
      const next = { ...state, currentUserId: userId };
      persist(next);
    },
    [state, persist]
  );

  const addUser = useCallback(
    (user: UserAccount) => {
      persist({ ...state, users: [...state.users, user] });
    },
    [state, persist]
  );

  const updateUser = useCallback(
    (userId: string, patch: Partial<Omit<UserAccount, "id">>) => {
      persist({
        ...state,
        users: state.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
      });
    },
    [state, persist]
  );

  const removeUser = useCallback(
    (userId: string) => {
      persist({
        ...state,
        users: state.users.filter((u) => u.id !== userId),
        currentUserId: state.currentUserId === userId ? state.users[0].id : state.currentUserId,
      });
    },
    [state, persist]
  );

  const resetToDefaults = useCallback(() => {
    setState(resetRBACState());
  }, []);

  return (
    <RBACContext.Provider
      value={{
        state,
        currentUser,
        currentRole,
        can,
        check,
        switchUser,
        addUser,
        updateUser,
        removeUser,
        resetToDefaults,
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
