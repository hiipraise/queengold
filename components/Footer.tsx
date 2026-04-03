"use client";

import React from "react";
import Link from "next/link";
import QueenGoldLogo from "./QueenGoldLogo";

const SHOP_LINKS = [
  { label: "Men's Watches", href: "/shop?gender=men" },
  { label: "Women's Watches", href: "/shop?gender=women" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Best Sellers", href: "/shop?filter=bestseller" },
  { label: "Limited Edition", href: "/shop?filter=limited" },
  { label: "All Collections", href: "/collections" },
];

const INFO_LINKS = [
  { label: "About Queen Gold", href: "/about" },
  { label: "Verify Authenticity", href: "/verify" },
  { label: "Warranty", href: "/warranty" },
  { label: "Care Guide", href: "/care" },
  { label: "Contact Us", href: "/contact" },
];

const ACCOUNT_LINKS = [
  { label: "My Account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Addresses", href: "/account/addresses" },
];

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: "linear-gradient(180deg, rgba(26,5,9,0) 0%, #0D0205 100%)",
        borderTop: "1px solid var(--border-gold)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top strip — newsletter */}
        <div
          className="py-10 text-center"
          style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}
        >
          <p className="font-display text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "var(--gold-muted)" }}>
            Join the Inner Circle
          </p>
          <h3 className="font-serif text-2xl text-gold-gradient mb-6">
            Exclusive Access & Early Releases
          </h3>
          <form
            className="flex gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="input-luxury flex-1 h-12 px-4 text-sm rounded-sm"
            />
            <button type="submit" className="btn-gold px-6 h-12 text-xs rounded-sm">
              Subscribe
            </button>
          </form>
        </div>

        {/* Main grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <QueenGoldLogo size="sm" className="mb-4" />
            <p className="font-body text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
              Crafting timeless luxury wristwatches for those who understand that precision is a form of poetry.
            </p>
            <p className="font-display text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--gold-muted)" }}>
              Lagos, Nigeria
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
              Shop
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-xs transition-colors hover:text-white"
                        style={{ color: "var(--text-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
              Information
            </h4>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-xs transition-colors hover:text-white"
                        style={{ color: "var(--text-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
              Account
            </h4>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-xs transition-colors hover:text-white"
                        style={{ color: "var(--text-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
        >
          <p className="font-body text-xs" style={{ color: "rgba(245,230,200,0.3)" }}>
            &copy; {new Date().getFullYear()} Queen Gold. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-body text-xs transition-colors hover:text-white"
                  style={{ color: "rgba(245,230,200,0.3)" }}>
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-body text-xs transition-colors hover:text-white"
                  style={{ color: "rgba(245,230,200,0.3)" }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}