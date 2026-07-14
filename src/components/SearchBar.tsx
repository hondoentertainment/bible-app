import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from '../hooks/useRecentSearches'
import { FEATURED_TOPICS, searchTopics } from '../data/topics'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  isSearching: boolean
  compact?: boolean
  autoFocus?: boolean
  inputId?: string
  recentSearches?: string[]
  onRecentSelect?: (query: string) => void
  /** Called whenever recent searches change (remove / clear) so parent state stays in sync. */
  onRecentChange?: (searches: string[]) => void
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  isSearching,
  compact = false,
  autoFocus = true,
  inputId: inputIdProp,
  recentSearches = [],
  onRecentSelect,
  onRecentChange,
}: SearchBarProps) {
  const generatedId = useId()
  const inputId = inputIdProp ?? generatedId
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const [localRecent, setLocalRecent] = useState<string[]>(() =>
    recentSearches.length ? recentSearches : getRecentSearches(),
  )

  useEffect(() => {
    if (autoFocus && !compact) {
      inputRef.current?.focus()
    }
  }, [autoFocus, compact])

  // Keep in sync with parent + storage (always prefer the freshest storage read).
  useEffect(() => {
    setLocalRecent(recentSearches.length ? recentSearches : getRecentSearches())
  }, [recentSearches])

  function syncRecent(next: string[]) {
    setLocalRecent(next)
    onRecentChange?.(next)
  }

  function handleRemove(term: string) {
    syncRecent(removeRecentSearch(term))
  }

  function handleClear() {
    clearRecentSearches()
    syncRecent([])
  }

  const trimmed = value.trim()
  const suggestions = useMemo(
    () => (trimmed.length >= 2 ? searchTopics(trimmed).slice(0, 6) : []),
    [trimmed],
  )
  const showSuggestions = focused && trimmed.length >= 2 && suggestions.length > 0 && !!onRecentSelect
  const showPopular =
    focused && !trimmed && localRecent.length === 0 && !!onRecentSelect
  // Recent chips sit below the bar (always visible) — same pattern as Stories/Lyrics.
  const showRecentChips = !compact && !trimmed && localRecent.length > 0 && !!onRecentSelect

  if (compact) {
    return (
      <form
        className="relative w-full"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Search by subject
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search subjects…"
          className="w-full rounded-xl border border-parchment-dark bg-white py-2 pr-20 pl-9 text-base text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          autoComplete="off"
          enterKeyHint="search"
        />
        <svg
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
        <button
          type="submit"
          disabled={isSearching || !value.trim()}
          className="touch-manipulation absolute top-1/2 right-1.5 flex h-8 min-w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-navy px-2.5 text-xs font-semibold text-white transition hover:bg-navy-light disabled:opacity-50 active:scale-95"
          aria-label="Search"
        >
          {isSearching ? <span className="spinner text-white" aria-hidden /> : 'Go'}
        </button>
      </form>
    )
  }

  return (
    <div className="relative w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '80ms' }}>
      <form
        className="relative w-full"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Search by subject
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-muted/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 150)}
            placeholder="Search a subject or reference — love, John 3:16…"
            className="w-full rounded-2xl border border-parchment-dark bg-white py-4 pr-32 pl-12 text-base text-ink shadow-sm outline-none transition-all duration-200 placeholder:text-ink-muted/50 focus:border-gold focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-gold)_15%,transparent)] sm:text-lg"
            autoComplete="off"
            enterKeyHint="search"
          />
          <button
            type="submit"
            disabled={isSearching || !value.trim()}
            className="touch-manipulation absolute top-1/2 right-2 flex min-h-[44px] -translate-y-1/2 items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-navy-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
          >
            {isSearching ? (
              <>
                <span className="spinner text-white" aria-hidden />
                <span className="sr-only">Searching</span>
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 rounded-xl border border-parchment-dark bg-white p-2 shadow-lg">
          <p className="px-2 py-1 text-xs font-semibold tracking-wide text-ink-muted uppercase">Subjects</p>
          <ul className="flex flex-col gap-0.5" role="listbox" aria-label="Subject suggestions">
            {suggestions.map((topic) => (
              <li key={topic.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onRecentSelect!(topic.name)}
                  className="touch-manipulation flex min-h-[44px] w-full min-w-0 items-center gap-2 rounded-lg px-3 text-left text-sm text-navy transition hover:bg-parchment active:scale-[0.99]"
                >
                  <svg className="h-4 w-4 shrink-0 text-gold/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                  </svg>
                  <span className="shrink-0 font-medium">{topic.name}</span>
                  <span className="min-w-0 truncate text-xs text-ink-muted">{topic.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showPopular && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 rounded-xl border border-parchment-dark bg-white p-3 shadow-lg">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">Popular subjects</p>
          <div className="flex flex-wrap gap-2">
            {FEATURED_TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onRecentSelect!(topic.name)}
                className="touch-manipulation rounded-full border border-parchment-dark bg-parchment/40 px-3.5 py-1.5 text-sm text-navy transition hover:border-gold hover:text-gold active:scale-95"
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {showRecentChips && (
        <div className="mt-3" aria-label="Recent searches">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
              Recent searches
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="touch-manipulation rounded-lg px-2 py-0.5 text-xs font-medium text-ink-muted transition hover:text-navy"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {localRecent.map((term) => (
              <div key={term} className="flex max-w-full items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onRecentSelect!(term)}
                  className="touch-manipulation max-w-[14rem] truncate rounded-l-full border border-r-0 border-parchment-dark bg-white px-3.5 py-1.5 text-sm text-navy transition hover:border-gold/50 hover:text-gold active:scale-95"
                  title={term}
                >
                  {term}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(term)}
                  className="touch-manipulation rounded-r-full border border-parchment-dark bg-white px-2.5 py-1.5 text-ink-muted transition hover:text-navy active:scale-95"
                  aria-label={`Remove ${term} from recent searches`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showRecentChips && (
        <p className="mt-2 text-center text-xs text-ink-muted/70">
          Press <kbd className="rounded border border-parchment-dark bg-white px-1.5 py-0.5 font-sans text-[10px]">/</kbd> to focus · Try &ldquo;John 3:16&rdquo; or a subject
        </p>
      )}
    </div>
  )
}
