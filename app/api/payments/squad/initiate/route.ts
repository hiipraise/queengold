import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";
import { generateTransactionRef, toKobo } from "@/lib/utils";

const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY!;
const SQUAD_BASE_URL   = process.env.SQUAD_ENV === "live"
  ? "https://api-d.squadco.com"
  : "https://sandbox-api-d.squadco.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId } = body;

  if (!orderId) {
    return NextResponse.json({ error: "orderId required." }, { status: 400 });
  }

  if (!SQUAD_SECRET_KEY) {
    return NextResponse.json({ error: "Payment gateway not configured." }, { status: 503 });
  }

  await connectDB();

  const order = await Order.findById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.paymentStatus === "paid") {
    return NextResponse.json({ error: "Order already paid." }, { status: 409 });
  }

  const transactionRef = generateTransactionRef("QG");
  const amountKobo     = toKobo(order.total);

  // Customer email — prefer account, fall back to guest email
  const email =
    order.guestEmail ??
    `${order.shippingAddress.firstName.toLowerCase()}.${order.shippingAddress.lastName.toLowerCase()}@queengold.com`;

  // Call Squad initiate transaction API
  let squadData: {
    checkout_url: string;
    transaction_ref: string;
  };

  try {
    const response = await fetch(`${SQUAD_BASE_URL}/transaction/initiate`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        Authorization:   `Bearer ${SQUAD_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email,
        amount:          amountKobo,
        currency:        "NGN",
        transaction_ref: transactionRef,
        callback_url:    `${SITE_URL}/checkout/callback`,
        payment_channels: ["card", "bank", "ussd", "transfer"],
        metadata: {
          order_number: order.orderNumber,
          order_id:     String(order._id),
          customer_name:`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        },
      }),
    });

    const json = await response.json();

    if (!response.ok || json.status !== 200) {
      console.error("Squad initiation failed:", json);
      return NextResponse.json(
        { error: json.message ?? "Payment initiation failed." },
        { status: 502 }
      );
    }

    squadData = {
      checkout_url:    json.data?.checkout_url,
      transaction_ref: json.data?.transaction_ref ?? transactionRef,
    };
  } catch (err) {
    console.error("Squad fetch error:", err);
    return NextResponse.json({ error: "Unable to connect to payment gateway." }, { status: 502 });
  }

  // Save payment record
  await Payment.create({
    order:               order._id,
    guestEmail:          order.guestEmail,
    squadTransactionRef: squadData.transaction_ref,
    squadCheckoutUrl:    squadData.checkout_url,
    amount:              amountKobo,
    currency:            "NGN",
    gatewayStatus:       "initiated",
  });

  // Save transaction ref on order
  order.squadTransactionRef = squadData.transaction_ref;
  order.paymentReference    = transactionRef;
  await order.save();

  return NextResponse.json({
    checkoutUrl:    squadData.checkout_url,
    transactionRef: squadData.transaction_ref,
  });
}