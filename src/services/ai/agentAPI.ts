import axios, { AxiosInstance } from 'axios';
import type { AgentResponse, AgentInitResponse } from './types';
import { checkoutAI } from './checkout/checkoutAI';
import { portalAI } from './portal/portalAI';

/**
 * Determine whether a context object is portal (admin) or checkout (customer).
 * Explicit `aiType` flag takes priority, then heuristics.
 */
function isPortalContext(context?: any): boolean {
  if (!context) return false;

  // Explicit flag — set by consumer components
  if (context.aiType === 'portal') return true;
  if (context.aiType === 'checkout') return false;

  // Heuristic: source field
  if (context.source === 'floating-chat' || context.source === 'index-chat') return true;

  // Heuristic: page-based
  const page = context.currentPage || '';
  if (page.startsWith('/dashboard') || page.startsWith('/vendors') || page.startsWith('/applications') || page.startsWith('/settings')) {
    return true;
  }

  // Default: checkout (customer-facing)
  return false;
}

class AgentAPI {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : window.location.origin);
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async initialize(sessionId: string): Promise<AgentInitResponse> {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      return {
        success: true,
        sessionId,
        initialMessage: "Hello! I'm your AI qualification assistant. I'll help you find the best banking products based on your needs."
      };
    }

    try {
      const response = await this.api.post('/api/ai/initialize', {
        sessionId,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Agent initialization failed:', error);
      throw error;
    }
  }

  async sendMessage(sessionId: string, message: string, context?: any): Promise<AgentResponse> {
    const portal = isPortalContext(context);
    console.log(`[AgentAPI] routing to ${portal ? 'portal' : 'checkout'} AI`, { sessionId, aiType: context?.aiType, source: context?.source });

    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      return portal
        ? portalAI.askQuestion(message, context)
        : checkoutAI.askQuestion(message, context);
    }

    try {
      const response = await this.api.post('/api/ai/message', {
        sessionId,
        message,
        context,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Message sending failed:', error);
      throw error;
    }
  }

  async getQualificationStatus(sessionId: string): Promise<any> {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      return {
        score: 75,
        factors: {
          creditScore: 80,
          income: 70,
          employmentHistory: 75,
          existingRelationship: 85
        },
        recommendations: [
          'Consider setting up direct deposit to improve your relationship score',
          'Your credit score is excellent - this qualifies you for our premium rates'
        ]
      };
    }

    try {
      const response = await this.api.get(`/api/ai/qualification/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Qualification status fetch failed:', error);
      throw error;
    }
  }

  async updateCustomerData(sessionId: string, customerData: any): Promise<void> {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      return;
    }

    try {
      await this.api.put(`/api/sessions/${sessionId}/customer`, customerData);
    } catch (error) {
      console.error('Customer data update failed:', error);
      throw error;
    }
  }

  // Delegate equipment chat to checkout service
  async askClaudeEquipment(
    message: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    existingItems: { name: string; quantity: number; totalValue: number }[] = []
  ) {
    return checkoutAI.askEquipment(message, conversationHistory, existingItems);
  }

  // Delegate application assessment to checkout service
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
    return checkoutAI.assessApplication(payload);
  }
}

export const agentAPI = new AgentAPI();
