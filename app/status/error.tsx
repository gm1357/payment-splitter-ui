"use client";

export default function StatusError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-foreground/60">
          Could not load the status page. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
