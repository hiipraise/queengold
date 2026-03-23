"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { discountedPrice, formatCurrency } from "@/lib/shop-utils";
import { useStore } from "@/lib/store";
import { getCloudinaryImage } from "@/lib/cloudinary";

type Category = { slug: string; name: string };
type Collection = { slug: string; name: string };
type Product = { slug: string; name: string; description: string; category: string; collection: string; sku: string; featured?: boolean; newArrival?: boolean; stock: number; price: number; discountPercentage?: number; images: string[] };

export default function ShopClient({ products, categories, collections, heading, description }: { products: Product[]; categories: Category[]; collections: Collection[]; heading: string; description: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [collection, setCollection] = useState("all");
  const [sort, setSort] = useState("featured");
  const { addToCart, toggleWishlist } = useStore();
  const filtered = useMemo(() => {
    const base = products.filter((product) => {
      const search = [product.name, product.description, product.collection, product.category, product.sku].join(" ").toLowerCase();
      return search.includes(query.toLowerCase()) && (category === "all" || product.category === category) && (collection === "all" || product.collection === collection);
    });
    return base.sort((a, b) => {
      if (sort === "price-asc") return discountedPrice(a.price, a.discountPercentage) - discountedPrice(b.price, b.discountPercentage);
      if (sort === "price-desc") return discountedPrice(b.price, b.discountPercentage) - discountedPrice(a.price, a.discountPercentage);
      if (sort === "latest") return Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival));
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [products, query, category, collection, sort]);
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-8 grid gap-6 lg:grid-cols-[280px_1fr]"><aside className="card-luxury h-fit space-y-5 p-5"><div><p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-muted)]">Search</p><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search watches, SKU, collection" className="input-luxury mt-3 h-12 w-full rounded-full px-4" /></div><Filter title="Category"><select value={category} onChange={(e) => setCategory(e.target.value)} className="input-luxury h-11 w-full rounded-full px-3"><option value="all">All categories</option>{categories.map((entry) => <option key={entry.slug} value={entry.name}>{entry.name}</option>)}</select></Filter><Filter title="Collection"><select value={collection} onChange={(e) => setCollection(e.target.value)} className="input-luxury h-11 w-full rounded-full px-3"><option value="all">All collections</option>{collections.map((entry) => <option key={entry.slug} value={entry.name}>{entry.name}</option>)}</select></Filter><Filter title="Sort"><select value={sort} onChange={(e) => setSort(e.target.value)} className="input-luxury h-11 w-full rounded-full px-3"><option value="featured">Featured</option><option value="latest">Newest</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option></select></Filter></aside><section><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.35em] text-[var(--gold-muted)]">Catalog</p><h1 className="font-serif text-5xl">{heading}</h1><p className="mt-3 max-w-2xl text-sm text-[var(--text-muted)]">{description}</p></div><p className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">{filtered.length} references</p></div>{filtered.length === 0 ? <div className="card-luxury p-8 text-sm text-[var(--text-muted)]">No references match your search right now.</div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => <motion.article key={product.slug} whileHover={{ y: -4 }} className="card-luxury overflow-hidden"><Link href={`/product/${product.slug}`} className="block h-80 bg-cover bg-center" style={{ backgroundImage: `url(${getCloudinaryImage(product.images[0], { width: 800, height: 960 })})` }} /><div className="space-y-3 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.28em] text-[var(--gold-muted)]">{product.collection}</p><h2 className="font-serif text-2xl">{product.name}</h2></div><span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-light)]">{product.stock > 0 ? 'In Stock' : 'Waitlist'}</span></div><p className="text-sm text-[var(--text-muted)]">{product.description}</p><div className="flex items-end justify-between"><div><p className="font-serif text-2xl">{formatCurrency(discountedPrice(product.price, product.discountPercentage))}</p>{product.discountPercentage ? <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-muted)]">{product.discountPercentage}% private offer</p> : null}</div><div className="flex gap-2"><button onClick={() => toggleWishlist(product.slug)} className="rounded-full border border-[var(--border-gold)] px-4 py-2 text-xs uppercase tracking-[0.2em]">Wishlist</button><button onClick={() => addToCart(product.slug)} className="btn-gold rounded-full px-4 py-2 text-xs">Add</button></div></div></div></motion.article>)}</div>}</section></div></main>;
}
function Filter({ title, children }: { title: string; children: React.ReactNode }) { return <label className="block"><p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--gold-muted)]">{title}</p>{children}</label>; }
