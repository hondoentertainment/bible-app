import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import {
  addRecentExternalMedia,
  getRecentExternalMedia,
  removeRecentExternalMedia,
} from '../hooks/useRecentExternalMedia'
import {
  compareBookToScripture,
  compareMovieToScripture,
  searchBooks,
  searchMovies,
} from '../services/externalMediaCompare'
import { searchCuratedComparisons } from '../data/media-comparisons'
import type { MediaComparison } from '../types/media'
import type {
  BookSearchResult,
  ExternalMediaComparisonResult,
  MovieSearchResult,
  RecentExternalMedia,
} from '../types/externalMedia'
import { DynamicMediaComparisonView } from './DynamicMediaComparisonView'
import { ApiStatusBanner } from './ApiStatusBanner'

const COMPARE_STAGES = {
  book: ['Fetching summary…', 'Analyzing themes…', 'Matching NIV passages…'],
  movie: ['Loading synopsis…', 'Analyzing themes…', 'Matching NIV passages…'],
} as const

const MIN_PARTIAL_CHARS = 2

interface ExternalMediaSearchProps {
  type: 'book' | 'movie'
  onExploreTheme?: (topicName: string) => void
  onSelectCurated?: (comparison: MediaComparison) => void
}

export function ExternalMediaSearch({ type, onExploreTheme, onSelectCurated }: ExternalMediaSearchProps) {
  const isBook = type === 'book'
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [books, setBooks] = useState<BookSearchResult[]>([])
  const [movies, setMovies] = useState<MovieSearchResult[]>([])
  const [moviesReady, setMoviesReady] = useState<boolean | null>(isBook ? null : null)
  const [comparing, setComparing] = useState(false)
  const [compareStage, setCompareStage] = useState(0)
  const [comparingTitle, setComparingTitle] = useState<string | null>(null)
  const [result, setResult] = useState<ExternalMediaComparisonResult | null>(null)
  const [recent, setRecent] = useState<RecentExternalMedia[]>(() =>
    getRecentExternalMedia().filter((r) => r.type === type),
  )
  const debouncedQuery = useDebouncedValue(query, 400)
  const curatedMatches = useMemo(
    () => searchCuratedComparisons(debouncedQuery, isBook ? 'book' : 'movie'),
    [debouncedQuery, isBook],
  )

  useEffect(() => {
    if (isBook) return
    fetch('/api/movies/status')
      .then((r) => r.json())
      .then((d: { configured: boolean }) => setMoviesReady(d.configured))
      .catch(() => setMoviesReady(false))
  }, [isBook])

  useEffect(() => {
    if (!comparing) {
      setCompareStage(0)
      return
    }
    setCompareStage(0)
    const t1 = window.setTimeout(() => setCompareStage(1), 900)
    const t2 = window.setTimeout(() => setCompareStage(2), 1800)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [comparing])

  const runSearch = useCallback(
    async (searchQuery: string) => {
      const q = searchQuery.trim()
      if (q.length < MIN_PARTIAL_CHARS) {
        setBooks([])
        setMovies([])
        setSearchError(null)
        return
      }

      setSearching(true)
      setSearchError(null)
      setBooks([])
      setMovies([])
      setResult(null)

      try {
        if (isBook) {
          const found = await searchBooks(q)
          setBooks(found)
          if (found.length === 0) setSearchError('No books found. Try a partial title or author name.')
        } else {
          if (moviesReady === false) {
            setSearchError('Movie search requires TMDB_API_KEY on the server. Contact the site admin.')
            return
          }
          const found = await searchMovies(q)
          setMovies(found)
          if (found.length === 0) setSearchError('No films found. Try a partial title.')
        }
      } catch (err) {
        if (!isBook && err instanceof Error && err.message === 'TMDB_NOT_CONFIGURED') {
          setMoviesReady(false)
          setSearchError('Movie search is not configured on the server.')
        } else {
          setSearchError(isBook ? 'Book search failed. Try again.' : 'Movie search failed. Try again.')
        }
      } finally {
        setSearching(false)
      }
    },
    [isBook, moviesReady],
  )

  useEffect(() => {
    if (debouncedQuery.trim().length >= MIN_PARTIAL_CHARS) {
      runSearch(debouncedQuery)
    } else {
      setBooks([])
      setMovies([])
      setSearchError(null)
    }
  }, [debouncedQuery, runSearch])

  async function runComparison(
    title: string,
    compareFn: () => Promise<ExternalMediaComparisonResult>,
    recentItem: RecentExternalMedia,
  ) {
    setComparing(true)
    setComparingTitle(title)
    setResult(null)
    setSearchError(null)

    try {
      const comparison = await compareFn()
      setResult(comparison)
      setRecent(addRecentExternalMedia(recentItem).filter((r) => r.type === type))
    } catch {
      setSearchError('Could not compare this title. Try again.')
    } finally {
      setComparing(false)
      setComparingTitle(null)
    }
  }

  function handleBookSelect(book: BookSearchResult) {
    runComparison(
      book.title,
      () => compareBookToScripture(book),
      { type: 'book', id: book.id, title: book.title, creator: book.authors[0] ?? '' },
    )
  }

  function handleMovieSelect(movie: MovieSearchResult) {
    runComparison(
      movie.title,
      () => compareMovieToScripture(movie),
      { type: 'movie', id: movie.id, title: movie.title, creator: movie.year ?? '' },
    )
  }

  if (result) {
    return (
      <DynamicMediaComparisonView
        result={result}
        onBack={() => setResult(null)}
        onExploreTheme={onExploreTheme}
      />
    )
  }

  const brand = isBook
    ? { name: 'Goodreads', color: '#553b08', placeholder: 'Partial title or author — e.g. Les Mis or Hugo' }
    : { name: 'Letterboxd', color: '#00c030', placeholder: 'Partial film title — e.g. Shawshank' }

  return (
    <div className="mb-8 rounded-2xl border border-parchment-dark bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: `${brand.color}18`, color: brand.color }}
          aria-hidden
        >
          {isBook ? '📚' : '🎬'}
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-navy">
            Search {isBook ? 'books' : 'films'} via {brand.name}
          </h3>
          <p className="text-xs text-ink-muted">
            {isBook
              ? 'Powered by Open Library · links to Goodreads'
              : 'Powered by TMDB · links to Letterboxd'}
          </p>
        </div>
      </div>

      {!isBook && moviesReady === false && (
        <ApiStatusBanner
          title="Movie search not configured"
          detail="Add TMDB_API_KEY to server environment variables to enable Letterboxd-style film search."
          stillWorks="Curated story comparisons below, book search via Goodreads/Open Library, and all Subjects/Lyrics modes."
        />
      )}

      <form
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault()
          runSearch(query)
        }}
      >
        <label htmlFor={`${type}-search`} className="sr-only">
          Search {isBook ? 'books' : 'films'}
        </label>
        <div className="flex gap-2">
          <input
            id={`${type}-search`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={brand.placeholder}
            disabled={!isBook && moviesReady === false}
            className="min-w-0 flex-1 rounded-xl border border-parchment-dark bg-white px-4 py-3 text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={searching || comparing || query.trim().length < MIN_PARTIAL_CHARS || (!isBook && moviesReady === false)}
            className="touch-manipulation min-h-[48px] shrink-0 rounded-xl px-5 text-sm font-semibold text-white transition hover:shadow-md disabled:opacity-50 active:scale-95"
            style={{ backgroundColor: brand.color }}
          >
            {searching ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {!searching && query.trim().length > 0 && query.trim().length < MIN_PARTIAL_CHARS && (
        <p className="mb-4 text-xs text-ink-muted">Type at least {MIN_PARTIAL_CHARS} characters to search.</p>
      )}

      {searchError && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
          {searchError}
        </p>
      )}

      {searching && (
        <ul className="flex flex-col gap-2" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl border border-parchment-dark p-3">
              <div className="skeleton h-14 w-10 shrink-0 rounded" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!searching && curatedMatches.length > 0 && debouncedQuery.trim().length >= MIN_PARTIAL_CHARS && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Curated matches — rich hand-picked parallels
          </p>
          <ul className="flex flex-col gap-2">
            {curatedMatches.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectCurated?.(item)}
                  className="touch-manipulation flex w-full items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/5 px-4 py-3 text-left transition hover:border-gold hover:shadow-sm active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy">{item.title}</p>
                    <p className="truncate text-sm text-ink-muted">
                      {item.creator ?? 'Curated'} · {item.parallels.length} parallels
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-white">
                    Curated
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!searching && books.length > 0 && (
        <ul className="flex flex-col gap-2">
          {books.map((book) => (
            <li key={book.id}>
              <BookResultRow book={book} onSelect={() => handleBookSelect(book)} disabled={comparing} />
            </li>
          ))}
        </ul>
      )}

      {!searching && movies.length > 0 && (
        <ul className="flex flex-col gap-2">
          {movies.map((movie) => (
            <li key={movie.id}>
              <MovieResultRow
                movie={movie}
                onSelect={() => handleMovieSelect(movie)}
                disabled={comparing}
                isComparing={comparingTitle === movie.title}
              />
            </li>
          ))}
        </ul>
      )}

      {recent.length > 0 && (
        <div className="mt-4 border-t border-parchment-dark pt-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Recent {isBook ? 'books' : 'films'} — tap to re-compare
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={comparing}
                  onClick={() => {
                    if (isBook) {
                      handleBookSelect({
                        id: item.id,
                        title: item.title,
                        authors: item.creator ? [item.creator] : [],
                        year: null,
                        coverUrl: null,
                        goodreadsUrl: `https://www.goodreads.com/search?q=${encodeURIComponent(item.title)}`,
                      })
                    } else {
                      handleMovieSelect({
                        id: item.id,
                        title: item.title,
                        year: item.creator || null,
                        overview: '',
                        posterUrl: null,
                        letterboxdUrl: `https://letterboxd.com/search/${encodeURIComponent(item.title)}/`,
                      })
                    }
                  }}
                  className="touch-manipulation rounded-l-full border border-r-0 border-parchment-dark bg-white px-3 py-1.5 text-sm text-navy transition hover:border-gold/50 active:scale-95 disabled:opacity-50"
                >
                  {item.title}
                </button>
                <button
                  type="button"
                  onClick={() => setRecent(removeRecentExternalMedia(item).filter((r) => r.type === type))}
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

      {comparing && comparingTitle && (
        <div className="mt-4 rounded-xl border border-parchment-dark bg-parchment/30 p-4" aria-busy="true">
          <p className="mb-3 font-semibold text-navy">{comparingTitle}</p>
          <div className="space-y-2">
            {COMPARE_STAGES[type].map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-2 text-sm ${
                  i <= compareStage ? 'text-navy' : 'text-ink-muted/50'
                }`}
              >
                {i < compareStage ? '✓' : i === compareStage ? <span className="spinner shrink-0 text-gold" style={{ width: '1rem', height: '1rem' }} /> : '○'}
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BookResultRow({
  book,
  onSelect,
  disabled,
}: {
  book: BookSearchResult
  onSelect: () => void
  disabled: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-parchment-dark bg-white p-2 transition hover:border-[#553b08]/30 hover:shadow-sm">
      {book.coverUrl ? (
        <img src={book.coverUrl} alt="" className="h-14 w-10 shrink-0 rounded object-cover" />
      ) : (
        <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded bg-parchment text-xs">📖</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-navy">{book.title}</p>
        <p className="truncate text-sm text-ink-muted">
          {book.authors.join(', ') || 'Unknown author'}
          {book.year && ` · ${book.year}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 pr-1">
        <a
          href={book.goodreadsUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-lg px-2 py-1.5 text-xs font-semibold text-[#553b08] hover:bg-[#553b08]/10 sm:inline"
        >
          Goodreads
        </a>
        <button
          type="button"
          onClick={onSelect}
          disabled={disabled}
          className="touch-manipulation min-h-[44px] rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-light disabled:opacity-50 active:scale-95 sm:text-sm"
        >
          Compare
        </button>
      </div>
    </div>
  )
}

function MovieResultRow({
  movie,
  onSelect,
  disabled,
  isComparing,
}: {
  movie: MovieSearchResult
  onSelect: () => void
  disabled: boolean
  isComparing?: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-parchment-dark bg-white p-2 transition hover:border-[#00c030]/30 hover:shadow-sm">
      {movie.posterUrl ? (
        <img src={movie.posterUrl} alt="" className="h-14 w-10 shrink-0 rounded object-cover" />
      ) : (
        <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded bg-parchment text-xs">🎬</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-navy">{movie.title}</p>
        <p className="line-clamp-2 text-sm text-ink-muted">
          {movie.year && `${movie.year} · `}
          {movie.overview.slice(0, 100)}
          {movie.overview.length > 100 ? '…' : ''}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 pr-1">
        <a
          href={movie.letterboxdUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-lg px-2 py-1.5 text-xs font-semibold text-[#00c030] hover:bg-[#00c030]/10 sm:inline"
        >
          Letterboxd
        </a>
        <button
          type="button"
          onClick={onSelect}
          disabled={disabled}
          className="touch-manipulation min-h-[44px] rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-light disabled:opacity-50 active:scale-95 sm:text-sm"
        >
          {isComparing ? <span className="spinner text-white" /> : 'Compare'}
        </button>
      </div>
    </div>
  )
}
