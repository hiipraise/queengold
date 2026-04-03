import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/orders — create order from cart
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    sessionId,
    shippingAddress,
    billingAddress,
    couponCode,
    couponDiscount = 0,
    guestEmail,
    notes,
  } = body;

  if (!sessionId || !shippingAddress) {
    return NextResponse.json({ error: "sessionId and shippingAddress required." }, { status: 400 });
  }

  await connectDB();

  // Get cart
  const cart = await Cart.findOne({ sessionId }).lean();
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Validate stock and build order items
  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product).lean();
    if (!product || product.status !== "active") {
      return NextResponse.json(
        { error: `Product "${item.name}" is no longer available.` },
        { status: 409 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Only ${product.stock} units of "${item.name}" are available.` },
        { status: 409 }
      );
    }

    orderItems.push({
      product:        item.product,
      name:           item.name,
      sku:            item.sku,
      price:          item.price,
      quantity:       item.quantity,
      thumbnailImage: item.thumbnailImage,
    });
    subtotal += item.price * item.quantity;
  }

  // Get authenticated customer if logged in
  const session = await getServerSession(authOptions);
  const customerId = (session?.user as { id?: string } | undefined)?.id;

  const shippingCost = subtotal >= 500000 ? 0 : 15000;
  const discountAmt = Math.min(Number(couponDiscount) || 0, subtotal);
  const total = Math.max(0, subtotal + shippingCost - discountAmt);

  const order = await Order.create({
    customer:       customerId ?? undefined,
    guestEmail:     guestEmail ?? undefined,
    items:          orderItems,
    shippingAddress,
    billingAddress: billingAddress ?? shippingAddress,
    subtotal,
    shippingCost,
    taxAmount:      0,
    discountAmount: discountAmt,
    couponCode:     couponCode ?? undefined,
    total,
    currency:       "NGN",
    orderStatus:    "pending",
    paymentStatus:  "pending",
    paymentMethod:  "squad",
    notes:          notes ?? undefined,
  });

  return NextResponse.json({ order: order.toObject() }, { status: 201 });
}

// GET /api/orders — list orders for authenticated customer
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  const customerId = (session?.user as { id?: string } | undefined)?.id;
  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectDB();

  const orders = await Order.find({ customer: customerId })
    .sort({ createdAt: -1 })
    .select("orderNumber total orderStatus paymentStatus createdAt items")
    .lean();

  return NextResponse.json({ orders });
}