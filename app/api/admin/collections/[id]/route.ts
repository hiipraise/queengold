import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Collection } from "@/lib/models/Collection";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  await connectDB();
  const allowed = ["name","tagline","description","coverImage","images","isActive","isFeatured","sortOrder","launchDate"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) { if (key in body) updates[key] = body[key]; }
  const col = await Collection.findByIdAndUpdate(params.id, { $set: updates }, { new: true }).lean();
  if (!col) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ collection: col });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const col = await Collection.findByIdAndDelete(params.id);
  if (!col) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}