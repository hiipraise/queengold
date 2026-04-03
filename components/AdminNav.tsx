"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import QueenGoldLogo from "./QueenGoldLogo";

interface Props { userName: string; }

const NAV_LINKS = [
  { href: "/admin/watches",     label: "Watches"     },
  { href: "/admin/products",    label: "Products"    },
  { href: "/admin/orders",      label: "Orders"      },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/categories",  label: "Categories"  },
  { href: "/admin/logs",        label: "Scan Logs"   },
  { href: "/admin/account",     label: "Account"     },
  { href: "/verify",            label: "Public Verify", external: true },
];

export default function AdminNav({ userName }: Props) {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: "/admin/login" });
  }

  return (
    <nav
      className="w-full px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50"
      style={{
        background:     "rgba(22,4,12,0.97)",
        borderBottom:   "1px solid var(--border-gold)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-6">
        <Link href="/admin" aria-label="Queen Gold Admin">
          <QueenGoldLogo size="sm" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="font-display text-[10px] tracking-[0.2em] uppercase transition-colors"
              style={{
                color: !link.external && pathname.startsWith(link.href)
                  ? "var(--gold)"
                  : "rgba(245,230,200,0.55)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="xl:hidden p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="2" y1="5" x2="16" y2="5" stroke="rgba(245,230,200,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="2" y1="9" x2="16" y2="9" stroke="rgba(245,230,200,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="2" y1="13" x2="10" y2="13" stroke="rgba(245,230,200,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block font-body text-xs" style={{ color: "rgba(245,230,200,0.4)" }}>
          {userName}
        </span>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="font-display text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm transition-colors hover:bg-white/5"
          style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
        >
          {signingOut ? "…" : "Sign Out"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="absolute left-0 right-0 top-full py-4 px-6 xl:hidden flex flex-wrap gap-x-6 gap-y-3"
          style={{ background: "rgba(22,4,12,0.98)", borderBottom: "1px solid var(--border-gold)" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              onClick={() => setMobileOpen(false)}
              className="font-display text-[10px] tracking-[0.2em] uppercase transition-colors"
              style={{
                color: !link.external && pathname.startsWith(link.href)
                  ? "var(--gold)"
                  : "rgba(245,230,200,0.55)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}