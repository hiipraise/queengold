"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatPrice, formatDate } from "@/lib/utils";

interface Order {
  _id: string;
  orderNumber: string;
  customer?: { firstName: string; lastName: string; email: string };
  guestEmail?: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number }>;
}

const ORDER_STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"];
const PAYMENT_STATUSES = ["pending","paid","failed","refunded"];

const STATUS_COLORS: Record<string, { c: string; bg: string }> = {
  pending:    { c: "#C9A84C", bg: "rgba(201,168,76,0.1)"  },
  confirmed:  { c: "#22783C", bg: "rgba(34,120,60,0.1)"   },
  processing: { c: "#D4AF37", bg: "rgba(212,175,55,0.1)"  },
  shipped:    { c: "#2980B9", bg: "rgba(41,128,185,0.1)"  },
  delivered:  { c: "#22783C", bg: "rgba(34,120,60,0.1)"   },
  cancelled:  { c: "#C0392B", bg: "rgba(192,57,43,0.1)"   },
  refunded:   { c: "#7F8C8D", bg: "rgba(127,140,141,0.1)" },
  paid:       { c: "#22783C", bg: "rgba(34,120,60,0.1)"   },
  failed:     { c: "#C0392B", bg: "rgba(192,57,43,0.1)"   },
};

function Badge({ value }: { value: string }) {
  const cfg = STATUS_COLORS[value] ?? { c: "var(--text-muted)", bg: "transparent" };
  return (
    <span className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
          style={{ color: cfg.c, background: cfg.bg }}>
      {value}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [statusF, setStatusF] = useState("");
  const [payF,    setPayF]    = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNum, setTrackingNum] = useState("");
  const limit = 20;

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), limit: String(limit),
      ...(statusF ? { status: statusF } : {}),
      ...(payF ? { payment: payF } : {}),
    });
    const res  = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, statusF, payF]);

  useEffect(() => { fetch_(); }, [fetch_]);

  async function handleUpdate(id: string) {
    const updates: Record<string, string> = {};
    if (newStatus)    updates.orderStatus   = newStatus;
    if (trackingNum)  updates.trackingNumber = trackingNum;
    if (Object.keys(updates).length === 0) { setEditingId(null); return; }

    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setEditingId(null);
    setNewStatus("");
    setTrackingNum("");
    fetch_();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-gold-gradient">Orders</h1>
          <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>{total} total orders</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <select value={statusF} onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                className="input-luxury h-10 px-3 text-sm rounded-sm">
          <option value="">All order statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={payF} onChange={(e) => { setPayF(e.target.value); setPage(1); }}
                className="input-luxury h-10 px-3 text-sm rounded-sm">
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={fetch_} className="font-display text-xs tracking-[0.15em] uppercase px-5 h-10 rounded-sm"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>
          Refresh
        </button>
      </div>

      <div className="card-luxury overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-gold)" }}>
              {["Order", "Customer", "Items", "Total", "Order Status", "Payment", "Date", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-display text-xs tracking-[0.15em] uppercase whitespace-nowrap"
                    style={{ color: "var(--gold-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center opacity-40 font-body text-xs tracking-widest uppercase">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center opacity-40 font-body text-xs tracking-widest uppercase">No orders</td></tr>
            ) : orders.map((o) => (
              <React.Fragment key={o._id}>
                <tr style={{ borderBottom: editingId === o._id ? "none" : "1px solid rgba(212,175,55,0.07)" }}
                    className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-body text-xs tracking-widest font-medium" style={{ color: "var(--gold-light)" }}>
                    {o.orderNumber}
                  </td>
                  <td className="px-4 py-3 font-body text-xs" style={{ color: "var(--text-muted)" }}>
                    {o.customer
                      ? `${o.customer.firstName} ${o.customer.lastName}`
                      : o.guestEmail ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-center" style={{ color: "var(--text-muted)" }}>
                    {o.items.length}
                  </td>
                  <td className="px-4 py-3 font-body text-sm" style={{ color: "var(--gold)" }}>
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-4 py-3"><Badge value={o.orderStatus} /></td>
                  <td className="px-4 py-3"><Badge value={o.paymentStatus} /></td>
                  <td className="px-4 py-3 font-body text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (editingId === o._id) { setEditingId(null); return; }
                        setEditingId(o._id);
                        setNewStatus(o.orderStatus);
                        setTrackingNum("");
                      }}
                      className="font-display text-[10px] tracking-[0.15em] uppercase opacity-70 hover:opacity-100"
                      style={{ color: "var(--gold-muted)" }}
                    >
                      {editingId === o._id ? "Cancel" : "Update"}
                    </button>
                  </td>
                </tr>

                {editingId === o._id && (
                  <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }}>
                    <td colSpan={8} className="px-4 pb-4">
                      <div className="flex items-center gap-3 flex-wrap pt-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="input-luxury h-9 px-3 text-xs rounded-sm"
                        >
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input
                          type="text"
                          placeholder="Tracking number (optional)"
                          value={trackingNum}
                          onChange={(e) => setTrackingNum(e.target.value)}
                          className="input-luxury h-9 px-3 text-xs rounded-sm w-52"
                        />
                        <button
                          onClick={() => handleUpdate(o._id)}
                          className="btn-gold px-5 h-9 text-xs rounded-sm"
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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