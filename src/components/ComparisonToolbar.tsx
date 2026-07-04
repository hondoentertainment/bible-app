interface ComparisonToolbarProps {
  backLabel: string
  onBack: () => void
  onCopy?: () => void
  onShare?: () => void
  onRecompare?: () => void
  showActions?: boolean
}

export function ComparisonToolbar({
  backLabel,
  onBack,
  onCopy,
  onShare,
  onRecompare,
  showActions = true,
}: ComparisonToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <button type="button" onClick={onBack} className="back-link">
        <span aria-hidden>←</span> {backLabel}
      </button>
      {showActions && (onCopy || onShare || onRecompare) && (
        <div className="flex flex-wrap gap-2">
          {onRecompare && (
            <button
              type="button"
              onClick={onRecompare}
              className="touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-navy transition hover:border-gold active:scale-95"
            >
              Re-run comparison
            </button>
          )}
          {onCopy && (
            <button
              type="button"
              onClick={onCopy}
              className="touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-ink-muted transition hover:border-gold hover:text-gold active:scale-95"
            >
              Copy all
            </button>
          )}
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-ink-muted transition hover:border-gold hover:text-gold active:scale-95"
            >
              Share
            </button>
          )}
        </div>
      )}
    </div>
  )
}
