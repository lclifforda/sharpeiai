import type { OfferEngineResidual, OfferEngineResult } from './types';

const roundCurrency = (n: number) => Math.round(n);

export function simulateResiduals(
  items: { name: string; price: number }[], 
  termMonths: number = 24
): OfferEngineResult {
  const residuals = items.map((it) => {
    const nameLower = it.name.toLowerCase();
    let pct = 0.1;
    if (nameLower.includes('bike')) pct = 0.15;
    if (nameLower.includes('macbook') || nameLower.includes('laptop')) pct = 0.2;
    if (nameLower.includes('robot')) pct = 0.12;
    const value = roundCurrency((it.price || 0) * pct);
    return {
      name: it.name,
      price: it.price || 0,
      residualPct: pct,
      residualValue: value,
    };
  });

  const combinedResidual = residuals.reduce((s, r) => s + r.residualValue, 0);

  let parts: string[] = residuals.map((r) => {
    const label = r.name.toLowerCase().includes('macbook') ? 'MacBook' : 
                  r.name.toLowerCase().includes('bike') ? 'E‑Bike' : 
                  r.name.toLowerCase().includes('robot') ? 'Robot' : r.name;
    return `${label} ~${Math.round(r.residualPct * 100)}% (~$${r.residualValue.toLocaleString()})`;
  });
  if (parts.length > 2) parts = parts.slice(0, 2);
  const summaryText = `After ${termMonths} months, ${parts.join(' and ')}.`;

  return { termMonths, residuals, combinedResidual, summaryText };
}
