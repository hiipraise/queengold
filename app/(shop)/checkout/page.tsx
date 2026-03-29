"use client";

import { useCart } from "@/components/store/cart-context";
import { formatCurrency } from "@/lib/currency";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", fullName: "", line1: "", city: "", state: "", phone: "" });

  async function pay() {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shippingAddress: form }) });
    const data = await res.json();
    if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    setLoading(false);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_360px] gap-6">
      <section className="card-luxury p-6">
        <h1 className="font-serif text-3xl">Checkout</h1>
        <div className="mt-4 flex gap-2 text-xs uppercase tracking-widest">
          <button className={`px-3 py-2 border ${step === 1 ? "border-[var(--gold)]" : "border-[var(--border-gold)]"}`} onClick={() => setStep(1)}>Delivery</button>
          <button className={`px-3 py-2 border ${step === 2 ? "border-[var(--gold)]" : "border-[var(--border-gold)]"}`} onClick={() => setStep(2)}>Review</button>
        </div>

        {step === 1 && <div className="grid md:grid-cols-2 gap-3 mt-6">{Object.entries(form).map(([key, value]) => <input key={key} value={value} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} placeholder={key} className="input-luxury h-11 px-3" />)}<button className="btn-gold h-11 text-xs md:col-span-2" onClick={() => setStep(2)}>Continue to Review</button></div>}

        {step === 2 && <div className="mt-6 space-y-3">{items.map((item) => <div key={item.productId} className="flex justify-between text-sm"><span>{item.name} × {item.quantity}</span><span>{formatCurrency(item.price * item.quantity)}</span></div>)}<button className="btn-gold h-11 px-5 text-xs" disabled={loading} onClick={pay}>{loading ? "Redirecting…" : "Pay with Squad"}</button></div>}
      </section>
      <aside className="card-luxury p-6 h-fit"><h2 className="font-serif text-2xl">Order Summary</h2><p className="mt-4 text-sm">Subtotal: {formatCurrency(subtotal)}</p><p className="text-sm">Shipping: Included</p><p className="text-xl mt-2">Total: {formatCurrency(subtotal)}</p></aside>
    </main>
  );
}
