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
  compareTvToScripture,
  searchBooks,
  searchMovies,
  searchTv,
} from '../services/externalMediaCompare'
import { searchCuratedComparisons } from '../data/media-comparisons'
import type { MediaComparison } from '../types/media'
import type {
  BookSearchResult,
  ExternalMediaComparisonResult,
  ExternalMediaType,
  MovieSearchResult,
  RecentExternalMedia,
  TvSearchResult,
} from '../types/externalMedia'
import { DynamicMediaComparisonView } from './DynamicMediaComparisonView'
import { ApiStatusBanner } from './ApiStatusBanner'
import { CompareStageIcon } from './CompareStageIcon'
import { ScripturePlaceholder } from './ScripturePlaceholder'

const COMPARE_STAGES = {
  book: ['Fetching summary…', 'Analyzing themes…', 'Matching NIV passages…'],
  movie: ['Loading synopsis…', 'Analyzing themes…', 'Matching NIV passages…'],
  tv: ['Loading synopsis…', 'Analyzing themes…', 'Matching NIV passages…'],
} as const

const BRAND = {
  book: {
    name: 'Goodreads',
    color: '#553b08',
    placeholder: 'Partial title or author — e.g. Les Mis or Hugo',
    noun: 'books',
    poweredBy: 'Powered by Open Library · links to Goodreads',
  },
  movie: {
    name: 'Letterboxd',
    color: '#00c030',
    placeholder: 'Partial film title — e.g. Shawshank',
    noun: 'films',
    poweredBy: 'Powered by TMDB · links to Letterboxd',
  },
  tv: {
    name: 'TMDB',
    color: '#01b4e4',
    placeholder: 'Partial show title — e.g. The Chosen',
    noun: 'TV shows',
    poweredBy: 'Powered by TMDB',
  },
} as const

const MIN_PARTIAL_CHARS = 2

interface ExternalMediaSearchProps {
  type: ExternalMediaType
  onExploreTheme?: (topicName: string) => void
  onSelectCurated?: (comparison: MediaComparison) => void
}

