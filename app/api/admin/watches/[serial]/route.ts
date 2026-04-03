import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Watch } from "@/lib/models/Watch";
import { requireAdmin } from "@/lib/admin-guard";
import { normalizeSerial } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: { serial: string } },
) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const watch = await Watch.findOne({
    serialNumber: normalizeSerial(params.serial),
  }).lean();
  if (!watch)
    return NextResponse.json({ error: "Watch not found." }, { status: 404 });
  const { _id: _o, __v: _v, ...safe } = watch;
  return NextResponse.json({ watch: safe });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { serial: string } },
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const serial = normalizeSerial(params.serial);
  await connectDB();

  const editable = [
    "model",
    "collection",
    "movement",
    "status",
    "warrantyStatus",
    "dateOfPurchase",
    "dealer",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of editable) {
    if (key in body) {
      updates[key] =
        key === "dateOfPurchase" && body[key] ? new Date(body[key]) : body[key];
    }
  }

  const watch = await Watch.findOneAndUpdate(
    { serialNumber: serial },
    { $set: updates },
    { new: true, runValidators: true },
  ).lean();

  if (!watch)
    return NextResponse.json({ error: "Watch not found." }, { status: 404 });
  const { _id: _o, __v: _v, ...safe } = watch;
  return NextResponse.json({ watch: safe });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { serial: string } },
) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const watch = await Watch.findOneAndDelete({
    serialNumber: normalizeSerial(params.serial),
  });
  if (!watch)
    return NextResponse.json({ error: "Watch not found." }, { status: 404 });
  return NextResponse.json({ deleted: true, serialNumber: params.serial });
}
