"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

interface Category { _id: string; name: string; slug: string; }
interface CollectionItem { _id: string; name: string; slug: string; }

interface Props {
  products: ProductCardData[];
  total: number;
  page: number;
  totalPages: number;
  categories: Category[];
  collections: CollectionItem[];
  initialParams: Record<string, string | undefined>;
}

const SORT_OPTIONS = [
  { value: "featured",  label: "Featured" },
  { value: "newest",    label: "Newest First" },
  { value: "priceLow",  label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "popular",   label: "Most Popular" },
];

const GENDER_OPTIONS = [
  { value: "",       label: "All" },
  { value: "men",    label: "Men" },
  { value: "women",  label: "Women" },
  { value: "unisex", label: "Unisex" },
];

const FILTER_OPTIONS = [
  { value: "",           label: "All Watches" },
  { value: "new",        label: "New Arrivals" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "limited",    label: "Limited Edition" },
  { value: "sale",       label: "On Sale" },
];

export default function ShopClient({
  products,
  total,
  page,
  totalPages,
  categories,
  initialParams,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  const currentSort     = initialParams.sort     ?? "featured";
  const currentGender   = initialParams.gender   ?? "";
  const currentFilter   = initialParams.filter   ?? "";
  const currentCategory = initialParams.category ?? "";
  const currentQuery    = initialParams.q        ?? "";

  function clearAll() {
    router.push("/shop");
  }

  const hasFilters = !!(currentGender || currentFilter || currentCategory || currentQuery);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="pt-8 pb-10 text-center">
          <p className="font-display text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
            Queen Gold
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gold-gradient mb-4">
            {currentQuery
              ? `Results for "${currentQuery}"`
              : currentFilter === "new"
              ? "New Arrivals"
              : currentFilter === "bestseller"
              ? "Best Sellers"
              : currentFilter === "limited"
              ? "Limited Edition"
              : "The Collection"}
          </h1>
          <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>
            {total} timepiece{total !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-8">

          {/* ── Sidebar filters (desktop) ─────────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-8">
            {hasFilters && (
              <button
                onClick={clearAll}
                className="font-display text-[10px] tracking-[0.2em] uppercase w-full text-left transition-colors"
                style={{ color: "#C0392B" }}
              >
                Clear All Filters
              </button>
            )}

            {/* Search display */}
            {currentQuery && (
              <div>
                <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--gold-muted)" }}>
                  Search
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{currentQuery}</span>
                  <button onClick={() => updateParam("q", "")} className="opacity-50 hover:opacity-100" style={{ color: "#C0392B" }}>×</button>
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
                Category
              </p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => updateParam("category", "")}
                    className="font-body text-xs text-left w-full transition-colors"
                    style={{ color: !currentCategory ? "var(--gold)" : "var(--text-muted)" }}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => updateParam("category", cat.slug)}
                      className="font-body text-xs text-left w-full transition-colors"
                      style={{ color: currentCategory === cat.slug ? "var(--gold)" : "var(--text-muted)" }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gender */}
            <div>
              <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
                For
              </p>
              <ul className="space-y-2">
                {GENDER_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      onClick={() => updateParam("gender", opt.value)}
                      className="font-body text-xs text-left w-full transition-colors"
                      style={{ color: currentGender === opt.value ? "var(--gold)" : "var(--text-muted)" }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter */}
            <div>
              <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
                Filter
              </p>
              <ul className="space-y-2">
                {FILTER_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      onClick={() => updateParam("filter", opt.value)}
                      className="font-body text-xs text-left w-full transition-colors"
                      style={{ color: currentFilter === opt.value ? "var(--gold)" : "var(--text-muted)" }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase px-4 h-10 rounded-sm"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Filters {hasFilters && `(active)`}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <label className="font-display text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--gold-muted)" }}>
                  Sort:
                </label>
                <select
                  value={currentSort}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="input-luxury h-9 px-3 text-xs rounded-sm pr-8"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-sm tracking-[0.2em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
                  No timepieces found
                </p>
                <p className="font-body text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAll}
                  className="btn-gold px-8 h-11 text-xs rounded-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} priority={i < 3} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                <button
                  onClick={() => updateParam("page", String(page - 1))}
                  disabled={page <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-sm font-display text-xs tracking-widest disabled:opacity-30 transition-colors hover:bg-white/5"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    return (
                      <React.Fragment key={p}>
                        {prev && p - prev > 1 && (
                          <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>…</span>
                        )}
                        <button
                          onClick={() => updateParam("page", String(p))}
                          className="w-10 h-10 flex items-center justify-center rounded-sm font-body text-xs transition-colors"
                          style={{
                            border: "1px solid var(--border-gold)",
                            background: p === page ? "rgba(212,175,55,0.15)" : "transparent",
                            color: p === page ? "var(--gold)" : "var(--text-muted)",
                          }}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
                <button
                  onClick={() => updateParam("page", String(page + 1))}
                  disabled={page >= totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-sm font-display text-xs tracking-widest disabled:opacity-30 transition-colors hover:bg-white/5"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 flex flex-col py-6 px-6 overflow-y-auto"
            style={{ background: "linear-gradient(160deg, #1A0509, #2D0614)", borderRight: "1px solid var(--border-gold)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg text-gold-gradient">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="opacity-60 hover:opacity-100 p-1">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" style={{ color: "var(--text-primary)" }} />
                </svg>
              </button>
            </div>

            {hasFilters && (
              <button onClick={() => { clearAll(); setFiltersOpen(false); }}
                      className="font-display text-[10px] tracking-[0.2em] uppercase mb-6 text-left"
                      style={{ color: "#C0392B" }}>
                Clear All
              </button>
            )}

            <div className="space-y-6">
              <FilterSection title="Category">
                <button onClick={() => { updateParam("category", ""); setFiltersOpen(false); }}
                        className="font-body text-xs block py-1"
                        style={{ color: !currentCategory ? "var(--gold)" : "var(--text-muted)" }}>
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button key={cat._id} onClick={() => { updateParam("category", cat.slug); setFiltersOpen(false); }}
                          className="font-body text-xs block py-1"
                          style={{ color: currentCategory === cat.slug ? "var(--gold)" : "var(--text-muted)" }}>
                    {cat.name}
                  </button>
                ))}
              </FilterSection>

              <FilterSection title="For">
                {GENDER_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => { updateParam("gender", opt.value); setFiltersOpen(false); }}
                          className="font-body text-xs block py-1"
                          style={{ color: currentGender === opt.value ? "var(--gold)" : "var(--text-muted)" }}>
                    {opt.label}
                  </button>
                ))}
              </FilterSection>

              <FilterSection title="Filter">
                {FILTER_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => { updateParam("filter", opt.value); setFiltersOpen(false); }}
                          className="font-body text-xs block py-1"
                          style={{ color: currentFilter === opt.value ? "var(--gold)" : "var(--text-muted)" }}>
                    {opt.label}
                  </button>
                ))}
              </FilterSection>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-[10px] tracking-[0.25em] uppercase mb-2 pb-2"
         style={{ color: "var(--gold-muted)", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        {title}
      </p>
      <div className="flex flex-col gap-0.5 pt-2">{children}</div>
    </div>
  );
}