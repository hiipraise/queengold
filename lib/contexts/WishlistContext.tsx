"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistContextValue {
  productIds: Set<string>;
  isLoading: boolean;
  toggle: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Persist wishlist in localStorage for guest users (syncs to server on login)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("qg_wishlist") ?? "[]") as string[];
      setProductIds(new Set(stored));
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((ids: Set<string>) => {
    try {
      localStorage.setItem("qg_wishlist", JSON.stringify(Array.from(ids)));
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      setProductIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        persist(next);
        return next;
      });

      // Fire-and-forget server sync (no auth required for guest wishlist)
      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }).catch(() => {});
    } finally {
      setIsLoading(false);
    }
  }, [persist]);

  const isWishlisted = useCallback(
    (productId: string) => productIds.has(productId),
    [productIds]
  );

  return (
    <WishlistContext.Provider
      value={{
        productIds,
        isLoading,
        toggle,
        isWishlisted,
        count: productIds.size,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}