import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const product = await Product.findById(params.id).populate("category", "name slug").populate("collections", "name slug").lean();
  if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const { _id, __v, ...rest } = product as typeof product & { __v?: number };
  void __v;
  return NextResponse.json({ product: { ...rest, _id: String(_id) } });
}

const EDITABLE_FIELDS = [
  "name","description","shortDescription","price","comparePrice","images","thumbnailImage",
  "category","collections","tags","gender","specifications","warrantyYears","stock","sku",
  "isFeatured","isNewArrival","isBestSeller","isLimitedEdition","status","weight",
  "metaTitle","metaDescription","sortOrder",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  await connectDB();

  const updates: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) updates[key] = body[key];
  }

  const product = await Product.findByIdAndUpdate(
    params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();

  if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const { _id, __v, ...rest } = product as typeof product & { __v?: number };
  void __v;
  return NextResponse.json({ product: { ...rest, _id: String(_id) } });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const product = await Product.findByIdAndDelete(params.id);
  if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ deleted: true, _id: params.id });
}