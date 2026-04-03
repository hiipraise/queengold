import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ScanLog } from "@/lib/models/ScanLog";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));
  const serial = searchParams.get("sn") ?? "";
  const ip = searchParams.get("ip") ?? "";

  const query: Record<string, unknown> = {};
  if (serial)
    query.serialAttempted = { $regex: serial.toUpperCase(), $options: "i" };
  if (ip) query.ip = ip;

  const [logs, total] = await Promise.all([
    ScanLog.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ScanLog.countDocuments(query),
  ]);

  const safe = logs.map(({ _id: _o, __v: _v, ...rest }) => rest);
  return NextResponse.json({ logs: safe, total, page, limit });
}
