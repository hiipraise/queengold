import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit  = Math.min(48, parseInt(searchParams.get("limit") ?? "12", 10));
  const q      = searchParams.get("q") ?? "";
  const gender = searchParams.get("gender") ?? "";
  const filter = searchParams.get("filter") ?? "";
  const categorySlug = searchParams.get("category") ?? "";
  const sort   = searchParams.get("sort") ?? "featured";

  const query: Record<string, unknown> = { status: "active" };

  if (q) query.$text = { $search: q };
  if (gender && ["men","women","unisex"].includes(gender)) query.gender = gender;
  if (filter === "new")        query.isNewArrival = true;
  if (filter === "bestseller") query.isBestSeller = true;
  if (filter === "limited")    query.isLimitedEdition = true;
  if (filter === "sale")       query.comparePrice = { $gt: 0 };

  if (categorySlug) {
    const cat = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
    if (cat) query.category = cat._id;
  }

  type SortObj = Record<string, 1 | -1>;
  const sortMap: Record<string, SortObj> = {
    newest:    { createdAt: -1 },
    oldest:    { createdAt:  1 },
    priceLow:  { price:      1 },
    priceHigh: { price:     -1 },
    popular:   { purchaseCount: -1 },
    featured:  { sortOrder:  1, isFeatured: -1 },
  };
  const sortObj: SortObj = sortMap[sort] ?? sortMap.featured;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("name slug price comparePrice thumbnailImage isBestSeller isNewArrival isLimitedEdition stock specifications gender")
      .lean(),
    Product.countDocuments(query),
  ]);

  const safe = products.map(({ _id, ...rest }) => ({ ...rest, _id: String(_id) }));

  return NextResponse.json({ products: safe, total, page, limit });
}