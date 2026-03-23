import { NextRequest, NextResponse } from "next/server";
import { getCart, saveCart } from "@/lib/commerce";

export const dynamic = "force-dynamic";

function getEmail(request: NextRequest) {
  return request.nextUrl.searchParams.get("email") || request.headers.get("x-customer-email") || "guest@queengold.local";
}

export async function GET(request: NextRequest) {
  const email = getEmail(request);
  const items = await getCart(email);
  return NextResponse.json({ email, items });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const email = body.email || getEmail(request);
  const items = await saveCart(email, body.items ?? []);
  return NextResponse.json({ email, items });
}
