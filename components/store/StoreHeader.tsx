"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/components/store/cart-context";
import { CartDrawer } from "@/components/store/CartDrawer";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/verify", label: "Verify" },
  { href: "/account", label: "Account" },
];

export default function StoreHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur bg-[#1a0509]/80 border-b border-[var(--border-gold)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-[0.2em] text-gold-gradient">QUEEN GOLD</Link>
          <nav className="hidden md:flex gap-6 text-sm tracking-widest uppercase">
            {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/account" aria-label="Wishlist"><Heart size={18} /></Link>
            <button onClick={() => setOpen(true)} className="relative" aria-label="Open cart">
              <ShoppingBag size={18} />
              {count > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--gold)] text-black text-[10px] flex items-center justify-center">{count}</span>}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={open} setOpen={setOpen} />
    </>
  );
}
