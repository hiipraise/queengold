"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QueenGoldLogo from "@/components/QueenGoldLogo";
import WatchPassport from "@/components/WatchPassport";
import { normalizeSerial } from "@/lib/utils";

interface PassportData {
  serialNumber:   string;
  model:          string;
  collection:     string;
  movement:       string;
  status:         string;
  warrantyStatus: string;
  dateOfPurchase: string | null;
  dealer:         string;
  scanCount:      number;
  firstScannedAt: string | null;
}

interface Props { initialSerial?: string; }

export default function VerifyClient({ initialSerial = "" }: Props) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [serial,   setSerial]   = useState(initialSerial.toUpperCase());
  const [loading,  setLoading]  = useState(false);
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sn = searchParams.get("sn");
    if (sn) { setSerial(sn.toUpperCase()); handleVerify(sn.toUpperCase()); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleVerify(overrideSerial?: string) {
    const value = normalizeSerial(overrideSerial ?? serial);
    if (!value) { inputRef.current?.focus(); return; }

    setLoading(true); setPassport(null); setNotFound(false); setErrorMsg("");
    router.replace(`/verify?sn=${encodeURIComponent(value)}`, { scroll: false });

    try {
      const res  = await fetch(`/api/verify?sn=${encodeURIComponent(value)}`);
      if (res.status === 429) {
        setErrorMsg("Too many attempts. Please wait a moment and try again."); return;
      }
      const data = await res.json();
      if (res.ok && data.found) { setPassport(data.passport); } else { setNotFound(true); }
    } catch {
      setErrorMsg("A network error occurred. Please check your connection.");
    } finally { setLoading(false); }
  }

  function handleReset() {
    setSerial(""); setPassport(null); setNotFound(false); setErrorMsg("");
    router.replace("/verify", { scroll: false });
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start px-4 pb-16 overflow-x-hidden z-10">
      <header className="w-full max-w-xl mx-auto pt-12 pb-2 flex flex-col items-center text-center animate-fade-up">
        <QueenGoldLogo size="lg" />
        <div className="divider-gold w-48 mt-6 mb-0" />
      </header>

      {!passport && (
        <section className="w-full max-w-md mx-auto mt-10 animate-fade-up delay-200" aria-label="Watch verification form">
          <div className="card-luxury p-8 sm:p-10">
            <h1 className="font-serif text-2xl sm:text-3xl text-gold-gradient text-center mb-2 tracking-wide">
              Verify Your Watch
            </h1>
            <p className="text-center font-body text-sm tracking-widest uppercase mb-8" style={{ color: "var(--text-muted)" }}>
              Digital Watch Passport
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="serial-input"
                       className="block font-display text-xs tracking-[0.2em] uppercase mb-2"
                       style={{ color: "var(--gold-muted)" }}>
                  Serial Number
                </label>
                <input
                  ref={inputRef} id="serial-input" type="text"
                  autoCapitalize="characters" autoComplete="off" spellCheck={false}
                  maxLength={32} value={serial}
                  onChange={e => { setSerial(e.target.value.toUpperCase()); setNotFound(false); setErrorMsg(""); }}
                  onKeyDown={e => e.key === "Enter" && handleVerify()}
                  placeholder="e.g. Q04R7254"
                  className="input-luxury w-full h-14 px-5 text-base rounded-sm"
                  aria-describedby={notFound ? "serial-error" : undefined}
                  aria-invalid={notFound}
                />
              </div>
              {notFound && (
                <p id="serial-error" className="text-sm text-center animate-fade-in" style={{ color: "#E8A0A0", letterSpacing: "0.05em" }}>
                  Serial number not recognised. Please contact Queen Gold support.
                </p>
              )}
              {errorMsg && (
                <p className="text-sm text-center animate-fade-in" style={{ color: "#E8A0A0", letterSpacing: "0.05em" }}>
                  {errorMsg}
                </p>
              )}
              <button onClick={() => handleVerify()} disabled={loading || !serial.trim()}
                      className="btn-gold w-full h-14 text-sm rounded-sm mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <LoadingDots />Verifying
                  </span>
                ) : "Verify Watch"}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8 opacity-50">
              <LockIcon />
              <span className="font-body text-xs tracking-[0.15em] uppercase" style={{ color: "var(--gold-muted)" }}>
                Secure Verification · Authentic Queen Gold Timepieces
              </span>
            </div>
          </div>
        </section>
      )}

      {passport && (
        <section className="w-full max-w-md mx-auto mt-10 animate-fade-up">
          <WatchPassport passport={passport} onReset={handleReset} />
        </section>
      )}

      <footer className="mt-auto pt-12 text-center">
        <p className="font-body text-xs tracking-widest uppercase opacity-30" style={{ color: "var(--gold-muted)" }}>
          www.queengold.com
        </p>
      </footer>
    </main>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <rect x="1" y="6" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"
            style={{ color: "var(--gold-muted)" }} />
      <path d="M3 6V4.5a3 3 0 0 1 6 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            style={{ color: "var(--gold-muted)" }} />
      <circle cx="6" cy="10" r="1" fill="currentColor" style={{ color: "var(--gold-muted)" }} />
    </svg>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-current"
              style={{ animation: `bounce 1s ${i * 0.15}s infinite` }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scaleY(1)} 40%{transform:scaleY(1.5)} }`}</style>
    </span>
  );
}