import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Watch Care Guide — Queen Gold",
  description: "How to care for and maintain your Queen Gold luxury timepiece to ensure decades of precision performance.",
};

const CARE_SECTIONS = [
  {
    icon: "◇",
    title: "Daily Wear",
    tips: [
      "Avoid extreme temperature changes — do not move directly from very hot to very cold environments.",
      "Remove your watch before contact sports, heavy lifting, or activities with risk of impact.",
      "Ensure the crown is fully pushed in and screwed down (if applicable) before any water exposure.",
      "Magnetic fields from speakers, phones, and laptops can affect mechanical movements — keep at a distance.",
    ],
  },
  {
    icon: "○",
    title: "Water Resistance",
    tips: [
      "Check your model's water resistance rating before any water activities.",
      "30m / 3 ATM — splash resistant, not for swimming.",
      "50m / 5 ATM — suitable for swimming, not diving.",
      "100m / 10 ATM — suitable for snorkelling and recreational diving.",
      "200m+ — suitable for professional diving.",
      "Never operate the crown or pushers while the watch is submerged.",
      "Have water resistance re-tested annually by an authorised service centre.",
    ],
  },
  {
    icon: "△",
    title: "Cleaning",
    tips: [
      "Wipe the case and bracelet weekly with a soft, lint-free cloth to remove dust and perspiration.",
      "For metal bracelets, use a soft brush with mild soapy water — rinse and dry thoroughly.",
      "Never use chemicals, solvents, or ultrasonic cleaners on your watch.",
      "Clean the sapphire crystal with a microfibre cloth to remove fingerprints.",
      "Leather straps should be kept away from water and wiped with a dry cloth only.",
    ],
  },
  {
    icon: "✦",
    title: "Storage",
    tips: [
      "Store your watch in its presentation box or a padded watch roll when not being worn.",
      "Keep away from direct sunlight, which can fade dials and degrade leather straps over time.",
      "For automatic watches not worn regularly, use a watch winder to keep the movement running.",
      "For long-term storage (months), have the watch serviced before returning it to regular wear.",
    ],
  },
  {
    icon: "✧",
    title: "Servicing",
    tips: [
      "Mechanical movements should be serviced every 3–5 years by an authorised technician.",
      "Quartz movements typically require only a battery change every 2–3 years.",
      "Do not attempt to open the caseback or adjust the movement yourself.",
      "Only use authorised Queen Gold service centres to maintain your warranty.",
      "After service, request a water resistance test — the seals are replaced during service.",
    ],
  },
];

export default function CarePage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="pt-12 pb-14 text-center">
          <p className="font-display text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
            Preserve Your Investment
          </p>
          <h1 className="font-serif text-5xl text-gold-gradient mb-4">Watch Care Guide</h1>
          <div className="divider-gold w-20 mx-auto mb-6" />
          <p className="font-body text-base max-w-xl mx-auto" style={{ color: "rgba(245,230,200,0.65)" }}>
            A Queen Gold timepiece is built to last generations. With the right care, it will maintain its precision, beauty, and value for decades to come.
          </p>
        </div>

        <div className="space-y-6">
          {CARE_SECTIONS.map((section) => (
            <div key={section.title} className="card-luxury p-8">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-sm flex items-center justify-center"
                     style={{ background: "rgba(212,175,55,0.08)", border: "1px solid var(--border-gold)" }}>
                  <span className="font-serif text-xl" style={{ color: "var(--gold)" }}>{section.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-xl text-gold-gradient mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full flex-shrink-0 mt-2" style={{ background: "var(--gold-muted)" }} />
                        <span className="font-body text-sm leading-relaxed" style={{ color: "rgba(245,230,200,0.7)" }}>
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <div className="divider-gold mb-10" />
          <p className="font-display text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
            Need Service or Assistance?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-gold px-10 h-12 text-xs rounded-sm inline-flex items-center justify-center">
              Contact Service Centre
            </Link>
            <Link href="/warranty"
                  className="px-10 h-12 font-display text-xs tracking-[0.2em] uppercase rounded-sm inline-flex items-center justify-center transition-colors hover:bg-white/5"
                  style={{ border: "1px solid var(--border-gold)", color: "var(--gold-muted)" }}>
              View Warranty
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}