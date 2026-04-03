"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/contexts/CartContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { formatPrice } from "@/lib/utils";

export interface ProductCardData {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  thumbnailImage: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimitedEdition?: boolean;
  stock: number;
  specifications?: {
    movement?: string;
    caseMaterial?: string;
    caseSize?: string;
  };
}

interface Props {
  product: ProductCardData;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: Props) {
  const { addItem, isLoading } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const isOnSale = product.comparePrice != null && product.comparePrice > product.price;
  const discountPct = isOnSale
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col" aria-label={product.name}>
      {/* Image container */}
      <div
        className="relative overflow-hidden rounded-sm mb-4"
        style={{
          aspectRatio: "3/4",
          background: "linear-gradient(145deg, rgba(75,14,35,0.4), rgba(45,6,20,0.6))",
          border: "1px solid var(--border-gold)",
        }}
      >
        {product.thumbnailImage ? (
          <Image
            src={product.thumbnailImage}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="32" cy="32" r="3" fill="currentColor" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isLimitedEdition && (
            <span className="badge-tag" style={{ background: "rgba(212,175,55,0.9)", color: "#1A0509" }}>
              Limited Edition
            </span>
          )}
          {product.isNewArrival && !product.isLimitedEdition && (
            <span className="badge-tag" style={{ background: "rgba(34,120,60,0.9)", color: "#fff" }}>
              New Arrival
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && !product.isLimitedEdition && (
            <span className="badge-tag" style={{ background: "rgba(75,14,35,0.9)", color: "var(--gold-light)" }}>
              Best Seller
            </span>
          )}
          {isOnSale && (
            <span className="badge-tag" style={{ background: "rgba(192,57,43,0.9)", color: "#fff" }}>
              −{discountPct}%
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
            <span className="font-display text-xs tracking-[0.25em] uppercase" style={{ color: "var(--gold-muted)" }}>
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product._id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
          style={{
            background: wishlisted ? "rgba(212,175,55,0.9)" : "rgba(22,4,12,0.8)",
            border: "1px solid rgba(212,175,55,0.4)",
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill={wishlisted ? "#1A0509" : "none"} aria-hidden="true">
            <path d="M7 12s-5.5-3.5-5.5-6.8A3.5 3.5 0 0 1 7 2.7a3.5 3.5 0 0 1 5.5 2.5C12.5 8.5 7 12 7 12z"
              stroke={wishlisted ? "#1A0509" : "rgba(245,230,200,0.85)"} strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Quick add hover overlay */}
        {product.stock > 0 && (
          <div
            className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            style={{ background: "linear-gradient(0deg, rgba(22,4,12,0.95), transparent)" }}
          >
            <button
              onClick={(e) => { e.preventDefault(); addItem(product._id); }}
              disabled={isLoading}
              className="w-full h-9 font-display text-[10px] tracking-[0.2em] uppercase rounded-sm transition-colors"
              style={{
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.5)",
                color: "var(--gold-light)",
              }}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
        {product.specifications?.caseMaterial && (
          <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
            {product.specifications.caseMaterial}
            {product.specifications.caseSize ? ` · ${product.specifications.caseSize}` : ""}
          </p>
        )}
        <h3 className="font-serif text-base leading-snug mb-2 transition-colors group-hover:text-gold-gradient"
            style={{ color: "var(--text-primary)" }}>
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-body text-sm font-medium" style={{ color: "var(--gold)" }}>
            {formatPrice(product.price)}
          </span>
          {isOnSale && (
            <span className="font-body text-xs line-through" style={{ color: "var(--text-muted)" }}>
              {formatPrice(product.comparePrice!)}
            </span>
          )}
        </div>
      </Link>

      <style jsx>{`
        .badge-tag {
          display: inline-block;
          font-family: 'Cormorant SC', serif;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 2px;
        }
      `}</style>
    </article>
  );
}