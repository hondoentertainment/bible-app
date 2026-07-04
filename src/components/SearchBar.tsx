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
      className="relative w-full max-w-2xl"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch()
      }}
    >
      <label htmlFor="subject-search" className="sr-only">
        Search by subject
      </label>
      <input
        ref={inputRef}
        id="subject-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search a subject — love, peace, forgiveness, anxiety..."
        className="w-full rounded-2xl border border-parchment-dark bg-white py-4 pr-32 pl-5 text-lg text-ink shadow-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isSearching || !value.trim()}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSearching ? 'Searching…' : 'Search'}
      </button>
    </form>
  )
}
