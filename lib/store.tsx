"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface CartItem { slug: string; quantity: number }
interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  customerEmail: string;
  hydrated: boolean;
  setCustomerEmail: (value: string) => void;
  toggleCart: (value?: boolean) => void;
  addToCart: (slug: string, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  toggleWishlist: (slug: string) => void;
  cartCount: number;
  syncState: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);
const EMAIL_KEY = "qg-customer-email";
const DEFAULT_EMAIL = process.env.NEXT_PUBLIC_DEFAULT_CUSTOMER_EMAIL || "guest@queengold.local";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerEmail, setCustomerEmailState] = useState(DEFAULT_EMAIL);
  const [hydrated, setHydrated] = useState(false);

  async function syncState(email = customerEmail) {
    const headers = { "x-customer-email": email };
    const [cartRes, wishlistRes] = await Promise.all([
      fetch("/api/cart", { headers, cache: "no-store" }),
      fetch("/api/wishlist", { headers, cache: "no-store" }),
    ]);
    if (cartRes.ok) {
      const data = await cartRes.json();
      setCart(data.items ?? []);
    }
    if (wishlistRes.ok) {
      const data = await wishlistRes.json();
      setWishlist(data.productSlugs ?? []);
    }
  }

  useEffect(() => {
    const storedEmail = window.localStorage.getItem(EMAIL_KEY) || DEFAULT_EMAIL;
    setCustomerEmailState(storedEmail);
    syncState(storedEmail).finally(() => setHydrated(true));
  }, []);

  const persistCart = async (nextCart: CartItem[], email = customerEmail) => {
    setCart(nextCart);
    if (!hydrated) return;
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, items: nextCart }),
    });
  };

  const persistWishlist = async (nextWishlist: string[], email = customerEmail) => {
    setWishlist(nextWishlist);
    if (!hydrated) return;
    await fetch("/api/wishlist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, productSlugs: nextWishlist }),
    });
  };

  const setCustomerEmail = (value: string) => {
    const email = value.trim().toLowerCase() || DEFAULT_EMAIL;
    window.localStorage.setItem(EMAIL_KEY, email);
    setCustomerEmailState(email);
    syncState(email);
  };

  const value = useMemo<StoreContextValue>(() => ({
    cart,
    wishlist,
    cartOpen,
    customerEmail,
    hydrated,
    setCustomerEmail,
    toggleCart: (value) => setCartOpen((current) => value ?? !current),
    addToCart: (slug, quantity = 1) => {
      const existing = cart.find((item) => item.slug === slug);
      const nextCart = existing
        ? cart.map((item) => item.slug === slug ? { ...item, quantity: item.quantity + quantity } : item)
        : [...cart, { slug, quantity }];
      void persistCart(nextCart);
    },
    updateQuantity: (slug, quantity) => {
      const nextCart = cart.flatMap((item) => item.slug !== slug ? [item] : quantity > 0 ? [{ ...item, quantity }] : []);
      void persistCart(nextCart);
    },
    removeFromCart: (slug) => {
      void persistCart(cart.filter((item) => item.slug !== slug));
    },
    toggleWishlist: (slug) => {
      const nextWishlist = wishlist.includes(slug)
        ? wishlist.filter((item) => item !== slug)
        : [...wishlist, slug];
      void persistWishlist(nextWishlist);
    },
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
    syncState: async () => { await syncState(); },
  }), [cart, wishlist, cartOpen, customerEmail, hydrated]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
