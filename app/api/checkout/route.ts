import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSessionId } from "@/lib/ecom-server";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const sessionId = getOrCreateSessionId();
  const { shippingAddress } = await req.json();

  const cart = await Cart.findOne({ sessionId }).lean();
  if (!cart?.items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

  const ids = cart.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } }).lean();
  const map = new Map(products.map((p) => [String(p._id), p]));

  const items = cart.items.map((item) => {
    const product = map.get(String(item.productId));
    const price = product?.discountPrice ?? product?.price ?? 0;
    return { productId: item.productId, name: product?.name ?? "Unknown", unitPrice: price, quantity: item.quantity };
  });

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const orderNumber = `QG-${Date.now().toString().slice(-8)}`;

  const order = await Order.create({
    orderNumber,
    customerId: session?.user?.role === "customer" ? session.user.id : undefined,
    email: shippingAddress.email || session?.user?.email || "guest@queengold.com",
    items,
    subtotal,
    discount: 0,
    shippingFee: 0,
    total: subtotal,
    shippingAddress,
    status: "pending",
    paymentStatus: "pending",
  });

  const initRes = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/payment/squad/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: String(order._id), amount: subtotal, email: order.email }),
  });
  const initData = await initRes.json();

  await Payment.create({
    orderId: order._id,
    provider: "squad",
    status: "initiated",
    amount: subtotal,
    currency: "NGN",
    transactionRef: initData.transactionRef,
    providerReference: initData.providerReference,
    rawPayload: initData,
  });

  return NextResponse.json({ checkoutUrl: initData.checkoutUrl, orderNumber });
}
