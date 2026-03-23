"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/lib/site-data";

interface CartItem { slug: string; quantity: number; }
interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  toggleCart: (value?: boolean) => void;
  addToCart: (slug: string, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  toggleWishlist: (slug: string) => void;
  cartCount: number;
  cartSubtotal: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "qg-cart";
const WISHLIST_KEY = "qg-wishlist";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const storedCart = typeof window !== "undefined" ? window.localStorage.getItem(CART_KEY) : null;
    const storedWishlist = typeof window !== "undefined" ? window.localStorage.getItem(WISHLIST_KEY) : null;
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  useEffect(() => { window.localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  const value = useMemo<StoreContextValue>(() => ({
    cart,
    wishlist,
    cartOpen,
    toggleCart: (value) => setCartOpen((current) => value ?? !current),
    addToCart: (slug, quantity = 1) => setCart((current) => {
      const existing = current.find((item) => item.slug === slug);
      if (existing) {
        return current.map((item) => item.slug === slug ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...current, { slug, quantity }];
    }),
    updateQuantity: (slug, quantity) => setCart((current) => current.flatMap((item) => item.slug !== slug ? [item] : quantity > 0 ? [{ ...item, quantity }] : [])),
    removeFromCart: (slug) => setCart((current) => current.filter((item) => item.slug !== slug)),
    toggleWishlist: (slug) => setWishlist((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]),
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
    cartSubtotal: cart.reduce((total, item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      const price = product ? product.price * (1 - (product.discountPercentage ?? 0) / 100) : 0;
      return total + price * item.quantity;
    }, 0),
  }), [cart, wishlist, cartOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
