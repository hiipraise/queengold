import ShopClient from "@/components/ShopClient";
import { getProductSummaries } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const { products, categories, collections } = await getProductSummaries();
  return <ShopClient products={products as any} categories={categories as any} collections={collections as any} heading="All Watches" description="Browse every Queen Gold reference with live pricing, filtering, and availability controls." />;
}
