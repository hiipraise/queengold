import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/lib/models/Customer";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
  const q     = searchParams.get("q") ?? "";

  const query: Record<string, unknown> = {};
  if (q) query.$or = [
    { email:     { $regex: q, $options: "i" } },
    { firstName: { $regex: q, $options: "i" } },
    { lastName:  { $regex: q, $options: "i" } },
  ];

  const [customers, total] = await Promise.all([
    Customer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-passwordHash")
      .lean(),
    Customer.countDocuments(query),
  ]);

  return NextResponse.json({ customers, total, page, limit });
}