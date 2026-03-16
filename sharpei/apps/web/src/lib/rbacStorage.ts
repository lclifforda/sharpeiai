import type { RBACState } from "@/types/rbac";
import { DEFAULT_ROLES, DEFAULT_USERS } from "./rbacDefaults";

const STORAGE_KEY = "sharpei_rbac_state";

function getDefaultState(): RBACState {
  return {
    currentUserId: DEFAULT_USERS[0].id,
    users: DEFAULT_USERS.map((u) => ({ ...u })),
    roles: DEFAULT_ROLES.map((r) => ({
      ...r,
      permissions: r.permissions.map((p) => ({ ...p, actions: [...p.actions] })),
    })),
  };
}

export function getRBACState(): RBACState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw) as RBACState;
  } catch {
    return getDefaultState();
  }
}

export function saveRBACState(state: RBACState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetRBACState(): RBACState {
  const state = getDefaultState();
  saveRBACState(state);
  return state;
}
