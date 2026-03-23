import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductBySlug, getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, products] = await Promise.all([getProductBySlug(params.slug), getProducts()]);
  if (!product) notFound();
  return <ProductDetailClient product={product as any} products={products as any} />;
}
