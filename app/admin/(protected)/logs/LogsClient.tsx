"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ScanLog {
  serialAttempted: string;
  ip:              string;
  userAgent:       string;
  found:           boolean;
  timestamp:       string;
}

export default function LogsClient() {
  const [logs,     setLogs]     = useState<ScanLog[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [snFilter, setSnFilter] = useState("");
  const [ipFilter, setIpFilter] = useState("");
  const [loading,  setLoading]  = useState(true);
  const limit = 50;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), limit: String(limit),
      ...(snFilter ? { sn: snFilter } : {}),
      ...(ipFilter ? { ip: ipFilter } : {}),
    });
    const res  = await fetch(`/api/admin/logs?${params}`);
    const data = await res.json();
    setLogs(data.logs ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, snFilter, ipFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-gold-gradient">Scan Logs</h1>
          <p className="font-body text-xs mt-1 tracking-wide" style={{ color: "var(--text-muted)" }}>
            {total} entries · auto-expire after 90 days
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Filter by serial…" value={snFilter}
               onChange={e => { setSnFilter(e.target.value.toUpperCase()); setPage(1); }}
               className="input-luxury h-10 px-4 text-sm rounded-sm w-44" />
        <input type="text" placeholder="Filter by IP…" value={ipFilter}
               onChange={e => { setIpFilter(e.target.value); setPage(1); }}
               className="input-luxury h-10 px-4 text-sm rounded-sm w-44" />
        <button onClick={fetchLogs} className="font-display text-xs tracking-[0.15em] uppercase px-5 h-10 rounded-sm"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>
          Refresh
        </button>
      </div>

      <div className="card-luxury overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-gold)" }}>
              {["Timestamp","Serial Attempted","Result","IP Address","User Agent"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-display text-xs tracking-[0.15em] uppercase whitespace-nowrap"
                    style={{ color: "var(--gold-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center opacity-40 font-body text-xs tracking-widest uppercase">Loading…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center opacity-40 font-body text-xs tracking-widest uppercase">No logs found</td></tr>
            ) : logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-body text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {new Date(log.timestamp).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-3 font-body text-xs tracking-widest font-medium" style={{ color: "var(--gold-light)" }}>
                  {log.serialAttempted}
                </td>
                <td className="px-4 py-3">
                  <span className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
                        style={{
                          color:      log.found ? "#22783C" : "#C0392B",
                          background: log.found ? "rgba(34,120,60,0.1)" : "rgba(192,57,43,0.1)",
                        }}>
                    {log.found ? "Found" : "Not Found"}
                  </span>
                </td>
                <td className="px-4 py-3 font-body text-xs" style={{ color: "var(--text-muted)" }}>
                  {log.ip}
                </td>
                <td className="px-4 py-3 font-body text-xs max-w-xs truncate"
                    style={{ color: "rgba(245,230,200,0.3)" }} title={log.userAgent}>
                  {log.userAgent || "—"}
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
    </div>
  );
}