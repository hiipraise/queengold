import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Queen Gold" };

const sections = [
  { title: "Information We Collect", body: "We collect information you provide directly to us — such as your name, email address, shipping address, and payment information when you make a purchase. We also automatically collect certain information about your device and how you interact with our website." },
  { title: "How We Use Your Information", body: "We use the information we collect to process your orders, send order confirmations and updates, respond to your enquiries, improve our services, and send you promotional communications (with your consent)." },
  { title: "Payment Information", body: "All payment processing is handled by Squad by GTBank, a PCI-DSS compliant payment gateway. Queen Gold does not store your full payment card details on our servers." },
  { title: "Data Sharing", body: "We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website, conducting our business, or servicing you — subject to confidentiality agreements." },
  { title: "Watch Passport Data", body: "Serial number verification data (IP address, timestamp, and verification result) is logged for anti-counterfeiting purposes and automatically deleted after 90 days." },
  { title: "Your Rights", body: "You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at privacy@queengold.com." },
  { title: "Cookies", body: "We use essential cookies to maintain your shopping session and preferences. You may disable cookies in your browser settings, though this may affect site functionality." },
  { title: "Contact", body: "For privacy-related enquiries, contact our Data Protection Officer at privacy@queengold.com." },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="pt-12 pb-12">
          <p className="font-display text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>Legal</p>
          <h1 className="font-serif text-4xl text-gold-gradient mb-2">Privacy Policy</h1>
          <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>Last updated: January 2025</p>
        </div>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title} className="card-luxury p-6">
              <h2 className="font-serif text-lg text-gold-gradient mb-3">{s.title}</h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(245,230,200,0.7)" }}>{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}