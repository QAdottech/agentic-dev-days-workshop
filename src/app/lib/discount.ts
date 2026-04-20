export interface DiscountResult {
  valid: boolean;
  code: string;
  percentage: number;
  discountAmount: number;
  total: number;
  error?: string;
}

const DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.1,
  HALF: 0.5,
};

export function applyDiscount(subtotal: number, code: string): DiscountResult {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      valid: false,
      code: normalizedCode,
      percentage: 0,
      discountAmount: 0,
      total: subtotal,
      error: "Please enter a discount code",
    };
  }

  const percentage = DISCOUNT_CODES[normalizedCode];

  if (percentage === undefined) {
    return {
      valid: false,
      code: normalizedCode,
      percentage: 0,
      discountAmount: 0,
      total: subtotal,
      error: `Invalid discount code: ${normalizedCode}`,
    };
  }

  const discountAmount = Math.round(subtotal * percentage * 100) / 100;
  const total = Math.round((subtotal - discountAmount) * 100) / 100;

  return {
    valid: true,
    code: normalizedCode,
    percentage,
    discountAmount,
    total: Math.max(0, total),
  };
}

export function getAvailableCodes(): string[] {
  return Object.keys(DISCOUNT_CODES);
}
