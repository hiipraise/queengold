import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";

export const metadata: Metadata = {
  title: "Collections — Queen Gold",
  description: "Explore the curated collections from Queen Gold luxury timepieces.",
};

export const revalidate = 120;

export default async function CollectionsPage() {
  await connectDB();
  const collections = await Collection.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center pt-8 pb-14">
          <p className="font-display text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
            Queen Gold
          </p>
          <h1 className="font-serif text-5xl text-gold-gradient mb-4">Collections</h1>
          <div className="divider-gold w-20 mx-auto" />
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-sm tracking-[0.2em] uppercase" style={{ color: "var(--gold-muted)" }}>
              No collections yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col, i) => (
              <Link
                key={String(col._id)}
                href={`/collections/${col.slug}`}
                className="group relative overflow-hidden rounded-sm"
                style={{ aspectRatio: i % 3 === 0 ? "3/4" : "1/1" }}
              >
                <div
                  className="absolute inset-0 z-10 transition-opacity duration-300"
                  style={{ background: "linear-gradient(0deg, rgba(22,4,12,0.9) 0%, rgba(22,4,12,0.3) 60%, transparent 100%)" }}
                />
                {col.coverImage ? (
                  <Image
                    src={col.coverImage}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    priority={i < 2}
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(75,14,35,0.6), rgba(45,6,20,0.9))" }} />
                )}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  {col.isFeatured && (
                    <span className="inline-block self-start font-display text-[9px] tracking-[0.2em] uppercase px-2 py-1 mb-3 rounded-sm"
                          style={{ background: "rgba(212,175,55,0.9)", color: "#1A0509" }}>
                      Featured
                    </span>
                  )}
                  <h2 className="font-serif text-2xl text-gold-gradient mb-2">{col.name}</h2>
                  <p className="font-body text-sm mb-4" style={{ color: "rgba(245,230,200,0.65)" }}>{col.tagline}</p>
                  <div
                    className="flex items-center gap-2 font-display text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
                    style={{ color: "var(--gold-muted)" }}
                  >
                    Explore Collection
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                         className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}