import { useState } from 'react'
import type { Verse } from '../types'
import {
  getFavoriteComparisons,
  getFavoriteVerses,
  removeFavoriteComparison,
  removeFavoriteVerse,
  type SavedComparison,
} from '../hooks/useFavorites'
import { VerseCard } from './VerseCard'

interface FavoritesPanelProps {
  onOpenComparison: (comparison: SavedComparison) => void
}

export function FavoritesPanel({ onOpenComparison }: FavoritesPanelProps) {
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(0)

  const verses = getFavoriteVerses()
  const comparisons = getFavoriteComparisons()

  if (verses.length === 0 && comparisons.length === 0) return null

  function refresh() {
    setTick((t) => t + 1)
  }

  function handleRemoveVerse(id: string) {
    removeFavoriteVerse(id)
    refresh()
  }

  function handleRemoveComparison(key: string) {
    removeFavoriteComparison(key)
    refresh()
  }

  void tick

  const savedVerses = getFavoriteVerses()
  const savedComparisons = getFavoriteComparisons()

  return (
    <section className="mb-10 w-full" aria-label="Saved favorites">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-parchment-dark bg-white px-4 py-3 text-left transition hover:border-gold/50"
      >
        <span className="font-display text-lg font-semibold text-navy">
          Saved favorites
          <span className="ml-2 text-sm font-normal text-ink-muted">
            ({savedVerses.length + savedComparisons.length})
          </span>
        </span>
        <span className="text-gold" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-6 rounded-xl border border-parchment-dark bg-white/80 p-4">
          {savedVerses.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                Saved verses
              </h3>
              <div className="flex flex-col gap-3">
                {savedVerses.map((verse) => (
                  <FavoriteVerseRow
                    key={verse.id}
                    verse={verse}
                    onRemove={() => handleRemoveVerse(verse.id)}
                    onFavoriteChange={refresh}
                  />
                ))}
              </div>
            </div>
          )}

          {savedComparisons.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                Saved comparisons
              </h3>
              <ul className="flex flex-col gap-2">
                {savedComparisons.map((item) => (
                  <li key={item.key}>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenComparison(item)}
                        className="min-w-0 flex-1 rounded-lg border border-parchment-dark bg-white px-3 py-2.5 text-left transition hover:border-gold active:scale-[0.99]"
                      >
                        <span className="block truncate font-semibold text-navy">{item.title}</span>
                        {item.subtitle && (
                          <span className="block truncate text-xs text-ink-muted">{item.subtitle}</span>
                        )}
                        <span className="mt-1 inline-block text-xs text-gold capitalize">
                          {kindLabel(item.kind)} →
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveComparison(item.key)}
                        className="shrink-0 rounded-lg border border-parchment-dark px-2.5 py-2 text-ink-muted transition hover:text-navy"
                        aria-label={`Remove ${item.title} from favorites`}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function FavoriteVerseRow({
  verse,
  onRemove,
  onFavoriteChange,
}: {
  verse: Verse
  onRemove: () => void
  onFavoriteChange: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  if (expanded) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="back-link mb-2 text-sm"
        >
          ← Collapse
        </button>
        <VerseCard verse={verse} onFavoriteChange={onFavoriteChange} />
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 text-xs text-ink-muted underline hover:text-navy"
        >
          Remove from favorites
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-parchment-dark bg-white px-3 py-2.5">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="min-w-0 flex-1 text-left"
      >
        <span className="block font-semibold text-navy">{verse.reference}</span>
        <span className="line-clamp-1 text-sm text-ink-muted">{verse.text}</span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-ink-muted hover:text-navy"
        aria-label={`Remove ${verse.reference} from favorites`}
      >
        ×
      </button>
    </div>
  )
}

function kindLabel(kind: SavedComparison['kind']): string {
  if (kind === 'story') return 'Story'
  if (kind === 'lyrics') return 'Song'
  return 'Quote'
}
