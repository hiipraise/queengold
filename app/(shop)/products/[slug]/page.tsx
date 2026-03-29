import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import ProductCard from "@/components/store/ProductCard";
import ProductDetailClient from "./product-detail-client";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug }).lean();
  if (!product) notFound();
  const related = await Product.find({ categoryId: product.categoryId, _id: { $ne: product._id } }).limit(4).lean();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ProductDetailClient product={{ ...product, _id: String(product._id), categoryId: String(product.categoryId), collectionIds: product.collectionIds.map(String), specs: Object.fromEntries(Object.entries(product.specs ?? {})) }} />
      <section>
        <h2 className="font-serif text-3xl mb-4">Related Products</h2>
        <div className="grid md:grid-cols-4 gap-4">{related.map((item) => <ProductCard key={String(item._id)} product={{ ...item, _id: String(item._id) }} />)}</div>
      </section>
    </main>
  );
}
