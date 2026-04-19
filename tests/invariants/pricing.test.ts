// Pricing Invariants
//
// These are NOT feature tests. They are PROPERTY tests.
// They verify things that must ALWAYS be true, regardless of
// what features are added or changed.
//
// Workshop participants will add more invariants here.

import { describe, it, expect } from "vitest";
import { products } from "@/app/data/products";

// Helper: calculate cart total (same logic as CartContext)
function calculateTotal(
  items: { productId: number; quantity: number }[]
): number {
  return items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  }, 0);
}

describe("Pricing Invariants", () => {
  it("total is never negative", () => {
    // Test with various cart states
    const cases = [
      [],
      [{ productId: 1, quantity: 1 }],
      [{ productId: 1, quantity: 0 }],
      [
        { productId: 1, quantity: 3 },
        { productId: 2, quantity: 2 },
        { productId: 3, quantity: 1 },
      ],
    ];

    for (const cart of cases) {
      expect(calculateTotal(cart)).toBeGreaterThanOrEqual(0);
    }
  });

  it("total equals sum of (price × quantity) for every item", () => {
    const cart = [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 1 },
      { productId: 5, quantity: 3 },
    ];

    const total = calculateTotal(cart);
    const manualTotal = cart.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    expect(total).toBeCloseTo(manualTotal);
  });

  it("empty cart has zero total", () => {
    expect(calculateTotal([])).toBe(0);
  });

  // TODO: When discount codes are added, add these invariants:
  //
  // it("total with discount is never negative", () => { ... })
  //
  // it("total with discount equals subtotal minus discount amount", () => { ... })
  //
  // it("discount never exceeds subtotal", () => { ... })
});
