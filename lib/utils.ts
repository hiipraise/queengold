import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeSerial(serial: string): string {
  return serial.toUpperCase().trim().replace(/\s+/g, "");
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day:   "2-digit",
    month: "long",
    year:  "numeric",
  }).format(new Date(date));
}

/**
 * Format price in NGN. amount is in WHOLE Naira (not kobo).
 */
export function formatPrice(amount: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Convert Naira to kobo (Squad expects kobo)
 */
export function toKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Convert kobo to Naira
 */
export function fromKobo(kobo: number): number {
  return kobo / 100;
}

/**
 * Generate a unique transaction reference
 */
export function generateTransactionRef(prefix = "QG"): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

/**
 * Slugify a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text to a max length
 */
export function truncate(str: string, max = 120): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "…";
}