import { useEffect, useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  isSearching: boolean
}

export function SearchBar({ value, onChange, onSearch, isSearching }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <form
      className="relative w-full max-w-2xl animate-fade-in-up"
      style={{ animationDelay: '80ms' }}
      onSubmit={(event) => {
        event.preventDefault()
        onSearch()
      }}
    >
      <label htmlFor="subject-search" className="sr-only">
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
          id="subject-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search a subject — love, peace, forgiveness…"
          className="w-full rounded-2xl border border-parchment-dark bg-white py-4 pr-32 pl-12 text-base text-ink shadow-sm outline-none transition-all duration-200 placeholder:text-ink-muted/50 focus:border-gold focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-gold)_15%,transparent)] sm:text-lg"
          autoComplete="off"
          enterKeyHint="search"
        />
        <button
          type="submit"
          disabled={isSearching || !value.trim()}
          className="absolute top-1/2 right-2 flex min-h-[44px] -translate-y-1/2 items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-navy-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
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
      <p className="mt-2 text-center text-xs text-ink-muted/70">
        Press Enter to search · Browse topics below
      </p>
    </form>
  )
}
