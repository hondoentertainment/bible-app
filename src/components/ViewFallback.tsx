export function ViewFallback() {
  return (
    <div
      className="mx-auto w-full max-w-3xl"
      role="status"
      aria-live="polite"
      aria-label="Loading view"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-72" />
      </div>
      <div className="mt-8 space-y-4">
        <div className="skeleton h-14 w-full rounded-2xl" />
        <div className="skeleton h-40 w-full rounded-2xl" />
        <div className="skeleton h-40 w-full rounded-2xl" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
