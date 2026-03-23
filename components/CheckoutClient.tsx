"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { discountedPrice, formatCurrency } from "@/lib/shop-utils";
import { getCloudinaryImage } from "@/lib/cloudinary";

type Product = { slug: string; name: string; price: number; discountPercentage?: number; images: string[] };

export default function CheckoutClient() {
  const { cart, customerEmail, setCustomerEmail } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState({ email: customerEmail, firstName: "", lastName: "", line1: "", city: "", state: "", country: "" });

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" }).then((res) => res.json()).then((data) => setProducts(data.products ?? []));
  }, []);
  useEffect(() => setCustomer((current) => ({ ...current, email: customerEmail })), [customerEmail]);

  const items = useMemo(() => cart.map((item) => ({ ...item, product: products.find((entry) => entry.slug === item.slug) })).filter((item): item is { slug: string; quantity: number; product: Product } => Boolean(item.product)), [cart, products]);
  const total = useMemo(() => items.reduce((sum, item) => sum + discountedPrice(item.product.price, item.product.discountPercentage) * item.quantity, 0), [items]);

  async function handleCheckout() {
    setLoading(true); setError("");
    setCustomerEmail(customer.email);
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart, customer }) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? 'Unable to initialize payment.');
    window.location.href = data.checkoutUrl;
  }

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[1fr_420px]"><section className="space-y-6"><div><p className="text-xs uppercase tracking-[0.35em] text-[var(--gold-muted)]">Checkout</p><h1 className="font-serif text-5xl">Secure checkout.</h1><p className="mt-4 max-w-2xl text-sm text-[var(--text-muted)]">Mongo-backed checkout with live inventory pricing and order creation.</p></div><div className="card-luxury grid gap-4 p-6 sm:grid-cols-2"><Field label="Email"><input value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className="input-luxury mt-2 h-11 w-full rounded-full px-4" /></Field><Field label="First name"><input value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} className="input-luxury mt-2 h-11 w-full rounded-full px-4" /></Field><Field label="Last name"><input value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} className="input-luxury mt-2 h-11 w-full rounded-full px-4" /></Field><Field label="Address"><input value={customer.line1} onChange={(e) => setCustomer({ ...customer, line1: e.target.value })} className="input-luxury mt-2 h-11 w-full rounded-full px-4" /></Field><Field label="City"><input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} className="input-luxury mt-2 h-11 w-full rounded-full px-4" /></Field><Field label="State"><input value={customer.state} onChange={(e) => setCustomer({ ...customer, state: e.target.value })} className="input-luxury mt-2 h-11 w-full rounded-full px-4" /></Field></div><div className="card-luxury p-6"><h2 className="font-serif text-2xl">Payment</h2><p className="mt-3 text-sm text-[var(--text-muted)]">Orders are persisted before redirect and inventory is validated against the latest database values.</p><div className="mt-4 flex flex-wrap gap-3"><button onClick={handleCheckout} disabled={!items.length || loading} className="btn-gold h-12 rounded-full px-6 text-sm">{loading ? 'Initializing…' : 'Pay with Squad'}</button><Link href="/shop" className="flex h-12 items-center justify-center rounded-full border border-[var(--border-gold)] px-6 text-sm uppercase tracking-[0.2em]">Continue shopping</Link></div>{error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}</div></section><aside className="card-luxury h-fit p-6"><h2 className="font-serif text-3xl">Order Summary</h2><div className="mt-5 space-y-4">{items.length === 0 ? <p className="text-sm text-[var(--text-muted)]">Your cart is empty. Add a watch to continue.</p> : items.map(({ slug, quantity, product }) => product ? <div key={slug} className="flex items-center gap-4"><div className="h-16 w-16 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${getCloudinaryImage(product.images[0], { width: 160, height: 160 })})` }} /><div className="flex-1"><p className="font-serif text-lg">{product.name}</p><p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Qty {quantity}</p></div><p className="text-sm">{formatCurrency(discountedPrice(product.price, product.discountPercentage) * quantity)}</p></div> : null)}</div><div className="mt-6 space-y-3 border-t border-[var(--border-gold)] pt-5"><Price label="Subtotal" value={formatCurrency(total)} /><Price label="Shipping" value="Calculated in payment session" /><Price label="Total" value={formatCurrency(total)} strong /></div></aside></div></main>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="rounded-[1.5rem] border border-[var(--border-gold)] p-4"><p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-muted)]">{label}</p>{children}</label>; }
function Price({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <div className={`flex items-center justify-between ${strong ? 'font-serif text-2xl' : 'text-sm'}`}><span className="text-[var(--text-muted)]">{label}</span><span>{value}</span></div>; }
