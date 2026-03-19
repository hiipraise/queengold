import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Watch } from "@/lib/models/Watch";
import { requireAdmin } from "@/lib/admin-guard";
import { normalizeSerial } from "@/lib/utils";

// ─── GET /api/admin/watches ────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const { searchParams } = new URL(request.url);
  const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit   = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
  const search  = searchParams.get("q") ?? "";
  const status  = searchParams.get("status") ?? "";

  const query: Record<string, unknown> = {};
  if (search) query.serialNumber = { $regex: search.toUpperCase(), $options: "i" };
  if (status) query.status = status;

  const [watches, total] = await Promise.all([
    Watch.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Watch.countDocuments(query),
  ]);

  // Strip internal _id / __v
  const safe = watches.map(({ _id: _omit, __v: _v, ...rest }) => rest);

  return NextResponse.json({ watches: safe, total, page, limit });
}

// ─── POST /api/admin/watches ───────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const serial = normalizeSerial(body.serialNumber ?? "");

  if (!serial) {
    return NextResponse.json(
      { error: "serialNumber is required." },
      { status: 400 }
    );
  }

  if (!/^[A-Z0-9\-]{4,32}$/.test(serial)) {
    return NextResponse.json(
      { error: "Invalid serial number format. Use uppercase letters, digits, and hyphens (4–32 chars)." },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const watch = await Watch.create({
      serialNumber:  serial,
      model:         body.model         ?? "QG-ER-01",
      collection:    body.collection    ?? "Eternal Reign",
      movement:      body.movement      ?? "CROWNCALIBRE™ CC-01",
      status:        body.status        ?? "unregistered",
      warrantyStatus: body.warrantyStatus ?? "active",
      dateOfPurchase: body.dateOfPurchase ? new Date(body.dateOfPurchase) : null,
      dealer:        body.dealer        ?? "Queen Gold Lagos",
    });

    const { _id: _omit, __v: _v, ...safe } = watch.toObject();
    return NextResponse.json({ watch: safe }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: `Serial number '${serial}' already exists.` },
        { status: 409 }
      );
    }
    throw err;
  }
}