export function ExternalMediaSearch({ type, onExploreTheme, onSelectCurated }: ExternalMediaSearchProps) {
  const brand = BRAND[type]
  const needsTmdb = type === 'movie' || type === 'tv'
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [books, setBooks] = useState<BookSearchResult[]>([])
  const [movies, setMovies] = useState<MovieSearchResult[]>([])
  const [shows, setShows] = useState<TvSearchResult[]>([])
  const [tmdbReady, setTmdbReady] = useState<boolean | null>(needsTmdb ? null : null)
  const [comparing, setComparing] = useState(false)
  const [compareStage, setCompareStage] = useState(0)
  const [comparingTitle, setComparingTitle] = useState<string | null>(null)
  const [result, setResult] = useState<ExternalMediaComparisonResult | null>(null)
  const [recent, setRecent] = useState<RecentExternalMedia[]>(() =>
    getRecentExternalMedia().filter((r) => r.type === type),
  )
  const debouncedQuery = useDebouncedValue(query, 400)
  const curatedMatches = useMemo(
    () => searchCuratedComparisons(debouncedQuery, type),
    [debouncedQuery, type],
  )

  useEffect(() => {
    if (!needsTmdb) return
    const statusPath = type === 'tv' ? '/api/tv/status' : '/api/movies/status'
    fetch(statusPath)
      .then((r) => r.json())
      .then((d: { configured: boolean }) => setTmdbReady(d.configured))
      .catch(() => setTmdbReady(false))
  }, [needsTmdb, type])

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

  const clearResults = () => {
    setBooks([])
    setMovies([])
    setShows([])
  }

  const runSearch = useCallback(
    async (searchQuery: string) => {
      const q = searchQuery.trim()
      if (q.length < MIN_PARTIAL_CHARS) {
        clearResults()
        setSearchError(null)
        return
      }

      setSearching(true)
      setSearchError(null)
      clearResults()
      setResult(null)

      try {
        if (type === 'book') {
          const found = await searchBooks(q)
          setBooks(found)
          if (found.length === 0) setSearchError('No books found. Try a partial title or author name.')
        } else if (type === 'movie') {
          if (tmdbReady === false) {
            setSearchError('Movie search requires TMDB_API_KEY on the server. Contact the site admin.')
            return
          }
          const found = await searchMovies(q)
          setMovies(found)
          if (found.length === 0) setSearchError('No films found. Try a partial title.')
        } else {
          if (tmdbReady === false) {
            setSearchError('TV search requires TMDB_API_KEY on the server. Contact the site admin.')
            return
          }
          const found = await searchTv(q)
          setShows(found)
          if (found.length === 0) setSearchError('No TV shows found. Try a partial title.')
        }
      } catch (err) {
        if (needsTmdb && err instanceof Error && err.message === 'TMDB_NOT_CONFIGURED') {
          setTmdbReady(false)
          setSearchError(`${type === 'tv' ? 'TV' : 'Movie'} search is not configured on the server.`)
        } else {
          const failLabel = type === 'book' ? 'Book' : type === 'movie' ? 'Movie' : 'TV'
          setSearchError(`${failLabel} search failed. Try again.`)
        }
      } finally {
        setSearching(false)
      }
    },
    [type, tmdbReady, needsTmdb],
  )

  useEffect(() => {
    if (debouncedQuery.trim().length >= MIN_PARTIAL_CHARS) {
      runSearch(debouncedQuery)
    } else {
      clearResults()
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

  function handleTvSelect(show: TvSearchResult) {
    runComparison(
      show.title,
      () => compareTvToScripture(show),
      { type: 'tv', id: show.id, title: show.title, creator: show.year ?? '' },
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

  const tmdbBlocked = needsTmdb && tmdbReady === false

  return (
    <div className="mb-8 rounded-2xl border border-parchment-dark bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: `${brand.color}18`, color: brand.color }}
        >
          <ScripturePlaceholder kind={type} size="xs" />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-navy">
            Search {brand.noun} via {brand.name}
          </h3>
          <p className="text-xs text-ink-muted">{brand.poweredBy}</p>
        </div>
      </div>

      {tmdbBlocked && (
        <ApiStatusBanner
          title={`${type === 'tv' ? 'TV' : 'Movie'} search not configured`}
          detail="Add TMDB_API_KEY to server environment variables to enable this search."
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
          Search {brand.noun}
        </label>
        <div className="flex gap-2">
          <input
            id={`${type}-search`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={brand.placeholder}
            disabled={tmdbBlocked}
            className="min-w-0 flex-1 rounded-xl border border-parchment-dark bg-white px-4 py-3 text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={searching || comparing || query.trim().length < MIN_PARTIAL_CHARS || tmdbBlocked}
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
              <PosterResultRow
                title={movie.title}
                year={movie.year}
                overview={movie.overview}
                posterUrl={movie.posterUrl}
                externalUrl={movie.letterboxdUrl}
                externalLabel="Letterboxd"
                externalColor="#00c030"
                placeholderKind="movie"
                onSelect={() => handleMovieSelect(movie)}
                disabled={comparing}
                isComparing={comparingTitle === movie.title}
              />
            </li>
          ))}
        </ul>
      )}

      {!searching && shows.length > 0 && (
        <ul className="flex flex-col gap-2">
          {shows.map((show) => (
            <li key={show.id}>
              <PosterResultRow
                title={show.title}
                year={show.year}
                overview={show.overview}
                posterUrl={show.posterUrl}
                externalUrl={show.tmdbUrl}
                externalLabel="TMDB"
                externalColor="#01b4e4"
                placeholderKind="tv"
                onSelect={() => handleTvSelect(show)}
                disabled={comparing}
                isComparing={comparingTitle === show.title}
              />
            </li>
          ))}
        </ul>
      )}

      {recent.length > 0 && (
        <div className="mt-4 border-t border-parchment-dark pt-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Recent {brand.noun} — tap to re-compare
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={comparing}
                  onClick={() => {
                    if (type === 'book') {
                      handleBookSelect({
                        id: item.id,
                        title: item.title,
                        authors: item.creator ? [item.creator] : [],
                        year: null,
                        coverUrl: null,
                        goodreadsUrl: `https://www.goodreads.com/search?q=${encodeURIComponent(item.title)}`,
                      })
                    } else if (type === 'movie') {
                      handleMovieSelect({
                        id: item.id,
                        title: item.title,
                        year: item.creator || null,
                        overview: '',
                        posterUrl: null,
                        letterboxdUrl: `https://letterboxd.com/search/${encodeURIComponent(item.title)}/`,
                      })
                    } else {
                      handleTvSelect({
                        id: item.id,
                        title: item.title,
                        year: item.creator || null,
                        overview: '',
                        posterUrl: null,
                        tmdbUrl: `https://www.themoviedb.org/tv/${item.id}`,
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
                <CompareStageIcon
                  status={i < compareStage ? 'done' : i === compareStage ? 'active' : 'pending'}
                />
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
        <ScripturePlaceholder kind="book" size="sm" className="h-14 w-10" />
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

function PosterResultRow({
  title,
  year,
  overview,
  posterUrl,
  externalUrl,
  externalLabel,
  externalColor,
  placeholderKind,
  onSelect,
  disabled,
  isComparing,
}: {
  title: string
  year: string | null
  overview: string
  posterUrl: string | null
  externalUrl: string
  externalLabel: string
  externalColor: string
  placeholderKind: 'movie' | 'tv'
  onSelect: () => void
  disabled: boolean
  isComparing?: boolean
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-parchment-dark bg-white p-2 transition hover:shadow-sm"
      style={{ ['--ext-hover' as string]: `${externalColor}30` }}
    >
      {posterUrl ? (
        <img src={posterUrl} alt="" className="h-14 w-10 shrink-0 rounded object-cover" />
      ) : (
        <ScripturePlaceholder kind={placeholderKind} size="sm" className="h-14 w-10" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-navy">{title}</p>
        <p className="line-clamp-2 text-sm text-ink-muted">
          {year && `${year} · `}
          {overview.slice(0, 100)}
          {overview.length > 100 ? '…' : ''}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 pr-1">
        <a
          href={externalUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-lg px-2 py-1.5 text-xs font-semibold hover:opacity-80 sm:inline"
          style={{ color: externalColor }}
        >
          {externalLabel}
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
