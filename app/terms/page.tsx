import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — Queen Gold" };

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="pt-12 pb-12">
          <p className="font-display text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>Legal</p>
          <h1 className="font-serif text-4xl text-gold-gradient mb-2">Terms of Service</h1>
          <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>Last updated: January 2025</p>
        </div>
        <div className="space-y-6" style={{ color: "rgba(245,230,200,0.7)" }}>
          {[
            { title: "Acceptance", body: "By accessing or using the Queen Gold website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations." },
            { title: "Products & Pricing", body: "All prices are displayed in Nigerian Naira (₦). Queen Gold reserves the right to modify prices at any time. Orders are confirmed only upon successful payment processing." },
            { title: "Authenticity Guarantee", body: "All Queen Gold products sold through this website are guaranteed authentic and come with a Digital Watch Passport. Any product found to be counterfeit will be fully refunded." },
            { title: "Returns & Refunds", body: "Unworn items in original condition may be returned within 14 days of delivery. Custom or personalised items are non-refundable. Refunds are processed within 7 business days." },
            { title: "Warranty", body: "Queen Gold timepieces carry a 2-year manufacturer's warranty against defects in materials and workmanship. The warranty does not cover accidental damage, misuse, or normal wear." },
            { title: "Intellectual Property", body: "The CROWNCALIBRE™ trademark, Queen Gold name, logos, and Digital Watch Passport system are proprietary to Queen Gold. Unauthorised reproduction is prohibited." },
            { title: "Limitation of Liability", body: "Queen Gold's liability is limited to the purchase price of the product. We are not liable for indirect, incidental, or consequential damages arising from the use of our products or services." },
            { title: "Governing Law", body: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved in the courts of Lagos State." },
          ].map((s) => (
            <section key={s.title} className="card-luxury p-6">
              <h2 className="font-serif text-lg text-gold-gradient mb-3">{s.title}</h2>
              <p className="font-body text-sm leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}