import { useMemo, useState } from 'react'
import {
  MEDIA_COMPARISONS,
  MEDIA_TYPE_LABELS,
  STORIES_COMPARE_STEPS,
  getComparisonsByType,
  getFeaturedStories,
  getMediaComparison,
} from '../data/media-comparisons'
import {
  addRecentStory,
  getRecentStories,
  removeRecentStory,
} from '../hooks/useRecentMedia'
import type { MediaComparison, MediaType } from '../types/media'
import { MediaComparisonView } from './MediaComparisonView'
import { ExternalMediaSearch } from './ExternalMediaSearch'

interface MediaShowcaseProps {
  onSelect?: (comparison: MediaComparison) => void
  onExploreTheme?: (topicName: string) => void
  initialStoryId?: string
  onStoryUrlChange?: (storyId: string | null) => void
  onOpenStory?: (storyId: string) => void
  onOpenSong?: (artist: string, track: string) => void
}

const TYPE_FILTERS: Array<{ id: MediaType | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'book', label: 'Books' },
  { id: 'song', label: 'Songs' },
  { id: 'movie', label: 'Movies' },
]

export function MediaShowcase({
  onSelect,
  onExploreTheme,
  initialStoryId,
  onStoryUrlChange,
  onOpenStory,
  onOpenSong,
}: MediaShowcaseProps) {
  const [filter, setFilter] = useState<MediaType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<MediaComparison | null>(() => {
    if (initialStoryId) return getMediaComparison(initialStoryId) ?? null
    return null
  })
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentStories())

  const items = useMemo(() => {
    const base = getComparisonsByType(filter)
    const q = search.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.creator?.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.parallels.some((p) => p.theme.toLowerCase().includes(q)),
    )
  }, [filter, search])

  const featuredStories = getFeaturedStories()
  const recentStories = recentIds
    .map((id) => getMediaComparison(id))
    .filter((item): item is MediaComparison => item !== undefined)

  function handleSelect(comparison: MediaComparison) {
    setSelected(comparison)
    setRecentIds(addRecentStory(comparison.id))
    onSelect?.(comparison)
    onStoryUrlChange?.(comparison.id)
  }

  function handleBack() {
    setSelected(null)
    onStoryUrlChange?.(null)
  }

  if (selected) {
    return (
      <MediaComparisonView
        comparison={selected}
        onBack={handleBack}
        onExploreTheme={onExploreTheme}
        onStoryUrlChange={onStoryUrlChange}
        onOpenStory={onOpenStory}
        onOpenSong={onOpenSong}
      />
    )
  }

  return (
    <section className="w-full animate-fade-in-up" aria-label="Stories and Scripture">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
          Stories &amp; Scripture
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-muted">
          Famous lines from books, songs, and films — or search Goodreads &amp; Letterboxd to compare any title with Scripture.
        </p>
      </div>

      <ol className="mx-auto mb-8 grid max-w-2xl gap-3 sm:grid-cols-3">
        {STORIES_COMPARE_STEPS.map(({ step, label, detail }) => (
          <li
            key={step}
            className="rounded-xl border border-parchment-dark bg-white/80 px-4 py-3 text-center sm:text-left"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
              {step}
            </span>
            <p className="mt-2 text-sm font-semibold text-navy">{label}</p>
            <p className="mt-0.5 text-xs leading-snug text-ink-muted">{detail}</p>
          </li>
        ))}
      </ol>

      {(filter === 'all' || filter === 'book') && (
        <ExternalMediaSearch type="book" onExploreTheme={onExploreTheme} onSelectCurated={handleSelect} />
      )}
      {(filter === 'all' || filter === 'movie') && (
        <ExternalMediaSearch type="movie" onExploreTheme={onExploreTheme} onSelectCurated={handleSelect} />
      )}

      <div className="mb-6">
        <p className="mb-2 text-center text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Curated stories — tap to open
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {featuredStories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="touch-manipulation rounded-full border border-parchment-dark bg-white px-3 py-2 text-sm transition hover:border-gold hover:shadow-sm active:scale-95"
            >
              <span className="font-medium text-navy">{item.title}</span>
              <span className="ml-1.5 text-xs text-ink-muted">
                · {MEDIA_TYPE_LABELS[item.type]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {recentStories.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-center text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Recently viewed
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {recentStories.map((item) => (
              <div key={item.id} className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="touch-manipulation rounded-l-full border border-r-0 border-parchment-dark bg-white px-3 py-1.5 text-sm text-navy transition hover:border-gold/50 active:scale-95"
                >
                  {item.title}
                </button>
                <button
                  type="button"
                  onClick={() => setRecentIds(removeRecentStory(item.id))}
                  className="touch-manipulation rounded-r-full border border-parchment-dark bg-white px-2 py-1.5 text-ink-muted transition hover:text-navy active:scale-95"
                  aria-label={`Remove ${item.title} from recent`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap justify-center gap-2 sm:justify-start"
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
              className={`touch-manipulation rounded-full border px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
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

        <label className="relative w-full sm:w-56">
          <span className="sr-only">Filter stories</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter stories…"
            className="w-full rounded-lg border border-parchment-dark bg-white py-2.5 pr-3 pl-9 text-base text-ink placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
          />
          <svg
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </label>
      </div>

      {items.length > 0 ? (
        <ul className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <MediaCard item={item} onSelect={() => handleSelect(item)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-parchment-dark bg-white/50 py-16 text-center text-ink-muted">
          No stories match &ldquo;{search}&rdquo;. Try a different word or category.
        </p>
      )}
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
      className="group flex h-full w-full flex-col rounded-2xl border border-parchment-dark bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg active:scale-[0.99]"
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
