/**
 * Portal AI — system prompt with platform business data only.
 * NO checkout education content.
 * Dynamically injects real localStorage data (customers, applications, user)
 * alongside baseline platform metrics.
 */

import { getStoredCustomers, type StoredCustomer } from '@/lib/customerStorage';
import { getStoredApplications, type StoredApplication } from '@/lib/applicationStorage';
import { getRBACState } from '@/lib/rbacStorage';

const BASELINE_PROMPT = `You are an AI assistant for the Sharpei equipment financing platform admin portal. You help platform administrators analyze their business data, KPIs, portfolio performance, risk metrics, and vendor relationships.

=== PLATFORM BASELINE METRICS ===

**Portfolio Overview:**
- Total Portfolio: $1.25M (184 funded contracts, +12% growth)
- Active Vendors: 26 across 9 equipment categories
- Portfolio Yield: 14.2% (Net: 12.8% after fees)
- ROI (12M): 13.9% (Target: 14%)
- Default Rate: 1.8%
- Delinquency Rate: 2.3%

**Portfolio by Product Type:**
- Equipment Financing: 142 contracts, $892K (71.4%)
- Equipment Leasing: 28 contracts, $218K (17.4%)
- Working Capital: 14 contracts, $140K (11.2%)

**Cash Flow (Monthly, in $K):**
- Jan: $102K actual vs $98K scheduled (104.1%)
- Feb: $98K actual vs $105K scheduled (93.3%)
- Mar: $115K actual vs $112K scheduled (102.7%)
- Apr: $110K actual vs $108K scheduled (101.9%)
- May: $118K actual vs $120K scheduled (98.3%)
- Jun: $128K actual vs $125K scheduled (102.4%)

**Top Vendors:**
1. TechCorp Solutions: $285K volume, 78% approval, 1.2% delinquency, score 94
2. MedEquip Pro: $218K volume, 85% approval, 0.8% delinquency, score 96
3. BuildMaster Inc: $195K volume, 72% approval, 2.8% delinquency, score 89
4. IT Solutions Hub: $168K volume, 81% approval, 1.5% delinquency, score 92
5. Manufacturing Plus: $142K volume, 69% approval, 2.8% delinquency, score 85

**Underwriting Funnel:**
- Applications: 450 → Pre-approved: 315 (70%) → Approved: 252 (56%) → Funded: 184 (41%)

**Risk Metrics:**
- Delinquency buckets: 0-30 days: 2.1%, 31-60 days: 1.2%, 60+: 0.8%
- Credit risk: Lower risk 124 customers, Stable 48, Higher risk 12
- Vintage 2024 performing better than 2023 (2.7% vs 3.8% cumulative loss at M6)

**Asset Distribution:**
- Leased Units: 184/250 (73.6%), Idle: 28 (11.2%), Refurbishing: 18 (7.2%), Resold: 20 (8%)

**Alerts:**
- BuildMaster Inc delinquency increased 45% (1.5% → 2.8%)
- Medical Equipment residual value dropped 8% below forecast
- AI detected unusual repayment pattern in Segment B

**Documentation:** 184 active agreements, 26 vendor KYCs, 98.2% data quality`;

const ROLE_GUIDELINES = `
=== YOUR ROLE ===
You should:
- Answer questions about the user's business data, KPIs, portfolio, working capital, cash flow, risk, and vendors
- Use EXACT numbers from the data (e.g., "$1.25M" not "approximately $1M")
- When real application/customer data is available, prioritize it over baseline metrics
- Reference specific customers and applications by name when relevant
- Be professional and analytical in tone
- Highlight trends, risks, and actionable insights
- Keep responses concise but data-rich

=== RESPONSE GUIDELINES ===
- Lead with the most relevant data points
- Use tables or bullet points for clarity
- Flag any concerning trends proactively
- Suggest related analyses when appropriate

Now answer the user's question:`;

// ── Live data builders ──────────────────────────────────────────

function buildCustomersSummary(customers: StoredCustomer[]): string {
  if (customers.length === 0) return '';

  const active = customers.filter(c => c.status === 'active');
  const industries = [...new Set(customers.map(c => c.industry).filter(i => i && i !== '—'))];
  const locations = [...new Set(customers.map(c => c.location).filter(l => l && l !== '—'))];

  let summary = `\n\n=== LIVE CUSTOMER DATA (${customers.length} customers) ===\n`;
  summary += `- Active: ${active.length}, Inactive: ${customers.length - active.length}\n`;
  if (industries.length > 0) summary += `- Industries: ${industries.join(', ')}\n`;
  if (locations.length > 0) summary += `- Locations: ${locations.join(', ')}\n`;

  // List up to 15 customers with details
  summary += '\n**Customers:**\n';
  for (const c of customers.slice(0, 15)) {
    const parts = [`${c.name}`];
    if (c.industry && c.industry !== '—') parts.push(c.industry);
    if (c.location && c.location !== '—') parts.push(c.location);
    if (c.activeContracts > 0) parts.push(`${c.activeContracts} contracts`);
    if (c.revenue && c.revenue !== '$0') parts.push(`revenue: ${c.revenue}`);
    parts.push(`status: ${c.status}`);
    summary += `- ${parts.join(' | ')}\n`;
  }
  if (customers.length > 15) summary += `- ... and ${customers.length - 15} more\n`;

  return summary;
}

