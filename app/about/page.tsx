import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Queen Gold — Our Story",
  description: "Queen Gold is a Lagos-born luxury watch brand crafting precision timepieces that embody West African heritage and global excellence.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="pt-12 pb-16 text-center">
          <p className="font-display text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
            Est. Lagos, Nigeria
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-gold-gradient mb-6">Our Story</h1>
          <div className="divider-gold w-24 mx-auto" />
        </div>

        {/* Content */}
        <div className="prose-luxury space-y-16">
          {[
            {
              title: "Born from a Vision",
              body: "Queen Gold was founded on a singular conviction: that Africa deserves luxury timepieces that speak its own language. Not replicas of European houses, but original horological expressions of West African excellence — precision-engineered, bold, and entirely authentic.",
            },
            {
              title: "The CROWNCALIBRE™ Movement",
              body: "Every Queen Gold timepiece is powered by our CROWNCALIBRE™ movement — developed through years of collaboration with precision engineers. Each movement is tested to exacting standards before being cased in our signature stainless steel and gold-plated cases.",
            },
            {
              title: "The Digital Watch Passport",
              body: "We pioneered the Digital Watch Passport system for African luxury goods — a blockchain-inspired authenticity record linked to every serial number. When you verify your Queen Gold watch, you are accessing an immutable record of its provenance, ownership, and craftsmanship.",
            },
            {
              title: "Lagos to the World",
              body: "From our Lagos atelier, Queen Gold timepieces travel to collectors and connoisseurs across Africa and beyond. We believe the future of global luxury includes African voices, African precision, and African pride.",
            },
          ].map((section) => (
            <section key={section.title} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <div className="w-8 h-px mb-4" style={{ background: "var(--gold)", opacity: 0.6 }} />
                <h2 className="font-serif text-2xl text-gold-gradient">{section.title}</h2>
              </div>
              <div className="md:col-span-2">
                <p className="font-body text-base leading-relaxed" style={{ color: "rgba(245,230,200,0.75)" }}>
                  {section.body}
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20 pt-16" style={{ borderTop: "1px solid var(--border-gold)" }}>
          <p className="font-display text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
            Experience the Collection
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="btn-gold px-10 h-12 text-xs rounded-sm inline-flex items-center justify-center">
              Shop Now
            </Link>
            <Link href="/verify"
                  className="px-10 h-12 font-display text-xs tracking-[0.2em] uppercase rounded-sm inline-flex items-center justify-center transition-colors hover:bg-white/5"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>
              Verify Your Watch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
