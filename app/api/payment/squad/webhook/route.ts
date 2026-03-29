import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/lib/models/Payment";
import { Order } from "@/lib/models/Order";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-squad-signature") || "";
  const secret = process.env.SQUAD_WEBHOOK_SECRET || "";

  const digest = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (!signature || digest !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(raw);
  const transactionRef = payload?.data?.transaction_ref || payload?.data?.transactionRef;
  const status = (payload?.data?.transaction_status || payload?.event || "").toLowerCase();

  await connectDB();
  const payment = await Payment.findOne({ transactionRef });
  if (!payment) return NextResponse.json({ ok: true });

  if (status.includes("success")) {
    payment.status = "success";
    await Order.findByIdAndUpdate(payment.orderId, { status: "paid", paymentStatus: "paid" });
  } else if (status.includes("fail")) {
    payment.status = "failed";
    await Order.findByIdAndUpdate(payment.orderId, { status: "failed", paymentStatus: "failed" });
  }

  payment.rawPayload = payload;
  await payment.save();

  return NextResponse.json({ ok: true });
}
