import { describe, it, expect } from "vitest";
import { products } from "@/app/data/products";
import {
  CartItem,
  addItem,
  removeItem,
  updateItemQuantity,
  getTotalItems,
  getTotalPrice,
  formatPrice,
} from "@/app/lib/cart";

const gatsby = products[0]; // The Great Gatsby, $12.99
const nineteen84 = products[1]; // 1984, $11.99
const mockingbird = products[2]; // To Kill a Mockingbird, $13.99

describe("addItem", () => {
  it("adds a product to an empty cart", () => {
    const cart = addItem([], gatsby);
    expect(cart).toHaveLength(1);
    expect(cart[0].product.id).toBe(gatsby.id);
    expect(cart[0].quantity).toBe(1);
  });

  it("increments quantity when adding a product already in the cart", () => {
    let cart = addItem([], gatsby);
    cart = addItem(cart, gatsby);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it("adds different products as separate items", () => {
    let cart = addItem([], gatsby);
    cart = addItem(cart, nineteen84);
    expect(cart).toHaveLength(2);
  });
});

describe("removeItem", () => {
  it("removes an item from the cart", () => {
    let cart = addItem([], gatsby);
    cart = addItem(cart, nineteen84);
    cart = removeItem(cart, gatsby.id);
    expect(cart).toHaveLength(1);
    expect(cart[0].product.id).toBe(nineteen84.id);
  });

  it("returns empty cart when removing the last item", () => {
    let cart = addItem([], gatsby);
    cart = removeItem(cart, gatsby.id);
    expect(cart).toHaveLength(0);
  });

  it("does nothing when removing a product not in the cart", () => {
    const cart = addItem([], gatsby);
    const result = removeItem(cart, 999);
    expect(result).toHaveLength(1);
  });
});

describe("updateItemQuantity", () => {
  it("updates the quantity of an item", () => {
    const cart = addItem([], gatsby);
    const result = updateItemQuantity(cart, gatsby.id, 5);
    expect(result[0].quantity).toBe(5);
  });

  it("removes the item when quantity is set to 0", () => {
    const cart = addItem([], gatsby);
    const result = updateItemQuantity(cart, gatsby.id, 0);
    expect(result).toHaveLength(0);
  });

  it("removes the item when quantity is negative", () => {
    const cart = addItem([], gatsby);
    const result = updateItemQuantity(cart, gatsby.id, -1);
    expect(result).toHaveLength(0);
  });
});

describe("getTotalItems", () => {
  it("returns 0 for empty cart", () => {
    expect(getTotalItems([])).toBe(0);
  });

  it("sums quantities across all items", () => {
    let cart = addItem([], gatsby);
    cart = addItem(cart, gatsby); // qty 2
    cart = addItem(cart, nineteen84); // qty 1
    expect(getTotalItems(cart)).toBe(3);
  });
});

describe("getTotalPrice", () => {
  it("returns 0 for empty cart", () => {
    expect(getTotalPrice([])).toBe(0);
  });

  it("calculates total for a single item", () => {
    const cart = addItem([], gatsby);
    expect(getTotalPrice(cart)).toBeCloseTo(12.99);
  });

  it("calculates total for multiple items with quantities", () => {
    const cart: CartItem[] = [
      { product: gatsby, quantity: 2 },
      { product: nineteen84, quantity: 1 },
    ];
    // 12.99 * 2 + 11.99 * 1 = 37.97
    expect(getTotalPrice(cart)).toBeCloseTo(37.97);
  });
});

describe("formatPrice", () => {
  it("formats with dollar sign and two decimals", () => {
    expect(formatPrice(12.99)).toBe("$12.99");
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(100)).toBe("$100.00");
  });
});
