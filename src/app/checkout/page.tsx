"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { applyDiscount, DiscountResult } from "../lib/discount";
import { validateCheckoutForm, ValidationErrors } from "../lib/validation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState<DiscountResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCheckoutForm(formData);
    setErrors(result.errors);
    if (!result.valid) return;
    clearCart();
    router.push("/checkout/confirmation");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleApplyDiscount = () => {
    const result = applyDiscount(totalPrice, discountCode);
    setDiscount(result);
  };

  const finalTotal = discount?.valid ? discount.total : totalPrice;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Payment Details
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label
                  htmlFor="cardNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${errors.cardNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                  placeholder="4242 4242 4242 4242"
                />
                {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Place Order
            </button>
          </div>
        </form>
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Summary
            </h2>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                {discount?.valid && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">
                      Discount ({discount.code})
                    </span>
                    <span className="font-medium text-green-600">
                      -${discount.discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Discount Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter code"
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Apply
                </button>
              </div>
              {discount && !discount.valid && (
                <p className="mt-1 text-sm text-red-600">{discount.error}</p>
              )}
              {discount?.valid && (
                <p className="mt-1 text-sm text-green-600">
                  {Math.round(discount.percentage * 100)}% discount applied!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
