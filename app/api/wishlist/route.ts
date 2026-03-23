import { NextRequest, NextResponse } from "next/server";
import { getWishlist, saveWishlist } from "@/lib/commerce";

export const dynamic = "force-dynamic";

function getEmail(request: NextRequest) {
  return request.nextUrl.searchParams.get("email") || request.headers.get("x-customer-email") || "guest@queengold.local";
}

export async function GET(request: NextRequest) {
  const email = getEmail(request);
  const productSlugs = await getWishlist(email);
  return NextResponse.json({ email, productSlugs });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const email = body.email || getEmail(request);
  const productSlugs = await saveWishlist(email, body.productSlugs ?? []);
  return NextResponse.json({ email, productSlugs });
}
