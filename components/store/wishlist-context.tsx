"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface WishlistValue {
  ids: string[];
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistValue | null>(null);

const GUEST_KEY = "qg_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user) {
      const raw = window.localStorage.getItem(GUEST_KEY);
      if (raw) setIds(JSON.parse(raw));
      return;
    }
    fetch("/api/wishlist").then((res) => res.json()).then((data) => setIds(data.productIds ?? []));
  }, [session?.user]);

  async function toggle(productId: string) {
    if (!session?.user) {
      const next = ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId];
      setIds(next);
      window.localStorage.setItem(GUEST_KEY, JSON.stringify(next));
      return;
    }

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    setIds(data.productIds ?? []);
  }

  return <WishlistContext.Provider value={{ ids, toggle, has: (productId) => ids.includes(productId) }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
