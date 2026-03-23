"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import QueenGoldLogo from "@/components/QueenGoldLogo";
import { useStore } from "@/lib/store";

const links = [
  ["/shop", "Shop"],
  ["/collections/eternal-reign", "Collections"],
  ["/categories/luxury", "Categories"],
  ["/verify", "Passport Verify"],
  ["/account", "Account"],
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { cartCount, toggleCart } = useStore();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-gold)] bg-[rgba(18,5,10,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Queen Gold home"><QueenGoldLogo size="sm" /></Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={`font-display text-xs uppercase tracking-[0.28em] ${pathname.startsWith(href) ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'} transition hover:text-[var(--gold-light)]`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/wishlist" className="rounded-full border border-[var(--border-gold)] px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--gold-light)]">Wishlist</Link>
          <button onClick={() => toggleCart(true)} className="rounded-full bg-[rgba(212,175,55,0.12)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[var(--gold-light)]">Cart ({cartCount})</button>
        </div>
      </div>
    </header>
  );
}
