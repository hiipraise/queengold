export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated crown / watch face */}
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "rgba(212,175,55,0.3)",
              borderTopColor: "var(--gold)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)", opacity: 0.6 }} />
          </div>
        </div>
        <p className="font-display text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--gold-muted)" }}>
          Loading
        </p>
      </div>
    </div>
  );
}