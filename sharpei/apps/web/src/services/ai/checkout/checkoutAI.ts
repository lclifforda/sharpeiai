/**
 * CheckoutAIService — customer-facing AI for equipment financing applications.
 * Handles general Q&A, equipment identification chat, and application assessment.
 */

import { getClaudeClient, getClaudeModel, hasClaudeKey } from '../shared/claudeClient';
import type { AgentResponse } from '../shared/types';
import {
  CHECKOUT_SYSTEM_PROMPT,
  CHECKOUT_RESPONSE_GUIDELINES,
  buildCheckoutSessionContext,
  getCheckoutSuggestions,
} from './checkoutPrompts';
import { getCheckoutMockResponse } from './checkoutMocks';

export class CheckoutAIService {
  /**
   * Answer a checkout / financing question using Claude, with mock fallback.
   */
  async askQuestion(question: string, sessionContext?: any): Promise<AgentResponse> {
    if (hasClaudeKey()) {
      try {
        return await this.callClaude(question, sessionContext);
      } catch (error) {
        console.warn('[CheckoutAI] Claude failed, using mock fallback:', error);
      }
    }

    // Keyword-based fallback
    return getCheckoutMockResponse(question) ?? {
      message: "I'm here to help with equipment financing. What would you like to know?",
      type: 'text',
      suggestions: ['How does financing work?', 'What documents do I need?'],
    };
  }

  /**
   * Equipment identification chat — Claude helps identify and collect equipment details.
   */
  async askEquipment(
    message: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    existingItems: { name: string; quantity: number; totalValue: number }[] = [],
  ): Promise<{
    message: string;
    suggestions?: string[];
    equipment?: {
      name: string;
      quantity: number;
      unitValue: number;
      year: string;
      condition: 'new' | 'used' | 'refurbished';
    };
  }> {
    const systemPrompt = `You are an AI assistant helping a business identify and describe equipment they want to finance or lease. Your job is to have a natural conversation to understand what equipment they need.

=== YOUR GOALS ===
1. Help the user describe their equipment clearly
2. Ask smart follow-up questions to fill in missing details
3. When you have enough info, extract structured data

=== EQUIPMENT FIELDS NEEDED ===
- name: Equipment name/model (e.g. "MacBook Pro M4", "Standing Desk", "Forklift")
- quantity: How many units
- unitValue: Price per unit in USD (number only)
- year: Model year or year of manufacture
- condition: "new", "used", or "refurbished"

=== RESPONSE FORMAT ===
Always respond with valid JSON in this exact format:
{
  "message": "Your conversational response to the user",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "equipment": null
}

When you have ALL five fields (name, quantity, unitValue, year, condition), include the equipment object:
{
  "message": "Your confirmation message",
  "suggestions": ["Confirm", "Edit", "Add more equipment"],
  "equipment": {
    "name": "MacBook Pro M4",
    "quantity": 50,
    "unitValue": 2400,
    "year": "2025",
    "condition": "new"
  }
}

=== GUIDELINES ===
- Be conversational and helpful, not robotic
- If the user gives partial info (e.g. "100 MacBook Pros"), acknowledge what you got and ask for what's missing
- If the user gives everything at once (e.g. "50 new 2025 MacBook Pros at $2,400 each"), extract it all and confirm
- For unit value, if the user gives a total, divide by quantity to get per-unit
- Give reasonable suggestions as clickable options
- Keep responses short (1-3 sentences)
- ALWAYS respond with valid JSON — no markdown, no code blocks, just raw JSON
${existingItems.length > 0 ? `\n=== ALREADY ADDED EQUIPMENT ===\n${existingItems.map(i => `- ${i.quantity}x ${i.name} ($${i.totalValue.toLocaleString()})`).join('\n')}\n` : ''}`;

    const client = getClaudeClient();
    const model = getClaudeModel();

    const messages: { role: 'user' | 'assistant'; content: string }[] = [];
    for (const msg of conversationHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }
    messages.push({ role: 'user', content: message });

    const response = await client.messages.create({
      model,
      max_tokens: 400,
      temperature: 0.5,
      system: systemPrompt,
      messages,
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        message: parsed.message || raw,
        suggestions: parsed.suggestions,
        equipment: parsed.equipment || undefined,
      };
    } catch {
      return { message: raw, suggestions: ['Tell me more', 'Start over'] };
    }
  }

  /**
   * Assess an equipment financing application and return structured AI summary.
   */
  async assessApplication(payload: {
    company: string;
    contact?: string;
    entityType?: string;
    entitySize?: string;
    dateEstablished?: string;
    annualRevenue?: string;
    requestedAmount?: string;
    equipment: string;
    equipmentItems?: { description: string; quantity: number; unitCost: number }[];
    documentsVerified: number;
    documentsTotal: number;
  }): Promise<{
    recommendation: 'strong' | 'moderate' | 'weak';
    text: string;
    highlights: { label: string; value: string; positive: boolean }[];
  }> {
    if (hasClaudeKey()) {
      try {
        return await this.callAssessment(payload);
      } catch (error) {
        console.warn('[CheckoutAI] Assessment failed, using fallback:', error);
      }
    }

    return this.fallbackAssessment(payload);
  }

