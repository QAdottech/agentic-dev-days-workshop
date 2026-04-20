// Cart Invariants
//
// Properties that must always hold for cart operations,
// regardless of what features are added.
//
// Each test maps to an invariant defined in INVARIANTS.md.

import { describe, it, expect } from "vitest";
import { products } from "@/app/data/products";
import {
  CartItem,
  addItem,
  removeItem,
  updateItemQuantity,
  getTotalItems,
} from "@/app/lib/cart";

describe("CART-01: Adding an existing item increments quantity, never duplicates", () => {
  it("adding the same product 5 times results in 1 item with quantity 5", () => {
    let cart: CartItem[] = [];
    for (let i = 0; i < 5; i++) {
      cart = addItem(cart, products[0]);
    }
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(5);
  });

  it("each product appears at most once in the cart", () => {
    let cart: CartItem[] = [];
    // Add every product 3 times
    for (const product of products) {
      for (let i = 0; i < 3; i++) {
        cart = addItem(cart, product);
      }
    }
    const productIds = cart.map((item) => item.product.id);
    const uniqueIds = new Set(productIds);
    expect(productIds.length).toBe(uniqueIds.size);
  });
});

describe("CART-02: Removing the last item results in an empty cart", () => {
  it("removing the only item leaves an empty cart", () => {
    let cart = addItem([], products[0]);
    cart = removeItem(cart, products[0].id);
    expect(cart).toHaveLength(0);
    expect(getTotalItems(cart)).toBe(0);
  });

  it("setting quantity to 0 removes the item", () => {
    let cart = addItem([], products[0]);
    cart = updateItemQuantity(cart, products[0].id, 0);
    expect(cart).toHaveLength(0);
  });
});

describe("CART-03: Item count equals sum of all quantities", () => {
  it("matches for a multi-item cart", () => {
    const cart: CartItem[] = [
      { product: products[0], quantity: 3 },
      { product: products[1], quantity: 2 },
      { product: products[2], quantity: 5 },
    ];
    const expectedCount = 3 + 2 + 5;
    expect(getTotalItems(cart)).toBe(expectedCount);
  });

  it("is 0 for an empty cart", () => {
    expect(getTotalItems([])).toBe(0);
  });
});

describe("CART-04: Cart operations are deterministic", () => {
  it("same sequence of operations always produces the same result", () => {
    function buildCart() {
      let cart: CartItem[] = [];
      cart = addItem(cart, products[0]);
      cart = addItem(cart, products[1]);
      cart = addItem(cart, products[0]);
      cart = updateItemQuantity(cart, products[1].id, 3);
      cart = removeItem(cart, products[0].id);
      return cart;
    }

    const cart1 = buildCart();
    const cart2 = buildCart();
    expect(cart1).toEqual(cart2);
  });
});
