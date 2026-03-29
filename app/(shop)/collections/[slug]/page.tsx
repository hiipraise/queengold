import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";
import { Product } from "@/lib/models/Product";
import ProductCard from "@/components/store/ProductCard";

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const collection = await Collection.findOne({ slug: params.slug }).lean();
  if (!collection) notFound();
  const products = await Product.find({ collectionIds: collection._id }).lean();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <section className="card-luxury p-8 mb-6">
        <h1 className="font-serif text-4xl">{collection.name}</h1>
        <p className="mt-3 opacity-80">{collection.description}</p>
      </section>
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => <ProductCard key={String(product._id)} product={{ ...product, _id: String(product._id) }} />)}
      </section>
    </main>
  );
}
