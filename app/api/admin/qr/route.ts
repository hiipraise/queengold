import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireAdmin } from "@/lib/admin-guard";
import { normalizeSerial } from "@/lib/utils";

const DEFAULT_QR_SIZE = 2400;
const MIN_QR_SIZE     = 256;
const MAX_QR_SIZE     = 2400;

function parseSize(raw: string | null) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return DEFAULT_QR_SIZE;
  return Math.min(MAX_QR_SIZE, Math.max(MIN_QR_SIZE, Math.round(parsed)));
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const serial = normalizeSerial(searchParams.get("sn") ?? "");
  const size   = parseSize(searchParams.get("size"));

  if (!serial) return NextResponse.json({ error: "sn param required." }, { status: 400 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://queengold.com";
  const url     = `${siteUrl}/verify?sn=${encodeURIComponent(serial)}`;

  const dataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    margin: 2,
    width:  size,
    color:  { dark: "#2D0614", light: "#F5E6C8" },
  });

  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const buf    = Buffer.from(base64, "base64");

  return new NextResponse(buf, {
    headers: {
      "Content-Type":        "image/png",
      "Content-Disposition": `attachment; filename="qr-${serial}-${size}px.png"`,
      "Cache-Control":       "public, max-age=86400",
    },
  });
}