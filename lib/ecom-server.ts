import { cookies } from "next/headers";
import crypto from "crypto";

export function getOrCreateSessionId() {
  const cookieStore = cookies();
  const existing = cookieStore.get("qg_session_id")?.value;
  if (existing) return existing;
  const sessionId = crypto.randomUUID();
  cookieStore.set("qg_session_id", sessionId, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
  return sessionId;
}
