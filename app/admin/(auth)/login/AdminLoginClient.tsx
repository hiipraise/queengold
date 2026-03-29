"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import QueenGoldLogo from "@/components/QueenGoldLogo";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      userType: "admin",
    });

    if (res?.ok) {
      router.push("/admin/watches");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 z-10 relative">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <QueenGoldLogo size="md" />
        </div>

        <div className="card-luxury p-8">
          <h1 className="font-serif text-xl text-gold-gradient text-center mb-1 tracking-wide">
            Admin Portal
          </h1>
          <p className="text-center font-body text-xs tracking-[0.2em] uppercase mb-8"
             style={{ color: "var(--text-muted)" }}>
            Authorised Access Only
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block font-display text-xs tracking-[0.2em] uppercase mb-2"
                     style={{ color: "var(--gold-muted)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@queengold.com"
                className="input-luxury w-full h-12 px-4 text-sm rounded-sm"
              />
            </div>

            <div>
              <label className="block font-display text-xs tracking-[0.2em] uppercase mb-2"
                     style={{ color: "var(--gold-muted)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input-luxury w-full h-12 px-4 text-sm rounded-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-center animate-fade-in"
                 style={{ color: "#E8A0A0" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full h-12 text-sm rounded-sm mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs mt-6 opacity-30 tracking-widest uppercase"
           style={{ color: "var(--gold-muted)" }}>
          Queen Gold Internal
        </p>
      </div>
    </main>
  );
}
