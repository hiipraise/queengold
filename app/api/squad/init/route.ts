import { NextRequest, NextResponse } from "next/server";
import { squadConfig } from "@/lib/site-data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const reference = `QG-${Date.now()}`;
  return NextResponse.json({
    message: "Mock Squad initialization created.",
    transaction_ref: reference,
    docsUrl: squadConfig.docsUrl,
    payload: {
      amount: body.amount,
      email: body.email,
      currency: "USD",
      transaction_ref: reference,
      callback_url: `${new URL(request.url).origin}/payment/success`,
      cancel_url: `${new URL(request.url).origin}/payment/cancel`,
      metadata: body.metadata,
    },
  });
}