  // ── Private ──────────────────────────────────────────────────

  private async callClaude(question: string, sessionContext?: any): Promise<AgentResponse> {
    const systemPrompt =
      CHECKOUT_SYSTEM_PROMPT +
      buildCheckoutSessionContext(sessionContext) +
      CHECKOUT_RESPONSE_GUIDELINES;

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
      suggestions: getCheckoutSuggestions(question),
    };
  }

  private async callAssessment(payload: {
    company: string;
    contact?: string;
    entityType?: string;
    entitySize?: string;
    dateEstablished?: string;
    annualRevenue?: string;
    requestedAmount?: string;
    equipment: string;
    documentsVerified: number;
    documentsTotal: number;
  }) {
    const client = getClaudeClient();
    const model = getClaudeModel();

    const prompt = `You are an AI underwriter for an equipment financing platform. Assess this application and return a brief summary.

=== APPLICATION DATA ===
- Company: ${payload.company}
- Contact: ${payload.contact || 'Not provided'}
- Entity type: ${payload.entityType || 'Not provided'}
- Company size: ${payload.entitySize || 'Not provided'}
- Date established: ${payload.dateEstablished || 'Not provided'}
- Annual revenue: $${payload.annualRevenue?.replace(/\D/g, '') ? Number(payload.annualRevenue.replace(/\D/g, '')).toLocaleString() : 'Not provided'}
- Requested amount: ${payload.requestedAmount || 'Not provided'}
- Equipment: ${payload.equipment}
- Documents verified: ${payload.documentsVerified}/${payload.documentsTotal}

=== RESPONSE FORMAT ===
Respond with valid JSON only (no markdown):
{
  "recommendation": "strong" | "moderate" | "weak",
  "text": "2-4 sentence summary of fit and key factors.",
  "highlights": [
    { "label": "Time in Business", "value": "X years", "positive": true },
    { "label": "Revenue-to-Loan", "value": "ratio or N/A", "positive": true },
    { "label": "Documents", "value": "X/Y verified", "positive": true },
    { "label": "Entity Type", "value": "X", "positive": true }
  ]
}

Guidelines:
- "strong": 5+ years in business, revenue >> loan, good docs
- "moderate": 2-5 years or reasonable revenue, some docs
- "weak": new business, low revenue, or missing docs
- Keep text concise and professional
- Include 3-5 highlights
- Always return valid JSON`;

    const response = await client.messages.create({
      model,
      max_tokens: 500,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      recommendation: (['strong', 'moderate', 'weak'] as const).includes(parsed.recommendation)
        ? (parsed.recommendation as 'strong' | 'moderate' | 'weak')
        : 'moderate' as const,
      text: parsed.text || 'Application submitted. Awaiting review.',
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights.slice(0, 6) : [],
    };
  }

  private fallbackAssessment(payload: {
    company: string;
    dateEstablished?: string;
    annualRevenue?: string;
    requestedAmount?: string;
    equipment: string;
    documentsVerified: number;
    documentsTotal: number;
  }) {
    const rev = parseInt(String(payload.annualRevenue || '0').replace(/\D/g, ''), 10) || 0;
    const amt = parseInt(String(payload.requestedAmount || '0').replace(/\D/g, ''), 10) || 0;
    const docRatio = payload.documentsTotal > 0 ? payload.documentsVerified / payload.documentsTotal : 0;
    const docOk = docRatio >= 0.66;

    let recommendation: 'strong' | 'moderate' | 'weak' = 'moderate';
    if (rev > 0 && amt > 0 && rev / amt >= 50 && docOk) recommendation = 'strong';
    else if (rev < 100000 || docRatio < 0.33) recommendation = 'weak';

    const highlights: { label: string; value: string; positive: boolean }[] = [
      { label: 'Company', value: payload.company, positive: true },
      { label: 'Amount', value: payload.requestedAmount || '\u2014', positive: true },
      { label: 'Documents', value: `${payload.documentsVerified}/${payload.documentsTotal}`, positive: docOk },
    ];
    if (payload.dateEstablished) {
      const years = new Date().getFullYear() - (parseInt(payload.dateEstablished.slice(0, 4), 10) || new Date().getFullYear());
      highlights.push({ label: 'Time in Business', value: `${Math.max(0, years)} years`, positive: years >= 2 });
    }
    if (rev > 0 && amt > 0) {
      const ratio = Math.round(rev / amt);
      highlights.push({ label: 'Revenue-to-Loan', value: `${ratio}:1`, positive: ratio >= 20 });
    }

    return {
      recommendation,
      text: `${payload.company} \u2014 ${payload.equipment}. ${payload.documentsVerified}/${payload.documentsTotal} documents verified. ${rev > 0 ? `Annual revenue $${rev.toLocaleString()}.` : ''} ${recommendation === 'strong' ? 'Strong fit' : recommendation === 'weak' ? 'Higher risk' : 'Moderate fit'}.`,
      highlights,
    };
  }
}

export const checkoutAI = new CheckoutAIService();
