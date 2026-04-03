import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/lib/models/Customer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/customers/register
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
  } = body;

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "First name, last name, email, and password are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  await connectDB();

  const existing = await Customer.findOne({ email: email.toLowerCase().trim() }).lean();
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const customer = await Customer.create({
    firstName: firstName.trim(),
    lastName:  lastName.trim(),
    email:     email.toLowerCase().trim(),
    passwordHash: password, // pre-save hook will hash it
    phone:     phone?.trim() ?? undefined,
  });

  const { passwordHash: _, ...safe } = customer.toObject();
  void _;

  return NextResponse.json({ customer: { ...safe, _id: String(safe._id) } }, { status: 201 });
}