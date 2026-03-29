import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/lib/models/Customer";

export async function POST(req: NextRequest) {
  await connectDB();
  const { firstName, lastName, email, password } = await req.json();

  if (!firstName || !lastName || !email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const exists = await Customer.findOne({ email: email.toLowerCase() });
  if (exists) return NextResponse.json({ error: "Account exists" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  await Customer.create({ firstName, lastName, email: email.toLowerCase(), passwordHash });

  return NextResponse.json({ ok: true });
}
