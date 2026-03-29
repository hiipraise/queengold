import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/storefront";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = await getProducts({
    page: Number(searchParams.get("page") || "1"),
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    gender: searchParams.get("gender") || undefined,
    type: searchParams.get("type") || undefined,
    sort: searchParams.get("sort") || undefined,
  });

  return NextResponse.json(data);
}
