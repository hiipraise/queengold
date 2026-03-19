import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Watch } from "@/lib/models/Watch";
import { ScanLog } from "@/lib/models/ScanLog";
import { rateLimitVerify } from "@/lib/rate-limit";
import { normalizeSerial, getClientIp } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, remaining, resetAt } = rateLimitVerify(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset":     String(resetAt),
          "Retry-After":           String(Math.ceil((resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawSerial = searchParams.get("sn") ?? "";

  if (!rawSerial) {
    return NextResponse.json(
      { error: "Serial number is required." },
      { status: 400 }
    );
  }

  const serial = normalizeSerial(rawSerial);

  if (!/^[A-Z0-9\-]{4,32}$/.test(serial)) {
    return NextResponse.json(
      { error: "Invalid serial number format." },
      { status: 400 }
    );
  }

  await connectDB();

  const watch = await Watch.findOne({ serialNumber: serial });

  // Always log the attempt (after DB check)
  const logEntry = {
    serialAttempted: serial,
    ip,
    userAgent: request.headers.get("user-agent") ?? "",
    found: !!watch,
    timestamp: new Date(),
  };

  // Fire-and-forget log — don't await to keep response fast
  ScanLog.create(logEntry).catch(console.error);

  if (!watch) {
    return NextResponse.json(
      { found: false },
      {
        status: 404,
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  }

  // Update scan tracking
  const now = new Date();
  Watch.findByIdAndUpdate(watch._id, {
    $inc: { scanCount: 1 },
    $set: {
      lastScannedAt: now,
      ...(watch.firstScannedAt ? {} : { firstScannedAt: now }),
    },
  }).catch(console.error);

  // Return only the fields needed for the passport — no internal IDs
  return NextResponse.json(
    {
      found: true,
      passport: {
        serialNumber:  watch.serialNumber,
        model:         watch.model,
        collection:    watch.collection,
        movement:      watch.movement,
        status:        watch.status,
        warrantyStatus: watch.warrantyStatus,
        dateOfPurchase: watch.dateOfPurchase,
        dealer:        watch.dealer,
        scanCount:     watch.scanCount + 1,  // reflect this scan
        firstScannedAt: watch.firstScannedAt ?? now,
      },
    },
    { headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}
