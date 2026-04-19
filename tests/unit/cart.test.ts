// Unit tests for cart logic
// Workshop participants will add more tests here

import { describe, it, expect } from "vitest";
import { products } from "@/app/data/products";

// Helper: simulate cart operations as pure functions
// (mirrors the logic in CartContext but testable without React)
function addItem(
  cart: { productId: number; quantity: number }[],
  productId: number
) {
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    return cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  return [...cart, { productId, quantity: 1 }];
}

function calculateTotal(
  cart: { productId: number; quantity: number }[]
): number {
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product?.price ?? 0) * item.quantity;
    }, 0);
}

describe("Cart", () => {
  it("adds an item to an empty cart", () => {
    const cart = addItem([], 1);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
  });

  it("increments quantity when adding an existing item", () => {
    let cart = addItem([], 1);
    cart = addItem(cart, 1);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it("calculates total correctly for multiple items", () => {
    const cart = [
      { productId: 1, quantity: 2 }, // The Great Gatsby: 12.99 × 2
      { productId: 2, quantity: 1 }, // 1984: 11.99 × 1
    ];
    const total = calculateTotal(cart);
    expect(total).toBeCloseTo(37.97);
  });

  // TODO: Add tests for:
  // - removing items
  // - updating quantity
  // - calculating total with empty cart
});
