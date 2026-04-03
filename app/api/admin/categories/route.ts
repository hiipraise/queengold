import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { requireAdmin } from "@/lib/admin-guard";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
  return NextResponse.json({ categories: categories.map(({ _id, __v, ...r }) => ({ ...r, _id: String(_id), __v: undefined })) });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "name required." }, { status: 400 });

  const slug = body.slug || slugify(body.name);
  await connectDB();

  try {
    const cat = await Category.create({ ...body, slug });
    const { _id, __v, ...safe } = cat.toObject();
    void __v;
    return NextResponse.json({ category: { ...safe, _id: String(_id) } }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "Category with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}