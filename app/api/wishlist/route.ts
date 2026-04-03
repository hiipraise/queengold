import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Wishlist } from "@/lib/models/Wishlist";
import { Product } from "@/lib/models/Product";

// GET — fetch wishlist for logged-in user
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ products: [] });

  await connectDB();
  const wishlist = await Wishlist.findOne({ customer: userId })
    .populate("products", "name slug price comparePrice thumbnailImage stock isNewArrival isBestSeller isLimitedEdition specifications")
    .lean();

  return NextResponse.json({ products: wishlist?.products ?? [] });
}

// POST — toggle product in wishlist (server sync for logged-in users)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    // Guest toggle — just acknowledge (client stores in localStorage)
    return NextResponse.json({ ok: true });
  }

  const body = await req.json();
  const { productId } = body;
  if (!productId) return NextResponse.json({ error: "productId required." }, { status: 400 });

  await connectDB();

  const product = await Product.findById(productId).lean();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  let wishlist = await Wishlist.findOne({ customer: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ customer: userId, products: [] });
  }

  const idx = wishlist.products.findIndex((p) => String(p) === String(productId));
  if (idx >= 0) {
    wishlist.products.splice(idx, 1);
  } else {
    wishlist.products.push(product._id as unknown as (typeof wishlist.products)[0]);
  }

  await wishlist.save();

  return NextResponse.json({
    wishlisted: idx < 0,
    count: wishlist.products.length,
  });
}