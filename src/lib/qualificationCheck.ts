import type { PlatformConfiguration } from "@/services/platformConfigMockData";
import { DEFAULT_PLATFORM_CONFIG } from "@/services/platformConfigMockData";

export interface QualificationResult {
  qualified: boolean;
  reason?: string;
  internalReason?: string;
}

export function checkQualification(
  data: {
    yearsInBusiness?: number;
    dateEstablished?: string;
    annualRevenue?: number;
    requestedAmount?: number;
    equipmentCost?: number;
  },
  config?: PlatformConfiguration
): QualificationResult {
  const cfg = config ?? DEFAULT_PLATFORM_CONFIG;
  const { lendingRangeMin, lendingRangeMax, minTimeInBusiness, minTimeInBusinessUnit } = cfg.profile;

  // Check time in business when lender has a minimum configured
  if (minTimeInBusiness != null && minTimeInBusiness > 0) {
    const minMonths = minTimeInBusinessUnit === 'years' ? minTimeInBusiness * 12 : minTimeInBusiness;
    let monthsInBusiness: number | undefined;
    if (data.yearsInBusiness !== undefined) {
      monthsInBusiness = data.yearsInBusiness * 12;
    } else if (data.dateEstablished) {
      const raw = data.dateEstablished;
      const dateStr = /^\d{4}-\d{2}$/.test(raw) ? `${raw}-01` : raw;
      const established = new Date(dateStr);
      if (!isNaN(established.getTime())) {
        const now = new Date();
        monthsInBusiness = (now.getTime() - established.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
      }
    }
    if (monthsInBusiness !== undefined && monthsInBusiness < minMonths) {
      const minLabel = minTimeInBusinessUnit === 'years'
        ? `${minTimeInBusiness} ${minTimeInBusiness === 1 ? 'year' : 'years'}`
        : `${minTimeInBusiness} ${minTimeInBusiness === 1 ? 'month' : 'months'}`;
      return {
        qualified: false,
        reason:
          `We currently work with businesses that have been operating for at least ${minLabel}. A member of our team will reach out to discuss alternative options.`,
        internalReason: `Time in business (${monthsInBusiness.toFixed(0)} months) below minimum threshold of ${minMonths} months`,
      };
    }
  }

  // Check annual revenue
  if (data.annualRevenue !== undefined && data.annualRevenue < 50000) {
    return {
      qualified: false,
      reason:
        "Our programs are designed for businesses with at least $50,000 in annual revenue. A team member will contact you to explore options.",
      internalReason: `Annual revenue ($${data.annualRevenue.toLocaleString()}) below minimum threshold of $50,000`,
    };
  }

  // Check requested amount against lending range
  const amount = data.requestedAmount ?? data.equipmentCost;
  if (amount !== undefined && (amount < lendingRangeMin || amount > lendingRangeMax)) {
    return {
      qualified: false,
      reason: `The requested amount falls outside our current lending range ($${lendingRangeMin.toLocaleString()} - $${lendingRangeMax.toLocaleString()}). A specialist will reach out to discuss alternatives.`,
      internalReason: `Amount ($${amount.toLocaleString()}) outside lending range $${lendingRangeMin.toLocaleString()}-$${lendingRangeMax.toLocaleString()}`,
    };
  }

  return { qualified: true };
}
