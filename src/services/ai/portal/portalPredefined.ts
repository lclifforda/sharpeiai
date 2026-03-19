/**
 * Predefined keyword-based portal responses.
 * Extracted from the original portalAI.ts for use by PortalAIService.
 */

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

Would you like to drill down into specific vendors, view the full financial dashboard, or analyze payment patterns?`;
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
   - Status: \u26a0\ufe0f Payment overdue (Jan 25, 2025)
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
   - Application: APP-002
   - Status: Within term

2. **AgriTech Farms** - PAY-1005
   - Amount: $30,000
   - Due: Feb 20, 2025
   - Application: APP-005
   - Status: Within term

3. **MetroTrack Logistics** - PAY-1007
   - Amount: $22,000
   - Due: Mar 10, 2025
   - Application: APP-007
   - Status: Within term

4. **AutoParts Dynamics** - PAY-1010
   - Amount: $13,500
   - Due: Mar 15, 2025
   - Application: APP-010
   - Status: Within term

5. **FarmTech Innovations** - PAY-1013
   - Amount: $12,000
   - Due: Mar 20, 2025
   - Application: APP-013
   - Status: Within term

6. **Assembly Line Dynamics** - PAY-1016
   - Amount: $11,200
   - Due: Mar 5, 2025
   - Application: APP-016
   - Status: Within term

7. **FactoryAI Systems** - PAY-1022
   - Amount: $35,000
   - Due: Mar 8, 2025
   - Application: APP-024
   - Status: Within term

**\u26a0\ufe0f OVERDUE Payments (Requires Immediate Attention):**

1. **AutoMotive Solutions** - PAY-1004
   - Amount: $18,000
   - Due: Jan 25, 2025 (OVERDUE)
   - Application: APP-004
   - **Action Required**: Follow up immediately

2. **VehicleTech Partners** - PAY-1017
   - Amount: $14,400
   - Due: Jan 20, 2025 (OVERDUE)
   - Application: APP-017
   - **Action Required**: Urgent collection needed

**Recommended Actions:**
1. Immediate follow-up with AutoMotive Solutions and VehicleTech Partners
2. Send payment reminders to DataFlow Systems and AgriTech Farms (due within 2 weeks)
3. Monitor DataFlow Systems closely (showing -4% growth trend)

Would you like me to help you navigate to the Payments page or provide contact information for any of these companies?`;
  }

  // Flow 5: KPI / Working Capital queries
  if (
    lowerMessage.includes('kpi') ||
    (lowerMessage.includes('working capital') && !lowerMessage.includes('apply')) ||
    (lowerMessage.includes('metric') && (lowerMessage.includes('my') || lowerMessage.includes('our') || lowerMessage.includes('show') || lowerMessage.includes('what')))
  ) {
    return `Here are your key performance indicators for this month:

**Working Capital Overview:**
- **Working Capital Portfolio**: $140,000 across 14 active contracts
- **Monthly Cash Inflow (Scheduled)**: $125,000
- **Monthly Cash Inflow (Actual)**: $128,000 \u2014 **102.4% collection rate**
- **Working Capital Yield**: 14.2% (Net: 12.8% after fees)

**Overall Portfolio KPIs:**
| Metric | Value | Trend |
|--------|-------|-------|
| Total Portfolio | $1.25M | +12% |
| Active Vendors | 26 (9 categories) | +3 |
| Portfolio Yield | 14.2% (Net: 12.8%) | +0.8% |
| ROI (12M) | 13.9% (Target: 14%) | -0.1% |
| Default Rate | 1.8% | +0.2% |
| Delinquency Rate | 2.3% | \u2014 |

**Portfolio Breakdown:**
- Equipment Financing: 142 contracts \u2014 $892K
- Equipment Leasing: 28 contracts \u2014 $218K
- Working Capital: 14 contracts \u2014 $140K

**Underwriting Funnel (This Period):**
- Applications Received: 450
- Pre-Approved: 315 (70%)
- Approved: 252 (56%)
- Funded: 184 (41%)

**Cash Flow (Last 6 Months):**
- Jan: $102K actual vs $98K scheduled
- Feb: $98K actual vs $105K scheduled
- Mar: $115K actual vs $112K scheduled
- Apr: $110K actual vs $108K scheduled
- May: $118K actual vs $120K scheduled
- Jun: $128K actual vs $125K scheduled

Would you like me to drill deeper into any specific KPI, or look at vendor performance, risk metrics, or cash flow trends?`;
  }

  // Flow 6: Portfolio / Dashboard overview
  if (
    (lowerMessage.includes('portfolio') || lowerMessage.includes('dashboard') || lowerMessage.includes('overview')) &&
    (lowerMessage.includes('my') || lowerMessage.includes('our') || lowerMessage.includes('show') || lowerMessage.includes('what') || lowerMessage.includes('tell') || lowerMessage.includes('how'))
  ) {
    return `Here's your portfolio overview:

**Total Portfolio**: $1.25M across 184 funded contracts (+12% growth)

**By Product Type:**
- **Equipment Financing**: 142 contracts \u2014 $892K (71.4% of portfolio)
- **Equipment Leasing**: 28 contracts \u2014 $218K (17.4%)
- **Working Capital**: 14 contracts \u2014 $140K (11.2%)

**Key Metrics:**
- Portfolio Yield: 14.2% (Net: 12.8%)
- ROI (12M): 13.9% vs 14% target
- Default Rate: 1.8%
- Delinquency Rate: 2.3%
- Active Vendors: 26 across 9 categories

**Top Performing Vendors:**
1. MedEquip Pro \u2014 Score: 96, 85% approval, 0.8% delinquency
2. TechCorp Solutions \u2014 Score: 94, $285K volume, 78% approval
3. IT Solutions Hub \u2014 Score: 92, 81% approval, 1.5% delinquency

**Alerts:**
- \u26a0\ufe0f BuildMaster Inc delinquency up 45% (1.5% \u2192 2.8%)
- \u26a0\ufe0f Medical Equipment residual value 8% below forecast
- \u2139\ufe0f AI detected unusual repayment pattern in Segment B

Would you like to explore any specific area \u2014 risk analysis, vendor details, cash flow, or application pipeline?`;
  }

  // Flow 7: Risk / Delinquency / Default queries
  if (
    lowerMessage.includes('risk') ||
    lowerMessage.includes('delinquen') ||
    lowerMessage.includes('default') ||
    (lowerMessage.includes('credit') && (lowerMessage.includes('portfolio') || lowerMessage.includes('customer')))
  ) {
    return `Here's your risk and delinquency analysis:

**Default & Delinquency:**
- Overall Default Rate: **1.8%**
- Overall Delinquency Rate: **2.3%**

**Delinquency by Bucket:**
- 0-30 days past due: 2.1%
- 31-60 days past due: 1.2%
- 60+ days past due: 0.8%

**Credit Risk Distribution:**
- Lower Risk (\u2193): 124 customers (67.4%)
- Stable (\u2192): 48 customers (26.1%)
- Higher Risk (\u2191): 12 customers (6.5%)

**Vintage Analysis (Cumulative Loss %):**
| Month | 2023 Vintage | 2024 Vintage |
|-------|-------------|-------------|
| Jan | 2.1% | 1.8% |
| Mar | 2.8% | 2.1% |
| Jun | 3.8% | 2.7% |

2024 vintage is performing better with lower loss rates across all months.

**Vendor Risk Flags:**
- \u26a0\ufe0f BuildMaster Inc: Delinquency spiked to 2.8% (+45%)
- \u26a0\ufe0f Manufacturing Plus: Highest delinquency at 2.8%, lowest approval at 69%

Would you like to look at a specific vendor's risk profile, payment patterns, or residual value tracking?`;
  }

  // Flow 8: Vendor / Vendor performance
  if (
    (lowerMessage.includes('vendor') || lowerMessage.includes('vendor') || lowerMessage.includes('supplier')) &&
    (lowerMessage.includes('performance') || lowerMessage.includes('top') || lowerMessage.includes('best') || lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('how'))
  ) {
    return `Here's your vendor performance breakdown:

**Top 5 Vendors by Volume:**

| Vendor | Volume | Approval | Delinquency | Score |
|--------|--------|----------|-------------|-------|
| TechCorp Solutions | $285K | 78% | 1.2% | 94 |
| MedEquip Pro | $218K | 85% | 0.8% | 96 |
| BuildMaster Inc | $195K | 72% | 2.8% | 89 |
| IT Solutions Hub | $168K | 81% | 1.5% | 92 |
| Manufacturing Plus | $142K | 69% | 2.8% | 85 |

**Summary:**
- **26 active vendors** across 9 equipment categories
- **Best performer**: MedEquip Pro (highest score 96, lowest delinquency 0.8%)
- **Watch list**: BuildMaster Inc (delinquency up 45%) and Manufacturing Plus (lowest approval rate)

**Asset Distribution:**
- Leased Units: 184/250 (73.6%)
- Idle Units: 28/250 (11.2%)
- Refurbishing: 18/250 (7.2%)
- Resold: 20/250 (8%)

Would you like to deep-dive into a specific vendor, compare two vendors, or review the asset lifecycle?`;
  }

  // Flow 9: Cash flow / collections
  if (
    lowerMessage.includes('cash flow') ||
    lowerMessage.includes('cashflow') ||
    lowerMessage.includes('collection') ||
    (lowerMessage.includes('money') && (lowerMessage.includes('coming') || lowerMessage.includes('flow')))
  ) {
    return `Here's your cash flow analysis:

**Current Month:**
- Scheduled Collections: $125,000
- Actual Collections: $128,000
- **Collection Rate: 102.4%** (exceeding target)

**6-Month Cash Flow Trend (in $K):**
| Month | Scheduled | Actual | Rate |
|-------|-----------|--------|------|
| Jan | $98K | $102K | 104.1% |
| Feb | $105K | $98K | 93.3% |
| Mar | $112K | $115K | 102.7% |
| Apr | $108K | $110K | 101.9% |
| May | $120K | $118K | 98.3% |
| Jun | $125K | $128K | 102.4% |

**Key Insights:**
- Average collection rate: **100.4%** \u2014 slightly above scheduled
- February was the only underperforming month (93.3%)
- Strong upward trend from May to June
- Total 6-month collections: $671K actual vs $668K scheduled

Would you like to see payment details, overdue collections, or project future cash flow?`;
  }

  // Flow 10: Applications / Pipeline
  if (
    (lowerMessage.includes('application') || lowerMessage.includes('pipeline') || lowerMessage.includes('funnel')) &&
    (lowerMessage.includes('how many') || lowerMessage.includes('status') || lowerMessage.includes('show') || lowerMessage.includes('what') || lowerMessage.includes('my') || lowerMessage.includes('our'))
  ) {
    return `Here's your application pipeline:

**Underwriting Funnel:**
- **Applications Received**: 450
- **Pre-Approved**: 315 (70% conversion)
- **Approved**: 252 (56% of total, 80% of pre-approved)
- **Funded**: 184 (41% of total, 73% of approved)

**By Product Type:**
| Product | Contracts | Volume |
|---------|-----------|--------|
| Equipment Financing | 142 | $892K |
| Equipment Leasing | 28 | $218K |
| Working Capital | 14 | $140K |

**Documentation Status:**
- Active Agreements: 184
- Funded Contracts: 184
- Vendor KYCs: 26
- Data Quality: 98.2%

**Residual Value Tracking:**
- M12: 85% actual vs 82% expected (+3%)
- M24: 68% actual vs 62% expected (+6%)
- M36: 52% actual vs 48% expected (+4%)
- Assets are holding value better than forecast across all periods.

Would you like details on specific applications, approval rates by vendor, or document verification status?`;
  }

  // No predefined response found
  return null;
};
