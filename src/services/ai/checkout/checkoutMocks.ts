/**
 * Keyword-based fallback responses for checkout AI when Claude is unavailable.
 */

import type { AgentResponse } from '../shared/types';

export function getCheckoutMockResponse(message: string): AgentResponse | null {
  const lowerMessage = message.toLowerCase();

  // Income/Salary queries
  if (lowerMessage.includes('income') || lowerMessage.includes('salary') || lowerMessage.includes('revenue')) {
    return {
      message: "Great! Based on your income information, I can see you're well-qualified for our premium financing products. Higher income typically qualifies you for better rates and terms. This will positively impact your qualification score.",
      type: 'qualification_update',
      qualification: {
        score: 80,
        factors: { creditScore: 75, income: 90, employmentHistory: 70, existingRelationship: 65 },
        recommendations: ['Your income qualification is excellent!'],
      },
      suggestions: ['How does income affect my rate?', 'What documents do I need?', 'What terms can I expect?'],
    };
  }

  // Credit score queries
  if (lowerMessage.includes('credit') || lowerMessage.includes('score')) {
    return {
      message: "I'll help you understand how your credit score affects your qualification. Most of our financing products require a minimum score of 650, with better rates available for scores above 750. Your credit score is one of the key factors we consider when determining your APR.",
      type: 'text',
      suggestions: ['What is your approximate credit score?', 'How can I improve my rate?', 'What if my credit score is low?'],
    };
  }

  // Loan/Financing queries
  if (lowerMessage.includes('loan') || lowerMessage.includes('financ') || lowerMessage.includes('equipment')) {
    return {
      message: "I can help you explore equipment financing options! Based on your profile, you may qualify for competitive rates. We offer both leasing and financing options. What type of equipment are you looking to finance?",
      type: 'suggestion',
      suggestions: ['Tell me about leasing', 'Tell me about financing', 'What documents do I need?', 'How does the process work?'],
    };
  }

  // APR/Rate queries
  if (lowerMessage.includes('apr') || lowerMessage.includes('rate') || lowerMessage.includes('interest')) {
    return {
      message: "APR (Annual Percentage Rate) is the yearly cost of borrowing money, expressed as a percentage. It includes both the interest rate and any fees. Our rates typically range from 6.99% to 16.99%, depending on your credit score, income, and other factors. Would you like to know what rate you might qualify for?",
      type: 'text',
      suggestions: ['How is my rate calculated?', 'How can I get a better rate?', 'What affects my rate?'],
    };
  }

  // Payment queries
  if (lowerMessage.includes('payment') || lowerMessage.includes('monthly') || lowerMessage.includes('pay')) {
    return {
      message: "Monthly payments depend on several factors: the equipment price, your APR, the term length, and any down payment. Generally, longer terms mean lower monthly payments but higher total cost. Shorter terms mean higher monthly payments but you pay less overall. Would you like to see payment estimates?",
      type: 'text',
      suggestions: ['Can I lower my payment?', 'What about down payment?', 'How do I calculate payments?'],
    };
  }

  // Documents queries
  if (lowerMessage.includes('document') || lowerMessage.includes('paperwork') || lowerMessage.includes('need')) {
    return {
      message: "The documents you need depend on whether you're applying as an individual or business. For businesses, we typically need: business tax returns, bank statements, financial statements, and business registration. For individuals, we need: personal tax returns, pay stubs, and bank statements. I can guide you through the specific requirements.",
      type: 'text',
      suggestions: ['What documents for business?', 'What documents for individual?', 'Can I submit later?'],
    };
  }

  // Terms queries
  if (lowerMessage.includes('term') || lowerMessage.includes('length') || lowerMessage.includes('duration')) {
    return {
      message: "We offer flexible terms typically ranging from 12 to 60 months. The term length affects both your monthly payment and total cost. Shorter terms mean higher monthly payments but less interest overall. Longer terms mean lower monthly payments but more interest. What term length are you considering?",
      type: 'text',
      suggestions: ['What term is best for me?', 'Can I change the term?', 'How does term affect payment?'],
    };
  }

  // Lease vs Financing question
  const hasLease = lowerMessage.includes('lease') || lowerMessage.includes('leas');
  const hasFinancing = lowerMessage.includes('financ') || lowerMessage.includes('buy') || lowerMessage.includes('difference');
  if (hasLease && hasFinancing) {
    return {
      message: "Great question! Here's the key difference:\n\n**Leasing:** Lower monthly payments (typically 20-30% lower), but you don't own the equipment during the term. At the end, you can return it, purchase it for 10-20% of the original price, or upgrade to new equipment. Best for equipment that becomes obsolete quickly.\n\n**Financing:** Higher monthly payments, but you own the equipment from day one and build equity with each payment. No residual payment at the end. Best for long-term equipment needs.\n\nWhich option sounds more aligned with your needs?",
      type: 'text',
      suggestions: ['Leasing sounds good', 'I prefer financing', 'Tell me more about tax benefits'],
    };
  }

  // Process/How it works queries
  if (lowerMessage.includes('process') || lowerMessage.includes('work') || lowerMessage.includes('step')) {
    return {
      message: "The financing process is straightforward:\n\n1. **Application**: Fill out our simple application with basic information\n2. **Qualification**: We review your credit, income, and business details\n3. **Offers**: You'll receive personalized financing offers\n4. **Selection**: Choose the offer that works best for you\n5. **Approval**: Complete final documentation\n6. **Funding**: Get your equipment!\n\nThe entire process typically takes 1-3 business days. Would you like to start an application?",
      type: 'text',
      suggestions: ['Start application', 'How long does it take?', 'What information do I need?'],
    };
  }

  // Default checkout response
  return {
    message: "I'm here to help you with equipment financing! I can answer questions about:\n\n\u2022 Leasing vs Financing options\n\u2022 APR and interest rates\n\u2022 Payment terms and calculations\n\u2022 Required documents\n\u2022 The application process\n\u2022 Qualification requirements\n\nWhat would you like to know more about?",
    type: 'text',
    suggestions: ['How does financing work?', "What's the difference between lease and finance?", 'What documents do I need?', 'How is my rate calculated?'],
  };
}
