import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await connectDB();

  const product = await Product.findOne({ slug: params.slug, status: "active" })
    .populate("category", "name slug")
    .populate("collections", "name slug")
    .lean();

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  // Increment view count (fire and forget)
  Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).catch(() => {});

  const { _id, __v, ...rest } = product as typeof product & { __v?: number };
  void __v;
  return NextResponse.json({ product: { ...rest, _id: String(_id) } });
}