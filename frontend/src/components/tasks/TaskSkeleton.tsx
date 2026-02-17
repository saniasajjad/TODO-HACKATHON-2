export function TaskSkeleton() {
  return (
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
              <div className="flex gap-2 mt-3">
                <div className="h-5 bg-muted/40 rounded-full w-16" />
                <div className="h-5 bg-muted/40 rounded-full w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
