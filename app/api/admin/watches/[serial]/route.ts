import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Watch } from "@/lib/models/Watch";
import { requireAdmin } from "@/lib/admin-guard";
import { normalizeSerial } from "@/lib/utils";

// ─── GET /api/admin/watches/[serial] ──────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: { serial: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const serial = normalizeSerial(params.serial);
  const watch = await Watch.findOne({ serialNumber: serial }).lean();

  if (!watch) {
    return NextResponse.json({ error: "Watch not found." }, { status: 404 });
  }

  const { _id: _omit, __v: _v, ...safe } = watch;
  return NextResponse.json({ watch: safe });
}

// ─── PATCH /api/admin/watches/[serial] ────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: { serial: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const serial = normalizeSerial(params.serial);

  await connectDB();

  const allowedFields: Record<string, unknown> = {};
  const editable = [
    "model",
    "collection",
    "movement",
    "status",
    "warrantyStatus",
    "dateOfPurchase",
    "dealer",
  ];

  for (const key of editable) {
    if (key in body) {
      allowedFields[key] =
        key === "dateOfPurchase" && body[key]
          ? new Date(body[key])
          : body[key];
    }
  }

  const watch = await Watch.findOneAndUpdate(
    { serialNumber: serial },
    { $set: allowedFields },
    { new: true, runValidators: true }
  ).lean();

  if (!watch) {
    return NextResponse.json({ error: "Watch not found." }, { status: 404 });
  }

  const { _id: _omit, __v: _v, ...safe } = watch;
  return NextResponse.json({ watch: safe });
}

// ─── DELETE /api/admin/watches/[serial] ───────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { serial: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const serial = normalizeSerial(params.serial);

  const watch = await Watch.findOneAndDelete({ serialNumber: serial });
  if (!watch) {
    return NextResponse.json({ error: "Watch not found." }, { status: 404 });
  }

  return NextResponse.json({ deleted: true, serialNumber: serial });
}
