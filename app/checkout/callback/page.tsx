"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

type Status = "verifying" | "success" | "failed" | "error";

export default function CheckoutCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const [status, setStatus] = useState<Status>("verifying");
  const [orderNumber, setOrderNumber] = useState("");
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const txRef = searchParams.get("transaction_ref") ??
                  searchParams.get("squad_ref") ?? "";

    if (!txRef) {
      setStatus("error");
      setMessage("No payment reference received. Please contact support.");
      return;
    }

    const sessionId = sessionStorage.getItem("qg_checkout_session") ?? "";

    (async () => {
      try {
        const res = await fetch(
          `/api/payments/squad/verify?transaction_ref=${encodeURIComponent(txRef)}&sessionId=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();

        if (res.ok && data.status === "success") {
          setStatus("success");
          setOrderNumber(data.orderNumber);
          setTotal(data.total ?? 0);
          await clearCart();
          sessionStorage.removeItem("qg_checkout_session");
        } else {
          setStatus("failed");
          setMessage(data.message ?? "Payment was not completed successfully.");
        }
      } catch {
        setStatus("error");
        setMessage("Unable to verify payment. Please contact support.");
      }
    })();
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">

        {status === "verifying" && (
          <div className="card-luxury p-12 animate-fade-up">
            <div className="w-16 h-16 rounded-full border-2 border-t-transparent mx-auto mb-6 animate-spin"
                 style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
            <h1 className="font-serif text-2xl text-gold-gradient mb-3">Verifying Payment</h1>
            <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="card-luxury p-12 animate-fade-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ background: "rgba(34,120,60,0.15)", border: "1px solid rgba(34,120,60,0.5)" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14l5.5 6L22 8" stroke="#22783C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-display text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
              Payment Confirmed
            </p>
            <h1 className="font-serif text-3xl text-gold-gradient mb-4">Order Placed!</h1>
            <p className="font-body text-sm mb-2" style={{ color: "var(--text-muted)" }}>
              Thank you for your Queen Gold purchase.
            </p>
            {orderNumber && (
              <p className="font-display text-base tracking-widest mb-2" style={{ color: "var(--gold)" }}>
                Order #{orderNumber}
              </p>
            )}
            {total > 0 && (
              <p className="font-serif text-2xl text-gold-gradient mb-8">
                {formatPrice(total)}
              </p>
            )}
            <div className="divider-gold mb-8" />
            <p className="font-body text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              A confirmation email has been sent. Your Digital Watch Passport will be registered upon dispatch.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/account/orders" className="btn-gold h-12 text-xs rounded-sm flex items-center justify-center">
                View My Orders
              </Link>
              <Link
                href="/shop"
                className="h-12 font-display text-xs tracking-[0.2em] uppercase rounded-sm flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {(status === "failed" || status === "error") && (
          <div className="card-luxury p-12 animate-fade-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.5)" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M8 8l12 12M20 8L8 20" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl text-gold-gradient mb-4">
              {status === "failed" ? "Payment Unsuccessful" : "Something Went Wrong"}
            </h1>
            <p className="font-body text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              {message || "Your payment could not be processed. No charge has been made."}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/checkout")}
                className="btn-gold h-12 text-xs rounded-sm flex items-center justify-center"
              >
                Try Again
              </button>
              <Link
                href="/shop"
                className="h-12 font-display text-xs tracking-[0.2em] uppercase rounded-sm flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
              >
                Return to Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}