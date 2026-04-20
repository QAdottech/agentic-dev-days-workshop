"use client";

import { useState } from "react";
import Link from "next/link";

export default function ConfirmationPage() {
  const [orderNumber] = useState(
    () => Math.floor(Math.random() * 900000) + 100000
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-8 w-8 text-green-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Thank you!</h1>
      <p className="mt-2 text-gray-600">
        Your order has been placed successfully.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Order number:{" "}
        <span className="font-semibold text-gray-900">#{orderNumber}</span>
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Continue shopping
      </Link>
    </div>
  );
}
