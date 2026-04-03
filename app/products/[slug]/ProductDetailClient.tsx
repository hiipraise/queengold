"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/contexts/CartContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { formatPrice, formatDate } from "@/lib/utils";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";
import WatchPassport from "@/components/WatchPassport";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  images: string[];
  thumbnailImage: string;
  category: { _id: string; name: string; slug: string };
  collections: Array<{ _id: string; name: string; slug: string }>;
  tags: string[];
  gender: string;
  specifications: {
    movement: string;
    caseMaterial: string;
    caseSize: string;
    dialColor: string;
    bracelet: string;
    waterResistance: string;
    crystalType: string;
    powerReserve?: string;
    functions?: string;
    lugWidth?: string;
    thickness?: string;
  };
  warrantyYears: number;
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  createdAt: string;
}

interface Props {
  product: Product;
  relatedProducts: ProductCardData[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem, isLoading } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const allImages = [product.thumbnailImage, ...product.images.filter((img) => img !== product.thumbnailImage)];
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "warranty">("description");

  const isOnSale = product.comparePrice != null && product.comparePrice > product.price;
  const discountPct = isOnSale
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;
  const inStock = product.stock > 0;

  async function handleAddToCart() {
    await addItem(product._id, qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2500);
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="py-6 flex items-center gap-2 font-body text-xs" style={{ color: "var(--text-muted)" }} aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-white transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 pb-20">

          {/* ── Image Gallery ──────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative overflow-hidden rounded-sm"
              style={{
                aspectRatio: "1/1",
                background: "linear-gradient(145deg, rgba(75,14,35,0.4), rgba(45,6,20,0.6))",
                border: "1px solid var(--border-gold)",
              }}
            >
              {allImages[activeImage] ? (
                <Image
                  src={allImages[activeImage]}
                  alt={`${product.name} — image ${activeImage + 1}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="60" cy="60" r="25" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="60" cy="60" r="5" fill="currentColor" />
                  </svg>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isLimitedEdition && (
                  <span className="inline-block font-display text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm"
                        style={{ background: "rgba(212,175,55,0.9)", color: "#1A0509" }}>
                    Limited Edition
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="inline-block font-display text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm"
                        style={{ background: "rgba(34,120,60,0.9)", color: "#fff" }}>
                    New Arrival
                  </span>
                )}
                {isOnSale && (
                  <span className="inline-block font-display text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm"
                        style={{ background: "rgba(192,57,43,0.9)", color: "#fff" }}>
                    −{discountPct}% Off
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="flex-shrink-0 relative w-20 h-20 rounded-sm overflow-hidden transition-all"
                    style={{
                      border: i === activeImage ? "2px solid var(--gold)" : "1px solid var(--border-gold)",
                      background: "rgba(45,6,20,0.5)",
                      opacity: i === activeImage ? 1 : 0.6,
                    }}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ───────────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="font-display text-[10px] tracking-[0.3em] uppercase mb-3 w-fit"
                style={{ color: "var(--gold-muted)" }}
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h1>

            <p className="font-body text-xs tracking-[0.1em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              SKU: {product.sku}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-serif text-3xl" style={{ color: "var(--gold)" }}>
                {formatPrice(product.price)}
              </span>
              {isOnSale && (
                <span className="font-body text-base line-through" style={{ color: "var(--text-muted)" }}>
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>

            <div className="divider-gold mb-6" />

            <p className="font-body text-sm leading-relaxed mb-8" style={{ color: "rgba(245,230,200,0.7)" }}>
              {product.shortDescription}
            </p>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Movement", value: product.specifications.movement },
                { label: "Case", value: product.specifications.caseMaterial },
                { label: "Diameter", value: product.specifications.caseSize },
                { label: "Crystal", value: product.specifications.crystalType },
              ].map((spec) => (
                <div key={spec.label} className="p-3 rounded-sm" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid var(--border-gold)" }}>
                  <p className="font-display text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--gold-muted)" }}>{spec.label}</p>
                  <p className="font-body text-xs" style={{ color: "var(--text-primary)" }}>{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: inStock ? "#22783C" : "#C0392B" }} />
              <span className="font-display text-[10px] tracking-[0.2em] uppercase" style={{ color: inStock ? "#22783C" : "#C0392B" }}>
                {inStock ? `In Stock (${product.stock} available)` : "Sold Out"}
              </span>
            </div>

            {/* Qty + Add to cart */}
            {inStock && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center rounded-sm"
                    style={{ border: "1px solid var(--border-gold)" }}
                  >
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-11 h-12 flex items-center justify-center text-lg transition-colors hover:bg-white/5"
                      style={{ color: "var(--gold-muted)" }}
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-body text-sm" style={{ color: "var(--text-primary)" }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="w-11 h-12 flex items-center justify-center text-lg transition-colors hover:bg-white/5"
                      style={{ color: "var(--gold-muted)" }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className="btn-gold flex-1 h-12 text-xs rounded-sm transition-all"
                    style={addedFeedback ? { background: "linear-gradient(135deg, #22783C, #2d9e52)" } : {}}
                  >
                    {addedFeedback ? "Added to Cart!" : isLoading ? "Adding..." : "Add to Cart"}
                  </button>
                </div>

                <Link
                  href="/checkout"
                  className="w-full h-12 flex items-center justify-center font-display text-xs tracking-[0.2em] uppercase rounded-sm transition-colors hover:bg-white/10"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
                  onClick={() => addItem(product._id, qty)}
                >
                  Buy Now
                </Link>
              </div>
            )}

            {/* Wishlist */}
            <button
              onClick={() => toggle(product._id)}
              className="flex items-center gap-2 mb-8 transition-opacity opacity-70 hover:opacity-100"
              style={{ color: wishlisted ? "var(--gold)" : "var(--text-muted)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill={wishlisted ? "currentColor" : "none"}>
                <path d="M8 13s-6-3.8-6-7.2A3.8 3.8 0 0 1 8 2.7a3.8 3.8 0 0 1 6 3.1C14 9.2 8 13 8 13z"
                      stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              <span className="font-display text-[10px] tracking-[0.2em] uppercase">
                {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </span>
            </button>

            <div className="divider-gold mb-6" />

            {/* Trust badges */}
            <div className="space-y-3">
              {[
                { label: "Digital Watch Passport Included", icon: "✓" },
                { label: `${product.warrantyYears}-Year Manufacturer Warranty`, icon: "✓" },
                { label: "Secure Checkout — Squad by GTBank", icon: "✓" },
                { label: "Free Shipping on Orders Over ₦500,000", icon: "✓" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="font-serif text-sm" style={{ color: "var(--gold)" }}>{item.icon}</span>
                  <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Specs / Warranty ─────────────────── */}
        <div className="pb-20">
          <div
            className="flex gap-0 mb-0 border-b"
            style={{ borderColor: "var(--border-gold)" }}
          >
            {(["description", "specs", "warranty"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-4 font-display text-[10px] tracking-[0.25em] uppercase border-b-2 -mb-px transition-colors"
                style={{
                  borderColor: activeTab === tab ? "var(--gold)" : "transparent",
                  color: activeTab === tab ? "var(--gold)" : "var(--text-muted)",
                }}
              >
                {tab === "description" ? "Description" : tab === "specs" ? "Specifications" : "Warranty"}
              </button>
            ))}
          </div>

          <div className="pt-8 max-w-3xl">
            {activeTab === "description" && (
              <div
                className="font-body text-sm leading-relaxed space-y-4 prose-luxury"
                style={{ color: "rgba(245,230,200,0.75)" }}
                dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br />") }}
              />
            )}

            {activeTab === "specs" && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {Object.entries({
                  Movement:          product.specifications.movement,
                  "Case Material":   product.specifications.caseMaterial,
                  "Case Size":       product.specifications.caseSize,
                  "Dial Colour":     product.specifications.dialColor,
                  Bracelet:          product.specifications.bracelet,
                  "Water Resistance":product.specifications.waterResistance,
                  Crystal:           product.specifications.crystalType,
                  ...(product.specifications.powerReserve ? { "Power Reserve": product.specifications.powerReserve } : {}),
                  ...(product.specifications.functions ? { Functions: product.specifications.functions } : {}),
                  ...(product.specifications.lugWidth ? { "Lug Width": product.specifications.lugWidth } : {}),
                  ...(product.specifications.thickness ? { Thickness: product.specifications.thickness } : {}),
                }).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start py-3 gap-4"
                    style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}
                  >
                    <dt className="font-display text-[10px] tracking-[0.2em] uppercase shrink-0 w-40" style={{ color: "var(--gold-muted)" }}>
                      {key}
                    </dt>
                    <dd className="font-body text-sm" style={{ color: "var(--text-primary)" }}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {activeTab === "warranty" && (
              <div className="space-y-6" style={{ color: "rgba(245,230,200,0.75)" }}>
                <div className="card-luxury p-6">
                  <h3 className="font-serif text-lg text-gold-gradient mb-3">
                    {product.warrantyYears}-Year Manufacturer Warranty
                  </h3>
                  <p className="font-body text-sm leading-relaxed mb-4">
                    Your Queen Gold timepiece is covered by a comprehensive {product.warrantyYears}-year manufacturer warranty from the date of purchase. This warranty covers all manufacturing defects in materials and workmanship.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Movement and mechanical components",
                      "Case and bracelet manufacturing defects",
                      "Water resistance (up to rated depth)",
                      "Crown and pusher mechanisms",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 font-body text-sm">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6.5" stroke="var(--gold)" strokeWidth="0.8" />
                          <path d="M4 7l2 2 4-4" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-luxury p-6">
                  <h3 className="font-serif text-base text-gold-gradient mb-2">Digital Watch Passport</h3>
                  <p className="font-body text-sm leading-relaxed">
                    Every Queen Gold watch comes with a unique serial number and Digital Watch Passport. Use our{" "}
                    <Link href="/verify" className="underline" style={{ color: "var(--gold)" }}>verification page</Link>
                    {" "}to confirm authenticity at any time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="pb-20 pt-4" style={{ borderTop: "1px solid var(--border-gold)" }}>
            <div className="pt-12 mb-10 flex items-end justify-between">
              <h2 className="font-serif text-2xl text-gold-gradient">You May Also Like</h2>
              <Link href="/shop" className="hidden sm:flex items-center gap-2 font-display text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: "var(--gold-muted)" }}>
                View All
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}