"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/shop-utils";
import { getCloudinaryImage } from "@/lib/cloudinary";

type Product = { slug: string; name: string; collection: string; discountPercentage?: number; price: number; images: string[] };

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, updateQuantity, removeFromCart } = useStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" }).then((res) => res.json()).then((data) => setProducts(data.products ?? []));
  }, []);

  const cartSubtotal = useMemo(() => cart.reduce((total, item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    const price = product ? product.price * (1 - (product.discountPercentage ?? 0) / 100) : 0;
    return total + price * item.quantity;
  }, 0), [cart, products]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[60]">
          <button className="absolute inset-0 bg-black/60" aria-label="Close cart" onClick={() => toggleCart(false)} />
          <motion.aside initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }} className="absolute right-0 top-0 h-full w-full max-w-md border-l border-[var(--border-gold)] bg-[rgba(23,7,12,0.98)] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-gold-gradient">Your Cart</h2>
              <button onClick={() => toggleCart(false)} className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Close</button>
            </div>
            <div className="space-y-4">
              {cart.length === 0 ? <div className="card-luxury p-6 text-sm text-[var(--text-muted)]">Your cart is empty.</div> : cart.map((item) => {
                const product = products.find((entry) => entry.slug === item.slug);
                if (!product) return null;
                const price = product.price * (1 - (product.discountPercentage ?? 0) / 100);
                return <div key={item.slug} className="card-luxury flex gap-4 p-4">
                  <div className="h-20 w-20 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${getCloudinaryImage(product.images[0], { width: 240, height: 240 })})` }} />
                  <div className="flex-1">
                    <p className="font-serif text-lg text-[var(--gold-light)]">{product.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{product.collection}</p>
                    <p className="mt-2 text-sm">{formatCurrency(price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="h-8 w-8 rounded-full border border-[var(--border-gold)]">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="h-8 w-8 rounded-full border border-[var(--border-gold)]">+</button>
                      <button onClick={() => removeFromCart(item.slug)} className="ml-auto text-xs uppercase tracking-[0.2em] text-rose-200">Remove</button>
                    </div>
                  </div>
                </div>;
              })}
            </div>
            <div className="mt-6 space-y-4 border-t border-[var(--border-gold)] pt-6">
              <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
              <Link href="/checkout" onClick={() => toggleCart(false)} className="btn-gold flex h-12 w-full items-center justify-center rounded-full text-sm">Proceed to Checkout</Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
