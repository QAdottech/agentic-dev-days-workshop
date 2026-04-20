import { describe, it, expect } from "vitest";
import { applyDiscount } from "@/app/lib/discount";

const subtotals = [0, 0.01, 1, 12.99, 49.99, 100, 999.99];
const validCodes = ["SAVE10", "HALF"];
const invalidCodes = ["", "BOGUS", "save10", "FREE100", "SAVE 10"];

describe("DISC-01: Total with discount is never negative", () => {
  it.each(subtotals)("subtotal $%d with SAVE10", (subtotal) => {
    const result = applyDiscount(subtotal, "SAVE10");
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it.each(subtotals)("subtotal $%d with HALF", (subtotal) => {
    const result = applyDiscount(subtotal, "HALF");
    expect(result.total).toBeGreaterThanOrEqual(0);
  });
});

describe("DISC-02: Total with discount equals subtotal minus discount amount", () => {
  for (const code of validCodes) {
    it.each(subtotals)(`subtotal $%d with ${code}`, (subtotal) => {
      const result = applyDiscount(subtotal, code);
      if (result.valid) {
        const expected =
          Math.round((subtotal - result.discountAmount) * 100) / 100;
        expect(result.total).toBeCloseTo(Math.max(0, expected));
      }
    });
  }
});

describe("DISC-03: Discount amount never exceeds subtotal", () => {
  for (const code of validCodes) {
    it.each(subtotals)(`subtotal $%d with ${code}`, (subtotal) => {
      const result = applyDiscount(subtotal, code);
      expect(result.discountAmount).toBeLessThanOrEqual(subtotal);
    });
  }
});

describe("DISC-04: Invalid discount code produces an error, never a wrong total", () => {
  it.each(invalidCodes)("code '%s' returns error and original subtotal", (code) => {
    const subtotal = 49.99;
    const result = applyDiscount(subtotal, code);
    if (!result.valid) {
      expect(result.error).toBeTruthy();
      expect(result.total).toBe(subtotal);
      expect(result.discountAmount).toBe(0);
    }
  });
});

describe("DISC-05: Applying the same code twice has the same effect as once", () => {
  it.each(validCodes)("code %s is idempotent", (code) => {
    const subtotal = 49.99;
    const first = applyDiscount(subtotal, code);
    const second = applyDiscount(subtotal, code);
    expect(first).toEqual(second);
  });
});
