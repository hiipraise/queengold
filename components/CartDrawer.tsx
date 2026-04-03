"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, } from "@/lib/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    itemCount,
    subtotal,
    couponDiscount,
    total,
    couponCode,
    removeItem,
    updateQuantity,
    isLoading,
  } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.6)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col transition-transform duration-400"
        style={{
          background: "linear-gradient(160deg, #1A0509 0%, #2D0614 100%)",
          borderLeft: "1px solid var(--border-gold)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border-gold)" }}
        >
          <div>
            <h2 className="font-serif text-lg text-gold-gradient">Your Cart</h2>
            <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    style={{ color: "var(--text-primary)" }} />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-20">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 opacity-30">
                <rect x="6" y="18" width="36" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 18v-4a8 8 0 0 1 16 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="font-display text-sm tracking-[0.2em] uppercase mb-2" style={{ color: "var(--gold-muted)" }}>
                Your cart is empty
              </p>
              <p className="font-body text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                Discover our luxury timepiece collection
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="btn-gold px-8 h-11 text-xs rounded-sm inline-flex items-center justify-center"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="flex gap-4 py-4"
                  style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}
                >
                  {/* Image */}
                  <div
                    className="relative flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden"
                    style={{ background: "rgba(245,230,200,0.05)", border: "1px solid var(--border-gold)" }}
                  >
                    {item.thumbnailImage ? (
                      <Image
                        src={item.thumbnailImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.2" />
                          <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {item.name}
                    </p>
                    <p className="font-body text-xs mt-0.5 mb-2" style={{ color: "var(--gold)" }}>
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Qty */}
                      <div
                        className="flex items-center rounded-sm overflow-hidden"
                        style={{ border: "1px solid var(--border-gold)" }}
                      >
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-white/5 font-body text-sm"
                          style={{ color: "var(--gold-muted)" }}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-body text-xs" style={{ color: "var(--text-primary)" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-white/5 font-body text-sm"
                          style={{ color: "var(--gold-muted)" }}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item._id)}
                        disabled={isLoading}
                        className="font-display text-[10px] tracking-[0.15em] uppercase opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: "#C0392B" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-6 py-5 space-y-3"
            style={{ borderTop: "1px solid var(--border-gold)" }}
          >
            {couponCode && couponDiscount > 0 && (
              <div className="flex justify-between font-body text-xs">
                <span style={{ color: "var(--text-muted)" }}>Coupon ({couponCode})</span>
                <span style={{ color: "#9ccc65" }}>−{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                Subtotal
              </span>
              <span className="font-serif text-lg text-gold-gradient">
                {formatPrice(total)}
              </span>
            </div>
            <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
              Shipping & taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-gold w-full h-13 text-xs rounded-sm flex items-center justify-center py-3"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full h-11 flex items-center justify-center font-display text-xs tracking-[0.2em] uppercase rounded-sm transition-colors hover:bg-white/5"
              style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
            >
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}