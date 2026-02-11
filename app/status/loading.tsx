export default function StatusLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-32 animate-pulse rounded bg-foreground/10" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-foreground/10" />
        </div>

        <div className="rounded-lg bg-foreground/5 p-5">
          <div className="mb-3 h-4 w-20 animate-pulse rounded bg-foreground/10" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/10" />
                  <div className="h-4 w-24 animate-pulse rounded bg-foreground/10" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-foreground/5 p-5">
          <div className="mb-3 h-4 w-16 animate-pulse rounded bg-foreground/10" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-foreground/10" />
                <div className="h-4 w-24 animate-pulse rounded bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
