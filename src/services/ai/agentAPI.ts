import axios, { AxiosInstance } from 'axios';
import Anthropic from '@anthropic-ai/sdk';
import type { AgentResponse, AgentInitResponse } from './types';
import { getPredefinedPortalResponse } from './portalAI';

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
      timeout: 30000, // 30 second timeout for AI responses
    });

    // Add request interceptor for auth tokens
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async initialize(sessionId: string): Promise<AgentInitResponse> {
    // Return mock response immediately in demo mode
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
    
    // Check for portal-specific responses first
    const portalResponse = getPredefinedPortalResponse(message);
    if (portalResponse) {
      console.log('🏢 Using portal-specific response');
      return {
        message: portalResponse,
        type: 'text',
        suggestions: [
          'Ask another question',
          'View inventory',
          'Check payments'
        ]
      };
    }
    
    // Return mock response in demo mode (now supports async Claude calls)
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('🎭 Using mock response (demo mode)');
      return await this.getMockResponse(message, context);
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
    // Return mock data immediately in demo mode
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
    // Skip API call in demo mode
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
    
    // Check if it's a question (off-script)
    const isQuestion = lowerMessage.includes('?') || 
                      lowerMessage.includes('what') ||
                      lowerMessage.includes('why') ||
                      lowerMessage.includes('how') ||
                      lowerMessage.includes('explain') ||
                      lowerMessage.includes('difference') ||
                      lowerMessage.includes('compare') ||
                      lowerMessage.includes('tell me') ||
                      lowerMessage.includes('can you') ||
                      lowerMessage.includes('help') ||
                      lowerMessage.includes('understand');
    
    console.log('❓ isQuestion:', isQuestion);
    console.log('🔑 Has Claude API key:', !!import.meta.env.VITE_CLAUDE_API_KEY);
    
    // If it's a question and we have Claude API key, use Claude
    if (isQuestion && import.meta.env.VITE_CLAUDE_API_KEY) {
      console.log('🤖 Attempting to call Claude...');
      try {
        const claudeResponse = await this.askClaude(message, context);
        console.log('✅ Claude response received:', claudeResponse);
        return claudeResponse;
      } catch (error) {
        console.warn('❌ Claude API failed, using fallback:', error);
        // Fall through to regular mock responses
      }
    } else {
      console.log('⏭️ Skipping Claude - isQuestion:', isQuestion, 'hasKey:', !!import.meta.env.VITE_CLAUDE_API_KEY);
    }
    
    // Income/Salary queries
    if (lowerMessage.includes('income') || lowerMessage.includes('salary') || lowerMessage.includes('revenue')) {
      return {
        message: "Great! Based on your income information, I can see you're well-qualified for our premium financing products. Higher income typically qualifies you for better rates and terms. This will positively impact your qualification score.",
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
        },
        suggestions: [
          'How does income affect my rate?',
          'What documents do I need?',
          'Continue with application'
        ]
      };
    }
    
    // Credit score queries
    if (lowerMessage.includes('credit') || lowerMessage.includes('score')) {
      return {
        message: "I'll help you understand how your credit score affects your qualification. Most of our financing products require a minimum score of 650, with better rates available for scores above 750. Your credit score is one of the key factors we consider when determining your APR.",
        type: 'text',
        suggestions: [
          'What is your approximate credit score?',
          'How can I improve my rate?',
          'What if my credit score is low?'
        ]
      };
    }
    
    // Loan/Financing queries
    if (lowerMessage.includes('loan') || lowerMessage.includes('financ') || lowerMessage.includes('equipment')) {
      return {
        message: "I can help you explore equipment financing options! Based on your profile, you may qualify for competitive rates. We offer both leasing and financing options. What type of equipment are you looking to finance?",
        type: 'suggestion',
        suggestions: [
          'Tell me about leasing',
          'Tell me about financing',
          'What documents do I need?',
          'How does the process work?'
        ]
      };
    }
    
    // APR/Rate queries
    if (lowerMessage.includes('apr') || lowerMessage.includes('rate') || lowerMessage.includes('interest')) {
      return {
        message: "APR (Annual Percentage Rate) is the yearly cost of borrowing money, expressed as a percentage. It includes both the interest rate and any fees. Our rates typically range from 6.99% to 16.99%, depending on your credit score, income, and other factors. Would you like to know what rate you might qualify for?",
        type: 'text',
        suggestions: [
          'How is my rate calculated?',
          'How can I get a better rate?',
          'What affects my rate?'
        ]
      };
    }
    
    // Payment queries
    if (lowerMessage.includes('payment') || lowerMessage.includes('monthly') || lowerMessage.includes('pay')) {
      return {
        message: "Monthly payments depend on several factors: the equipment price, your APR, the term length, and any down payment. Generally, longer terms mean lower monthly payments but higher total cost. Shorter terms mean higher monthly payments but you pay less overall. Would you like to see payment estimates?",
        type: 'text',
        suggestions: [
          'Can I lower my payment?',
          'What about down payment?',
          'How do I calculate payments?'
        ]
      };
    }
    
    // Documents queries
    if (lowerMessage.includes('document') || lowerMessage.includes('paperwork') || lowerMessage.includes('need')) {
      return {
        message: "The documents you need depend on whether you're applying as an individual or business. For businesses, we typically need: business tax returns, bank statements, financial statements, and business registration. For individuals, we need: personal tax returns, pay stubs, and bank statements. I can guide you through the specific requirements.",
        type: 'text',
        suggestions: [
          'What documents for business?',
          'What documents for individual?',
          'Can I submit later?'
        ]
      };
    }
    
    // Terms queries
    if (lowerMessage.includes('term') || lowerMessage.includes('length') || lowerMessage.includes('duration')) {
      return {
        message: "We offer flexible terms typically ranging from 12 to 60 months. The term length affects both your monthly payment and total cost. Shorter terms mean higher monthly payments but less interest overall. Longer terms mean lower monthly payments but more interest. What term length are you considering?",
        type: 'text',
        suggestions: [
          'What term is best for me?',
          'Can I change the term?',
          'How does term affect payment?'
        ]
      };
    }
    
    // Lease vs Financing question
    const hasLease = lowerMessage.includes('lease') || lowerMessage.includes('leas');
    const hasFinancing = lowerMessage.includes('financ') || lowerMessage.includes('buy') || lowerMessage.includes('difference');
    console.log('💰 Checking lease/finance - hasLease:', hasLease, 'hasFinancing:', hasFinancing);
    
    if (hasLease && hasFinancing) {
      console.log('✅ Returning lease vs financing response');
      return {
        message: "Great question! Here's the key difference:\n\n**Leasing:** Lower monthly payments (typically 20-30% lower), but you don't own the equipment during the term. At the end, you can return it, purchase it for 10-20% of the original price, or upgrade to new equipment. Best for equipment that becomes obsolete quickly.\n\n**Financing:** Higher monthly payments, but you own the equipment from day one and build equity with each payment. No residual payment at the end. Best for long-term equipment needs.\n\nWhich option sounds more aligned with your needs?",
        type: 'text',
        suggestions: [
          'Leasing sounds good',
          'I prefer financing',
          'Tell me more about tax benefits'
        ]
      };
    }
    
    // Process/How it works queries
    if (lowerMessage.includes('process') || lowerMessage.includes('work') || lowerMessage.includes('step')) {
      return {
        message: "The financing process is straightforward:\n\n1. **Application**: Fill out our simple application with basic information\n2. **Qualification**: We review your credit, income, and business details\n3. **Offers**: You'll receive personalized financing offers\n4. **Selection**: Choose the offer that works best for you\n5. **Approval**: Complete final documentation\n6. **Funding**: Get your equipment!\n\nThe entire process typically takes 1-3 business days. Would you like to start an application?",
        type: 'text',
        suggestions: [
          'Start application',
          'How long does it take?',
          'What information do I need?'
        ]
      };
    }
    
    // Default response
    console.log('🔄 Returning default response');
    return {
      message: "I'm here to help you with equipment financing! I can answer questions about:\n\n• Leasing vs Financing options\n• APR and interest rates\n• Payment terms and calculations\n• Required documents\n• The application process\n• Qualification requirements\n\nWhat would you like to know more about?",
      type: 'text',
      suggestions: [
        'How does financing work?',
        'What\'s the difference between lease and finance?',
        'What documents do I need?',
        'How is my rate calculated?'
      ]
    };
  }
  
  /**
   * Ask Claude for off-script questions during demo
   */
  private async askClaude(question: string, sessionContext?: any): Promise<AgentResponse> {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }
    
    // Build context with product info + session data
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
   - Off-balance-sheet treatment (for operating leases)
   - Best for: Technology/equipment that becomes obsolete quickly, businesses that want flexibility

