// Converts between Automation (API/storage format) and WorkflowBuilder nodes/connections

export interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  subtype: string;
  label: string;
  x: number;
  y: number;
  config: Record<string, string>;
  conditions?: { id: string; field: string; operator: string; value: string }[];
  conditionLogic?: "and" | "or";
}

export interface WorkflowConnection {
  from: string;
  to: string;
  sourceOutput?: string;
}

export interface AutomationForConversion {
  name: string;
  description?: string;
  eventType: string;
  eventLabel: string;
  actionType: string;
  actionLabel: string;
  actionConfig: Record<string, string>;
}

// Per-app subtypes that map to the same API actionType
const CRM_SUBTYPES = new Set(["hubspot", "salesforce", "pipedrive"]);
const EMAIL_SUBTYPES = new Set(["gmail", "outlook", "sendgrid", "smtp"]);

// Map actionType (API) → default subtype (workflow builder)
// When config has provider/emailProvider info, we use the specific subtype instead
const ACTION_TYPE_TO_DEFAULT_SUBTYPE: Record<string, string> = {
  email: "gmail",
  slack: "slack_message",
  teams: "teams_message",
  webhook: "http_request",
  lender_api: "lender_api",
  crm_update: "hubspot",
};

// Map subtype → actionType (API)
const SUBTYPE_TO_ACTION_TYPE: Record<string, string> = {
  // Email subtypes
  gmail: "email",
  outlook: "email",
  sendgrid: "email",
  smtp: "email",
  // CRM subtypes
  hubspot: "crm_update",
  salesforce: "crm_update",
  pipedrive: "crm_update",
  // Other action subtypes
  slack_message: "slack",
  teams_message: "teams",
  http_request: "webhook",
  lender_api: "lender_api",
  create_task: "webhook",
  // Legacy subtypes (backward compat)
  send_email: "email",
  crm_update: "crm_update",
};

// Map actionType → workflow config keys from actionConfig
const ACTION_CONFIG_MAP: Record<string, { workflowKey: string; apiKey: string }[]> = {
  email: [
    { workflowKey: "to", apiKey: "recipients" },
    { workflowKey: "subject", apiKey: "subject" },
    { workflowKey: "body", apiKey: "bodyTemplate" },
  ],
  slack: [
    { workflowKey: "channel", apiKey: "channel" },
    { workflowKey: "webhookUrl", apiKey: "webhookUrl" },
    { workflowKey: "messageTemplate", apiKey: "messageTemplate" },
  ],
  teams: [
    { workflowKey: "webhookUrl", apiKey: "webhookUrl" },
    { workflowKey: "messageTemplate", apiKey: "messageTemplate" },
  ],
  lender_api: [
    { workflowKey: "url", apiKey: "baseUrl" },
    { workflowKey: "url", apiKey: "url" },
    { workflowKey: "method", apiKey: "method" },
    { workflowKey: "authHeader", apiKey: "authHeader" },
    { workflowKey: "contentType", apiKey: "contentType" },
  ],
  webhook: [
    { workflowKey: "url", apiKey: "baseUrl" },
    { workflowKey: "url", apiKey: "url" },
    { workflowKey: "method", apiKey: "method" },
    { workflowKey: "authHeader", apiKey: "authHeader" },
    { workflowKey: "contentType", apiKey: "contentType" },
    { workflowKey: "taskTitle", apiKey: "taskTitle" },
    { workflowKey: "taskDescription", apiKey: "taskDescription" },
  ],
  crm_update: [
    { workflowKey: "action", apiKey: "action" },
  ],
};

/**
 * Resolve the specific subtype from actionType + actionConfig.
 * e.g. actionType "crm_update" + config.provider "salesforce" → subtype "salesforce"
 */
function resolveSubtype(actionType: string, actionConfig: Record<string, string>): string {
  if (actionType === "crm_update" && actionConfig.provider && CRM_SUBTYPES.has(actionConfig.provider)) {
    return actionConfig.provider;
  }
  if (actionType === "email" && actionConfig.emailProvider && EMAIL_SUBTYPES.has(actionConfig.emailProvider)) {
    return actionConfig.emailProvider;
  }
  return ACTION_TYPE_TO_DEFAULT_SUBTYPE[actionType] ?? "http_request";
}

/**
 * Convert an Automation to workflow nodes + connections for the visual builder
 */
