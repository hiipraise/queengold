"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const {
    items, subtotal, total, itemCount, couponCode, couponDiscount,
    removeItem, updateQuantity, applyCoupon, removeCoupon, isLoading,
  } = useCart();

  const [couponInput,   setCouponInput]   = useState("");
  const [couponMsg,     setCouponMsg]     = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const shippingCost = subtotal >= 500000 ? 0 : 15000;
  const finalTotal   = Math.max(0, subtotal + shippingCost - couponDiscount);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMsg("");
    const result = await applyCoupon(couponInput.trim());
    setCouponMsg(result.message);
    setCouponSuccess(result.success);
    if (result.success) setCouponInput("");
    setCouponLoading(false);
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-6 opacity-20">
            <rect x="8" y="22" width="48" height="34" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M22 22v-6a10 10 0 0 1 20 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h1 className="font-serif text-3xl text-gold-gradient mb-3">Your Cart is Empty</h1>
          <p className="font-body text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Discover our collection of handcrafted luxury timepieces.
          </p>
          <Link href="/shop" className="btn-gold px-10 h-12 text-xs rounded-sm inline-flex items-center justify-center">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-6 pb-10">
          <h1 className="font-serif text-4xl text-gold-gradient">Your Cart</h1>
          <p className="font-body text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="card-luxury p-5 flex gap-5">
                {/* Image */}
                <Link href={`/products/${item.sku.toLowerCase().replace(/_/g, "-")}`}
                      className="flex-shrink-0 relative w-24 h-24 rounded-sm overflow-hidden"
                      style={{ background: "rgba(45,6,20,0.5)", border: "1px solid var(--border-gold)" }}>
                  {item.thumbnailImage ? (
                    <Image src={item.thumbnailImage} alt={item.name} fill className="object-cover" sizes="96px"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2"/>
                        <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-body text-sm font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
                        {item.name}
                      </p>
                      <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        SKU: {item.sku}
                      </p>
                    </div>
                    <p className="font-serif text-base flex-shrink-0" style={{ color: "var(--gold)" }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity */}
                    <div className="flex items-center rounded-sm overflow-hidden"
                         style={{ border: "1px solid var(--border-gold)" }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={isLoading}
                              className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white/5 text-lg"
                              style={{ color: "var(--gold-muted)" }}>−</button>
                      <span className="w-10 text-center font-body text-sm" style={{ color: "var(--text-primary)" }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={isLoading}
                              className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white/5 text-lg"
                              style={{ color: "var(--gold-muted)" }}>+</button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                        {formatPrice(item.price)} each
                      </p>
                      <button onClick={() => removeItem(item._id)} disabled={isLoading}
                              className="font-display text-[10px] tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity"
                              style={{ color: "#C0392B" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link href="/shop"
                  className="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.2em] uppercase mt-2"
                  style={{ color: "var(--gold-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div className="card-luxury p-6 sticky top-28 space-y-5">
              <h2 className="font-serif text-xl text-gold-gradient">Order Summary</h2>

              {/* Coupon */}
              {!couponCode ? (
                <div className="space-y-2">
                  <label className="font-display text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--gold-muted)" }}>
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponMsg(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Enter code"
                      className="input-luxury flex-1 h-10 px-3 text-sm rounded-sm"
                    />
                    <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                            className="btn-gold px-4 h-10 text-xs rounded-sm disabled:opacity-50">
                      {couponLoading ? "…" : "Apply"}
                    </button>
                  </div>
                  {couponMsg && (
                    <p className="font-body text-xs" style={{ color: couponSuccess ? "#9ccc65" : "#ff8a80" }}>
                      {couponMsg}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-sm"
                     style={{ background: "rgba(34,120,60,0.08)", border: "1px solid rgba(34,120,60,0.3)" }}>
                  <div>
                    <p className="font-display text-[10px] tracking-[0.2em] uppercase" style={{ color: "#22783C" }}>
                      {couponCode}
                    </p>
                    <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Saves {formatPrice(couponDiscount)}
                    </p>
                  </div>
                  <button onClick={removeCoupon} className="font-display text-[10px] tracking-[0.15em] uppercase opacity-60 hover:opacity-100"
                          style={{ color: "#C0392B" }}>Remove</button>
                </div>
              )}

              <div className="divider-gold" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between font-body text-sm">
                  <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                  <span style={{ color: "var(--text-primary)" }}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span style={{ color: "var(--text-muted)" }}>Shipping</span>
                  <span style={{ color: shippingCost === 0 ? "#9ccc65" : "var(--text-primary)" }}>
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between font-body text-sm">
                    <span style={{ color: "var(--text-muted)" }}>Discount</span>
                    <span style={{ color: "#9ccc65" }}>−{formatPrice(couponDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="divider-gold" />

              <div className="flex justify-between items-baseline">
                <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                  Total
                </span>
                <span className="font-serif text-2xl text-gold-gradient">{formatPrice(finalTotal)}</span>
              </div>

              {shippingCost > 0 && (
                <p className="font-body text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
                  Add {formatPrice(500000 - subtotal)} more for free shipping
                </p>
              )}

              <Link href="/checkout"
                    className="btn-gold w-full h-12 text-xs rounded-sm flex items-center justify-center">
                Proceed to Checkout
              </Link>

              {/* Trust */}
              <div className="space-y-2 pt-1">
                {["Secure checkout via Squad by GTBank", "Digital Watch Passport included", "2-Year warranty on all pieces"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5.5" stroke="var(--gold-muted)" strokeWidth="0.8"/>
                      <path d="M3 6l2 2 4-4" stroke="var(--gold-muted)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}