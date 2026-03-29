"use client";

import { useState } from "react";
import { useCart } from "@/components/store/cart-context";
import { useWishlist } from "@/components/store/wishlist-context";
import { formatCurrency } from "@/lib/currency";

export default function ProductDetailClient({ product }: { product: any }) {
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "specs" | "warranty">("description");
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const price = product.discountPrice ?? product.price;

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div>
        <div className="aspect-square border border-[var(--border-gold)] overflow-hidden">
          <img src={product.images[active] || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop"} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {product.images.map((img: string, idx: number) => (
            <button key={img + idx} className={`w-16 h-16 border ${active === idx ? "border-[var(--gold)]" : "border-[var(--border-gold)]"}`} onClick={() => setActive(idx)}><img src={img} alt="" className="w-full h-full object-cover" /></button>
          ))}
        </div>
      </div>
      <div className="card-luxury p-6">
        <p className="text-xs tracking-[0.2em] uppercase opacity-60">Digital Passport Ready</p>
        <h1 className="font-serif text-4xl mt-2">{product.name}</h1>
        <p className="text-2xl text-gold-gradient mt-4">{formatCurrency(price)}</p>
        <p className="text-sm mt-2">Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
        <p className="text-sm mt-2">Movement: {product.movementDetails}</p>
        <p className="text-sm">Material: {product.materialDetails}</p>
        <div className="flex items-center gap-3 mt-6">
          <input type="number" min={1} max={product.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="input-luxury h-10 w-24 px-2" />
          <button className="btn-gold h-10 px-5 text-xs" onClick={() => addItem(product._id, qty)} disabled={product.stock < 1}>Add to Cart</button>
          <button className="border border-[var(--border-gold)] h-10 px-4 text-xs" onClick={() => addItem(product._id, qty)}>Buy Now</button>
          <button className="border border-[var(--border-gold)] h-10 px-4 text-xs" onClick={() => toggle(product._id)}>{has(product._id) ? "Wishlisted" : "Wishlist"}</button>
        </div>

        <div className="mt-8">
          <div className="flex gap-2 mb-4 text-xs uppercase tracking-widest">
            {(["description", "specs", "warranty"] as const).map((key) => <button key={key} onClick={() => setTab(key)} className={`px-3 py-2 border ${tab === key ? "border-[var(--gold)]" : "border-[var(--border-gold)]"}`}>{key}</button>)}
          </div>
          {tab === "description" && <p className="opacity-80">{product.description}</p>}
          {tab === "specs" && <ul className="space-y-2 text-sm">{Object.entries(product.specs || {}).map(([k, v]) => <li key={k}><span className="opacity-60">{k}</span>: {String(v)}</li>)}</ul>}
          {tab === "warranty" && <p>{product.warrantyInfo}</p>}
        </div>
      </div>
    </section>
  );
}
