import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";

export async function GET(req: NextRequest) {
  await connectDB();
  const url = new URL(req.url);
  const transactionRef = url.searchParams.get("transaction_ref") || url.searchParams.get("transactionRef") || "";
  const status = (url.searchParams.get("status") || "").toLowerCase();

  const payment = await Payment.findOne({ transactionRef });
  if (!payment) return NextResponse.redirect(new URL(`/payment/failed`, req.url));

  if (status === "success" || status === "successful") {
    payment.status = "success";
    await payment.save();
    await Order.findByIdAndUpdate(payment.orderId, { status: "paid", paymentStatus: "paid" });
    return NextResponse.redirect(new URL(`/payment/success?order=${payment.orderId}`, req.url));
  }

  payment.status = "failed";
  await payment.save();
  await Order.findByIdAndUpdate(payment.orderId, { status: "failed", paymentStatus: "failed" });
  return NextResponse.redirect(new URL(`/payment/failed?order=${payment.orderId}`, req.url));
}
