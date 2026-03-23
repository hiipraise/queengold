import { CategoryGrid, CollectionShowcase, EditorialBand, HeroSection, ProductRail, TrustStrip } from "@/components/LuxurySections";
import { getProductSummaries } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { products, categories, collections } = await getProductSummaries();
  const featuredProducts = (products as any[]).filter((product) => product.featured);
  const bestSellers = (products as any[]).filter((product) => product.bestSeller);
  const newArrivals = (products as any[]).filter((product) => product.newArrival);
  return (
    <main>
      <HeroSection featuredProducts={featuredProducts as any} />
      <TrustStrip />
      <ProductRail title="Featured signatures" subtitle="Hero references selected for collectors seeking ceremony, performance, and provenance." items={featuredProducts as any} />
      <CollectionShowcase collections={collections as any} />
      <ProductRail title="Best sellers" subtitle="The pieces clients revisit for gifting, collecting, and milestone celebrations." items={bestSellers as any} />
      <CategoryGrid categories={categories as any} />
      <ProductRail title="New arrivals" subtitle="Fresh launches that merge the Queen Gold visual language with modern movement architecture." items={newArrivals as any} />
      <EditorialBand bestSellers={bestSellers as any} newArrivals={newArrivals as any} />
    </main>
  );
}
