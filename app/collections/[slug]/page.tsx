import { notFound } from "next/navigation";
import ShopClient from "@/components/ShopClient";
import { categories, collections, products } from "@/lib/site-data";

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = collections.find((entry) => entry.slug === params.slug);
  if (!collection) notFound();
  return <ShopClient products={products.filter((product) => product.collection === collection.name)} categories={categories} collections={collections} heading={collection.name} description={collection.description} />;
}
