import { useEffect, useId, useRef, useState } from 'react'
import { getRecentSearches, removeRecentSearch } from '../hooks/useRecentSearches'

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
}: SearchBarProps) {
  const generatedId = useId()
  const inputId = inputIdProp ?? generatedId
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const [localRecent, setLocalRecent] = useState<string[]>([])

  useEffect(() => {
    if (autoFocus && !compact) {
      inputRef.current?.focus()
    }
  }, [autoFocus, compact])

  useEffect(() => {
    if (focused) setLocalRecent(recentSearches.length ? recentSearches : getRecentSearches())
  }, [focused, recentSearches])

  const showRecent = focused && !value.trim() && localRecent.length > 0 && onRecentSelect

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

      {showRecent && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 rounded-xl border border-parchment-dark bg-white p-3 shadow-lg">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">Recent searches</p>
          <ul className="flex flex-col gap-1">
            {localRecent.map((term) => (
              <li key={term} className="flex items-center gap-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onRecentSelect(term)}
                  className="touch-manipulation flex min-h-[44px] flex-1 items-center rounded-lg px-3 text-left text-sm text-navy transition hover:bg-parchment active:scale-[0.99]"
                >
                  {term}
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setLocalRecent(removeRecentSearch(term))}
                  className="touch-manipulation flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-parchment hover:text-navy"
                  aria-label={`Remove ${term} from recent searches`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-2 text-center text-xs text-ink-muted/70">
        Press <kbd className="rounded border border-parchment-dark bg-white px-1.5 py-0.5 font-sans text-[10px]">/</kbd> to focus · Try &ldquo;John 3:16&rdquo; or a subject
      </p>
    </div>
  )
}
