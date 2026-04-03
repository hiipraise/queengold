"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Category { _id: string; name: string; slug: string; isActive: boolean; sortOrder: number; }

const BLANK = { name: "", slug: "", description: "", isActive: true, sortOrder: 0 };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(BLANK);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const f = (key: keyof typeof BLANK, value: unknown) => setForm(p => ({ ...p, [key]: value }));

  async function handleSave() {
    if (!form.name) { setError("Name is required."); return; }
    setSaving(true); setError("");
    try {
      const res  = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create."); return; }
      setShowModal(false); setForm(BLANK); fetch_();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? This may affect products.`)) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetch_();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-gold-gradient">Categories</h1>
          <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>{categories.length} categories</p>
        </div>
        <button onClick={() => { setShowModal(true); setForm(BLANK); setError(""); }}
                className="btn-gold px-6 h-10 text-xs rounded-sm">
          + Add Category
        </button>
      </div>

      <div className="card-luxury overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-gold)" }}>
              {["Name","Slug","Active","Sort","Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-display text-xs tracking-[0.15em] uppercase"
                    style={{ color: "var(--gold-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center opacity-40 font-body text-xs">Loading…</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center opacity-40 font-body text-xs">No categories yet</td></tr>
            ) : categories.map(cat => (
              <tr key={cat._id} style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }} className="hover:bg-white/5">
                <td className="px-4 py-3 font-body text-sm font-medium" style={{ color: "var(--gold-light)" }}>{cat.name}</td>
                <td className="px-4 py-3 font-body text-xs" style={{ color: "var(--text-muted)" }}>{cat.slug}</td>
                <td className="px-4 py-3">
                  <span className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
                        style={{ color: cat.isActive ? "#22783C" : "#C0392B", background: cat.isActive ? "rgba(34,120,60,0.1)" : "rgba(192,57,43,0.1)" }}>
                    {cat.isActive ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 font-body text-xs text-center" style={{ color: "var(--text-muted)" }}>{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(cat._id, cat.name)}
                          className="font-display text-[10px] tracking-[0.15em] uppercase opacity-70 hover:opacity-100"
                          style={{ color: "#C0392B" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}
             onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="card-luxury w-full max-w-md p-8 space-y-4 animate-fade-up">
            <h2 className="font-serif text-lg text-gold-gradient">Add Category</h2>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Name <span style={{ color: "#C0392B" }}>*</span>
              </label>
              <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.name}
                     onChange={e => f("name", e.target.value)} />
            </div>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Slug (auto-generated if blank)
              </label>
              <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.slug}
                     onChange={e => f("slug", e.target.value)} />
            </div>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Description
              </label>
              <textarea className="input-luxury w-full px-4 py-3 text-sm rounded-sm resize-none" rows={2}
                        value={form.description} onChange={e => f("description", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>Sort Order</label>
                <input type="number" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                       value={form.sortOrder} onChange={e => f("sortOrder", parseInt(e.target.value, 10))} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-7">
                <input type="checkbox" checked={form.isActive} onChange={e => f("isActive", e.target.checked)}
                       style={{ accentColor: "var(--gold)" }} />
                <span className="font-body text-sm" style={{ color: "var(--text-muted)" }}>Active</span>
              </label>
            </div>
            {error && <p className="font-body text-sm" style={{ color: "#ff8a80" }}>{error}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 h-11 text-xs rounded-sm">
                {saving ? "Creating…" : "Create Category"}
              </button>
              <button onClick={() => setShowModal(false)}
                      className="font-display text-xs tracking-[0.15em] uppercase px-6 h-11 rounded-sm"
                      style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}