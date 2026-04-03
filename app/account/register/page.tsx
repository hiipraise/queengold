"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import QueenGoldLogo from "@/components/QueenGoldLogo";

export default function AccountRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          phone:     form.phone,
          password:  form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }

      // Auto sign in after registration
      const loginRes = await signIn("credentials", {
        email:    form.email,
        password: form.password,
        redirect: false,
      });

      if (loginRes?.ok) {
        router.push("/account");
      } else {
        router.push("/account/login?registered=1");
      }
    } finally {
      setLoading(false);
    }
  }

  const f = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16 z-10 relative">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/"><QueenGoldLogo size="md" /></Link>
        </div>

        <div className="card-luxury p-8">
          <h1 className="font-serif text-2xl text-gold-gradient text-center mb-1">Create Account</h1>
          <p className="text-center font-body text-xs tracking-[0.15em] uppercase mb-8"
             style={{ color: "var(--text-muted)" }}>
            Join the Queen Gold Circle
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                  First Name <span style={{ color: "#C0392B" }}>*</span>
                </label>
                <input type="text" value={form.firstName} onChange={(e) => f("firstName", e.target.value)}
                       required autoComplete="given-name"
                       className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
              </div>
              <div>
                <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                  Last Name <span style={{ color: "#C0392B" }}>*</span>
                </label>
                <input type="text" value={form.lastName} onChange={(e) => f("lastName", e.target.value)}
                       required autoComplete="family-name"
                       className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
              </div>
            </div>

            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Email <span style={{ color: "#C0392B" }}>*</span>
              </label>
              <input type="email" value={form.email} onChange={(e) => f("email", e.target.value)}
                     required autoComplete="email"
                     className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
            </div>

            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Phone
              </label>
              <input type="tel" value={form.phone} onChange={(e) => f("phone", e.target.value)}
                     autoComplete="tel" placeholder="+234..."
                     className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
            </div>

            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Password <span style={{ color: "#C0392B" }}>*</span>
              </label>
              <input type="password" value={form.password} onChange={(e) => f("password", e.target.value)}
                     required autoComplete="new-password" minLength={8}
                     className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
            </div>

            <div>
              <label className="block font-display text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--gold-muted)" }}>
                Confirm Password <span style={{ color: "#C0392B" }}>*</span>
              </label>
              <input type="password" value={form.confirmPassword} onChange={(e) => f("confirmPassword", e.target.value)}
                     required autoComplete="new-password"
                     className="input-luxury w-full h-11 px-4 text-sm rounded-sm" />
            </div>

            {error && (
              <p className="text-sm text-center animate-fade-in" style={{ color: "#E8A0A0" }}>{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full h-12 text-xs rounded-sm">
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link href="/account/login" className="underline" style={{ color: "var(--gold-muted)" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}