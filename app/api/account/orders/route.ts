import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ orders: [] });
  await connectDB();
  const orders = await Order.find({ email: session.user.email }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}
