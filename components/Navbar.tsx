"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import QueenGoldLogo from "./QueenGoldLogo";
import { useCart } from "@/lib/contexts/CartContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Limited Edition", href: "/shop?filter=limited" },
  { label: "Verify", href: "/verify" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  const isTransparent = !scrolled && (pathname === "/" || pathname === "");

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-40 transition-all duration-500"
        style={{
          background: isTransparent
            ? "transparent"
            : "rgba(22, 4, 12, 0.95)",
          backdropFilter: isTransparent ? "none" : "blur(16px)",
          borderBottom: isTransparent
            ? "none"
            : "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Left: mobile menu + desktop nav */}
            <div className="flex items-center gap-8">
              <button
                className="lg:hidden p-2 -ml-2"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <HamburgerIcon />
              </button>

              <nav className="hidden lg:flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-display text-[11px] tracking-[0.25em] uppercase transition-all duration-200"
                    style={{
                      color: pathname.startsWith(link.href.split("?")[0])
                        ? "var(--gold)"
                        : "rgba(245,230,200,0.75)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Centre: Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Queen Gold">
              <QueenGoldLogo size="sm" />
            </Link>

            {/* Right: search, wishlist, account, cart */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-sm transition-colors hover:bg-white/5"
                aria-label="Search"
              >
                <SearchIcon />
              </button>

              <Link
                href="/account/wishlist"
                className="relative p-2 rounded-sm transition-colors hover:bg-white/5"
                aria-label={`Wishlist (${wishlistCount})`}
              >
                <HeartIcon />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center font-body text-[9px]"
                        style={{ background: "var(--gold)", color: "#1A0509" }}>
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="hidden sm:block p-2 rounded-sm transition-colors hover:bg-white/5"
                aria-label="Account"
              >
                <UserIcon />
              </Link>

              <button
                onClick={openCart}
                className="relative p-2 rounded-sm transition-colors hover:bg-white/5"
                aria-label={`Cart (${itemCount} items)`}
              >
                <BagIcon />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center font-body text-[9px]"
                        style={{ background: "var(--gold)", color: "#1A0509" }}>
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div
            className="absolute inset-x-0 top-full py-4 px-6"
            style={{ background: "rgba(22,4,12,0.98)", borderBottom: "1px solid var(--border-gold)" }}
          >
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search timepieces..."
                className="input-luxury flex-1 h-12 px-5 text-sm rounded-sm"
                autoComplete="off"
              />
              <button type="submit" className="btn-gold px-6 h-12 text-xs rounded-sm">
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-4 h-12 font-display text-xs tracking-widest uppercase rounded-sm"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className="absolute left-0 top-0 bottom-0 w-72 flex flex-col py-8 px-6"
            style={{ background: "linear-gradient(160deg, #1A0509, #2D0614)", borderRight: "1px solid var(--border-gold)" }}
          >
            <div className="flex items-center justify-between mb-10">
              <QueenGoldLogo size="sm" />
              <button onClick={() => setMobileOpen(false)} className="opacity-60 hover:opacity-100 p-2">
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-display text-xs tracking-[0.25em] uppercase py-3 border-b transition-colors"
                  style={{
                    borderColor: "rgba(212,175,55,0.1)",
                    color: pathname.startsWith(link.href.split("?")[0]) ? "var(--gold)" : "rgba(245,230,200,0.75)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Link href="/account" className="font-display text-xs tracking-[0.2em] uppercase py-2" style={{ color: "var(--gold-muted)" }}>
                My Account
              </Link>
              <Link href="/account/orders" className="font-display text-xs tracking-[0.2em] uppercase py-2" style={{ color: "var(--gold-muted)" }}>
                Orders
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

/* ── Icon components ─────────────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(245,230,200,0.75)" strokeWidth="1.4" />
      <path d="M11.5 11.5L16 16" stroke="rgba(245,230,200,0.75)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 15s-7-4.35-7-8.5A4.5 4.5 0 0 1 9 3.5 4.5 4.5 0 0 1 16 6.5C16 10.65 9 15 9 15z"
        stroke="rgba(245,230,200,0.75)" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3.5" stroke="rgba(245,230,200,0.75)" strokeWidth="1.4" />
      <path d="M2.5 16c0-3.5 3-5 6.5-5s6.5 1.5 6.5 5" stroke="rgba(245,230,200,0.75)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="7" width="14" height="10" rx="1.5" stroke="rgba(245,230,200,0.75)" strokeWidth="1.4" />
      <path d="M6 7V5a3 3 0 0 1 6 0v2" stroke="rgba(245,230,200,0.75)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <line x1="3" y1="6" x2="19" y2="6" stroke="rgba(245,230,200,0.85)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="11" x2="19" y2="11" stroke="rgba(245,230,200,0.85)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="16" x2="13" y2="16" stroke="rgba(245,230,200,0.85)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="rgba(245,230,200,0.75)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}