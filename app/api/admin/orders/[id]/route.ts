import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  await connectDB();
  const order = await Order.findById(params.id)
    .populate("customer", "firstName lastName email phone")
    .lean();
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const allowed = ["orderStatus","paymentStatus","trackingNumber","notes","cancelReason"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  // Set timestamps on status changes
  if (body.orderStatus === "shipped" && !updates.shippedAt) {
    updates.shippedAt = new Date();
  }
  if (body.orderStatus === "delivered" && !updates.deliveredAt) {
    updates.deliveredAt = new Date();
  }
  if (body.orderStatus === "cancelled" && !updates.cancelledAt) {
    updates.cancelledAt = new Date();
  }

  await connectDB();
  const order = await Order.findByIdAndUpdate(
    params.id,
    { $set: updates },
    { new: true }
  ).populate("customer", "firstName lastName email").lean();

  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ order });
}