function buildApplicationsSummary(apps: StoredApplication[]): string {
  if (apps.length === 0) return '';

  const statusCounts: Record<string, number> = {};
  let totalAmount = 0;
  const types: Record<string, number> = {};
  const vendors: Record<string, number> = {};

  for (const app of apps) {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    const amt = parseFloat(app.amount.replace(/[^0-9.]/g, ''));
    if (!isNaN(amt)) totalAmount += amt;
    if (app.type) types[app.type] = (types[app.type] || 0) + 1;
    if (app.vendor) vendors[app.vendor] = (vendors[app.vendor] || 0) + 1;
  }

  let summary = `\n\n=== LIVE APPLICATION DATA (${apps.length} applications) ===\n`;
  summary += `- Total requested amount: $${totalAmount.toLocaleString()}\n`;
  summary += `- By status: ${Object.entries(statusCounts).map(([s, n]) => `${s}: ${n}`).join(', ')}\n`;
  if (Object.keys(types).length > 0) {
    summary += `- By type: ${Object.entries(types).map(([t, n]) => `${t}: ${n}`).join(', ')}\n`;
  }
  if (Object.keys(vendors).length > 0) {
    summary += `- By vendor: ${Object.entries(vendors).map(([v, n]) => `${v}: ${n}`).join(', ')}\n`;
  }

  // List up to 10 recent applications with key details
  summary += '\n**Recent Applications:**\n';
  for (const app of apps.slice(0, 10)) {
    const parts = [`${app.company}`];
    parts.push(app.type || 'N/A');
    parts.push(app.equipment || 'N/A');
    parts.push(app.amount);
    parts.push(`status: ${app.status}`);
    if (app.date) parts.push(`date: ${app.date}`);
    if (app.aiSummary) parts.push(`AI: ${app.aiSummary.recommendation}`);
    if (app.assignedOfficerName) parts.push(`officer: ${app.assignedOfficerName}`);
    summary += `- ${parts.join(' | ')}\n`;
  }
  if (apps.length > 10) summary += `- ... and ${apps.length - 10} more\n`;

  return summary;
}

function buildUserContext(): string {
  try {
    const rbac = getRBACState();
    const currentUser = rbac.users.find(u => u.id === rbac.currentUserId);
    if (!currentUser) return '';

    const role = rbac.roles.find(r => r.id === currentUser.roleId);
    let ctx = `\n\n=== CURRENT USER ===\n`;
    ctx += `- Name: ${currentUser.name}\n`;
    ctx += `- Email: ${currentUser.email}\n`;
    ctx += `- Role: ${role?.name || currentUser.roleId}\n`;
    if (role?.description) ctx += `- Role description: ${role.description}\n`;
    ctx += `- Team size: ${rbac.users.length} users\n`;
    return ctx;
  } catch {
    return '';
  }
}

/**
 * Build the full portal system prompt with live data from localStorage.
 */
export function buildPortalSystemPrompt(): string {
  let prompt = BASELINE_PROMPT;

  // Inject live data
  try {
    const customers = getStoredCustomers();
    prompt += buildCustomersSummary(customers);
  } catch { /* storage unavailable */ }

  try {
    const apps = getStoredApplications();
    prompt += buildApplicationsSummary(apps);
  } catch { /* storage unavailable */ }

  prompt += buildUserContext();
  prompt += ROLE_GUIDELINES;

  return prompt;
}

// Keep backward compat export — but callers should prefer buildPortalSystemPrompt()
export const PORTAL_SYSTEM_PROMPT = BASELINE_PROMPT + ROLE_GUIDELINES;

/**
 * Build session context for portal conversations.
 */
export function buildPortalSessionContext(sessionContext: any): string {
  if (!sessionContext) return '';

  let ctx = '\n\n=== CURRENT SESSION CONTEXT ===\n';

  if (sessionContext.currentPage) {
    const pageDescriptions: Record<string, string> = {
      '/dashboard': 'The user is on the Dashboard, viewing their merchant overview, recent orders, and key metrics.',
      '/applications': 'The user is on the Applications page, viewing their list of financing applications.',
      '/merchants': 'The user is on the Merchants page, browsing enrolled merchants.',
      '/settings': 'The user is on the Settings page, managing their account and platform configuration.',
    };
    const page = sessionContext.currentPage;
    const pageDesc = pageDescriptions[page]
      || Object.entries(pageDescriptions).find(([k]) => page.startsWith(k))?.[1]
      || `The user is on page: ${page}`;
    ctx += `\nCurrent Page: ${page}\n${pageDesc}\n`;
  }

  return ctx;
}

/**
 * Generate contextual follow-up suggestions for portal conversations.
 */
export function getPortalSuggestions(question: string): string[] {
  const q = question.toLowerCase();

  if (q.includes('kpi') || q.includes('metric') || q.includes('working capital')) {
    return ['Show cash flow trends', 'Vendor performance', 'Risk analysis'];
  }
  if (q.includes('portfolio') || q.includes('overview') || q.includes('dashboard')) {
    return ['Drill into risk metrics', 'Show vendor breakdown', 'Application pipeline'];
  }
  if (q.includes('vendor') || q.includes('merchant')) {
    return ['Compare top vendors', 'Show risk flags', 'Asset distribution'];
  }
  if (q.includes('risk') || q.includes('delinquen') || q.includes('default')) {
    return ['Vintage analysis', 'Credit risk breakdown', 'Which vendors are at risk?'];
  }
  if (q.includes('cash') || q.includes('collection') || q.includes('flow')) {
    return ['Show pending payments', 'Compare to last quarter', 'Forecast next month'];
  }
  return ['Show me my KPIs', 'Portfolio overview', 'Vendor performance'];
}
