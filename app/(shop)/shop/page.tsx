import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import { getProducts } from "@/lib/storefront";

export default async function ShopPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const page = Number(searchParams.page ?? "1");
  const data = await getProducts({
    page,
    category: typeof searchParams.category === "string" ? searchParams.category : undefined,
    gender: typeof searchParams.gender === "string" ? searchParams.gender : undefined,
    type: typeof searchParams.type === "string" ? searchParams.type : undefined,
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    sort: typeof searchParams.sort === "string" ? searchParams.sort : "latest",
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[280px_1fr] gap-6">
      <aside className="card-luxury p-5 h-fit sticky top-20">
        <h1 className="font-serif text-2xl">Shop</h1>
        <form className="mt-4 space-y-4 text-sm">
          <input name="q" placeholder="Search" defaultValue={typeof searchParams.q === "string" ? searchParams.q : ""} className="input-luxury h-10 px-3 w-full" />
          <select name="gender" defaultValue={typeof searchParams.gender === "string" ? searchParams.gender : ""} className="input-luxury h-10 px-3 w-full">
            <option value="">All Genders</option><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option>
          </select>
          <select name="type" defaultValue={typeof searchParams.type === "string" ? searchParams.type : ""} className="input-luxury h-10 px-3 w-full">
            <option value="">All Types</option><option value="classic">Classic</option><option value="sport">Sport</option><option value="luxury">Luxury</option><option value="limited-edition">Limited Edition</option><option value="signature">Signature Collection</option>
          </select>
          <select name="sort" defaultValue={typeof searchParams.sort === "string" ? searchParams.sort : "latest"} className="input-luxury h-10 px-3 w-full">
            <option value="latest">Latest</option><option value="popular">Best Sellers</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option>
          </select>
          <button className="btn-gold w-full h-10 text-xs">Apply</button>
        </form>
      </aside>

      <section>
        {data.products.length === 0 ? <div className="card-luxury p-8">No watches found for this filter.</div> : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{data.products.map((product) => <ProductCard key={String(product._id)} product={{ ...product, _id: String(product._id) }} />)}</div>}
        <div className="flex items-center justify-between mt-8">
          <Link className="border border-[var(--border-gold)] px-4 py-2 text-xs" href={`/shop?page=${Math.max(1, page - 1)}`}>Previous</Link>
          <p className="text-sm">Page {data.page} of {Math.max(1, data.totalPages)}</p>
          <Link className="border border-[var(--border-gold)] px-4 py-2 text-xs" href={`/shop?page=${Math.min(data.totalPages, page + 1)}`}>Next</Link>
        </div>
      </section>
    </main>
  );
}
