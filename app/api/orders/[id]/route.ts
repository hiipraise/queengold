import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session  = await getServerSession(authOptions);
  const userId   = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  await connectDB();
  const order = await Order.findOne({ _id: params.id, customer: userId }).lean();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  return NextResponse.json({ order });
}