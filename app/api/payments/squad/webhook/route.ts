import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";
import { Product } from "@/lib/models/Product";
import { Customer } from "@/lib/models/Customer";
import crypto from "crypto";

const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY!;

function verifySquadWebhook(payload: string, signature: string): boolean {
  try {
    const hash = crypto
      .createHmac("sha512", SQUAD_SECRET_KEY)
      .update(payload)
      .digest("hex")
      .toUpperCase();
    return hash === signature.toUpperCase();
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-squad-encrypted-body") ?? "";

  // Verify webhook authenticity
  if (SQUAD_SECRET_KEY && !verifySquadWebhook(rawBody, signature)) {
    console.warn("Squad webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const event      = payload.Event as string;
  const data       = payload.Body as Record<string, unknown>;
  const txRef      = (data?.transaction_ref ?? data?.merchantTransactionRef) as string;
  const status     = (data?.transaction_status ?? data?.success) as string | boolean;

  if (!txRef) {
    return NextResponse.json({ error: "No transaction ref." }, { status: 400 });
  }

  await connectDB();

  const payment = await Payment.findOne({ squadTransactionRef: txRef });
  if (!payment) {
    console.warn(`Squad webhook: payment not found for ref ${txRef}`);
    return NextResponse.json({ received: true }); // Acknowledge but don't error
  }

  const isSuccess =
    event === "charge.success" ||
    status === "success" ||
    status === true ||
    String(status).toLowerCase() === "successful";

  payment.webhookPayload  = payload as Record<string, unknown>;
  payment.gatewayResponse = data;
  payment.gatewayStatus   = isSuccess ? "success" : "failed";
  if (isSuccess) payment.paidAt = new Date();
  await payment.save();

  const order = await Order.findById(payment.order);
  if (!order) {
    return NextResponse.json({ received: true });
  }

  if (isSuccess && order.paymentStatus !== "paid") {
    order.paymentStatus = "paid";
    order.orderStatus   = "confirmed";
    await order.save();

    // Decrement stock for each item (fire and forget)
    for (const item of order.items) {
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, purchaseCount: item.quantity },
      }).catch(console.error);
    }

    // Update customer totals if logged-in order
    if (order.customer) {
      Customer.findByIdAndUpdate(order.customer, {
        $inc: { totalOrders: 1, totalSpent: order.total },
      }).catch(console.error);
    }
  } else if (!isSuccess) {
    order.paymentStatus = "failed";
    await order.save();
  }

  return NextResponse.json({ received: true });
}