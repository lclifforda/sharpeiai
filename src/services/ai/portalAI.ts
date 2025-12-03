/**
 * Portal AI Service
 * Provides predefined responses for operational queries (inventory, revenue, payments)
 * that complement the existing financing-focused AI agent
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Checks if the user query matches predefined flows and returns a canned response.
 * Returns null if no predefined response matches.
 */
export const getPredefinedPortalResponse = (userMessage: string): string | null => {
  const lowerMessage = userMessage.toLowerCase();

  // Flow 1: Check Inventory Status
  if (
    lowerMessage.includes('inventory') &&
    (lowerMessage.includes('status') ||
      lowerMessage.includes('check') ||
      lowerMessage.includes('available') ||
      lowerMessage.includes('stock'))
  ) {
    return `I've checked the inventory status for you. Here's the current overview:

**Critical Items (Low Availability):**
- **Thermal Imaging Camera (TIC-Pro)**: Only 6 units available out of 18 (33%) - High demand item
- **Industrial Camera System (CAM-4K-PRO)**: 8 units available out of 20 (40%)
- **Environmental Sensor Array (ENV-360)**: 10 units available out of 35 (29%)

**High Availability Items:**
- **Temperature Logger (TL-200)**: 48 out of 60 available (80%) - Currently in maintenance
- **Motion Detector (MD-Ultra)**: 42 out of 50 available (84%)
- **Asset Tracking Beacon (ATB-100)**: 50 out of 65 available (77%)

**Total Inventory Summary:**
- Total equipment units: 863 units across 20 product categories
- Currently in use: 279 units
- Available for deployment: 584 units
- Units in maintenance: 10 units (Temperature Loggers)

**Recommendations:**
1. Consider procuring additional Thermal Imaging Cameras and Industrial Camera Systems
2. Schedule maintenance completion for Temperature Loggers
3. Monitor Environmental Sensor Array utilization closely

Would you like me to provide details on a specific equipment category or help you navigate to the Inventory page?`;
  }

  // Flow 2: Revenue Analysis
  if (
    (lowerMessage.includes('revenue') || lowerMessage.includes('financial')) &&
    (lowerMessage.includes('analysis') ||
      lowerMessage.includes('overview') ||
      lowerMessage.includes('summary') ||
      lowerMessage.includes('performance'))
  ) {
    return `Here's your comprehensive revenue analysis:

**Current Month Performance:**
- **Incoming Payments**: $126,000
- **Scheduled Payments**: $132,500
- **Collection Rate**: 95.1% (slightly behind schedule)

**12-Month Performance:**
- **Projected Returns**: $1,480,000
- **Actual Returns**: $1,425,000
- **Achievement Rate**: 96.3%

**Portfolio Metrics:**
- **Portfolio Yield**: 12.4%
- **ROI**: 14.2%
- **Net Yield After Fees**: 10.3% (with 1.8% Sharpei fee)
- **Total Leases Value**: $1,250,000 across 184 active leases

**Top Revenue Contributors:**
1. **SmartFactory Inc**: $320,000 (18% of volume) - Growing at +12%
2. **TechCorp Industries**: $260,000 (15% of volume) - Growing at +9%
3. **AgriTech Farms**: $210,000 (12% of volume) - Strong growth at +22%
4. **DataFlow Systems**: $170,000 (10% of volume) - Declining at -4%

**Risk Indicators:**
- Default Rate: 1.3%
- Delinquency Rate: 2.1%
- On-time Repayment: 91%

**Asset Resale Performance:**
- Resale vs Forecast: 104% (exceeding expectations)
- Circularity/Reuse Rate: 68%

Would you like to drill down into specific merchants, view the full financial dashboard, or analyze payment patterns?`;
  }

  // Flow 3: Active Leases
  if (
    (lowerMessage.includes('lease') || lowerMessage.includes('contract')) &&
    (lowerMessage.includes('active') ||
      lowerMessage.includes('how many') ||
      lowerMessage.includes('count') ||
      lowerMessage.includes('total') ||
      lowerMessage.includes('list') ||
      lowerMessage.includes('show'))
  ) {
    return `Here's your active leases overview:

**Active Leases Summary:**
- **Total Active Leases**: 184 contracts
- **Total Portfolio Value**: $1,250,000
- **Average Monthly Payment**: $6,793 per lease
- **Total Monthly Revenue**: $1,250,000

**Top Active Leases by Value:**

1. **CTR-2024-001** - SmartFactory Inc
   - Equipment: Industrial Automation System
   - Lease Amount: $125,000
   - Monthly Payment: $3,450
   - Term: 36 months (12 months remaining)
   - Status: Current, on-time payments
   - Start Date: Jan 15, 2024

2. **CTR-2024-015** - TechCorp Industries
   - Equipment: IoT Sensor Network (50 units)
   - Lease Amount: $98,500
   - Monthly Payment: $2,750
   - Term: 48 months (28 months remaining)
   - Status: Current, excellent payment history
   - Start Date: Mar 10, 2024

3. **CTR-2024-028** - AgriTech Farms
   - Equipment: GPS Tracking & Monitoring System
   - Lease Amount: $87,200
   - Monthly Payment: $2,420
   - Term: 42 months (18 months remaining)
   - Status: Current
   - Start Date: Apr 5, 2024

4. **CTR-2024-042** - DataFlow Systems
   - Equipment: Edge Computing Infrastructure
   - Lease Amount: $76,800
   - Monthly Payment: $2,130
   - Term: 36 months (24 months remaining)
   - Status: Current
   - Start Date: May 20, 2024

5. **CTR-2024-055** - AutoMotive Solutions
   - Equipment: Vehicle Telematics System
   - Lease Amount: $65,400
   - Monthly Payment: $1,815
   - Term: 48 months (32 months remaining)
   - Status: ⚠️ Payment overdue (Jan 25, 2025)
   - Start Date: Jun 12, 2024

**Lease Status Breakdown:**
- **Current & On-Time**: 178 leases (96.7%)
- **Current but Overdue**: 4 leases (2.2%)
- **At Risk**: 2 leases (1.1%)
- **In Default**: 0 leases (0%)

**Lease Types:**
- **Operating Leases**: 142 leases (77%)
- **Finance Leases**: 42 leases (23%)

**Geographic Distribution:**
- **West Coast**: 68 leases (37%)
- **Midwest**: 52 leases (28%)
- **East Coast**: 45 leases (24%)
- **South**: 19 leases (11%)

**Equipment Categories:**
- **IoT & Sensors**: 78 leases (42%)
- **Industrial Automation**: 45 leases (24%)
- **Telematics & Tracking**: 35 leases (19%)
- **Edge Computing**: 26 leases (15%)

**Upcoming Lease End Dates (Next 6 Months):**
- **March 2025**: 12 leases expiring
- **April 2025**: 8 leases expiring
- **May 2025**: 15 leases expiring
- **June 2025**: 10 leases expiring

Would you like me to:
- Show details for a specific lease?
- Navigate to the Contracts page?
- Show leases by company or equipment type?
- Analyze lease performance metrics?`;
  }

  // Flow 4: Pending Payments
  if (
    lowerMessage.includes('pending') &&
    (lowerMessage.includes('payment') || lowerMessage.includes('invoice'))
  ) {
    return `Here's the current status of pending payments:

**Pending Payments Summary:**
- **Total Pending**: 7 payments
- **Total Amount**: $159,000
- **Largest Payment**: $35,000 (FactoryAI Systems)

**Upcoming Pending Payments (Next 30 Days):**

1. **DataFlow Systems** - PAY-1002
   - Amount: $16,000
   - Due: Feb 15, 2025
   - Order: ORD-002
   - Status: Within term

2. **AgriTech Farms** - PAY-1005
   - Amount: $30,000
   - Due: Feb 20, 2025
   - Order: ORD-005
   - Status: Within term

3. **MetroTrack Logistics** - PAY-1007
   - Amount: $22,000
   - Due: Mar 10, 2025
   - Order: ORD-007
   - Status: Within term

4. **AutoParts Dynamics** - PAY-1010
   - Amount: $13,500
   - Due: Mar 15, 2025
   - Order: ORD-010
   - Status: Within term

5. **FarmTech Innovations** - PAY-1013
   - Amount: $12,000
   - Due: Mar 20, 2025
   - Order: ORD-013
   - Status: Within term

6. **Assembly Line Dynamics** - PAY-1016
   - Amount: $11,200
   - Due: Mar 5, 2025
   - Order: ORD-016
   - Status: Within term

7. **FactoryAI Systems** - PAY-1022
   - Amount: $35,000
   - Due: Mar 8, 2025
   - Order: ORD-024
   - Status: Within term

**⚠️ OVERDUE Payments (Requires Immediate Attention):**

1. **AutoMotive Solutions** - PAY-1004
   - Amount: $18,000
   - Due: Jan 25, 2025 (OVERDUE)
   - Order: ORD-004
   - **Action Required**: Follow up immediately

2. **VehicleTech Partners** - PAY-1017
   - Amount: $14,400
   - Due: Jan 20, 2025 (OVERDUE)
   - Order: ORD-017
   - **Action Required**: Urgent collection needed

**Recommended Actions:**
1. Immediate follow-up with AutoMotive Solutions and VehicleTech Partners
2. Send payment reminders to DataFlow Systems and AgriTech Farms (due within 2 weeks)
3. Monitor DataFlow Systems closely (showing -4% growth trend)

Would you like me to help you navigate to the Payments page or provide contact information for any of these companies?`;
  }

  // No predefined response found
  return null;
};

/**
 * Get Anthropic AI response with predefined portal responses checked first
 * This function integrates with the existing AI system while adding portal-specific responses
 */
export const getPortalAIResponse = async (
  messages: ChatMessage[]
): Promise<string> => {
  // Check for predefined responses first
  const lastUserMessage = messages[messages.length - 1];
  if (lastUserMessage.role === 'user') {
    const predefinedResponse = getPredefinedPortalResponse(lastUserMessage.content);
    if (predefinedResponse) {
      return predefinedResponse;
    }
  }

  // If no predefined response, return a general portal assistant message
  // In production, this would call the Anthropic API or integrate with existing agentAPI
  return `I'm here to help you with the Sharpei AI Portal. I can assist with:
- Active leases and contracts overview
- Inventory status and equipment availability
- Revenue analysis and financial performance
- Payment tracking and collections
- Company and merchant management
- Orders and contract details

What would you like to know more about?`;
};
