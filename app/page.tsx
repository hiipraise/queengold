import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Collection } from "@/lib/models/Collection";
import { Category } from "@/lib/models/Category";

export const metadata: Metadata = {
  title: "Queen Gold — Authentic Luxury Timepieces",
  description: "Discover Queen Gold's collection of handcrafted luxury wristwatches. Each piece certified authentic with our Digital Watch Passport.",
};

export const revalidate = 60;

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    await connectDB();
    const products = await Product.find({ status: "active", isFeatured: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(8)
      .select("name slug price comparePrice thumbnailImage isBestSeller isNewArrival isLimitedEdition stock specifications")
      .lean();
    return products.map((p) => ({ ...p, _id: String(p._id) })) as ProductCardData[];
  } catch {
    return [];
  }
}

async function getNewArrivals(): Promise<ProductCardData[]> {
  try {
    await connectDB();
    const products = await Product.find({ status: "active", isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("name slug price comparePrice thumbnailImage isBestSeller isNewArrival isLimitedEdition stock specifications")
      .lean();
    return products.map((p) => ({ ...p, _id: String(p._id) })) as ProductCardData[];
  } catch {
    return [];
  }
}

async function getFeaturedCollections() {
  try {
    await connectDB();
    return await Collection.find({ isActive: true, isFeatured: true })
      .sort({ sortOrder: 1 })
      .limit(3)
      .lean();
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    await connectDB();
    return await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .limit(6)
      .lean();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, newArrivals, collections, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getFeaturedCollections(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">
        {/* Decorative rings */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
          style={{ border: "1px solid var(--gold)" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.03] pointer-events-none"
          style={{ border: "1px solid var(--gold)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto animate-fade-up">
          <p className="font-display text-xs tracking-[0.4em] uppercase mb-6 delay-100 animate-fade-in"
             style={{ color: "var(--gold-muted)", opacity: 0 }}>
            Est. Lagos · Timepieces of Distinction
          </p>

          <div className="divider-gold w-20 mx-auto mb-8" />

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6 delay-200 animate-fade-in"
              style={{ opacity: 0 }}>
            <span className="text-gold-shimmer">Time</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>Elevated to</span>
            <br />
            <span className="text-gold-gradient">Art</span>
          </h1>

          <p className="font-body text-base sm:text-lg leading-relaxed mb-10 delay-300 animate-fade-in"
             style={{ color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 2.5rem", opacity: 0 }}>
            Each Queen Gold timepiece carries a Digital Watch Passport — your guarantee of authenticity, craftsmanship, and legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 delay-400 animate-fade-in"
               style={{ opacity: 0 }}>
            <Link href="/shop" className="btn-gold px-10 h-13 text-xs rounded-sm inline-flex items-center justify-center py-3.5">
              Explore Collection
            </Link>
            <Link
              href="/verify"
              className="px-10 h-13 font-display text-xs tracking-[0.25em] uppercase rounded-sm inline-flex items-center justify-center py-3.5 transition-colors hover:bg-white/5"
              style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
            >
              Verify Authenticity
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-fade-in delay-500"
             style={{ opacity: 0 }}>
          <div className="w-px h-10" style={{ background: "linear-gradient(180deg, transparent, var(--gold))" }} />
          <p className="font-display text-[9px] tracking-[0.35em] uppercase" style={{ color: "var(--gold-muted)" }}>
            Scroll
          </p>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border-gold)", borderBottom: "1px solid var(--border-gold)" }}>
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "✦", title: "Certified Authentic", desc: "Digital Watch Passport with every piece" },
            { icon: "◇", title: "Precision Crafted", desc: "Swiss-grade movements, African soul" },
            { icon: "○", title: "2-Year Warranty", desc: "Comprehensive manufacturer coverage" },
            { icon: "△", title: "Secure Checkout", desc: "Protected payments via Squad by GTBank" },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <p className="font-serif text-xl mb-2" style={{ color: "var(--gold)" }}>{item.icon}</p>
              <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--gold-muted)" }}>
                {item.title}
              </p>
              <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-display text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
                Curated Selection
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-gold-gradient">
                Featured Timepieces
              </h2>
              <div className="divider-gold w-24 mx-auto mt-5" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} priority={i < 2} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 font-display text-xs tracking-[0.25em] uppercase pb-0.5"
                style={{ borderBottom: "1px solid rgba(212,175,55,0.4)", color: "var(--gold-muted)" }}
              >
                View All Watches
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Collections Banner ────────────────────────────────────────── */}
      {collections.length > 0 && (
        <section className="py-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {collections.slice(0, 3).map((col, i) => (
                <Link
                  key={String(col._id)}
                  href={`/collections/${col.slug}`}
                  className="group relative overflow-hidden rounded-sm"
                  style={{ aspectRatio: i === 0 ? "2/3" : "1/1" }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(160deg, rgba(75,14,35,0.6), rgba(22,4,12,0.9))`,
                    }}
                  />
                  {col.coverImage && (
                    <Image
                      src={col.coverImage}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 -z-10"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <p className="font-display text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--gold-muted)" }}>
                      Collection
                    </p>
                    <h3 className="font-serif text-2xl text-gold-gradient mb-2">{col.name}</h3>
                    <p className="font-body text-xs" style={{ color: "rgba(245,230,200,0.6)" }}>{col.tagline}</p>
                    <div
                      className="mt-4 w-0 group-hover:w-16 h-px transition-all duration-400"
                      style={{ background: "var(--gold)" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── New Arrivals ──────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-display text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
                  Just Arrived
                </p>
                <h2 className="font-serif text-3xl text-gold-gradient">New Arrivals</h2>
              </div>
              <Link
                href="/shop?filter=new"
                className="hidden sm:flex items-center gap-2 font-display text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "var(--gold-muted)" }}
              >
                See All
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Categories ────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 px-4" style={{ borderTop: "1px solid var(--border-gold)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl text-gold-gradient">Shop by Category</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={String(cat._id)}
                  href={`/shop/${cat.slug}`}
                  className="px-6 py-3 font-display text-xs tracking-[0.25em] uppercase rounded-sm transition-all duration-200 hover:scale-105"
                  style={{
                    border: "1px solid var(--border-gold)",
                    color: "var(--gold-muted)",
                    background: "rgba(212,175,55,0.04)",
                  }}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/shop"
                className="px-6 py-3 font-display text-xs tracking-[0.25em] uppercase rounded-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))",
                  border: "1px solid rgba(212,175,55,0.5)",
                  color: "var(--gold)",
                }}
              >
                All Watches
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Authenticity Section ──────────────────────────────────────── */}
      <section
        className="py-24 px-4"
        style={{
          background: "linear-gradient(160deg, rgba(45,6,20,0.5), rgba(26,5,9,0.8))",
          borderTop: "1px solid var(--border-gold)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ background: "var(--gold)", opacity: 0.5 }} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10.5" stroke="var(--gold)" strokeWidth="1" />
              <path d="M7 12l3.5 3.5L17 8.5" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="w-8 h-px" style={{ background: "var(--gold)", opacity: 0.5 }} />
          </div>
          <p className="font-display text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
            Guaranteed Authentic
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold-gradient mb-6">
            Every Timepiece Comes with a<br />Digital Watch Passport
          </h2>
          <p className="font-body text-base leading-relaxed mb-10" style={{ color: "var(--text-muted)", maxWidth: "520px", margin: "0 auto 2.5rem" }}>
            Each Queen Gold watch carries a unique serial number linked to its Digital Watch Passport — an immutable record of provenance, ownership, and authenticity you can verify anywhere, instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/verify" className="btn-gold px-10 h-12 text-xs rounded-sm inline-flex items-center justify-center">
              Verify Your Watch
            </Link>
            <Link
              href="/about"
              className="px-10 h-12 font-display text-xs tracking-[0.2em] uppercase rounded-sm inline-flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}