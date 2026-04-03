export default function ShopLoading() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="pt-8 pb-10 text-center space-y-3">
          <div className="h-3 w-24 rounded mx-auto animate-pulse" style={{ background: "rgba(212,175,55,0.15)" }} />
          <div className="h-10 w-56 rounded mx-auto animate-pulse" style={{ background: "rgba(212,175,55,0.1)" }} />
          <div className="h-3 w-20 rounded mx-auto animate-pulse" style={{ background: "rgba(212,175,55,0.08)" }} />
        </div>

        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
            {[80, 60, 72, 64].map((w, i) => (
              <div key={i} className="space-y-2">
                <div className="h-2.5 rounded animate-pulse" style={{ width: `${w}%`, background: "rgba(212,175,55,0.15)" }} />
                {[50, 65, 45, 55].map((w2, j) => (
                  <div key={j} className="h-2 rounded animate-pulse ml-2" style={{ width: `${w2}%`, background: "rgba(212,175,55,0.08)" }} />
                ))}
              </div>
            ))}
          </aside>

          {/* Grid skeleton */}
          <div className="flex-1">
            <div className="flex justify-end mb-8">
              <div className="h-9 w-32 rounded-sm animate-pulse" style={{ background: "rgba(212,175,55,0.1)" }} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div
                    className="rounded-sm animate-pulse"
                    style={{ aspectRatio: "3/4", background: "rgba(212,175,55,0.06)", animationDelay: `${i * 0.05}s` }}
                  />
                  <div className="h-2.5 w-3/4 rounded animate-pulse" style={{ background: "rgba(212,175,55,0.08)" }} />
                  <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: "rgba(212,175,55,0.1)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}