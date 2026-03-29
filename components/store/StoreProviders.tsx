"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/store/cart-context";
import { WishlistProvider } from "@/components/store/wishlist-context";

export default function StoreProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </SessionProvider>
  );
}
