import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";

function getSessionId(req: NextRequest): string {
  return req.nextUrl.searchParams.get("sessionId") ?? "";
}

// GET /api/cart?sessionId=xxx
export async function GET(req: NextRequest) {
  const sessionId = getSessionId(req);
  if (!sessionId) return NextResponse.json({ cart: null });

  await connectDB();
  const cart = await Cart.findOne({ sessionId }).lean();
  return NextResponse.json({ cart: cart ? sanitize(cart) : null });
}

// POST /api/cart — add item
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, productId, quantity = 1 } = body;

  if (!sessionId || !productId) {
    return NextResponse.json({ error: "sessionId and productId required." }, { status: 400 });
  }

  await connectDB();

  const product = await Product.findById(productId).lean();
  if (!product || product.status !== "active") {
    return NextResponse.json({ error: "Product not available." }, { status: 404 });
  }
  if (product.stock < 1) {
    return NextResponse.json({ error: "Product is out of stock." }, { status: 409 });
  }

  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    cart = await Cart.create({
      sessionId,
      items: [],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  // Check existing item
  const existingIdx = cart.items.findIndex(
    (i) => String(i.product) === String(product._id)
  );

  const requestedQty = existingIdx >= 0
    ? cart.items[existingIdx].quantity + quantity
    : quantity;

  if (requestedQty > product.stock) {
    return NextResponse.json(
      { error: `Only ${product.stock} units available.` },
      { status: 409 }
    );
  }

  if (existingIdx >= 0) {
    cart.items[existingIdx].quantity = requestedQty;
  } else {
    cart.items.push({
      product:        product._id,
      quantity,
      price:          product.price,
      name:           product.name,
      thumbnailImage: product.thumbnailImage,
      sku:            product.sku,
    } as (typeof cart.items)[0]);
  }

  // Reset TTL
  cart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await cart.save();

  return NextResponse.json({ cart: sanitize(cart.toObject()) });
}

// DELETE /api/cart?sessionId=xxx — clear cart
export async function DELETE(req: NextRequest) {
  const sessionId = getSessionId(req);
  if (!sessionId) return NextResponse.json({ ok: true });

  await connectDB();
  await Cart.deleteOne({ sessionId });
  return NextResponse.json({ ok: true, cart: null });
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