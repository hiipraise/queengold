import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { Collection } from "@/lib/models/Collection";

export async function getHomepageData() {
  await connectDB();
  const [featured, newArrivals, categories, collections] = await Promise.all([
    Product.find({ "featuredFlags.featured": true }).limit(8).lean(),
    Product.find({ "featuredFlags.newArrival": true }).sort({ createdAt: -1 }).limit(8).lean(),
    Category.find({}).limit(10).lean(),
    Collection.find({}).limit(6).lean(),
  ]);
  return { featured, newArrivals, categories, collections };
}

export async function getProducts(params: {
  page?: number;
  category?: string;
  gender?: string;
  type?: string;
  q?: string;
  sort?: string;
}) {
  await connectDB();
  const page = params.page ?? 1;
  const limit = 12;
  const filter: Record<string, unknown> = {};
  if (params.gender) filter.gender = params.gender;
  if (params.type) filter.type = params.type;
  if (params.q) filter.$text = { $search: params.q };
  if (params.category) {
    const category = await Category.findOne({ slug: params.category }).lean();
    filter.categoryId = category?._id;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    latest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popular: { "featuredFlags.bestSeller": -1, createdAt: -1 },
  };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[params.sort ?? "latest"] ?? sortMap.latest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total, totalPages: Math.ceil(total / limit), page };
}
