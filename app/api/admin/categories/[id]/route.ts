import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  await connectDB();
  const allowed = ["name","description","image","isActive","sortOrder","metaTitle","metaDescription"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) { if (key in body) updates[key] = body[key]; }
  const cat = await Category.findByIdAndUpdate(params.id, { $set: updates }, { new: true }).lean();
  if (!cat) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ category: cat });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const cat = await Category.findByIdAndDelete(params.id);
  if (!cat) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}