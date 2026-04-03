"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AccountSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");
  const [saving,          setSaving]          = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!currentPassword || !newPassword) { setError("All password fields are required."); return; }
    if (newPassword !== confirmPassword)  { setError("New passwords do not match."); return; }
    if (newPassword.length < 8)           { setError("Password must be at least 8 characters."); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/customers/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to update password."); return; }
      setSuccess("Password updated. Please sign in again.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => signOut({ callbackUrl: "/account/login" }), 1500);
    } finally { setSaving(false); }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="pt-4 pb-10">
          <nav className="flex items-center gap-2 font-body text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            <Link href="/account" className="hover:text-white transition-colors">Account</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Settings</span>
          </nav>
          <h1 className="font-serif text-4xl text-gold-gradient">Settings</h1>
        </div>

        <div className="card-luxury p-6 space-y-5">
          <h2 className="font-serif text-lg text-gold-gradient">Change Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Current Password <span style={{ color: "#C0392B" }}>*</span>
              </label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                     required autoComplete="current-password"
                     className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
            </div>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                New Password <span style={{ color: "#C0392B" }}>*</span>
              </label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                     required autoComplete="new-password" minLength={8}
                     className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
            </div>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Confirm New Password <span style={{ color: "#C0392B" }}>*</span>
              </label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                     required autoComplete="new-password"
                     className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
            </div>

            {error   && <p className="font-body text-sm" style={{ color: "#ff8a80" }}>{error}</p>}
            {success && <p className="font-body text-sm" style={{ color: "#9ccc65" }}>{success}</p>}

            <button type="submit" disabled={saving} className="btn-gold px-8 h-11 text-xs rounded-sm disabled:opacity-70">
              {saving ? "Saving…" : "Update Password"}
            </button>
          </form>
        </div>

        <div className="card-luxury p-6 mt-6">
          <h2 className="font-serif text-lg text-gold-gradient mb-4">Account Actions</h2>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-display text-xs tracking-[0.2em] uppercase px-6 h-10 rounded-sm transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(192,57,43,0.4)", color: "#C0392B" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}