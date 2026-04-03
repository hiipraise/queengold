"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
             style={{ background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 9v6M14 18v1" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" />
            <path d="M12.2 4.2L2.5 21a2 2 0 0 0 1.7 3h19.6a2 2 0 0 0 1.7-3L15.8 4.2a2 2 0 0 0-3.6 0z"
                  stroke="#C0392B" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="font-display text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
          Something Went Wrong
        </p>
        <h1 className="font-serif text-3xl text-gold-gradient mb-4">An Error Occurred</h1>
        <p className="font-body text-sm leading-relaxed mb-10" style={{ color: "var(--text-muted)" }}>
          An unexpected error occurred. Please try again, or contact support if the problem persists.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="btn-gold px-10 h-12 text-xs rounded-sm inline-flex items-center justify-center"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-10 h-12 font-display text-xs tracking-[0.2em] uppercase rounded-sm inline-flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}