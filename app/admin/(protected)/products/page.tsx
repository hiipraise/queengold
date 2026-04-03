"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  stock: number;
  status: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  sku: string;
  category?: { name: string };
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading,  setLoading]  = useState(true);
  const limit = 20;

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), limit: String(limit),
      ...(search ? { q: search } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    });
    const res  = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetch_();
  }

  async function toggleFlag(id: string, flag: string, current: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [flag]: !current }),
    });
    fetch_();
  }

  const totalPages = Math.ceil(total / limit);

  const statusBadge = (s: string) => {
    const map: Record<string, { c: string; bg: string }> = {
      active:   { c: "#22783C", bg: "rgba(34,120,60,0.1)" },
      draft:    { c: "#C9A84C", bg: "rgba(201,168,76,0.1)" },
      archived: { c: "#7F8C8D", bg: "rgba(127,140,141,0.1)" },
    };
    const cfg = map[s] ?? map.draft;
    return (
      <span className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
            style={{ color: cfg.c, background: cfg.bg }}>
        {s}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-gold-gradient">Products</h1>
          <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>{total} products</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold px-6 h-10 text-xs rounded-sm inline-flex items-center justify-center">
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text" placeholder="Search products…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-luxury h-10 px-4 text-sm rounded-sm w-56"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-luxury h-10 px-3 text-sm rounded-sm"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button onClick={fetch_} className="font-display text-xs tracking-[0.15em] uppercase px-5 h-10 rounded-sm"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="card-luxury overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-gold)" }}>
              {["Product", "SKU", "Price", "Stock", "Status", "Flags", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-display text-xs tracking-[0.15em] uppercase whitespace-nowrap"
                    style={{ color: "var(--gold-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center opacity-40 font-body text-xs tracking-widest uppercase">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center opacity-40 font-body text-xs tracking-widest uppercase">No products found</td></tr>
            ) : products.map((p) => (
              <tr key={p._id} style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-body text-sm font-medium" style={{ color: "var(--gold-light)" }}>{p.name}</p>
                  {p.category && <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.category.name}</p>}
                </td>
                <td className="px-4 py-3 font-body text-xs tracking-widest" style={{ color: "var(--text-muted)" }}>{p.sku}</td>
                <td className="px-4 py-3">
                  <p className="font-body text-sm" style={{ color: "var(--gold)" }}>{formatPrice(p.price)}</p>
                  {p.comparePrice && p.comparePrice > p.price && (
                    <p className="font-body text-xs line-through" style={{ color: "var(--text-muted)" }}>{formatPrice(p.comparePrice)}</p>
                  )}
                </td>
                <td className="px-4 py-3 font-body text-sm text-center"
                    style={{ color: p.stock === 0 ? "#C0392B" : p.stock < 5 ? "#C9A84C" : "var(--text-muted)" }}>
                  {p.stock}
                </td>
                <td className="px-4 py-3">{statusBadge(p.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {[
                      { key: "isFeatured", label: "F", active: p.isFeatured },
                      { key: "isNewArrival", label: "N", active: p.isNewArrival },
                      { key: "isBestSeller", label: "B", active: p.isBestSeller },
                      { key: "isLimitedEdition", label: "L", active: p.isLimitedEdition },
                    ].map(({ key, label, active }) => (
                      <button
                        key={key}
                        onClick={() => toggleFlag(p._id, key, active)}
                        title={{ isFeatured: "Featured", isNewArrival: "New Arrival", isBestSeller: "Best Seller", isLimitedEdition: "Limited" }[key]}
                        className="w-6 h-6 rounded-sm font-display text-[9px] transition-all"
                        style={{
                          background: active ? "rgba(212,175,55,0.2)" : "transparent",
                          border: `1px solid ${active ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.15)"}`,
                          color: active ? "var(--gold)" : "var(--text-muted)",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/products/${p._id}/edit`}
                          className="font-display text-[10px] tracking-[0.15em] uppercase opacity-70 hover:opacity-100"
                          style={{ color: "var(--gold-muted)" }}>
                      Edit
                    </Link>
                    <Link href={`/products/${p.slug}`} target="_blank"
                          className="font-display text-[10px] tracking-[0.15em] uppercase opacity-70 hover:opacity-100"
                          style={{ color: "var(--gold-muted)" }}>
                      View
                    </Link>
                    <button onClick={() => handleDelete(p._id, p.name)}
                            className="font-display text-[10px] tracking-[0.15em] uppercase opacity-70 hover:opacity-100"
                            style={{ color: "#C0392B" }}>
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="font-display text-xs tracking-[0.15em] uppercase px-4 h-9 rounded-sm disabled:opacity-30"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>Prev</button>
          <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="font-display text-xs tracking-[0.15em] uppercase px-4 h-9 rounded-sm disabled:opacity-30"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>Next</button>
        </div>
      )}
    </div>
  );
}