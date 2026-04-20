import { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export function addItem(cart: CartItem[], product: Product): CartItem[] {
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  return [...cart, { product, quantity: 1 }];
}

export function removeItem(cart: CartItem[], productId: number): CartItem[] {
  return cart.filter((item) => item.product.id !== productId);
}

export function updateItemQuantity(
  cart: CartItem[],
  productId: number,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeItem(cart, productId);
  }
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
}

export function getTotalItems(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getTotalPrice(cart: CartItem[]): number {
  return cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
