"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

type Step = "address" | "review" | "paying";

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
}

const EMPTY_ADDRESS: Address = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "Nigeria",
};

const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

function sessionId() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("qg_session") ?? "";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, couponCode, couponDiscount, itemCount, clearCart } = useCart();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(couponCode ?? "");
  const [couponSaving, setCouponSaving] = useState(0);

  const shippingCost = subtotal >= 500000 ? 0 : 15000;
  const finalTotal   = Math.max(0, subtotal + shippingCost - couponDiscount);

  function fieldError(field: keyof Address): string {
    if (!address[field] && ["firstName","lastName","email","phone","addressLine1","city","state"].includes(field)) {
      return "Required";
    }
    return "";
  }

  function validateAddress(): boolean {
    for (const key of ["firstName","lastName","email","phone","addressLine1","city","state"] as (keyof Address)[]) {
      if (!address[key].trim()) {
        setError(`Please fill in all required fields.`);
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError("");
    return true;
  }

  async function handleContinueToReview() {
    if (!validateAddress()) return;
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePay() {
    setLoading(true);
    setError("");
    setStep("paying");

    try {
      const sid = sessionId();

      // 1. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId:      sid,
          shippingAddress: {
            firstName:    address.firstName,
            lastName:     address.lastName,
            phone:        address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city:         address.city,
            state:        address.state,
            country:      address.country,
          },
          guestEmail:     address.email,
          couponCode:     couponApplied || undefined,
          couponDiscount: couponDiscount,
          notes:          notes || undefined,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error ?? "Could not create order.");

      const orderId = String(orderData.order._id ?? orderData.order.id);

      // 2. Initiate Squad payment
      const payRes = await fetch("/api/payments/squad/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error ?? "Payment initiation failed.");

      // Store session id so callback can clear cart
      sessionStorage.setItem("qg_checkout_session", sid);

      // 3. Redirect to Squad hosted checkout
      window.location.href = payData.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStep("review");
      setLoading(false);
    }
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display text-lg tracking-[0.2em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
            Your cart is empty
          </p>
          <Link href="/shop" className="btn-gold px-8 h-11 text-xs rounded-sm inline-flex items-center justify-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center py-8 mb-4">
          <Link href="/" aria-label="Queen Gold Home">
            <p className="font-display text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: "var(--gold-muted)" }}>
              Queen Gold
            </p>
          </Link>
          <h1 className="font-serif text-3xl text-gold-gradient">Secure Checkout</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {(["address","review"] as const).map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-body text-xs"
                  style={{
                    background: step === s || (step === "paying" && s === "review") ? "rgba(212,175,55,0.2)" : "transparent",
                    border: `1px solid ${step === s || (step === "paying" && s === "review") ? "var(--gold)" : "var(--border-gold)"}`,
                    color: step === s || (step === "paying" && s === "review") ? "var(--gold)" : "var(--text-muted)",
                  }}
                >
                  {i + 1}
                </div>
                <span className="hidden sm:block font-display text-[10px] tracking-[0.2em] uppercase"
                      style={{ color: step === s ? "var(--gold)" : "var(--text-muted)" }}>
                  {s === "address" ? "Delivery" : "Review & Pay"}
                </span>
              </div>
              {i < 1 && <div className="w-10 h-px" style={{ background: "var(--border-gold)" }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Form ───────────────────────────────────── */}
          <div className="lg:col-span-3">

            {step === "address" && (
              <div className="card-luxury p-6 sm:p-8 space-y-5">
                <h2 className="font-serif text-xl text-gold-gradient mb-2">Delivery Details</h2>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name" required>
                    <input
                      className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                      value={address.firstName}
                      onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                      autoComplete="given-name"
                    />
                  </FormField>
                  <FormField label="Last Name" required>
                    <input
                      className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                      value={address.lastName}
                      onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                      autoComplete="family-name"
                    />
                  </FormField>
                </div>

                <FormField label="Email Address" required>
                  <input
                    type="email"
                    className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    autoComplete="email"
                    placeholder="Order confirmation will be sent here"
                  />
                </FormField>

                <FormField label="Phone Number" required>
                  <input
                    type="tel"
                    className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    autoComplete="tel"
                    placeholder="+234..."
                  />
                </FormField>

                <FormField label="Address Line 1" required>
                  <input
                    className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    autoComplete="address-line1"
                    placeholder="Street address, house number"
                  />
                </FormField>

                <FormField label="Address Line 2">
                  <input
                    className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    autoComplete="address-line2"
                    placeholder="Apartment, suite, estate (optional)"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="City" required>
                    <input
                      className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      autoComplete="address-level2"
                    />
                  </FormField>
                  <FormField label="State" required>
                    <select
                      className="input-luxury w-full h-11 px-3 text-sm rounded-sm"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    >
                      <option value="">Select state</option>
                      {NIGERIA_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Order Notes">
                  <textarea
                    className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions for your order (optional)"
                  />
                </FormField>

                {error && (
                  <p className="font-body text-sm animate-fade-in" style={{ color: "#ff8a80" }}>{error}</p>
                )}

                <button
                  onClick={handleContinueToReview}
                  className="btn-gold w-full h-12 text-xs rounded-sm"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {(step === "review" || step === "paying") && (
              <div className="card-luxury p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl text-gold-gradient">Review & Pay</h2>
                  <button
                    onClick={() => setStep("address")}
                    className="font-display text-[10px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100"
                    style={{ color: "var(--gold-muted)" }}
                  >
                    Edit Address
                  </button>
                </div>

                {/* Address summary */}
                <div className="p-4 rounded-sm" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid var(--border-gold)" }}>
                  <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--gold-muted)" }}>
                    Delivering to
                  </p>
                  <p className="font-body text-sm" style={{ color: "var(--text-primary)" }}>
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                    <br />
                    {address.city}, {address.state}, {address.country}
                  </p>
                  <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>{address.phone}</p>
                  <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{address.email}</p>
                </div>

                {/* Items summary */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-sm overflow-hidden flex-shrink-0"
                           style={{ background: "rgba(45,6,20,0.5)", border: "1px solid var(--border-gold)" }}>
                        {item.thumbnailImage && (
                          <Image src={item.thumbnailImage} alt={item.name} fill className="object-cover" sizes="56px" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm truncate" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                        <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                      </div>
                      <p className="font-body text-sm flex-shrink-0" style={{ color: "var(--gold)" }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {error && (
                  <p className="font-body text-sm animate-fade-in" style={{ color: "#ff8a80" }}>{error}</p>
                )}

                <div className="p-4 rounded-sm" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="4.5" width="13" height="9" rx="1.5" stroke="var(--gold)" strokeWidth="1" />
                      <path d="M4 4.5V3a4 4 0 0 1 8 0v1.5" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    <p className="font-display text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--gold-muted)" }}>
                      Secure Payment — Squad by GTBank
                    </p>
                  </div>
                  <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                    You will be redirected to Squad's secure checkout to complete your payment via card, bank transfer, or USSD.
                  </p>
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading || step === "paying"}
                  className="btn-gold w-full h-13 text-xs rounded-sm py-4 disabled:opacity-70"
                >
                  {loading || step === "paying" ? "Redirecting to Payment..." : `Pay ${formatPrice(finalTotal)}`}
                </button>

                <Link
                  href="/shop"
                  className="block text-center font-display text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ──────────────────────── */}
          <div className="lg:col-span-2">
            <div className="card-luxury p-6 space-y-4 sticky top-28">
              <h3 className="font-serif text-lg text-gold-gradient">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-sm flex-shrink-0 overflow-hidden"
                         style={{ background: "rgba(45,6,20,0.5)", border: "1px solid var(--border-gold)" }}>
                      {item.thumbnailImage && (
                        <Image src={item.thumbnailImage} alt={item.name} fill className="object-cover" sizes="48px" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs truncate" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                      <p className="font-body text-[11px]" style={{ color: "var(--text-muted)" }}>×{item.quantity}</p>
                    </div>
                    <p className="font-body text-xs flex-shrink-0" style={{ color: "var(--gold)" }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="divider-gold" />

              <div className="space-y-2">
                <div className="flex justify-between font-body text-xs">
                  <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                  <span style={{ color: "var(--text-primary)" }}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-xs">
                  <span style={{ color: "var(--text-muted)" }}>Shipping</span>
                  <span style={{ color: shippingCost === 0 ? "#9ccc65" : "var(--text-primary)" }}>
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between font-body text-xs">
                    <span style={{ color: "var(--text-muted)" }}>Coupon ({couponApplied})</span>
                    <span style={{ color: "#9ccc65" }}>−{formatPrice(couponDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="divider-gold" />

              <div className="flex justify-between">
                <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Total</span>
                <span className="font-serif text-xl text-gold-gradient">{formatPrice(finalTotal)}</span>
              </div>

              {shippingCost > 0 && (
                <p className="font-body text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
                  Free shipping on orders over ₦500,000
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
        {label}{required && <span style={{ color: "#C0392B" }}> *</span>}
      </label>
      {children}
    </div>
  );
}