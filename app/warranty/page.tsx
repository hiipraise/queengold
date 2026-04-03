import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Warranty — Queen Gold", description: "Every Queen Gold timepiece is backed by our 2-year manufacturer's warranty and Digital Watch Passport." };

export default function WarrantyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="pt-12 pb-12 text-center">
          <p className="font-display text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>Peace of Mind</p>
          <h1 className="font-serif text-5xl text-gold-gradient mb-4">Warranty</h1>
          <div className="divider-gold w-20 mx-auto" />
        </div>

        <div className="space-y-6">
          <div className="card-luxury p-8">
            <h2 className="font-serif text-2xl text-gold-gradient mb-4">2-Year Manufacturer&apos;s Warranty</h2>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: "rgba(245,230,200,0.75)" }}>
              Every Queen Gold timepiece is covered by a comprehensive 2-year warranty from the date of purchase, against defects in materials and workmanship.
            </p>
            <ul className="space-y-3">
              {["Movement and all mechanical components", "Case and bracelet manufacturing defects", "Water resistance up to rated depth", "Crown, pushers, and winding mechanism", "Dial and hands (manufacturing defects)"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7.5" stroke="var(--gold)" strokeWidth="0.8"/>
                    <path d="M4.5 8l2.5 2.5L12 5.5" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-body text-sm" style={{ color: "rgba(245,230,200,0.75)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-luxury p-8">
            <h2 className="font-serif text-xl text-gold-gradient mb-3">What Is Not Covered</h2>
            <ul className="space-y-2">
              {["Accidental damage or impact", "Scratches and normal wear", "Water damage beyond rated resistance", "Unauthorised modifications or repairs", "Battery replacement (quartz models)"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C0392B" }} />
                  <span className="font-body text-sm" style={{ color: "rgba(245,230,200,0.65)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-luxury p-8">
            <h2 className="font-serif text-xl text-gold-gradient mb-3">Making a Warranty Claim</h2>
            <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "rgba(245,230,200,0.75)" }}>
              To make a warranty claim, please contact our service team with your order number and serial number. We will arrange inspection and repair or replacement at no charge.
            </p>
            <Link href="/contact" className="btn-gold px-8 h-11 text-xs rounded-sm inline-flex items-center justify-center">
              Contact Service Team
            </Link>
          </div>

          <div className="card-luxury p-8">
            <h2 className="font-serif text-xl text-gold-gradient mb-3">Digital Watch Passport</h2>
            <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "rgba(245,230,200,0.75)" }}>
              Your warranty is tied to your watch&apos;s Digital Watch Passport. Always verify your watch to confirm warranty status.
            </p>
            <Link href="/verify" className="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.2em] uppercase pb-0.5"
                  style={{ borderBottom: "1px solid rgba(212,175,55,0.4)", color: "var(--gold-muted)" }}>
              Verify Your Watch
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}