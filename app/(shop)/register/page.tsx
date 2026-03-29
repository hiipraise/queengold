"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setMsg(res.ok ? "Account created. Please sign in." : "Unable to create account.");
  }

  return <main className="max-w-md mx-auto px-4 py-10"><form onSubmit={submit} className="card-luxury p-6 space-y-3"><h1 className="font-serif text-3xl">Create Account</h1>{Object.entries(form).map(([k,v]) => <input key={k} type={k === "password" ? "password" : "text"} placeholder={k} value={v} onChange={(e)=>setForm((p)=>({...p,[k]: e.target.value}))} className="input-luxury h-11 px-3 w-full" />)}<button className="btn-gold h-11 w-full text-xs">Create Account</button>{msg && <p className="text-sm">{msg}</p>}</form></main>;
}
