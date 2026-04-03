import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";
import { requireAdmin } from "@/lib/admin-guard";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const cols = await Collection.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ collections: cols.map(({ _id, __v, ...r }) => ({ ...r, _id: String(_id), __v: undefined })) });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.name || !body.tagline || !body.coverImage) {
    return NextResponse.json({ error: "name, tagline, and coverImage required." }, { status: 400 });
  }

  const slug = body.slug || slugify(body.name);
  await connectDB();

  try {
    const col = await Collection.create({ ...body, slug });
    const { _id, __v, ...safe } = col.toObject();
    void __v;
    return NextResponse.json({ collection: { ...safe, _id: String(_id) } }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "Collection with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}