"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

export interface CartItem {
  _id: string;
  product: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  thumbnailImage: string;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  couponCode?: string;
  couponDiscount: number;
  total: number;
  isLoading: boolean;
  isOpen: boolean;
}

interface CartActions {
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<(CartState & CartActions) | null>(null);

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("qg_session");
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem("qg_session", sid);
  }
  return sid;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hasFetched = useRef(false);

  const refreshCart = useCallback(async () => {
    try {
      const sid = getSessionId();
      const res = await fetch(`/api/cart?sessionId=${sid}`);
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.cart?.items ?? []);
      setCouponCode(data.cart?.couponCode ?? undefined);
      setCouponDiscount(data.cart?.couponDiscount ?? 0);
    } catch {
      // silent — cart not critical on failure
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      refreshCart();
    }
  }, [refreshCart]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - couponDiscount);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      const sid = getSessionId();
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, productId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.cart?.items ?? []);
        setIsOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    setIsLoading(true);
    try {
      const sid = getSessionId();
      const res = await fetch(`/api/cart/${itemId}?sessionId=${sid}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.cart?.items ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return removeItem(itemId);
    setIsLoading(true);
    try {
      const sid = getSessionId();
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.cart?.items ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, [removeItem]);

  const clearCart = useCallback(async () => {
    const sid = getSessionId();
    await fetch(`/api/cart?sessionId=${sid}`, { method: "DELETE" });
    setItems([]);
    setCouponCode(undefined);
    setCouponDiscount(0);
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    const sid = getSessionId();
    const res = await fetch("/api/cart/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid, code, subtotal }),
    });
    const data = await res.json();
    if (res.ok && data.discount) {
      setCouponCode(code.toUpperCase());
      setCouponDiscount(data.discount);
      return { success: true, message: data.message ?? "Coupon applied." };
    }
    return { success: false, message: data.error ?? "Invalid coupon." };
  }, [subtotal]);

  const removeCoupon = useCallback(async () => {
    setCouponCode(undefined);
    setCouponDiscount(0);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        couponCode,
        couponDiscount,
        total,
        isLoading,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}