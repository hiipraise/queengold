import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Wishlist } from "@/lib/models/Wishlist";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ productIds: [] });
  await connectDB();
  const wishlist = await Wishlist.findOne({ customerId: session.user.id }).lean();
  return NextResponse.json({ productIds: wishlist?.productIds?.map(String) ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { productId } = await req.json();
  const wishlist = (await Wishlist.findOne({ customerId: session.user.id })) ?? (await Wishlist.create({ customerId: session.user.id, productIds: [] }));
  const exists = wishlist.productIds.some((id) => String(id) === productId);
  if (exists) wishlist.productIds = wishlist.productIds.filter((id) => String(id) !== productId);
  else wishlist.productIds.push(productId);
  await wishlist.save();
  return NextResponse.json({ productIds: wishlist.productIds.map(String) });
}
