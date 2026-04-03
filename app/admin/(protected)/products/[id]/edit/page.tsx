"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface Category   { _id: string; name: string; }
interface Collection { _id: string; name: string; }

const SPEC_FIELDS = [
  ["movement",        "Movement",          true],
  ["caseMaterial",    "Case Material",     true],
  ["caseSize",        "Case Size",         true],
  ["dialColor",       "Dial Colour",       true],
  ["bracelet",        "Bracelet",          true],
  ["waterResistance", "Water Resistance",  true],
  ["crystalType",     "Crystal",           true],
  ["powerReserve",    "Power Reserve",     false],
  ["functions",       "Functions",         false],
  ["lugWidth",        "Lug Width",         false],
  ["thickness",       "Thickness",         false],
] as const;

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [categories,  setCategories]  = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  const [form,        setForm]        = useState<Record<string, unknown>>({});

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then(r => r.json()),
      fetch("/api/admin/categories").then(r => r.json()),
      fetch("/api/admin/collections").then(r => r.json()),
    ]).then(([prod, cats, cols]) => {
      if (prod.product) {
        const p = prod.product;
        setForm({
          name:             p.name ?? "",
          slug:             p.slug ?? "",
          shortDescription: p.shortDescription ?? "",
          description:      p.description ?? "",
          price:            String(p.price ?? ""),
          comparePrice:     p.comparePrice ? String(p.comparePrice) : "",
          thumbnailImage:   p.thumbnailImage ?? "",
          images:           (p.images ?? []).join("\n"),
          sku:              p.sku ?? "",
          stock:            String(p.stock ?? 0),
          category:         p.category?._id ?? p.category ?? "",
          collections:      (p.collections ?? []).map((c: { _id: string } | string) =>
                              typeof c === "object" ? c._id : c),
          gender:           p.gender ?? "unisex",
          warrantyYears:    String(p.warrantyYears ?? 2),
          status:           p.status ?? "draft",
          isFeatured:       !!p.isFeatured,
          isNewArrival:     !!p.isNewArrival,
          isBestSeller:     !!p.isBestSeller,
          isLimitedEdition: !!p.isLimitedEdition,
          tags:             (p.tags ?? []).join(", "),
          sortOrder:        String(p.sortOrder ?? 0),
          // Specs
          ...Object.fromEntries(
            SPEC_FIELDS.map(([key]) => [key, p.specifications?.[key] ?? ""])
          ),
        });
      }
      setCategories(cats.categories ?? []);
      setCollections(cols.collections ?? []);
      setLoading(false);
    });
  }, [id]);

  const f = (key: string, value: unknown) => setForm(p => ({ ...p, [key]: value }));
  const v = (key: string) => (form[key] as string) ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");

    const payload = {
      name:             v("name"),
      slug:             v("slug") || slugify(v("name")),
      shortDescription: v("shortDescription"),
      description:      v("description"),
      price:            parseFloat(v("price")),
      comparePrice:     v("comparePrice") ? parseFloat(v("comparePrice")) : null,
      thumbnailImage:   v("thumbnailImage"),
      images:           v("images").split("\n").map((s: string) => s.trim()).filter(Boolean),
      sku:              v("sku").toUpperCase(),
      stock:            parseInt(v("stock"), 10),
      category:         v("category"),
      collections:      (form.collections as string[]) ?? [],
      gender:           v("gender"),
      warrantyYears:    parseInt(v("warrantyYears"), 10),
      status:           v("status"),
      isFeatured:       !!form.isFeatured,
      isNewArrival:     !!form.isNewArrival,
      isBestSeller:     !!form.isBestSeller,
      isLimitedEdition: !!form.isLimitedEdition,
      tags:             v("tags").split(",").map((s: string) => s.trim()).filter(Boolean),
      sortOrder:        parseInt(v("sortOrder"), 10) || 0,
      specifications:   Object.fromEntries(SPEC_FIELDS.map(([key]) => [key, v(key)])),
    };

    try {
      const res  = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save."); return; }
      router.push("/admin/products");
    } finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
             style={{ borderColor: "rgba(212,175,55,0.3)", borderTopColor: "var(--gold)" }} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-gold-gradient">Edit Product</h1>
          <Link href="/admin/products" className="font-display text-[10px] tracking-[0.2em] uppercase mt-1 block"
                style={{ color: "var(--text-muted)" }}>← Back to Products</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Basic Information</h2>
          <Field label="Product Name" required>
            <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={v("name")}
                   onChange={e => f("name", e.target.value)} required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug">
              <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={v("slug")}
                     onChange={e => f("slug", e.target.value)} />
            </Field>
            <Field label="SKU">
              <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={v("sku")}
                     onChange={e => f("sku", e.target.value.toUpperCase())} />
            </Field>
          </div>
          <Field label="Short Description">
            <textarea className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none" rows={2}
                      value={v("shortDescription")} maxLength={300}
                      onChange={e => f("shortDescription", e.target.value)} />
          </Field>
          <Field label="Full Description">
            <textarea className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none" rows={6}
                      value={v("description")} onChange={e => f("description", e.target.value)} />
          </Field>
        </section>

        {/* Pricing */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (₦)" required>
              <input type="number" min="0" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                     value={v("price")} onChange={e => f("price", e.target.value)} required />
            </Field>
            <Field label="Compare Price (₦)">
              <input type="number" min="0" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                     value={v("comparePrice")} onChange={e => f("comparePrice", e.target.value)} />
            </Field>
            <Field label="Stock">
              <input type="number" min="0" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                     value={v("stock")} onChange={e => f("stock", e.target.value)} />
            </Field>
          </div>
        </section>

        {/* Categorisation */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Categorisation</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm" value={v("category")}
                      onChange={e => f("category", e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Gender">
              <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm" value={v("gender")}
                      onChange={e => f("gender", e.target.value)}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </Field>
          </div>
          <Field label="Collections (hold Ctrl/Cmd for multiple)">
            <select multiple className="input-luxury w-full px-3 py-2 text-sm rounded-sm" style={{ height: "100px" }}
                    value={form.collections as string[]}
                    onChange={e => f("collections", Array.from(e.target.selectedOptions, o => o.value))}>
              {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Tags (comma-separated)">
            <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={v("tags")}
                   onChange={e => f("tags", e.target.value)} />
          </Field>
        </section>

        {/* Images */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Images</h2>
          <Field label="Thumbnail Image URL" required>
            <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={v("thumbnailImage")}
                   onChange={e => f("thumbnailImage", e.target.value)} required />
          </Field>
          <Field label="Additional Image URLs (one per line)">
            <textarea className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none" rows={4}
                      value={v("images")} onChange={e => f("images", e.target.value)} />
          </Field>
        </section>

        {/* Specifications */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            {SPEC_FIELDS.map(([key, label, required]) => (
              <Field key={key} label={label} required={required}>
                <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                       value={v(key)} onChange={e => f(key, e.target.value)} />
              </Field>
            ))}
          </div>
          <Field label="Warranty (years)">
            <input type="number" min="1" max="10" className="input-luxury w-24 h-11 px-4 text-sm rounded-sm"
                   value={v("warrantyYears")} onChange={e => f("warrantyYears", e.target.value)} />
          </Field>
        </section>

        {/* Status */}
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-serif text-lg text-gold-gradient">Status & Flags</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm" value={v("status")}
                      onChange={e => f("status", e.target.value)}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Sort Order">
              <input type="number" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                     value={v("sortOrder")} onChange={e => f("sortOrder", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "isFeatured",       label: "Featured" },
              { key: "isNewArrival",     label: "New Arrival" },
              { key: "isBestSeller",     label: "Best Seller" },
              { key: "isLimitedEdition", label: "Limited Edition" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form[key]}
                       onChange={e => f(key, e.target.checked)}
                       className="w-4 h-4" style={{ accentColor: "var(--gold)" }} />
                <span className="font-body text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
              </label>
            ))}
          </div>
        </section>

        {error && <p className="font-body text-sm" style={{ color: "#ff8a80" }}>{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-gold px-8 h-12 text-xs rounded-sm disabled:opacity-70">
            {saving ? "Saving…" : "Save Changes"}
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