import axios, { AxiosInstance } from 'axios';
import type { AgentResponse, AgentInitResponse } from './types';

class AgentAPI {
  private api: AxiosInstance;
  private baseURL: string;
  
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
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
    console.log('📨 sendMessage called - sessionId:', sessionId, 'message:', message);
    console.log('🎮 DEMO_MODE:', import.meta.env.VITE_DEMO_MODE);
    console.log('🎯 Context:', context);
    
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('🎭 Using mock response (demo mode)');
      return await this.getMockResponse(message, context);
    }

    try {
      const response = await this.api.post('/api/ai/message', {
        sessionId,
        message,
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

  private async getMockResponse(message: string, context?: any): Promise<AgentResponse> {
    const lowerMessage = message.toLowerCase();
    
    console.log('🔍 getMockResponse called with:', message);
    console.log('📝 Lowercase message:', lowerMessage);
    console.log('📊 Context received:', context);
    
    const isQuestion = lowerMessage.includes('?') || 
                      lowerMessage.includes('what') ||
                      lowerMessage.includes('why') ||
                      lowerMessage.includes('how') ||
                      lowerMessage.includes('explain') ||
                      lowerMessage.includes('difference') ||
                      lowerMessage.includes('compare') ||
                      lowerMessage.includes('tell me') ||
                      lowerMessage.includes('can you');
    
    console.log('❓ isQuestion:', isQuestion);
    console.log('🔑 Has Claude API key:', !!import.meta.env.VITE_CLAUDE_API_KEY);
    
    if (isQuestion && import.meta.env.VITE_CLAUDE_API_KEY) {
      console.log('🤖 Attempting to call Claude...');
      try {
        const claudeResponse = await this.askClaude(message, context);
        console.log('✅ Claude response received:', claudeResponse);
        return claudeResponse;
      } catch (error) {
        console.warn('❌ Claude API failed, using fallback:', error);
      }
    } else {
      console.log('⏭️ Skipping Claude - isQuestion:', isQuestion, 'hasKey:', !!import.meta.env.VITE_CLAUDE_API_KEY);
    }
    
    if (lowerMessage.includes('income') || lowerMessage.includes('salary')) {
      return {
        message: "Great! Based on your income information, I can see you're well-qualified for our premium banking products. This will positively impact your qualification score.",
        type: 'qualification_update',
        qualification: {
          score: 80,
          factors: {
            creditScore: 75,
            income: 90,
            employmentHistory: 70,
            existingRelationship: 65
          },
          recommendations: ['Your income qualification is excellent!']
        }
      };
    }
    
    if (lowerMessage.includes('credit') || lowerMessage.includes('score')) {
      return {
        message: "I'll help you understand how your credit score affects your qualification. Most of our products require a minimum score of 650, with better rates available for scores above 750.",
        type: 'text',
        suggestions: [
          'What is your approximate credit score?',
          'Do you have any recent credit inquiries?',
          'Are you interested in credit monitoring services?'
        ]
      };
    }
    
    if (lowerMessage.includes('loan') || lowerMessage.includes('mortgage')) {
      return {
        message: "I can help you explore loan options! Based on your profile, you may qualify for competitive rates. What type of loan are you most interested in?",
        type: 'suggestion',
        suggestions: [
          'Personal loan',
          'Home mortgage',
          'Auto loan',
          'Business loan'
        ]
      };
    }
    
    const hasLease = lowerMessage.includes('lease') || lowerMessage.includes('leas');
    const hasFinancing = lowerMessage.includes('financ') || lowerMessage.includes('buy') || lowerMessage.includes('difference');
    console.log('💰 Checking lease/finance - hasLease:', hasLease, 'hasFinancing:', hasFinancing);
    
    if (hasLease && hasFinancing) {
      console.log('✅ Returning lease vs financing response');
      return {
        message: "Great question! Here's the key difference:\n\n**Leasing:** Lower monthly payments, but you don't own the equipment. At the end of the term, you can return it, purchase it for 10-20% of the original price, or upgrade to new equipment.\n\n**Financing:** Higher monthly payments, but you own the equipment from day one and build equity with each payment. No residual payment at the end.\n\nWhich option sounds more aligned with your needs?",
        type: 'text',
        suggestions: [
          'Leasing sounds good',
          'I prefer financing',
          'Tell me more about rates'
        ]
      };
    }
    
    console.log('🔄 Returning default response');
    return {
      message: "Thank you for that information. I'm analyzing your profile to provide the best recommendations. Could you tell me more about your leasing needs?",
      type: 'text',
      suggestions: [
        'I need equipment for my business',
        'I want to lease robotics',
        'Tell me about financing options',
        'What are the requirements?'
      ]
    };
  }
  
  private async askClaude(question: string, sessionContext?: any): Promise<AgentResponse> {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }
    
    let contextText = `
You are an AI assistant for an equipment financing platform. You help customers understand their financing options and guide them through the application process.

=== EQUIPMENT FINANCING FUNDAMENTALS ===

**Product Types:**
1. EQUIPMENT LEASING
   - Lower monthly payments (typically 20-30% lower than financing)
   - You don't own the equipment during the lease term
   - At lease end, you have 3 options:
     a) Return the equipment (no additional cost)
     b) Purchase it for 10-20% of original price (buyout option)
     c) Upgrade to newer equipment
   - Tax benefits: Lease payments are typically fully tax-deductible
   - Best for: Technology/equipment that becomes obsolete quickly, businesses that want flexibility

2. EQUIPMENT FINANCING (Loan)
   - Higher monthly payments (but you're building equity)
   - You own the equipment from day one
   - Build equity with each payment
   - No residual payment at the end
   - Tax benefits: Interest is tax-deductible, equipment can be depreciated
   - Best for: Long-term equipment needs, businesses that want to own assets

**APR (Annual Percentage Rate) Explained:**
- This is the yearly cost of borrowing money, expressed as a percentage
- APR includes the interest rate PLUS any fees
- For equipment financing, APR typically ranges from 6.99% to 16.99%
- Your APR is determined by:
  * Credit score (higher = better rate)
  * Income/revenue (higher = better rate)
  * Employment stability (longer = better rate)
  * Down payment amount (larger = better rate)
  * Loan term (shorter = better rate, typically)

**Rate Tiers:**
- 0% APR: Exceptional income (over $250K) - promotional rate
- 6.99-7.99%: Excellent credit (750+) or high income + stable employment
- 8.99-10.99%: Good credit (680-749) with decent income
- 12.99-16.99%: Fair credit (620-679) or moderate income

=== YOUR ROLE ===
You should:
- Answer questions naturally and conversationally
- Explain concepts in simple terms (avoid jargon unless asked)
- Use specific numbers from the session context when available
- Be helpful and patient - customers may not understand financial terms
- Guide them back to the application when appropriate
- Explain WHY they received a certain rate or offer
`;

    if (sessionContext) {
      contextText += `\n\nCurrent Session Context:\n`;
      
      if (sessionContext.customerData) {
        const data = sessionContext.customerData;
        if (data.customerType) contextText += `- Customer type: ${data.customerType}\n`;
        if (data.income) contextText += `- Income: $${data.income.toLocaleString()}\n`;
        if (data.creditScore) contextText += `- Credit score: ${data.creditScore}\n`;
        if (data.employmentStatus) contextText += `- Employment: ${data.employmentStatus}\n`;
      }
      
      if (sessionContext.lastOffer) {
        const offer = sessionContext.lastOffer;
        contextText += `\n=== CURRENT OFFER ===`;
        contextText += `\nLender: ${offer.lender}`;
        contextText += `\nAPR (Annual Percentage Rate): ${offer.rate}%`;
        contextText += `\nLoan Term: ${offer.term} months`;
        contextText += `\nDown Payment Required: $${offer.down}`;
        contextText += `\nEstimated Monthly Payment: $${offer.estMonthly}\n`;
        contextText += `\n===================\n`;
      }
      
      if (sessionContext.cartTotal) {
        contextText += `\n- Cart total: $${sessionContext.cartTotal.toLocaleString()}\n`;
      }
    }

    contextText += `\n\n=== RESPONSE GUIDELINES ===
- Use EXACT numbers from the context (e.g., "10.99%" not "[RATE]%")
- Be conversational and friendly (like talking to a friend)
- Keep responses to 2-4 sentences unless explaining complex concepts
- When explaining APR/rates, always explain WHY they got that rate
- When discussing offers, reference their specific situation
- If they seem confused, offer to explain further
- Suggest next steps when appropriate

Now answer the user's question:
`;
    
    try {
      const useProxy = true;
      const apiUrl = useProxy 
        ? 'https://corsproxy.io/?' + encodeURIComponent('https://api.anthropic.com/v1/messages')
        : 'https://api.anthropic.com/v1/messages';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: `${contextText}\n\nUser question: ${question}`
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }
      
      const data = await response.json();
      const answer = data.content[0].text;
      
      let suggestions: string[] = [];
      
      if (question.toLowerCase().includes('apr') || question.toLowerCase().includes('rate')) {
        suggestions = ['How can I get a better rate?', 'Continue with application', 'What affects my rate?'];
      } else if (question.toLowerCase().includes('lease') || question.toLowerCase().includes('finance')) {
        suggestions = ['Which is better for me?', 'Continue with application', 'Tell me about tax benefits'];
      } else if (question.toLowerCase().includes('payment') || question.toLowerCase().includes('monthly')) {
        suggestions = ['Can I lower my payment?', 'Continue with application', 'What about down payment?'];
      } else if (sessionContext?.lastOffer) {
        suggestions = ['Continue with application', 'Ask another question', 'Show me other options'];
      } else {
        suggestions = ['Continue with application', 'Tell me more', 'Ask another question'];
      }
      
      return {
        message: answer,
        type: 'text',
        suggestions
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
}

export const agentAPI = new AgentAPI();
