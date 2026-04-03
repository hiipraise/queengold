"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface Category { _id: string; name: string; slug: string; }
interface Collection { _id: string; name: string; slug: string; }

const BLANK = {
  name: "", slug: "", shortDescription: "", description: "",
  price: "", comparePrice: "",
  thumbnailImage: "", images: "",
  sku: "", stock: "0",
  category: "", collections: [] as string[],
  gender: "unisex",
  warrantyYears: "2",
  status: "draft",
  isFeatured: false, isNewArrival: false, isBestSeller: false, isLimitedEdition: false,
  tags: "",
  // Specs
  movement: "", caseMaterial: "", caseSize: "", dialColor: "",
  bracelet: "", waterResistance: "", crystalType: "",
  powerReserve: "", functions: "", lugWidth: "", thickness: "",
};

export default function AdminProductNewPage() {
  const router = useRouter();
  const [form,        setForm]        = useState(BLANK);
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then(r => r.json()),
      fetch("/api/admin/collections").then(r => r.json()),
    ]).then(([cats, cols]) => {
      setCategories(cats.categories ?? []);
      setCollections(cols.collections ?? []);
    });
  }, []);

  const f = (key: keyof typeof BLANK, value: unknown) => setForm(p => ({ ...p, [key]: value }));

  function autoSlug() {
    if (!form.slug && form.name) f("slug", slugify(form.name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.sku || !form.thumbnailImage) {
      setError("Name, price, category, SKU, and thumbnail image are required."); return;
    }
    setSaving(true); setError("");

    const payload = {
      name:             form.name,
      slug:             form.slug || slugify(form.name),
      shortDescription: form.shortDescription,
      description:      form.description,
      price:            parseFloat(form.price),
      comparePrice:     form.comparePrice ? parseFloat(form.comparePrice) : null,
      thumbnailImage:   form.thumbnailImage,
      images:           form.images.split("\n").map(s => s.trim()).filter(Boolean),
      sku:              form.sku.trim().toUpperCase(),
      stock:            parseInt(form.stock, 10),
      category:         form.category,
      collections:      form.collections,
      gender:           form.gender,
      warrantyYears:    parseInt(form.warrantyYears, 10),
      status:           form.status,
      isFeatured:       form.isFeatured,
      isNewArrival:     form.isNewArrival,
      isBestSeller:     form.isBestSeller,
      isLimitedEdition: form.isLimitedEdition,
      tags:             form.tags.split(",").map(s => s.trim()).filter(Boolean),
      specifications: {
        movement: form.movement, caseMaterial: form.caseMaterial, caseSize: form.caseSize,
        dialColor: form.dialColor, bracelet: form.bracelet, waterResistance: form.waterResistance,
        crystalType: form.crystalType, powerReserve: form.powerReserve, functions: form.functions,
        lugWidth: form.lugWidth, thickness: form.thickness,
      },
    };

    try {
      const res  = await fetch("/api/admin/products", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create product."); return; }
      router.push("/admin/products");
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-gold-gradient">Add New Product</h1>
          <Link href="/admin/products" className="font-display text-[10px] tracking-[0.2em] uppercase mt-1 block"
                style={{ color: "var(--text-muted)" }}>← Back to Products</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core info */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Basic Information</h2>
          <Field label="Product Name" required>
            <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.name}
                   onChange={e => f("name", e.target.value)} onBlur={autoSlug} required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug" required>
              <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.slug}
                     onChange={e => f("slug", e.target.value)} placeholder="auto-generated from name" />
            </Field>
            <Field label="SKU" required>
              <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.sku}
                     onChange={e => f("sku", e.target.value.toUpperCase())} placeholder="QG-ER-01" required />
            </Field>
          </div>
          <Field label="Short Description (max 300 chars)">
            <textarea className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none" rows={2}
                      value={form.shortDescription} maxLength={300}
                      onChange={e => f("shortDescription", e.target.value)} />
          </Field>
          <Field label="Full Description">
            <textarea className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none" rows={6}
                      value={form.description} onChange={e => f("description", e.target.value)} />
          </Field>
        </section>

        {/* Pricing & Inventory */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (₦)" required>
              <input type="number" min="0" step="1000" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                     value={form.price} onChange={e => f("price", e.target.value)} required />
            </Field>
            <Field label="Compare Price (₦)">
              <input type="number" min="0" step="1000" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                     value={form.comparePrice} onChange={e => f("comparePrice", e.target.value)}
                     placeholder="Original price (for sale)" />
            </Field>
            <Field label="Stock">
              <input type="number" min="0" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                     value={form.stock} onChange={e => f("stock", e.target.value)} />
            </Field>
          </div>
        </section>

        {/* Categorisation */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Categorisation</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required>
              <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm" value={form.category}
                      onChange={e => f("category", e.target.value)} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Gender">
              <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm" value={form.gender}
                      onChange={e => f("gender", e.target.value)}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </Field>
          </div>
          <Field label="Collections (hold Ctrl/Cmd for multiple)">
            <select multiple className="input-luxury w-full px-3 py-2 text-sm rounded-sm" style={{ height: "100px" }}
                    value={form.collections}
                    onChange={e => f("collections", Array.from(e.target.selectedOptions, o => o.value))}>
              {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Tags (comma-separated)">
            <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.tags}
                   onChange={e => f("tags", e.target.value)} placeholder="automatic, gold, luxury" />
          </Field>
        </section>

        {/* Images */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Images</h2>
          <Field label="Thumbnail Image URL" required>
            <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.thumbnailImage}
                   onChange={e => f("thumbnailImage", e.target.value)}
                   placeholder="https://cdn.queengold.com/products/..." required />
          </Field>
          <Field label="Additional Image URLs (one per line)">
            <textarea className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none" rows={4}
                      value={form.images} onChange={e => f("images", e.target.value)}
                      placeholder="https://cdn.queengold.com/products/..." />
          </Field>
        </section>

        {/* Specifications */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["movement",        "Movement",         "CROWNCALIBRE™ CC-01 Automatic"],
              ["caseMaterial",    "Case Material",    "316L Stainless Steel"],
              ["caseSize",        "Case Size",        "42mm"],
              ["dialColor",       "Dial Colour",      "Champagne Sunburst"],
              ["bracelet",        "Bracelet",         "Stainless Steel"],
              ["waterResistance", "Water Resistance", "100m / 330ft"],
              ["crystalType",     "Crystal",          "Sapphire, AR-coated"],
              ["powerReserve",    "Power Reserve",    "42 hours"],
              ["functions",       "Functions",        "Hours, Minutes, Seconds, Date"],
              ["lugWidth",        "Lug Width",        "20mm"],
              ["thickness",       "Thickness",        "11.5mm"],
            ].map(([key, label, placeholder]) => (
              <Field key={key} label={label} required={["movement","caseMaterial","caseSize","dialColor","bracelet","waterResistance","crystalType"].includes(key)}>
                <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                       value={form[key as keyof typeof BLANK] as string}
                       onChange={e => f(key as keyof typeof BLANK, e.target.value)}
                       placeholder={placeholder} />
              </Field>
            ))}
          </div>
          <Field label="Warranty (years)">
            <input type="number" min="1" max="10" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                   value={form.warrantyYears} onChange={e => f("warrantyYears", e.target.value)} />
          </Field>
        </section>

        {/* Status & Flags */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Status & Flags</h2>
          <Field label="Status">
            <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm" value={form.status}
                    onChange={e => f("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "isFeatured",       label: "Featured" },
              { key: "isNewArrival",     label: "New Arrival" },
              { key: "isBestSeller",     label: "Best Seller" },
              { key: "isLimitedEdition", label: "Limited Edition" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof BLANK] as boolean}
                       onChange={e => f(key as keyof typeof BLANK, e.target.checked)}
                       className="w-4 h-4" style={{ accentColor: "var(--gold)" }} />
                <span className="font-body text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
              </label>
            ))}
          </div>
        </section>

        {error && <p className="font-body text-sm" style={{ color: "#ff8a80" }}>{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-gold px-8 h-12 text-xs rounded-sm disabled:opacity-70">
            {saving ? "Creating…" : "Create Product"}
          </button>
          <Link href="/admin/products"
                className="px-8 h-12 font-display text-xs tracking-[0.2em] uppercase rounded-sm flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
        {label}{required && <span style={{ color: "#C0392B" }}> *</span>}
      </label>
      {children}
    </div>
  );
}