import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { orderId, amount, email } = await req.json();
  const transactionRef = `QG-${orderId}-${Date.now()}`;
  const callbackUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/payment/squad/callback`;

  const payload = {
    amount,
    email,
    currency_code: "NGN",
    initiate_type: "inline",
    transaction_ref: transactionRef,
    callback_url: callbackUrl,
    pass_charge: false,
    metadata: { orderId },
  };

  const secret = process.env.SQUAD_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({
      checkoutUrl: `/payment/error?reason=missing_squad_key`,
      transactionRef,
      providerReference: null,
      mode: "fallback",
      payload,
    });
  }

  const response = await fetch("https://sandbox-api-d.squadco.com/transaction/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  const checkoutUrl = data?.data?.checkout_url || data?.data?.payment_url || `/payment/failed`;

  return NextResponse.json({
    checkoutUrl,
    transactionRef,
    providerReference: data?.data?.transaction_ref || data?.data?.id || null,
    raw: data,
  });
}
