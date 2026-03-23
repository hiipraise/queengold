import ShopClient from "@/components/ShopClient";
import { categories, collections, products } from "@/lib/site-data";

export default function ShopPage() {
  return <ShopClient products={products} categories={categories} collections={collections} heading="All Watches" description="Browse every Queen Gold reference with premium filtering, sorting, search, and availability controls." />;
}
