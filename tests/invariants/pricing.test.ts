// Pricing Invariants
//
// These are PROPERTY tests, not feature tests.
// They verify things that must ALWAYS be true about pricing,
// regardless of what features are added or changed.
//
// Each test maps to an invariant defined in INVARIANTS.md.

import { describe, it, expect } from "vitest";
import { products } from "@/app/data/products";
import {
  CartItem,
  addItem,
  getTotalPrice,
  formatPrice,
} from "@/app/lib/cart";

// Generate various cart states for property testing
const cartStates: { name: string; cart: CartItem[] }[] = [
  { name: "empty cart", cart: [] },
  { name: "single item qty 1", cart: [{ product: products[0], quantity: 1 }] },
  { name: "single item qty 10", cart: [{ product: products[0], quantity: 10 }] },
  {
    name: "all products qty 1",
    cart: products.map((p) => ({ product: p, quantity: 1 })),
  },
  {
    name: "all products qty 99",
    cart: products.map((p) => ({ product: p, quantity: 99 })),
  },
  {
    name: "mixed quantities",
    cart: [
      { product: products[0], quantity: 3 },
      { product: products[2], quantity: 1 },
      { product: products[4], quantity: 7 },
    ],
  },
];

describe("PRICE-01: Total is never negative", () => {
  it.each(cartStates)("$name", ({ cart }) => {
    expect(getTotalPrice(cart)).toBeGreaterThanOrEqual(0);
  });
});

describe("PRICE-02: Total equals sum of (price × quantity) for all items", () => {
  it.each(cartStates)("$name", ({ cart }) => {
    const total = getTotalPrice(cart);
    const expectedTotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    expect(total).toBeCloseTo(expectedTotal);
  });
});

describe("PRICE-03: Empty cart has zero total", () => {
  it("total is exactly 0", () => {
    expect(getTotalPrice([])).toBe(0);
  });
});

describe("PRICE-04: Adding an item always increases the total", () => {
  it.each(products)("adding $name increases total", (product) => {
    const cart: CartItem[] = [{ product: products[0], quantity: 1 }];
    const totalBefore = getTotalPrice(cart);
    const totalAfter = getTotalPrice(addItem(cart, product));
    expect(totalAfter).toBeGreaterThan(totalBefore);
  });
});

describe("PRICE-05: All product prices are positive", () => {
  it.each(products)("$name has a positive price", (product) => {
    expect(product.price).toBeGreaterThan(0);
  });
});

describe("PRICE-06: Formatted prices always show exactly 2 decimal places", () => {
  const amounts = [0, 1, 12.99, 100, 9.1, 0.5, 999.999];
  it.each(amounts)("formatPrice(%d) has 2 decimal places", (amount) => {
    const formatted = formatPrice(amount);
    expect(formatted).toMatch(/^\$\d+\.\d{2}$/);
  });
});
