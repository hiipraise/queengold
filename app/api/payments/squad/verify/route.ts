import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";
import { Product } from "@/lib/models/Product";
import { Customer } from "@/lib/models/Customer";
import { Cart } from "@/lib/models/Cart";

const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY!;
const SQUAD_BASE_URL   = process.env.SQUAD_ENV === "live"
  ? "https://api-d.squadco.com"
  : "https://sandbox-api-d.squadco.com";

export async function GET(req: NextRequest) {
  const txRef     = req.nextUrl.searchParams.get("transaction_ref") ?? "";
  const sessionId = req.nextUrl.searchParams.get("sessionId") ?? "";

  if (!txRef) {
    return NextResponse.json({ error: "transaction_ref required." }, { status: 400 });
  }

  await connectDB();

  const payment = await Payment.findOne({ squadTransactionRef: txRef });
  if (!payment) {
    return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
  }

  const order = await Order.findById(payment.order);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // If already confirmed (webhook arrived first), return immediately
  if (order.paymentStatus === "paid") {
    if (sessionId) {
      Cart.deleteOne({ sessionId }).catch(() => {});
    }
    return NextResponse.json({
      status:      "success",
      orderNumber: order.orderNumber,
      orderId:     String(order._id),
      total:       order.total,
    });
  }

  // Verify with Squad API
  try {
    const response = await fetch(
      `${SQUAD_BASE_URL}/transaction/verify/${encodeURIComponent(txRef)}`,
      {
        headers: { Authorization: `Bearer ${SQUAD_SECRET_KEY}` },
      }
    );

    const json = await response.json();
    const verified = json.data?.transaction_status === "success" ||
                     json.data?.success === true;

    if (verified) {
      payment.gatewayStatus   = "success";
      payment.gatewayResponse = json.data;
      payment.paidAt          = new Date();
      await payment.save();

      order.paymentStatus = "paid";
      order.orderStatus   = "confirmed";
      await order.save();

      for (const item of order.items) {
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, purchaseCount: item.quantity },
        }).catch(console.error);
      }

      if (order.customer) {
        Customer.findByIdAndUpdate(order.customer, {
          $inc: { totalOrders: 1, totalSpent: order.total },
        }).catch(console.error);
      }

      // Clear cart
      if (sessionId) {
        await Cart.deleteOne({ sessionId });
      }

      return NextResponse.json({
        status:      "success",
        orderNumber: order.orderNumber,
        orderId:     String(order._id),
        total:       order.total,
      });
    } else {
      payment.gatewayStatus = "failed";
      await payment.save();

      return NextResponse.json({
        status:  "failed",
        message: json.message ?? "Payment was not successful.",
      });
    }
  } catch (err) {
    console.error("Squad verify error:", err);
    return NextResponse.json({ error: "Verification failed." }, { status: 502 });
  }
}