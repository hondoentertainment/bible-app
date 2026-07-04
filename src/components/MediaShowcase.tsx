import { useState } from 'react'
import {
  MEDIA_COMPARISONS,
  MEDIA_TYPE_LABELS,
  getComparisonsByType,
} from '../data/media-comparisons'
import type { MediaComparison, MediaType } from '../types/media'
import { MediaComparisonView } from './MediaComparisonView'

interface MediaShowcaseProps {
  onSelect?: (comparison: MediaComparison) => void
}

const TYPE_FILTERS: Array<{ id: MediaType | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'book', label: 'Books' },
  { id: 'song', label: 'Songs' },
  { id: 'movie', label: 'Movies' },
]

export function MediaShowcase({ onSelect }: MediaShowcaseProps) {
  const [filter, setFilter] = useState<MediaType | 'all'>('all')
  const [selected, setSelected] = useState<MediaComparison | null>(null)

  const items = getComparisonsByType(filter)

  function handleSelect(comparison: MediaComparison) {
    setSelected(comparison)
    onSelect?.(comparison)
  }

  if (selected) {
    return (
      <MediaComparisonView comparison={selected} onBack={() => setSelected(null)} />
    )
  }

  return (
    <section className="w-full" aria-label="Stories and Scripture">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
          Stories &amp; Scripture
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-muted">
          Famous lines from books, songs, and films — paired side-by-side with the NIV verses
          they echo.
        </p>
      </div>

      <div
        className="mb-6 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Media type"
      >
        {TYPE_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            onClick={() => setFilter(id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filter === id
                ? 'border-gold bg-gold text-white'
                : 'border-parchment-dark bg-white text-ink-muted hover:border-gold/40 hover:text-navy'
            }`}
          >
            {label}
            <span className={`ml-1.5 text-xs ${filter === id ? 'text-white/80' : 'opacity-60'}`}>
              {id === 'all' ? MEDIA_COMPARISONS.length : getComparisonsByType(id).length}
            </span>
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <MediaCard item={item} onSelect={() => handleSelect(item)} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function MediaCard({
  item,
  onSelect,
}: {
  item: MediaComparison
  onSelect: () => void
}) {
  const sampleLine = item.parallels[0]?.mediaLine.text
  const themes = item.parallels.map((p) => p.theme).slice(0, 3)

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex h-full flex-col rounded-2xl border border-parchment-dark bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold uppercase">
          {MEDIA_TYPE_LABELS[item.type]}
        </span>
        <span className="text-xs text-ink-muted">
          {item.parallels.length} parallel{item.parallels.length === 1 ? '' : 's'}
        </span>
      </div>

      <h3 className="font-display text-xl font-semibold text-navy group-hover:text-gold">
        {item.title}
      </h3>
      {item.creator && <p className="mt-0.5 text-xs text-ink-muted">{item.creator}</p>}

      <p className="mt-2 flex-1 text-sm leading-snug text-ink-muted">{item.summary}</p>

      {sampleLine && (
        <blockquote className="mt-3 line-clamp-2 border-l-2 border-gold/40 pl-3 text-sm italic text-navy/80">
          &ldquo;{sampleLine}&rdquo;
        </blockquote>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {themes.map((theme) => (
          <span
            key={theme}
            className="rounded-md bg-parchment px-2 py-0.5 text-xs text-ink-muted"
          >
            {theme}
          </span>
        ))}
      </div>

      <span className="mt-4 text-xs font-semibold tracking-wide text-gold uppercase group-hover:underline">
        View parallels →
      </span>
    </button>
  )
}
