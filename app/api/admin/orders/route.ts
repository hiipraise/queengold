import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
  const status = searchParams.get("status") ?? "";
  const payment = searchParams.get("payment") ?? "";

  const query: Record<string, unknown> = {};
  if (status)  query.orderStatus  = status;
  if (payment) query.paymentStatus = payment;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("customer", "firstName lastName email")
      .lean(),
    Order.countDocuments(query),
  ]);

  return NextResponse.json({ orders, total, page, limit });
}