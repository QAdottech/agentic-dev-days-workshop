export interface Product {
  id: number;
  name: string;
  author: string;
  price: number;
  color: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "1984",
    author: "George Orwell",
    price: 11.99,
    color: "#EF4444",
  },
  {
    id: 3,
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 13.99,
    color: "#10B981",
  },
  {
    id: 4,
    name: "Pride and Prejudice",
    author: "Jane Austen",
    price: 10.99,
    color: "#F59E0B",
  },
  {
    id: 5,
    name: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 11.49,
    color: "#8B5CF6",
  },
  {
    id: 6,
    name: "Brave New World",
    author: "Aldous Huxley",
    price: 12.49,
    color: "#EC4899",
  },
];
