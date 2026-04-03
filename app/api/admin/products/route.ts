import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { requireAdmin } from "@/lib/admin-guard";
import { slugify } from "@/lib/utils";

// GET /api/admin/products
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
  const q      = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";

  const query: Record<string, unknown> = {};
  if (q)      query.$text = { $search: q };
  if (status) query.status = status;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "name slug")
      .lean(),
    Product.countDocuments(query),
  ]);

  const safe = products.map(({ _id, __v, ...rest }) => ({ ...rest, _id: String(_id), __v: undefined }));
  void safe.forEach((p) => delete p.__v);
  return NextResponse.json({ products: safe, total, page, limit });
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();

  if (!body.name || !body.price || !body.category || !body.sku || !body.thumbnailImage) {
    return NextResponse.json({ error: "name, price, category, sku, and thumbnailImage are required." }, { status: 400 });
  }

  const slug = body.slug || slugify(body.name);

  await connectDB();

  // Check for duplicate slug / sku
  const existing = await Product.findOne({ $or: [{ slug }, { sku: body.sku }] }).lean();
  if (existing) {
    return NextResponse.json(
      { error: existing.slug === slug ? "A product with this slug already exists." : "SKU already in use." },
      { status: 409 }
    );
  }

  try {
    const product = await Product.create({ ...body, slug });
    const { _id, __v, ...safe } = product.toObject();
    void __v;
    return NextResponse.json({ product: { ...safe, _id: String(_id) } }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "Duplicate product." }, { status: 409 });
    }
    throw err;
  }
}