import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md">
        {/* Decorative element */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div
            className="absolute inset-0 rounded-full opacity-10"
            style={{ border: "1px solid var(--gold)" }}
          />
          <div
            className="absolute inset-4 rounded-full opacity-10"
            style={{ border: "1px solid var(--gold)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-5xl text-gold-gradient">404</span>
          </div>
        </div>

        <p className="font-display text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "var(--gold-muted)" }}>
          Page Not Found
        </p>
        <h1 className="font-serif text-3xl text-gold-gradient mb-4">
          Lost in Time
        </h1>
        <p className="font-body text-sm leading-relaxed mb-10" style={{ color: "var(--text-muted)" }}>
          The page you are looking for does not exist or has been moved. Return to the collection and continue your journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/shop" className="btn-gold px-10 h-12 text-xs rounded-sm inline-flex items-center justify-center">
            Browse Collection
          </Link>
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