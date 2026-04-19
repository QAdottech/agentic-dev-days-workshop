"use client";

import { products } from "./data/products";
import ProductCard from "./components/ProductCard";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Books</h1>
        <p className="mt-2 text-gray-600">
          Discover your next favorite read from our curated collection.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
