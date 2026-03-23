import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const { transaction_ref } = await request.json();
  return NextResponse.json({ status: "success", transaction_ref, message: "Mock verification succeeded." });
}
