import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/lib/models/Admin";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(request: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const currentPassword = String(body.currentPassword ?? "");
  const nextEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const nextPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword) {
    return NextResponse.json({ error: "Current password is required." }, { status: 400 });
  }

  if (!nextEmail && !nextPassword) {
    return NextResponse.json(
      { error: "Provide a new email address, a new password, or both." },
      { status: 400 },
    );
  }

  if (nextEmail && !EMAIL_PATTERN.test(nextEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (nextPassword && nextPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters long." },
      { status: 400 },
    );
  }

  await connectDB();

  const admin = await Admin.findById(session.user.id);
  if (!admin) {
    return NextResponse.json({ error: "Admin account not found." }, { status: 404 });
  }

  const validPassword = await admin.comparePassword(currentPassword);
  if (!validPassword) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  if (nextEmail && nextEmail !== admin.email) {
    const existingAdmin = await Admin.findOne({ email: nextEmail, _id: { $ne: admin._id } }).lean();
    if (existingAdmin) {
      return NextResponse.json(
        { error: "That email address is already in use." },
        { status: 409 },
      );
    }

    admin.email = nextEmail;
  }

  if (nextPassword) {
    admin.passwordHash = nextPassword;
  }

  await admin.save();

  return NextResponse.json({
    success: true,
    message: "Account updated. Please sign in again with your new credentials.",
  });
}
