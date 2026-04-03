"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";

interface Watch {
  serialNumber:   string;
  model:          string;
  collection:     string;
  movement:       string;
  status:         string;
  warrantyStatus: string;
  dateOfPurchase: string | null;
  dealer:         string;
  scanCount:      number;
  firstScannedAt: string | null;
  createdAt:      string;
}

const BLANK_FORM = {
  serialNumber:   "",
  model:          "QG-ER-01",
  collection:     "Eternal Reign",
  movement:       "CROWNCALIBRE™ CC-01",
  status:         "unregistered" as const,
  warrantyStatus: "active" as const,
  dateOfPurchase: "",
  dealer:         "Queen Gold Lagos",
};

const QR_PREVIEW_SIZE  = 480;
const QR_DOWNLOAD_SIZE = 2400;

function qrCodeUrl(serial: string, size = QR_DOWNLOAD_SIZE) {
  return `/api/admin/qr?${new URLSearchParams({ sn: serial, size: String(size) })}`;
}

export default function WatchesClient() {
  const [watches,      setWatches]      = useState<Watch[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [editSerial,   setEditSerial]   = useState<string | null>(null);
  const [form,         setForm]         = useState(BLANK_FORM);
  const [saving,       setSaving]       = useState(false);
  const [formError,    setFormError]    = useState("");
  const [qrSerial,     setQrSerial]     = useState<string | null>(null);
  const limit = 20;

  const fetchWatches = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), limit: String(limit),
      ...(search       ? { q: search }           : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    });
    const res  = await fetch(`/api/admin/watches?${params}`);
    const data = await res.json();
    setWatches(data.watches ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { fetchWatches(); }, [fetchWatches]);

  function openCreate() {
    setForm(BLANK_FORM); setEditSerial(null); setFormError(""); setShowModal(true);
  }

  function openEdit(w: Watch) {
    setForm({
      serialNumber:   w.serialNumber,
      model:          w.model,
      collection:     w.collection,
      movement:       w.movement,
      status:         w.status as typeof BLANK_FORM.status,
      warrantyStatus: w.warrantyStatus as typeof BLANK_FORM.warrantyStatus,
      dateOfPurchase: w.dateOfPurchase ? w.dateOfPurchase.split("T")[0] : "",
      dealer:         w.dealer,
    });
    setEditSerial(w.serialNumber); setFormError(""); setShowModal(true);
  }

  async function handleSave() {
    setSaving(true); setFormError("");
    try {
      const method = editSerial ? "PATCH" : "POST";
      const url    = editSerial
        ? `/api/admin/watches/${encodeURIComponent(editSerial)}`
        : "/api/admin/watches";

      const body = { ...form, dateOfPurchase: form.dateOfPurchase || null };
      if (editSerial) delete (body as { serialNumber?: string }).serialNumber;

      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Failed to save."); return; }
      setShowModal(false); fetchWatches();
    } finally { setSaving(false); }
  }

  async function handleDelete(serial: string) {
    if (!confirm(`Delete serial ${serial}? This cannot be undone.`)) return;
    await fetch(`/api/admin/watches/${encodeURIComponent(serial)}`, { method: "DELETE" });
    fetchWatches();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-gold-gradient">Watch Registry</h1>
          <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {total} timepiece{total !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button onClick={openCreate} className="btn-gold px-6 h-10 text-xs rounded-sm">
          + Add Watch
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Search serial…" value={search}
               onChange={e => { setSearch(e.target.value.toUpperCase()); setPage(1); }}
               className="input-luxury h-10 px-4 text-sm rounded-sm w-52" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="input-luxury h-10 px-3 text-sm rounded-sm">
          <option value="">All statuses</option>
          <option value="unregistered">Unregistered</option>
          <option value="registered">Registered</option>
          <option value="sold">Sold</option>
        </select>
        <button onClick={fetchWatches} className="font-display text-xs tracking-[0.15em] uppercase px-5 h-10 rounded-sm"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>
          Refresh
        </button>
      </div>

      <div className="card-luxury overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-gold)" }}>
              {["Serial","Model","Collection","Status","Warranty","Scans","First Scan","Date of Purchase","Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-display text-xs tracking-[0.15em] uppercase whitespace-nowrap"
                    style={{ color: "var(--gold-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center opacity-40 font-body text-xs tracking-widest uppercase">Loading…</td></tr>
            ) : watches.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center opacity-40 font-body text-xs tracking-widest uppercase">No watches found</td></tr>
            ) : watches.map(w => (
              <tr key={w.serialNumber} style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }}
                  className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-body text-xs tracking-widest font-medium" style={{ color: "var(--gold-light)" }}>
                  {w.serialNumber}
                </td>
                <td className="px-4 py-3 font-body text-xs" style={{ color: "var(--text-muted)" }}>{w.model}</td>
                <td className="px-4 py-3 font-body text-xs" style={{ color: "var(--text-muted)" }}>{w.collection}</td>
                <td className="px-4 py-3"><StatusBadge value={w.status} /></td>
                <td className="px-4 py-3"><WarrantyBadge value={w.warrantyStatus} /></td>
                <td className="px-4 py-3 font-body text-xs text-center"
                    style={{ color: w.scanCount > 5 ? "#E8C060" : "var(--text-muted)" }}>
                  {w.scanCount}
                  {w.scanCount > 10 && <span className="ml-1 text-[10px]" title="High scan count">⚠</span>}
                </td>
                <td className="px-4 py-3 font-body text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {formatDate(w.firstScannedAt)}
                </td>
                <td className="px-4 py-3 font-body text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {formatDate(w.dateOfPurchase)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(w)} className="font-display text-[10px] tracking-[0.15em] uppercase opacity-70 hover:opacity-100"
                            style={{ color: "var(--gold-muted)" }}>Edit</button>
                    <button onClick={() => setQrSerial(w.serialNumber)}
                            className="min-w-[3rem] h-8 px-3 inline-flex items-center justify-center rounded-sm font-display text-xs tracking-[0.18em] uppercase"
                            style={{ color: "var(--gold-light)", border: "1px solid rgba(212,175,55,0.45)", background: "rgba(212,175,55,0.08)" }}>
                      QR
                    </button>
                    <button onClick={() => handleDelete(w.serialNumber)} className="font-display text-[10px] tracking-[0.15em] uppercase opacity-70 hover:opacity-100"
                            style={{ color: "#C0392B" }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="font-display text-xs tracking-[0.15em] uppercase px-4 h-9 rounded-sm disabled:opacity-30"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>Prev</button>
          <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="font-display text-xs tracking-[0.15em] uppercase px-4 h-9 rounded-sm disabled:opacity-30"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>Next</button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editSerial ? `Edit ${editSerial}` : "Register New Watch"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {!editSerial && (
              <Field label="Serial Number" required>
                <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                       value={form.serialNumber} maxLength={32}
                       onChange={e => setForm(f => ({ ...f, serialNumber: e.target.value.toUpperCase() }))}
                       placeholder="e.g. Q04R7254" />
              </Field>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Model">
                <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.model}
                       onChange={e => setForm(f => ({ ...f, model: e.target.value }))} />
              </Field>
              <Field label="Collection">
                <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.collection}
                       onChange={e => setForm(f => ({ ...f, collection: e.target.value }))} />
              </Field>
            </div>
            <Field label="Movement">
              <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.movement}
                     onChange={e => setForm(f => ({ ...f, movement: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm" value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof BLANK_FORM.status }))}>
                  <option value="unregistered">Unregistered</option>
                  <option value="registered">Registered</option>
                  <option value="sold">Sold</option>
                </select>
              </Field>
              <Field label="Warranty">
                <select className="input-luxury w-full h-11 px-3 text-sm rounded-sm" value={form.warrantyStatus}
                        onChange={e => setForm(f => ({ ...f, warrantyStatus: e.target.value as typeof BLANK_FORM.warrantyStatus }))}>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="void">Void</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Purchase">
                <input type="date" className="input-luxury w-full h-11 px-4 text-sm rounded-sm"
                       value={form.dateOfPurchase}
                       onChange={e => setForm(f => ({ ...f, dateOfPurchase: e.target.value }))} />
              </Field>
              <Field label="Dealer">
                <input className="input-luxury w-full h-11 px-4 text-sm rounded-sm" value={form.dealer}
                       onChange={e => setForm(f => ({ ...f, dealer: e.target.value }))} />
              </Field>
            </div>
            {formError && <p className="text-sm animate-fade-in" style={{ color: "#E8A0A0" }}>{formError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 h-11 text-xs rounded-sm">
                {saving ? "Saving…" : editSerial ? "Save Changes" : "Register Watch"}
              </button>
              <button onClick={() => setShowModal(false)}
                      className="font-display text-xs tracking-[0.15em] uppercase px-6 h-11 rounded-sm"
                      style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* QR Modal */}
      {qrSerial && (
        <Modal title={`QR Code — ${qrSerial}`} onClose={() => setQrSerial(null)}>
          <div className="flex flex-col items-center gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl(qrSerial, QR_PREVIEW_SIZE)} alt={`QR for ${qrSerial}`}
                 className="rounded-sm w-60 h-60 sm:w-72 sm:h-72" style={{ imageRendering: "pixelated" }}
                 width={288} height={288} />
            <a href={qrCodeUrl(qrSerial)} download={`qr-${qrSerial}-${QR_DOWNLOAD_SIZE}px.png`}
               className="btn-gold px-8 h-11 text-xs rounded-sm inline-flex items-center justify-center">
              Download High-Res PNG ({QR_DOWNLOAD_SIZE}px)
            </a>
            <p className="font-body text-xs text-center" style={{ color: "var(--text-muted)" }}>
              Links to: /verify?sn={qrSerial}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    unregistered: { label: "Unregistered", color: "#8B6C5C", bg: "rgba(139,108,92,0.1)" },
    registered:   { label: "Registered",   color: "#22783C", bg: "rgba(34,120,60,0.1)"  },
    sold:         { label: "Sold",          color: "#D4AF37", bg: "rgba(212,175,55,0.1)" },
  };
  const s = map[value] ?? map.unregistered;
  return (
    <span className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
          style={{ color: s.color, background: s.bg }}>{s.label}</span>
  );
}

function WarrantyBadge({ value }: { value: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active:  { label: "Active",  color: "#22783C", bg: "rgba(34,120,60,0.1)"  },
    expired: { label: "Expired", color: "#C0392B", bg: "rgba(192,57,43,0.1)"  },
    void:    { label: "Void",    color: "#8B6C5C", bg: "rgba(139,108,92,0.1)" },
  };
  const s = map[value] ?? map.expired;
  return (
    <span className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
          style={{ color: s.color, background: s.bg }}>{s.label}</span>
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

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: "rgba(0,0,0,0.7)" }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card-luxury w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg text-gold-gradient">{title}</h2>
          <button onClick={onClose} className="font-body text-xl opacity-40 hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-primary)", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}