export function automationToWorkflow(
  automation: AutomationForConversion,
  eventLabelMap?: (eventType: string) => string
): { nodes: WorkflowNode[]; connections: WorkflowConnection[] } {
  const triggerId = "node_trigger";
  const actionId = "node_action";

  const subtype = resolveSubtype(automation.actionType, automation.actionConfig);
  const configMap = ACTION_CONFIG_MAP[automation.actionType] ?? [];
  const workflowConfig: Record<string, string> = {};

  for (const { workflowKey, apiKey } of configMap) {
    const val = automation.actionConfig[apiKey];
    if (val !== undefined) {
      workflowConfig[workflowKey] = val;
    }
  }
  // Fallback: pass through any unmapped keys (except provider/emailProvider which are now encoded in subtype)
  for (const [k, v] of Object.entries(automation.actionConfig)) {
    if (!workflowConfig[k] && v && k !== "provider" && k !== "emailProvider") workflowConfig[k] = v;
  }

  const eventLabel =
    eventLabelMap?.(automation.eventType) ?? automation.eventLabel ?? automation.eventType;

  const actionLabel =
    automation.actionLabel ?? getDefaultActionLabel(automation.actionType);

  const nodes: WorkflowNode[] = [
    {
      id: triggerId,
      type: "trigger",
      subtype: "event",
      label: eventLabel,
      x: 300,
      y: 60,
      config: { event: automation.eventType },
    },
    {
      id: actionId,
      type: "action",
      subtype,
      label: actionLabel,
      x: 300,
      y: 240,
      config: workflowConfig,
    },
  ];

  const connections: WorkflowConnection[] = [{ from: triggerId, to: actionId }];

  return { nodes, connections };
}

function getDefaultActionLabel(actionType: string): string {
  const labels: Record<string, string> = {
    email: "Send Email",
    slack: "Slack Message",
    teams: "Teams Message",
    webhook: "HTTP Request",
    lender_api: "Lender API",
    crm_update: "Update CRM",
  };
  return labels[actionType] ?? "Action";
}


/**
 * Convert workflow nodes + connections back to Automation format
 */
export function workflowToAutomation(
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
  baseAutomation: Partial<AutomationForConversion> & { name: string }
): AutomationForConversion {
  const triggerNode = nodes.find((n) => n.type === "trigger");
  const actionNode = nodes.find((n) => n.type === "action");

  const eventType = triggerNode?.config?.event ?? baseAutomation.eventType ?? "application_created";
  const eventLabel =
    triggerNode?.label ?? baseAutomation.eventLabel ?? eventType;

  const subtype = actionNode?.subtype ?? "gmail";
  const actionType = SUBTYPE_TO_ACTION_TYPE[subtype] ?? "email";
  const actionConfig = actionConfigFromNode(actionNode, actionType, subtype);

  const actionLabel =
    actionNode?.label ?? baseAutomation.actionLabel ?? getDefaultActionLabel(actionType);

  return {
    name: baseAutomation.name,
    description: baseAutomation.description ?? "",
    eventType,
    eventLabel,
    actionType,
    actionLabel,
    actionConfig,
  };
}

function actionConfigFromNode(
  node: WorkflowNode | undefined,
  actionType: string,
  subtype: string
): Record<string, string> {
  if (!node) return {};

  const config = node.config ?? {};
  const configMap = ACTION_CONFIG_MAP[actionType] ?? [];

  const result: Record<string, string> = {};

  // Set provider/emailProvider from subtype for API compatibility
  if (CRM_SUBTYPES.has(subtype)) {
    result.provider = subtype;
  } else if (EMAIL_SUBTYPES.has(subtype)) {
    result.emailProvider = subtype;
  }

  for (const { workflowKey, apiKey } of configMap) {
    const val = config[workflowKey];
    if (val !== undefined) result[apiKey] = val;
  }
  // For webhook/lender_api: also set baseUrl from url for template compatibility
  if ((actionType === "webhook" || actionType === "lender_api") && config.url) {
    result.baseUrl = config.url;
  }
  // Pass through unmapped config keys (e.g. taskDescription)
  const mappedWorkflowKeys = new Set(configMap.map((m) => m.workflowKey));
  for (const [k, v] of Object.entries(config)) {
    if (v && !mappedWorkflowKeys.has(k) && !(k in result)) result[k] = v;
  }
  return result;
}
