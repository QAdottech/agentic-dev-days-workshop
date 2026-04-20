"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../data/products";
import {
  CartItem,
  addItem,
  removeItem,
  updateItemQuantity,
  getTotalItems,
  getTotalPrice,
} from "../lib/cart";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems((prev) => addItem(prev, product));
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => removeItem(prev, productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems((prev) => updateItemQuantity(prev, productId, quantity));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems: getTotalItems(items),
        totalPrice: getTotalPrice(items),
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
