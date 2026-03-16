// Re-export from portal module for backward compatibility
export { getPredefinedPortalResponse } from './portal/portalPredefined';
export { portalAI, PortalAIService } from './portal/portalAI';

// Keep the ChatMessage interface for backward compat
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Keep getPortalAIResponse for backward compat
export const getPortalAIResponse = async (
  messages: ChatMessage[]
): Promise<string> => {
  const { getPredefinedPortalResponse } = await import('./portal/portalPredefined');
  const lastUserMessage = messages[messages.length - 1];
  if (lastUserMessage.role === 'user') {
    const predefinedResponse = getPredefinedPortalResponse(lastUserMessage.content);
    if (predefinedResponse) {
      return predefinedResponse;
    }
  }
  return `I'm here to help you explore your Sharpei AI Portal data. I can assist with:
- **KPIs & Working Capital** — portfolio metrics, yields, ROI
- **Portfolio Overview** — funded contracts, product breakdown
- **Cash Flow** — scheduled vs actual collections, trends
- **Risk & Delinquency** — default rates, credit risk, vintage analysis
- **Vendor Performance** — top vendors, approval rates, scores
- **Active Leases & Contracts** — status, payments, expirations
- **Application Pipeline** — funnel metrics, approval rates
- **Inventory & Equipment** — availability, asset distribution
- **Payments & Collections** — pending, overdue, forecasts

What would you like to explore?`;
};
