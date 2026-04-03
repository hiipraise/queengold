import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";
import { Product } from "@/lib/models/Product";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const col = await Collection.findOne({ slug: params.slug, isActive: true }).lean();
  if (!col) return { title: "Collection Not Found" };
  return {
    title: `${col.name} Collection`,
    description: col.tagline,
    openGraph: { images: col.coverImage ? [col.coverImage] : [] },
  };
}

export const revalidate = 120;

export default async function CollectionDetailPage({ params }: Props) {
  await connectDB();

  const col = await Collection.findOne({ slug: params.slug, isActive: true }).lean();
  if (!col) notFound();

  const products = await Product.find({ collections: col._id, status: "active" })
    .sort({ sortOrder: 1, createdAt: -1 })
    .select("name slug price comparePrice thumbnailImage isBestSeller isNewArrival isLimitedEdition stock specifications")
    .lean();

  const mappedProducts: ProductCardData[] = products.map((p) => ({
    ...JSON.parse(JSON.stringify(p)),
    _id: String(p._id),
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-96 flex items-end">
        <div className="absolute inset-0 z-0">
          {col.coverImage ? (
            <Image
              src={col.coverImage}
              alt={col.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div style={{ background: "linear-gradient(145deg, #2D0614, #4B0E23)" }} className="absolute inset-0" />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(22,4,12,0.95) 0%, rgba(22,4,12,0.3) 70%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <nav className="flex items-center gap-2 font-body text-xs mb-6" style={{ color: "rgba(245,230,200,0.5)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>{col.name}</span>
          </nav>
          <p className="font-display text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
            Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gold-gradient mb-3">{col.name}</h1>
          <p className="font-body text-base max-w-xl" style={{ color: "rgba(245,230,200,0.65)" }}>{col.tagline}</p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>
              {mappedProducts.length} timepiece{mappedProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {mappedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-sm tracking-[0.2em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
                Coming Soon
              </p>
              <p className="font-body text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Products for this collection are being prepared.
              </p>
              <Link href="/shop" className="btn-gold px-8 h-11 text-xs rounded-sm inline-flex items-center justify-center">
                Browse All Watches
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {mappedProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </section>

      {col.description && (
        <section className="py-16 px-4" style={{ borderTop: "1px solid var(--border-gold)" }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-body text-base leading-relaxed" style={{ color: "rgba(245,230,200,0.65)" }}>
              {col.description}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}