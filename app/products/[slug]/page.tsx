import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import type { ProductCardData } from "@/components/ProductCard";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug, status: "active" })
    .select("name shortDescription thumbnailImage price")
    .lean();
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Queen Gold`,
      description: product.shortDescription,
      images: product.thumbnailImage ? [product.thumbnailImage] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  await connectDB();

  const product = await Product.findOne({ slug: params.slug, status: "active" })
    .populate("category", "name slug")
    .populate("collections", "name slug")
    .lean();

  if (!product) notFound();

  // Related products: same category, exclude current
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: "active",
  })
    .limit(4)
    .select("name slug price comparePrice thumbnailImage isBestSeller isNewArrival isLimitedEdition stock specifications")
    .lean();

  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedRelated: ProductCardData[] = related.map((p) => ({
    ...JSON.parse(JSON.stringify(p)),
    _id: String(p._id),
  }));

  return (
    <ProductDetailClient
      product={serializedProduct}
      relatedProducts={serializedRelated}
    />
  );
}