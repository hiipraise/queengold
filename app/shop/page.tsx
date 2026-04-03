import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { Collection } from "@/lib/models/Collection";
import type { ProductCardData } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop — Luxury Wristwatches",
  description: "Browse the Queen Gold collection of handcrafted luxury timepieces.",
};

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    gender?: string;
    filter?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

const ITEMS_PER_PAGE = 12;

export default async function ShopPage({ searchParams }: Props) {
  await connectDB();

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const skip = (page - 1) * ITEMS_PER_PAGE;

  // Build query
  const query: Record<string, unknown> = { status: "active" };

  if (searchParams.q) {
    query.$text = { $search: searchParams.q };
  }
  if (searchParams.gender && ["men", "women", "unisex"].includes(searchParams.gender)) {
    query.gender = searchParams.gender;
  }
  if (searchParams.filter === "new")        query.isNewArrival = true;
  if (searchParams.filter === "bestseller") query.isBestSeller = true;
  if (searchParams.filter === "limited")    query.isLimitedEdition = true;
  if (searchParams.filter === "sale")       query.comparePrice = { $gt: 0 };

  const minP = parseFloat(searchParams.minPrice ?? "");
  const maxP = parseFloat(searchParams.maxPrice ?? "");
  if (!isNaN(minP) || !isNaN(maxP)) {
    query.price = {
      ...(isNaN(minP) ? {} : { $gte: minP }),
      ...(isNaN(maxP) ? {} : { $lte: maxP }),
    };
  }

  // Sort
  type SortObj = Record<string, 1 | -1>;
  const sortMap: Record<string, SortObj> = {
    newest:     { createdAt: -1 },
    oldest:     { createdAt:  1 },
    priceLow:   { price:      1 },
    priceHigh:  { price:     -1 },
    popular:    { purchaseCount: -1 },
    featured:   { sortOrder:  1, isFeatured: -1 },
  };
  const sort: SortObj = sortMap[searchParams.sort ?? "featured"] ?? sortMap.featured;

  // Category filter
  if (searchParams.category) {
    const cat = await Category.findOne({ slug: searchParams.category, isActive: true }).lean();
    if (cat) query.category = cat._id;
  }

  const [products, total, categories, collections] = await Promise.all([
    Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .select("name slug price comparePrice thumbnailImage isBestSeller isNewArrival isLimitedEdition stock specifications")
      .lean(),
    Product.countDocuments(query),
    Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    Collection.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
  ]);

  const mappedProducts: ProductCardData[] = products.map((p) => ({
    ...p,
    _id: String(p._id),
  })) as ProductCardData[];

  return (
    <ShopClient
      products={mappedProducts}
      total={total}
      page={page}
      totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
      categories={categories.map((c) => ({ _id: String(c._id), name: c.name, slug: c.slug }))}
      collections={collections.map((c) => ({ _id: String(c._id), name: c.name, slug: c.slug }))}
      initialParams={searchParams}
    />
  );
}