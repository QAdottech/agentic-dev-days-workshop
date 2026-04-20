"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import CartItemComponent from "../components/CartItem";

export default function CartPage() {
  const { items, totalPrice } = useCart();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartItemComponent key={item.product.id} item={item} />
        ))}
      </div>
      {items.length > 0 && (
        <div className="mt-8 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
          <Link
            href="/checkout"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Proceed to checkout
          </Link>
        </div>
      )}
    </div>
  );
}
