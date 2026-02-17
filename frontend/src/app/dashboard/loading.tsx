export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <aside className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border" />

      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-muted rounded-lg w-48 mb-2" />
            <div className="h-4 bg-muted/50 rounded-lg w-72" />
          </div>

          <div className="bg-card/60 border border-border/30 rounded-2xl p-4 mb-6 animate-pulse">
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-muted rounded-xl" />
              <div className="w-32 h-10 bg-muted/60 rounded-xl" />
              <div className="w-32 h-10 bg-muted/60 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card/60 border border-border/30 rounded-2xl p-5 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-md bg-muted mt-0.5" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded-lg w-3/4" />
                    <div className="h-3 bg-muted/60 rounded-lg w-full" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-muted/40 rounded-full w-16" />
                      <div className="h-5 bg-muted/40 rounded-full w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
