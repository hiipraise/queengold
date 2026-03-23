import { CategoryGrid, CollectionShowcase, EditorialBand, HeroSection, ProductRail, TrustStrip } from "@/components/LuxurySections";
import { bestSellers, featuredProducts, newArrivals } from "@/lib/site-data";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustStrip />
      <ProductRail title="Featured signatures" subtitle="Hero references selected for collectors seeking ceremony, performance, and provenance." items={featuredProducts} />
      <CollectionShowcase />
      <ProductRail title="Best sellers" subtitle="The pieces clients revisit for gifting, collecting, and milestone celebrations." items={bestSellers} />
      <CategoryGrid />
      <ProductRail title="New arrivals" subtitle="Fresh launches that merge the Queen Gold visual language with modern movement architecture." items={newArrivals} />
      <EditorialBand />
    </main>
  );
}
