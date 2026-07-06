export function ViewFallback() {
  return (
    <div
      className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col items-center justify-center gap-4 text-ink-muted"
      role="status"
      aria-live="polite"
      aria-label="Loading view"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-parchment-dark border-t-gold"
        aria-hidden
      />
      <p className="text-sm">Loading…</p>
    </div>
  )
}
