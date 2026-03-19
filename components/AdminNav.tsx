// components/AdminNav.tsx
"use client";

import React, { useState } from "react";
import Link             from "next/link";
import { usePathname }  from "next/navigation";
import { signOut }      from "next-auth/react";
import QueenGoldLogo    from "./QueenGoldLogo";

interface Props {
  userName: string;
}

export default function AdminNav({ userName }: Props) {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  const links = [
    { href: "/admin/watches", label: "Watches" },
    { href: "/admin/logs",    label: "Scan Logs" },
    { href: "/admin/account", label: "Account" },
    { href: "/verify",        label: "Public Verify", external: true },
  ];

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: "/admin/login" });
  }

  return (
    <nav
      className="w-full px-6 py-3 flex items-center justify-between"
      style={{
        background:   "rgba(45,6,20,0.95)",
        borderBottom: "1px solid var(--border-gold)",
        backdropFilter: "blur(12px)",
        position:     "sticky",
        top:          0,
        zIndex:       50,
      }}
    >
      {/* Logo */}
      <Link href="/admin/watches" aria-label="Queen Gold Admin">
        <QueenGoldLogo size="sm" />
      </Link>

      {/* Nav links */}
      <div className="hidden sm:flex items-center gap-6">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="font-display text-xs tracking-[0.2em] uppercase transition-colors"
            style={{
              color: pathname.startsWith(link.href) && !link.external
                ? "var(--gold)"
                : "rgba(245,230,200,0.6)",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* User + sign out */}
      <div className="flex items-center gap-4">
        <span className="hidden sm:block font-body text-xs"
              style={{ color: "rgba(245,230,200,0.5)" }}>
          {userName}
        </span>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="font-display text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-sm transition-colors"
          style={{
            border:  "1px solid var(--border-gold)",
            color:   "var(--gold-muted)",
            background: "transparent",
            cursor:  "pointer",
          }}
        >
          {signingOut ? "…" : "Sign Out"}
        </button>
      </div>
    </nav>
  );
}
