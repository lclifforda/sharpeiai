/**
 * PortalAIService — admin-facing AI for analyzing Sharpei platform data.
 * Uses predefined responses first, then Claude with portal-only system prompt.
 */

import { getClaudeClient, getClaudeModel, hasClaudeKey } from '../shared/claudeClient';
import type { AgentResponse } from '../shared/types';
import { getPredefinedPortalResponse } from './portalPredefined';
import {
  buildPortalSystemPrompt,
  buildPortalSessionContext,
  getPortalSuggestions,
} from './portalPrompts';

export class PortalAIService {
  /**
   * Answer a portal / business-data question.
   * Tries Claude first, falls back to predefined keyword responses.
   */
  async askQuestion(question: string, sessionContext?: any): Promise<AgentResponse> {
    if (hasClaudeKey()) {
      try {
        return await this.callClaude(question, sessionContext);
      } catch (error) {
        console.warn('[PortalAI] Claude failed, using predefined fallback:', error);
      }
    }

    // Predefined keyword responses as fallback
    const predefined = getPredefinedPortalResponse(question);
    if (predefined) {
      return {
        message: predefined,
        type: 'text',
        suggestions: getPortalSuggestions(question),
      };
    }

    // Generic portal fallback
    return {
      message: `I'm here to help you explore your Sharpei AI Portal data. I can assist with:\n- **KPIs & Working Capital** \u2014 portfolio metrics, yields, ROI\n- **Portfolio Overview** \u2014 funded contracts, product breakdown\n- **Cash Flow** \u2014 scheduled vs actual collections, trends\n- **Risk & Delinquency** \u2014 default rates, credit risk, vintage analysis\n- **Vendor Performance** \u2014 top vendors, approval rates, scores\n- **Active Leases & Contracts** \u2014 status, payments, expirations\n- **Application Pipeline** \u2014 funnel metrics, approval rates\n- **Inventory & Equipment** \u2014 availability, asset distribution\n- **Payments & Collections** \u2014 pending, overdue, forecasts\n\nWhat would you like to explore?`,
      type: 'text',
      suggestions: ['Show me my KPIs', 'Portfolio overview', 'Vendor performance'],
    };
  }

  // ── Private ──────────────────────────────────────────────────

  private async callClaude(question: string, sessionContext?: any): Promise<AgentResponse> {
    // Build prompt dynamically with live localStorage data each time
    const systemPrompt = buildPortalSystemPrompt() + buildPortalSessionContext(sessionContext);

    const client = getClaudeClient();
    const model = getClaudeModel();

    const messages: { role: 'user' | 'assistant'; content: string }[] = [];

    if (sessionContext?.conversationHistory && Array.isArray(sessionContext.conversationHistory)) {
      for (const msg of sessionContext.conversationHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    messages.push({ role: 'user', content: question });

    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages,
    });

    const answer =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'I apologize, but I encountered an error processing your question.';

    return {
      message: answer,
      type: 'text',
      suggestions: getPortalSuggestions(question),
    };
  }
}

export const portalAI = new PortalAIService();
