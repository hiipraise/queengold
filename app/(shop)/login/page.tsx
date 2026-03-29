"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, userType: "customer", redirect: true, callbackUrl: "/account" });
    if (res?.error) setError("Invalid login credentials");
  }

  return <main className="max-w-md mx-auto px-4 py-10"><form onSubmit={submit} className="card-luxury p-6 space-y-3"><h1 className="font-serif text-3xl">Sign In</h1><input className="input-luxury h-11 px-3 w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><input type="password" className="input-luxury h-11 px-3 w-full" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />{error && <p className="text-sm text-red-200">{error}</p>}<button className="btn-gold h-11 w-full text-xs">Sign In</button></form></main>;
}
