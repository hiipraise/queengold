import { notFound } from "next/navigation";
import ShopClient from "@/components/ShopClient";
import { categories, collections, products } from "@/lib/site-data";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((entry) => entry.slug === params.slug);
  if (!category) notFound();
  return <ShopClient products={products.filter((product) => product.category === category.name)} categories={categories} collections={collections} heading={category.name} description={category.description} />;
}
