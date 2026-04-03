import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/lib/models/Wishlist";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code: string = (body.code ?? "").toUpperCase().trim();
  const subtotal: number = Number(body.subtotal) || 0;

  if (!code) {
    return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
  }

  await connectDB();

  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    return NextResponse.json({ error: "Invalid or expired coupon code." }, { status: 404 });
  }

  // Expiry check
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "This coupon has expired." }, { status: 410 });
  }

  // Usage limit check
  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
    return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 409 });
  }

  // Min order amount
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return NextResponse.json(
      { error: `Minimum order amount is ₦${coupon.minOrderAmount.toLocaleString("en-NG")}.` },
      { status: 422 }
    );
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = coupon.value;
  }

  discount = Math.min(discount, subtotal);

  return NextResponse.json({
    discount,
    message: `Coupon applied! You save ₦${discount.toLocaleString("en-NG")}.`,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    },
  });
}