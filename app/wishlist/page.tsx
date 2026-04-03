import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Wishlist } from "@/lib/models/Wishlist";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/account/login?callbackUrl=/account/wishlist");

  const userId = (session.user as { id?: string }).id;
  await connectDB();

  const wishlist = await Wishlist.findOne({ customer: userId })
    .populate<{
      products: ProductCardData[];
    }>("products", "name slug price comparePrice thumbnailImage stock isNewArrival isBestSeller isLimitedEdition specifications")
    .lean();

  const products: ProductCardData[] = (wishlist?.products ?? []).map((p) => ({
    ...p,
    _id: String(p._id),
  }));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-4 pb-10">
          <nav
            className="flex items-center gap-2 font-body text-xs mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            <Link
              href="/account"
              className="hover:text-white transition-colors"
            >
              Account
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Wishlist</span>
          </nav>
          <h1 className="font-serif text-4xl text-gold-gradient">
            My Wishlist
          </h1>
          <p
            className="font-body text-sm mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            {products.length} saved timepiece{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="card-luxury p-16 text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              className="mx-auto mb-4 opacity-20"
            >
              <path
                d="M24 40s-18-11.5-18-22.5A12 12 0 0 1 24 8a12 12 0 0 1 18 9.5C42 28.5 24 40 24 40z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <p
              className="font-display text-sm tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--gold-muted)" }}
            >
              Your wishlist is empty
            </p>
            <p
              className="font-body text-sm mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              Save timepieces you love to find them later
            </p>
            <Link
              href="/shop"
              className="btn-gold px-8 h-11 text-xs rounded-sm inline-flex items-center justify-center"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
