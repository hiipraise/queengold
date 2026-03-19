"use client";

import React from "react";
import QueenGoldLogo from "./QueenGoldLogo";
import { formatDate } from "@/lib/utils";

interface PassportData {
  serialNumber:    string;
  model:           string;
  collection:      string;
  movement:        string;
  status:          string;
  warrantyStatus:  string;
  dateOfPurchase:  string | null;
  dealer:          string;
  scanCount:       number;
  firstScannedAt:  string | null;
}

interface Props {
  passport: PassportData;
  onReset:  () => void;
}

export default function WatchPassport({ passport, onReset }: Props) {
  const isRegistered = passport.status === "registered" || passport.status === "sold";
  const warrantyActive = passport.warrantyStatus === "active";

  return (
    <article aria-label="Digital Watch Passport" className="w-full">
      {/* ── Authenticated header ─────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 mb-6 animate-fade-up">
        <CheckBadge />
        <span className="font-display text-xs tracking-[0.3em] uppercase"
              style={{ color: "var(--gold)" }}>
          Authentic Queen Gold Timepiece
        </span>
      </div>

      {/* ── Passport card ────────────────────────────────────────── */}
      <div className="passport-card overflow-hidden animate-fade-up delay-100">

        {/* ── Card header — burgundy band ────────────────────────── */}
        <div
          className="px-8 pt-10 pb-8 flex flex-col items-center text-center"
          style={{ background: "linear-gradient(160deg, #4B0E23 0%, #2D0614 100%)" }}
        >
          {/* Decorative top line */}
          <div className="w-16 h-px mb-6" style={{ background: "var(--gold)", opacity: 0.6 }} />

          <QueenGoldLogo size="md" />

          <p className="mt-4 font-display text-xs tracking-[0.35em] uppercase"
             style={{ color: "var(--gold-light)", opacity: 0.75 }}>
            Digital Watch Passport
          </p>

          <div className="w-24 h-px mt-5" style={{ background: "var(--gold)", opacity: 0.5 }} />
        </div>

        {/* ── Passport body ─────────────────────────────────────── */}
        <div className="px-8 py-8 space-y-0">

          {/* Verified stamp */}
          <div className="flex justify-end mb-2">
            <span
              className="inline-flex items-center gap-1.5 font-display text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-sm"
              style={{
                border:     "1px solid rgba(34,120,60,0.5)",
                color:      "#22783C",
                background: "rgba(34,120,60,0.07)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1" />
                <path d="M2.5 5l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Verified
            </span>
          </div>

          {/* Field rows */}
          <PassportField label="Model"       value={passport.model}      />
          <PassportField label="Serial Number" value={passport.serialNumber} mono />
          <PassportField label="Collection"  value={passport.collection} />
          <PassportField label="Movement"    value={passport.movement}   />

          <div className="divider-gold my-4" style={{ opacity: 0.3 }} />

          <PassportField
            label="Status"
            value={isRegistered ? "Authentic — Registered" : "Authentic — Unregistered"}
            highlight={isRegistered ? "green" : "amber"}
          />
          <PassportField
            label="Warranty"
            value={warrantyActive ? "Active" : "Expired"}
            highlight={warrantyActive ? "green" : "red"}
          />
          <PassportField
            label="Date of Purchase"
            value={formatDate(passport.dateOfPurchase)}
          />
          <PassportField label="Authorised Dealer" value={passport.dealer} />

          <div className="divider-gold my-4" style={{ opacity: 0.3 }} />

          {/* Anti-counterfeit info */}
          {passport.firstScannedAt && (
            <div
              className="rounded-sm px-4 py-3 mt-2"
              style={{ background: "rgba(75,14,35,0.07)", border: "1px solid rgba(75,14,35,0.12)" }}
            >
              <p className="font-body text-[11px] tracking-wide" style={{ color: "#5C1A3A" }}>
                <span className="font-semibold">First verified:</span>{" "}
                {formatDate(passport.firstScannedAt)}
              </p>
              {passport.scanCount > 1 && (
                <p className="font-body text-[11px] mt-0.5" style={{ color: "#5C1A3A", opacity: 0.8 }}>
                  Verified {passport.scanCount} time{passport.scanCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          {/* Bottom brand strip */}
          <div className="pt-8 pb-2 text-center">
            <p className="font-display text-[10px] tracking-[0.3em] uppercase"
               style={{ color: "#8B6C5C", opacity: 0.7 }}>
              Queen Gold · Lagos
            </p>
            <p className="font-body text-[10px] mt-1" style={{ color: "#8B6C5C", opacity: 0.5 }}>
              www.queengold.com
            </p>
          </div>
        </div>
      </div>

      {/* ── Verify another ────────────────────────────────────────── */}
      <div className="mt-8 text-center animate-fade-up delay-300">
        <button
          onClick={onReset}
          className="font-display text-xs tracking-[0.2em] uppercase pb-0.5"
          style={{
            color:          "var(--gold-muted)",
            borderBottom:   "1px solid rgba(212,175,55,0.3)",
            background:     "none",
            cursor:         "pointer",
          }}
        >
          Verify another watch
        </button>
      </div>
    </article>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function PassportField({
  label,
  value,
  mono      = false,
  highlight,
}: {
  label:     string;
  value:     string;
  mono?:     boolean;
  highlight?: "green" | "amber" | "red";
}) {
  const highlightColor = {
    green: "#22783C",
    amber: "#B8762E",
    red:   "#C0392B",
  }[highlight ?? ""] ?? "inherit";

  return (
    <div
      className="flex items-start justify-between py-3 gap-4"
      style={{ borderBottom: "1px solid rgba(75,14,35,0.12)" }}
    >
      <span
        className="font-body text-xs tracking-[0.12em] uppercase shrink-0"
        style={{ color: "#8B7060", minWidth: "120px" }}
      >
        {label}
      </span>
      <span
        className={`font-body text-sm text-right ${mono ? "tracking-widest font-medium" : "font-medium"}`}
        style={{
          color:      highlight ? highlightColor : "#2D0614",
          fontWeight: highlight ? 600 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function CheckBadge() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9.5" stroke="#D4AF37" strokeWidth="1" />
      <path d="M5.5 10.5l3 3 6-6"
            stroke="#D4AF37" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
