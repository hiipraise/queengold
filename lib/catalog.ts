import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { Collection } from "@/lib/models/Collection";

export async function getProducts() {
  noStore();
  await connectDB();
  return Product.find({}).sort({ featured: -1, createdAt: -1 }).lean();
}

export async function getProductBySlug(slug: string) {
  noStore();
  await connectDB();
  return Product.findOne({ slug }).lean();
}

export async function getProductSummaries() {
  noStore();
  await connectDB();
  const [products, categories, collections] = await Promise.all([
    Product.find({}).sort({ featured: -1, createdAt: -1 }).lean(),
    Category.find({}).sort({ name: 1 }).lean(),
    Collection.find({}).sort({ name: 1 }).lean(),
  ]);
  return { products, categories, collections };
}