2. EQUIPMENT FINANCING (Loan)
   - Higher monthly payments (but you're building equity)
   - You own the equipment from day one
   - Build equity with each payment
   - No residual payment at the end
   - Tax benefits: Interest is tax-deductible, equipment can be depreciated
   - On-balance-sheet (asset + liability)
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

**How APR Affects Monthly Payments:**
- Example: $10,000 equipment, 24-month term
  * At 7.99% APR: ~$450/month (total paid: ~$10,800)
  * At 10.99% APR: ~$470/month (total paid: ~$11,280)
  * At 15.99% APR: ~$500/month (total paid: ~$12,000)

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

    // Add session context if available
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
        contextText += `\nWHY THIS RATE: The ${offer.rate}% APR was calculated because `;
        if (offer.rate === 0) {
          contextText += `the customer has exceptional income (over $250,000) which qualifies them for our exclusive 0% promotional financing.`;
        } else if (offer.rate <= 7.99) {
          contextText += `the customer has excellent credit (over 750) or high income with stable employment, qualifying for premium tier rates.`;
        } else if (offer.rate <= 10.99) {
          contextText += `the customer has a good overall credit and income profile, qualifying for standard tier rates.`;
        } else {
          contextText += `the customer has fair credit (under 650) or moderate income, which falls into our alternative financing tier.`;
        }
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
      // Use Anthropic SDK for better reliability
      const anthropic = new Anthropic({
        apiKey: apiKey,
        baseURL: import.meta.env.VITE_ANTHROPIC_BASE_URL || undefined,
      });
      
      const claudeModel = import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-haiku-20240307';
      
      const message = await anthropic.messages.create({
        model: claudeModel,
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: `${contextText}\n\nUser question: ${question}`
          }
        ]
      });
      
      const answer = message.content[0].type === 'text' ? message.content[0].text : 'I apologize, but I encountered an error processing your question.';
      
      // Generate smart suggestions based on the question and context
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
