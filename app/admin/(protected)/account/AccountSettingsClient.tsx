"use client";

import { FormEvent, useState } from "react";
import { signOut } from "next-auth/react";

export default function AccountSettingsClient() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail && !newPassword) {
      setError("Enter a new email address, a new password, or both.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Failed to update account.");
        return;
      }

      setSuccess(data.message ?? "Account updated successfully.");
      setEmail("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        void signOut({ callbackUrl: "/admin/login" });
      }, 1200);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-gold-gradient">Account Settings</h1>
        <p className="font-body text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          Admin and superadmin users can update their login email and password here.
          You&apos;ll be signed out after saving so you can log back in with the new credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-luxury p-6 space-y-5">
        <div className="space-y-2">
          <label className="font-display text-xs tracking-[0.15em] uppercase"
                 style={{ color: "var(--gold-muted)" }}>
            New Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="Leave blank to keep current email"
            className="input-luxury h-11 px-4 text-sm rounded-sm w-full"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="font-display text-xs tracking-[0.15em] uppercase"
                 style={{ color: "var(--gold-muted)" }}>
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={event => setCurrentPassword(event.target.value)}
            placeholder="Required to confirm changes"
            className="input-luxury h-11 px-4 text-sm rounded-sm w-full"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="font-display text-xs tracking-[0.15em] uppercase"
                   style={{ color: "var(--gold-muted)" }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
              className="input-luxury h-11 px-4 text-sm rounded-sm w-full"
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <label className="font-display text-xs tracking-[0.15em] uppercase"
                   style={{ color: "var(--gold-muted)" }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              placeholder="Repeat new password"
              className="input-luxury h-11 px-4 text-sm rounded-sm w-full"
              autoComplete="new-password"
              minLength={8}
              disabled={!newPassword}
            />
          </div>
        </div>

        {error ? (
          <p className="font-body text-sm" style={{ color: "#ff8a80" }}>
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="font-body text-sm" style={{ color: "#9ccc65" }}>
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="btn-gold px-6 h-11 text-xs rounded-sm disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save Credentials"}
        </button>
      </form>
    </div>
  );
}
