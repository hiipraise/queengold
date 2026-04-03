import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/lib/models/Customer";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await req.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Current and new passwords are required." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  await connectDB();
  const customer = await Customer.findById(userId);
  if (!customer) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const valid = await customer.comparePassword(currentPassword);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

  customer.passwordHash = newPassword; // pre-save hook hashes it
  await customer.save();

  return NextResponse.json({ success: true, message: "Password updated successfully." });
}