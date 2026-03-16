/**
 * Compute monthly payment using standard amortization formula.
 * If apr is 0 or negative, falls back to simple division.
 */
export const computeMonthly = (principal: number, apr: number, months: number): number => {
  if (!apr || apr <= 0) return Math.ceil(principal / months);
  const r = apr / 100 / 12;
  const n = months;
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
};

/**
 * Determine offer rate and lender based on income/credit profile.
 */
export const calculateOfferRate = (
  income?: number,
  creditScore?: number
): { rate: number; lender: string } => {
  if (income && income > 250000) {
    return { rate: 0, lender: 'Premium Elite Lender' };
  }
  if ((creditScore && creditScore >= 750) || (income && income >= 120000)) {
    return { rate: 7.99, lender: 'Preferred Lender' };
  }
  if (creditScore && creditScore < 650) {
    return { rate: 15.99, lender: 'Alt Lender' };
  }
  return { rate: 10.99, lender: 'Standard Lender' };
};
