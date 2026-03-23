import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";
import { Customer } from "@/lib/models/Customer";
import { Address } from "@/lib/models/Address";
import { discountedPrice } from "@/lib/shop-utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const items = (body.items ?? []) as { slug: string; quantity: number }[];
  const customer = body.customer ?? {};

  if (!items.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  if (!customer.email || !customer.firstName || !customer.lastName) {
    return NextResponse.json({ error: "Customer email and full name are required." }, { status: 400 });
  }

  await connectDB();
  const products = await Product.find({ slug: { $in: items.map((item) => item.slug) } }).lean();
  const productMap = new Map(products.map((product) => [product.slug, product]));
  const missing = items.find((item) => !productMap.has(item.slug));
  if (missing) return NextResponse.json({ error: `Product ${missing.slug} is unavailable.` }, { status: 400 });

  const orderItems = items.map((item) => {
    const product: any = productMap.get(item.slug);
    if (product.stock < item.quantity) throw new Error(`${product.name} does not have enough stock.`);
    return {
      slug: item.slug,
      quantity: item.quantity,
      unitPrice: discountedPrice(product.price, product.discountPercentage),
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const orderNumber = `QG-${Date.now()}`;
  const paymentReference = `${orderNumber}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  await Promise.all([
    Customer.findOneAndUpdate(
      { email: customer.email },
      { email: customer.email, name: `${customer.firstName} ${customer.lastName}`, tier: "Client" },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
    Address.findOneAndUpdate(
      { customerEmail: customer.email, label: "Primary" },
      { customerEmail: customer.email, label: "Primary", line1: customer.line1, city: customer.city, state: customer.state, country: customer.country || "" },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ),
    Order.create({
      orderNumber,
      customerEmail: customer.email,
      items: orderItems,
      total,
      status: "pending_payment",
      paymentStatus: "initialized",
      paymentReference,
      address: { line1: customer.line1, city: customer.city, state: customer.state, country: customer.country || "" },
    }),
    Payment.create({ orderNumber, transactionRef: paymentReference, amount: total, status: "initialized", payload: { customer, items: orderItems } }),
  ]);

  await Promise.all(orderItems.map((item) => Product.updateOne({ slug: item.slug }, { $inc: { stock: -item.quantity } })));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const callbackUrl = `${siteUrl}/payment/success?order=${orderNumber}&transaction_ref=${paymentReference}`;
  const cancelUrl = `${siteUrl}/payment/cancel?order=${orderNumber}`;
  const squadSecret = process.env.SQUAD_SECRET_KEY;

  if (!squadSecret) {
    return NextResponse.json({ checkoutUrl: callbackUrl, amount: total, orderNumber, paymentReference, warning: "SQUAD_SECRET_KEY is not configured; redirected to local success page." });
  }

  const squadRes = await fetch("https://sandbox-api-d.squadco.com/transaction/init", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${squadSecret}` },
    body: JSON.stringify({
      amount: total,
      email: customer.email,
      currency: "USD",
      transaction_ref: paymentReference,
      callback_url: callbackUrl,
      cancel_url: cancelUrl,
      metadata: { orderNumber, items: orderItems },
    }),
    cache: "no-store",
  });

  const transaction = await squadRes.json();
  if (!squadRes.ok) {
    return NextResponse.json({ error: transaction.message || "Unable to initialize Squad checkout." }, { status: 502 });
  }

  await Payment.updateOne({ orderNumber }, { status: "pending_redirect", payload: transaction });
  return NextResponse.json({ checkoutUrl: transaction.data?.checkout_url || callbackUrl, amount: total, orderNumber, paymentReference, transaction });
}
