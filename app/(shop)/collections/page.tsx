import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";

export default async function CollectionsPage() {
  await connectDB();
  const collections = await Collection.find({}).lean();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl mb-6">Collections</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Link key={String(collection._id)} href={`/collections/${collection.slug}`} className="card-luxury p-6">
            <h2 className="font-serif text-2xl">{collection.name}</h2>
            <p className="mt-2 opacity-75">{collection.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
