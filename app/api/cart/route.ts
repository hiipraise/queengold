import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkStockLevels } from "@/lib/ecom";
import { getOrCreateSessionId } from "@/lib/ecom-server";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";

async function serializeCart(sessionId: string) {
  const cart = await Cart.findOne({ sessionId }).lean();
  if (!cart?.items?.length) return [];
  const ids = cart.items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids } }).lean();
  const map = new Map(products.map((p) => [String(p._id), p]));
  return cart.items.map((item) => {
    const product = map.get(String(item.productId));
    return {
      productId: String(item.productId),
      quantity: item.quantity,
      name: product?.name ?? "Unavailable item",
      price: product?.discountPrice ?? product?.price ?? 0,
      image: product?.images?.[0] ?? "",
      stock: product?.stock ?? 0,
    };
  });
}

export async function GET() {
  await connectDB();
  const sessionId = getOrCreateSessionId();
  const items = await serializeCart(sessionId);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const sessionId = getOrCreateSessionId();
  const { action, productId, quantity = 1 } = await req.json();

  const cart = (await Cart.findOne({ sessionId })) ?? (await Cart.create({ sessionId, items: [] }));
  const itemIndex = cart.items.findIndex((item) => String(item.productId) === productId);

  if (action === "add") {
    if (itemIndex > -1) cart.items[itemIndex].quantity += quantity;
    else cart.items.push({ productId, quantity });
  }

  if (action === "update" && itemIndex > -1) cart.items[itemIndex].quantity = Math.max(1, quantity);
  if (action === "remove" && itemIndex > -1) cart.items.splice(itemIndex, 1);

  const stockChecks = await checkStockLevels(cart.items.map((item) => ({ productId: String(item.productId), quantity: item.quantity })));
  cart.items = cart.items.filter((item) => stockChecks.find((check) => check.productId === String(item.productId))?.valid);

  await cart.save();
  const items = await serializeCart(sessionId);
  return NextResponse.json({ items });
}
