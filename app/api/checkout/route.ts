import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/site-data";
import { discountedPrice } from "@/lib/shop-utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const items = (body.items ?? []) as { slug: string; quantity: number }[];
  if (!items.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  const amount = items.reduce((total, item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    return total + (product ? discountedPrice(product.price, product.discountPercentage) * item.quantity : 0);
  }, 0);
  const transaction = await fetch(`${new URL(request.url).origin}/api/squad/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      email: body.customer?.email,
      metadata: {
        items,
        customer: body.customer,
        note: "Reference implementation aligned to Squad transaction initialization + redirect flow.",
      },
    }),
  }).then((res) => res.json());
  return NextResponse.json({
    checkoutUrl: `${new URL(request.url).origin}/payment/success?transaction_ref=${transaction.transaction_ref}`,
    amount,
    transaction,
  });
}
