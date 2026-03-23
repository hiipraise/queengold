import { NextResponse } from "next/server";
import { products } from "@/lib/site-data";
export async function GET() { return NextResponse.json({ products }); }
