/**
 * Integer Paise Money Utilities
 * 
 * Strict rule: All internal calculations, DB fields, and payloads use integer paise.
 * 1 INR = 100 paise.
 */

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function formatPaiseToINR(paise: number, includeDecimals = false): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

export function formatCompactINR(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 10000000) {
    return `₹${(rupees / 10000000).toFixed(2)} Cr`;
  }
  if (rupees >= 100000) {
    return `₹${(rupees / 100000).toFixed(1)} L`;
  }
  if (rupees >= 1000) {
    return `₹${(rupees / 1000).toFixed(1)} K`;
  }
  return formatPaiseToINR(paise);
}

export function calculateDiscountPaise(baseAmountPaise: number, discountPercentage: number): number {
  const clampedPercentage = Math.max(0, Math.min(100, discountPercentage));
  return Math.round((baseAmountPaise * clampedPercentage) / 100);
}

export function applyDiscount(baseAmountPaise: number, discountPercentage: number): {
  discountPaise: number;
  finalAmountPaise: number;
} {
  const discountPaise = calculateDiscountPaise(baseAmountPaise, discountPercentage);
  const finalAmountPaise = Math.max(0, baseAmountPaise - discountPaise);
  return { discountPaise, finalAmountPaise };
}
