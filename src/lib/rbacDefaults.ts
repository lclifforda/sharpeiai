import type { Role, UserAccount, Resource, Action } from "@/types/rbac";

const ALL_RESOURCES: Resource[] = [
  "ai_assistant",
  "dashboard",
  "applications",
  "customers",
  "contracts",
  "payments",
  "assets",
  "merchants",
  "automations",
  "inbox",
  "settings",
  "checkout",
  "team",
  "roles",
];

const ALL_ACTIONS: Action[] = ["view", "create", "edit", "delete", "export"];

function fullAccess(resource: Resource) {
  return { resource, actions: [...ALL_ACTIONS] as Action[], scope: "all" as const };
}

function viewOnly(resource: Resource) {
  return { resource, actions: ["view", "export"] as Action[], scope: "all" as const };
}

export const DEFAULT_ROLES: Role[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to everything",
    isSystem: true,
    permissions: ALL_RESOURCES.map(fullAccess),
  },
  {
    id: "ops_manager",
    name: "Operations Manager",
    description: "Day-to-day operations — everything except Settings & Team management",
    isSystem: true,
    permissions: [
      ...ALL_RESOURCES
        .filter((r) => r !== "settings" && r !== "team" && r !== "roles")
        .map(fullAccess),
      { resource: "team" as Resource, actions: ["view"] as Action[], scope: "all" as const },
    ],
  },
  {
    id: "credit_analyst",
    name: "Credit Analyst",
    description: "Underwriting focus — Applications (view/edit), Customers (view), Dashboard",
    isSystem: true,
    permissions: [
      { resource: "dashboard", actions: ["view", "export"], scope: "all" },
      { resource: "applications", actions: ["view", "edit", "export"], scope: "all" },
      { resource: "customers", actions: ["view", "export"], scope: "all" },
      { resource: "ai_assistant", actions: ["view"], scope: "all" },
    ],
  },
  {
    id: "vendor_portal",
    name: "Vendor Portal",
    description: "External vendor partner — only their own merchant data, applications, checkout",
    isSystem: true,
    permissions: [
      { resource: "merchants", actions: ["view", "edit"], scope: "vendor" },
      { resource: "applications", actions: ["view", "create"], scope: "vendor" },
      { resource: "checkout", actions: ["view"], scope: "vendor" },
      { resource: "dashboard", actions: ["view"], scope: "vendor" },
    ],
  },
  {
    id: "readonly_auditor",
    name: "Read-Only Auditor",
    description: "Compliance/audit — view & export everything, edit nothing",
    isSystem: true,
    permissions: ALL_RESOURCES.map(viewOnly),
  },
];

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: "user_lucia",
    name: "Lucia Clifford",
    email: "lucia@sharpei.ai",
    initials: "LC",
    roleId: "super_admin",
    vendorIds: [],
    isSystem: true,
  },
  {
    id: "user_carlos",
    name: "Carlos Rivera",
    email: "carlos@sharpei.ai",
    initials: "CR",
    roleId: "ops_manager",
    vendorIds: [],
    isSystem: true,
  },
  {
    id: "user_sarah",
    name: "Sarah Chen",
    email: "sarah@sharpei.ai",
    initials: "SC",
    roleId: "credit_analyst",
    vendorIds: [],
    isSystem: true,
  },
  {
    id: "user_techventure",
    name: "TechVenture Solutions",
    email: "admin@techventure.com",
    initials: "TV",
    roleId: "vendor_portal",
    vendorIds: ["vendor_techmart"],
    isSystem: true,
  },
  {
    id: "user_maria",
    name: "Maria Santos",
    email: "maria@sharpei.ai",
    initials: "MS",
    roleId: "readonly_auditor",
    vendorIds: [],
    isSystem: true,
  },
];
