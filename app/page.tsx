import StoreProviders from "@/components/store/StoreProviders";
import StoreHeader from "@/components/store/StoreHeader";
import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import { getHomepageData } from "@/lib/storefront";

export default async function HomePage() {
  const { featured, newArrivals, categories, collections } = await getHomepageData();

  return (
    <StoreProviders>
      <StoreHeader />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <section className="card-luxury p-8 md:p-12 overflow-hidden">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold-muted)]">Queen Gold Horology</p>
        <h1 className="font-serif text-4xl md:text-6xl mt-4 max-w-3xl">Luxury wrist watches crafted for legacy.</h1>
        <p className="max-w-2xl opacity-80 mt-4">Discover signature mechanical timepieces, limited editions, and authenticated ownership through our Digital Watch Passport.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/shop" className="btn-gold h-12 px-6 text-xs flex items-center">Shop Watches</Link>
          <Link href="/verify" className="h-12 px-6 border border-[var(--border-gold)] text-xs flex items-center">Verify Authenticity</Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["Lifetime Authenticity", "Insured Global Delivery", "5-Year Warranty", "Concierge Support"].map((item) => (
          <div key={item} className="card-luxury p-4 text-center text-xs tracking-widest uppercase">{item}</div>
        ))}
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-serif text-3xl">Featured Products</h2>
          <Link href="/shop" className="text-xs tracking-widest uppercase">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((product) => <ProductCard key={String(product._id)} product={{ ...product, _id: String(product._id) }} />)}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {collections.map((collection) => (
          <Link key={String(collection._id)} href={`/collections/${collection.slug}`} className="card-luxury p-8 block">
            <p className="text-xs tracking-widest uppercase opacity-60">Collection</p>
            <h3 className="font-serif text-3xl mt-2">{collection.name}</h3>
            <p className="mt-3 opacity-75">{collection.description}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="font-serif text-3xl mb-4">New Arrivals</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {newArrivals.map((product) => (
            <div key={String(product._id)} className="min-w-[280px] max-w-[280px]"><ProductCard product={{ ...product, _id: String(product._id) }} /></div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-3xl mb-4">Categories</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link key={String(category._id)} href={`/shop?category=${category.slug}`} className="card-luxury p-6">
              <h3 className="font-serif text-xl">{category.name}</h3>
              <p className="text-xs mt-2 tracking-widest uppercase opacity-60">{category.gender} · {category.type}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card-luxury p-8">
        <h2 className="font-serif text-3xl">Authenticity Promise</h2>
        <p className="mt-3 opacity-80">Every Queen Gold watch includes a secure serial record and Digital Watch Passport. Validate ownership instantly before or after purchase.</p>
        <Link href="/verify" className="mt-5 inline-flex border border-[var(--border-gold)] px-4 py-2 text-xs tracking-widest uppercase">Verify Your Timepiece</Link>
      </section>
      </main>
    </StoreProviders>
  );
}
