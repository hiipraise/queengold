"use client";
import Link from "next/link";
import { products } from "@/lib/site-data";
import { useStore } from "@/lib/store";
import { discountedPrice, formatCurrency } from "@/lib/shop-utils";

export default function WishlistPage() {
  const { wishlist, addToCart } = useStore();
  const items = products.filter((product) => wishlist.includes(product.slug));
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><p className="text-xs uppercase tracking-[0.35em] text-[var(--gold-muted)]">Wishlist</p><h1 className="font-serif text-5xl">Saved collector interests.</h1><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.length === 0 ? <div className="card-luxury p-8 text-sm text-[var(--text-muted)]">No saved references yet. Browse the shop and add pieces to your shortlist.</div> : items.map((product) => <div key={product.slug} className="card-luxury overflow-hidden"><Link href={`/product/${product.slug}`} className="block h-80 bg-cover bg-center" style={{ backgroundImage: `url(${product.images[0]})` }} /><div className="p-5"><p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-muted)]">{product.collection}</p><h2 className="mt-2 font-serif text-2xl">{product.name}</h2><p className="mt-3 text-sm text-[var(--text-muted)]">{product.description}</p><div className="mt-4 flex items-center justify-between"><p className="font-serif text-2xl">{formatCurrency(discountedPrice(product.price, product.discountPercentage))}</p><button onClick={() => addToCart(product.slug)} className="btn-gold rounded-full px-4 py-2 text-xs">Add to cart</button></div></div></div>)}</div></main>;
}
