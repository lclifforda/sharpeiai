/**
 * Checkout AI — system prompt and session context builder.
 * Contains equipment financing education only — NO internal business data.
 */

export const CHECKOUT_SYSTEM_PROMPT = `You are an AI assistant for an equipment financing platform. You help customers understand their financing options and guide them through the application process.

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
- When discussing offers, reference their specific situation`;

export const CHECKOUT_RESPONSE_GUIDELINES = `
=== RESPONSE GUIDELINES ===
- Use EXACT numbers from the context (e.g., "10.99%" not "[RATE]%")
- Be conversational and friendly (like talking to a friend)
- Keep responses to 2-4 sentences unless explaining complex concepts
- When explaining APR/rates, always explain WHY they got that rate
- When discussing offers, reference their specific situation
- If they seem confused, offer to explain further
- Suggest next steps when appropriate

Now answer the user's question:`;

/**
 * Build session context string from the checkout context object.
 */
export function buildCheckoutSessionContext(sessionContext: any): string {
  if (!sessionContext) return '';

  let ctx = '\n\n=== CURRENT SESSION CONTEXT ===\n';

  if (sessionContext.currentPage) {
    const pageDescriptions: Record<string, string> = {
      '/checkout': 'The user is on the Checkout page, reviewing or filling out an equipment financing application.',
    };
    const page = sessionContext.currentPage;
    const pageDesc = pageDescriptions[page]
      || Object.entries(pageDescriptions).find(([k]) => page.startsWith(k))?.[1]
      || `The user is on page: ${page}`;
    ctx += `\nCurrent Page: ${page}\n${pageDesc}\n`;
  }

  if (sessionContext.applicationType) {
    const typeLabels: Record<string, string> = {
      'equipment-financing': 'Equipment Financing',
      'lease-financing': 'Equipment Leasing',
      'working-capital': 'Working Capital',
    };
    ctx += `- Application type: ${typeLabels[sessionContext.applicationType] || sessionContext.applicationType}\n`;
  }
  if (sessionContext.currentStep) {
    const stepLabels: Record<string, string> = {
      'info': 'Filling out company & contact information',
      'documents': 'Uploading required documents',
      'offers': 'Reviewing financing offers',
      'contract': 'Reviewing the contract',
      'complete': 'Application is complete',
    };
    ctx += `- Current step: ${stepLabels[sessionContext.currentStep] || sessionContext.currentStep}\n`;
  }
  if (sessionContext.companyName) ctx += `- Company: ${sessionContext.companyName}\n`;
  if (sessionContext.equipmentSummary) ctx += `- Equipment: ${sessionContext.equipmentSummary}\n`;
  if (sessionContext.equipmentTotal) ctx += `- Equipment total value: $${Number(sessionContext.equipmentTotal).toLocaleString()}\n`;
  if (sessionContext.revenue) ctx += `- Annual revenue: $${Number(sessionContext.revenue).toLocaleString()}\n`;
  if (sessionContext.offersCount) ctx += `- ${sessionContext.offersCount} financing offers available\n`;
  if (sessionContext.viewMode) ctx += `- View mode: ${sessionContext.viewMode}\n`;

  if (sessionContext.customerData) {
    const data = sessionContext.customerData;
    if (data.customerType) ctx += `- Customer type: ${data.customerType}\n`;
    if (data.income) ctx += `- Income: $${data.income.toLocaleString()}\n`;
    if (data.creditScore) ctx += `- Credit score: ${data.creditScore}\n`;
    if (data.employmentStatus) ctx += `- Employment: ${data.employmentStatus}\n`;
  }

  if (sessionContext.selectedOffer || sessionContext.lastOffer) {
    const offer = sessionContext.selectedOffer || sessionContext.lastOffer;
    ctx += `\n=== SELECTED OFFER ===`;
    if (offer.lender) ctx += `\nLender: ${offer.lender}`;
    ctx += `\nAPR: ${offer.rate}%`;
    ctx += `\nTerm: ${offer.term} months`;
    if (offer.monthly) ctx += `\nMonthly Payment: $${offer.monthly}`;
    if (offer.down) ctx += `\nDown Payment: $${offer.down}`;
    if (offer.estMonthly) ctx += `\nEstimated Monthly Payment: $${offer.estMonthly}`;
    ctx += `\n===================\n`;
  }

  if (sessionContext.cartTotal) ctx += `\n- Cart total: $${sessionContext.cartTotal.toLocaleString()}\n`;

  return ctx;
}

/**
 * Generate contextual follow-up suggestions for checkout conversations.
 */
export function getCheckoutSuggestions(question: string): string[] {
  const q = question.toLowerCase();

  if (q.includes('apr') || q.includes('rate') || q.includes('interest')) {
    return ['How can I get a better rate?', 'What affects my rate?', 'Explain APR vs interest rate'];
  }
  if (q.includes('lease') || q.includes('finance')) {
    return ['Which is better for me?', 'Tell me about tax benefits', 'What are typical terms?'];
  }
  if (q.includes('payment') || q.includes('monthly')) {
    return ['Can I lower my payment?', 'What about down payment?', 'How do terms affect cost?'];
  }
  if (q.includes('document') || q.includes('need')) {
    return ["What if I'm missing documents?", 'How long does approval take?'];
  }
  if (q.includes('income') || q.includes('salary') || q.includes('revenue')) {
    return ['How does income affect my rate?', 'What documents do I need?', 'What terms can I expect?'];
  }
  if (q.includes('credit') || q.includes('score')) {
    return ['How can I improve my rate?', 'What if my credit score is low?'];
  }
  return ['How does financing work?', "What's the difference between lease and finance?", 'What documents do I need?'];
}
