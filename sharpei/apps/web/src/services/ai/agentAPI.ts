import api from '@/lib/api';
import type { AgentResponse, AgentInitResponse } from './types';

class AgentAPI {
  async initialize(sessionId: string): Promise<AgentInitResponse> {
    return {
      success: true,
      sessionId,
      initialMessage: "Hi! I'm your Sharpei AI assistant. How can I help you today?"
    };
  }

  async sendMessage(sessionId: string, message: string, context?: any): Promise<AgentResponse> {
    try {
      const { data } = await api.post('/ai/message', {
        sessionId,
        message,
        context,
        timestamp: new Date().toISOString()
      });
      return data;
    } catch (error) {
      console.error('[AgentAPI] sendMessage failed:', error);
      return {
        message: "I'm having trouble connecting right now. Please try again.",
        type: 'text',
        suggestions: [],
      };
    }
  }

  async getQualificationStatus(sessionId: string): Promise<any> {
    try {
      const { data } = await api.get(`/ai/qualification/${sessionId}`);
      return data;
    } catch (error) {
      console.error('[AgentAPI] getQualificationStatus failed:', error);
      return { score: 0, factors: {}, recommendations: [] };
    }
  }

  async updateCustomerData(sessionId: string, customerData: any): Promise<void> {
    try {
      await api.put(`/sessions/${sessionId}/customer`, customerData);
    } catch (error) {
      console.error('[AgentAPI] updateCustomerData failed:', error);
    }
  }

  async askClaudeEquipment(
    message: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    existingItems: { name: string; quantity: number; totalValue: number }[] = []
  ) {
    try {
      const { data } = await api.post('/ai/equipment', {
        message,
        conversationHistory,
        existingItems,
      });
      return data;
    } catch (error) {
      console.error('[AgentAPI] askClaudeEquipment failed:', error);
      return {
        message: "Sorry, I had trouble processing that. Could you try again?",
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
    equipmentItems?: { description: string; quantity: number; unitCost: number }[];
    documentsVerified: number;
    documentsTotal: number;
  }) {
    try {
      const { data } = await api.post('/ai/assess', payload);
      return data;
    } catch (error) {
      console.error('[AgentAPI] assessApplication failed:', error);
      return {
        recommendation: 'moderate',
        text: 'Unable to generate AI assessment. Please review manually.',
        highlights: [],
      };
    }
  }
}

export const agentAPI = new AgentAPI();
