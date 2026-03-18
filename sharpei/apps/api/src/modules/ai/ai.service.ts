import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  PORTAL_SYSTEM_PROMPT,
  CHECKOUT_SYSTEM_PROMPT,
  EQUIPMENT_SYSTEM_PROMPT,
  ASSESSMENT_SYSTEM_PROMPT,
} from './ai.prompts';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: Anthropic;
  private readonly model = 'claude-sonnet-4-20250514';

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async sendMessage(
    message: string,
    context: any,
    conversationHistory?: { role: string; content: string }[],
  ) {
    const isPortal = this.isPortalContext(context);
    const systemPrompt = isPortal ? PORTAL_SYSTEM_PROMPT : CHECKOUT_SYSTEM_PROMPT;

    // Build context string from whatever the frontend sends
    let contextStr = '';
    if (context) {
      const { conversationHistory: _, aiType: __, source: ___, ...rest } = context;
      if (Object.keys(rest).length > 0) {
        contextStr = `\n\n=== SESSION CONTEXT ===\n${JSON.stringify(rest, null, 2)}`;
      }
    }

    const messages: Anthropic.MessageParam[] = [];

    // Add conversation history
    if (conversationHistory?.length) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt + contextStr,
        messages,
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';

      // Try to parse JSON response
      try {
        const parsed = JSON.parse(text);
        return {
          message: parsed.message || text,
          type: parsed.type || 'text',
          suggestions: parsed.suggestions || [],
          qualification: parsed.qualification || undefined,
        };
      } catch {
        // Claude didn't return JSON — wrap as plain text
        return {
          message: text,
          type: 'text' as const,
          suggestions: [],
        };
      }
    } catch (error) {
      this.logger.error('Claude API error:', error);
      return {
        message: 'I encountered an issue processing your request. Please try again.',
        type: 'text' as const,
        suggestions: [],
      };
    }
  }

  async askEquipment(
    message: string,
    conversationHistory: { role: string; content: string }[],
    existingItems: { name: string; quantity: number; totalValue: number }[] = [],
  ) {
    const messages: Anthropic.MessageParam[] = [];

    for (const msg of conversationHistory) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }
    messages.push({ role: 'user', content: message });

    let contextStr = '';
    if (existingItems.length > 0) {
      contextStr = `\n\n=== EXISTING ITEMS IN CART ===\n${JSON.stringify(existingItems)}`;
    }

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 512,
        system: EQUIPMENT_SYSTEM_PROMPT + contextStr,
        messages,
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';

      try {
        return JSON.parse(text);
      } catch {
        return { message: text, suggestions: [], equipment: null };
      }
    } catch (error) {
      this.logger.error('Equipment chat error:', error);
      return {
        message: 'Sorry, I had trouble processing that. Could you try again?',
        suggestions: [],
        equipment: null,
      };
    }
  }

  async assessApplication(payload: {
    company: string;
    contact?: string;
    entityType?: string;
    entitySize?: string;
    dateEstablished?: string;
    annualRevenue?: string;
    requestedAmount?: string;
    equipment: string;
    equipmentItems?: any[];
    documentsVerified: number;
    documentsTotal: number;
  }) {
    const prompt = `Analyze this equipment financing application:\n${JSON.stringify(payload, null, 2)}`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 512,
        system: ASSESSMENT_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';

      try {
        return JSON.parse(text);
      } catch {
        return {
          recommendation: 'moderate',
          text,
          highlights: [],
        };
      }
    } catch (error) {
      this.logger.error('Assessment error:', error);
      // Fallback logic
      const revenue = parseFloat(payload.annualRevenue || '0');
      const amount = parseFloat(payload.requestedAmount || '0');
      const docRatio =
        payload.documentsTotal > 0
          ? payload.documentsVerified / payload.documentsTotal
          : 0;

      let recommendation: 'strong' | 'moderate' | 'weak' = 'moderate';
      if (revenue / (amount || 1) >= 50 && docRatio >= 0.66) {
        recommendation = 'strong';
      } else if (revenue < 100000 || docRatio < 0.33) {
        recommendation = 'weak';
      }

      return {
        recommendation,
        text: `Based on available data: ${payload.company} with ${payload.annualRevenue || 'unknown'} annual revenue requesting ${payload.requestedAmount || 'unknown'} for ${payload.equipment}.`,
        highlights: [
          {
            label: 'Documentation',
            value: `${payload.documentsVerified}/${payload.documentsTotal} verified`,
            positive: docRatio >= 0.5,
          },
        ],
      };
    }
  }

  private isPortalContext(context?: any): boolean {
    if (!context) return false;
    if (context.aiType === 'portal') return true;
    if (context.aiType === 'checkout') return false;
    if (
      context.source === 'floating-chat' ||
      context.source === 'index-chat'
    )
      return true;
    const page = context.currentPage || '';
    if (
      page.startsWith('/dashboard') ||
      page.startsWith('/merchants') ||
      page.startsWith('/applications') ||
      page.startsWith('/settings')
    )
      return true;
    return false;
  }
}
