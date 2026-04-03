import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";

// PATCH /api/cart/[itemId] — update quantity
export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const body = await req.json();
  const { sessionId, quantity } = body;

  if (!sessionId) return NextResponse.json({ error: "sessionId required." }, { status: 400 });
  if (typeof quantity !== "number" || quantity < 1) {
    return NextResponse.json({ error: "quantity must be >= 1." }, { status: 400 });
  }

  await connectDB();
  const cart = await Cart.findOne({ sessionId });
  if (!cart) return NextResponse.json({ error: "Cart not found." }, { status: 404 });

  const item = cart.items.find((i) => String(i._id) === params.itemId);
  if (!item) return NextResponse.json({ error: "Item not found." }, { status: 404 });

  // Check stock
  const product = await Product.findById(item.product).select("stock").lean();
  if (!product || quantity > product.stock) {
    return NextResponse.json(
      { error: `Only ${product?.stock ?? 0} units available.` },
      { status: 409 }
    );
  }

  item.quantity = quantity;
  await cart.save();

  return NextResponse.json({ cart: sanitize(cart.toObject()) });
}

// DELETE /api/cart/[itemId] — remove specific item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") ?? "";
  if (!sessionId) return NextResponse.json({ error: "sessionId required." }, { status: 400 });

  await connectDB();
  const cart = await Cart.findOne({ sessionId });
  if (!cart) return NextResponse.json({ error: "Cart not found." }, { status: 404 });

  cart.items = cart.items.filter((i) => String(i._id) !== params.itemId) as typeof cart.items;
  await cart.save();

  return NextResponse.json({ cart: sanitize(cart.toObject()) });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitize(cart: any) {
  const { __v, _id, ...rest } = cart;
  void __v; void _id;
  return {
    ...rest,
    items: (rest.items ?? []).map((item: Record<string, unknown>) => ({
      _id:            String(item._id),
      product:        String(item.product),
      name:           item.name,
      sku:            item.sku,
      price:          item.price,
      quantity:       item.quantity,
      thumbnailImage: item.thumbnailImage,
    })),
  };
}