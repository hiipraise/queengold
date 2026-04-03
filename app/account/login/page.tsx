"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import QueenGoldLogo from "@/components/QueenGoldLogo";

export default function AccountLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

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
    });

    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16 z-10 relative">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <QueenGoldLogo size="md" />
          </Link>
        </div>

        <div className="card-luxury p-8">
          <h1 className="font-serif text-2xl text-gold-gradient text-center mb-1">Sign In</h1>
          <p className="text-center font-body text-xs tracking-[0.15em] uppercase mb-8"
             style={{ color: "var(--text-muted)" }}>
            Your Queen Gold Account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5"
                     style={{ color: "var(--gold-muted)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input-luxury w-full h-12 px-4 text-sm rounded-sm"
              />
            </div>

            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5"
                     style={{ color: "var(--gold-muted)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input-luxury w-full h-12 px-4 text-sm rounded-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-center animate-fade-in" style={{ color: "#E8A0A0" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full h-12 text-xs rounded-sm"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/account/register" className="underline" style={{ color: "var(--gold-muted)" }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}