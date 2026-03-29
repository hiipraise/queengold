"use client";

import Link from "next/link";
import { useCart } from "@/components/store/cart-context";
import { useWishlist } from "@/components/store/wishlist-context";
import { formatCurrency } from "@/lib/currency";

export interface ProductCardData {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const price = product.discountPrice ?? product.price;

  return (
    <article className="card-luxury p-4 group transition-transform hover:-translate-y-1">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-black/30 border border-[var(--border-gold)] mb-3 overflow-hidden">
          <img src={product.images[0] || "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200&auto=format&fit=crop"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      </Link>
      <h3 className="font-serif text-lg">{product.name}</h3>
      <p className="text-sm opacity-70">{formatCurrency(price)}</p>
      <div className="mt-3 flex gap-2">
        <button className="btn-gold h-10 px-4 text-xs" disabled={product.stock < 1} onClick={() => addItem(product._id)}>Add to Cart</button>
        <button className="border border-[var(--border-gold)] px-3 text-xs" onClick={() => toggle(product._id)}>{has(product._id) ? "Saved" : "Wishlist"}</button>
      </div>
    </article>
  );
}
