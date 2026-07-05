import { useCallback, useEffect, useRef, useState } from 'react'
import { AppNav } from './components/AppNav'
import { MediaShowcase } from './components/MediaShowcase'
import { ScrollToTop } from './components/ScrollToTop'
import { SearchBar } from './components/SearchBar'
import { SkipLink } from './components/SkipLink'
import { SpotifyLyricsCompare } from './components/SpotifyLyricsCompare'
import { SubjectGrid } from './components/SubjectGrid'
import { VerseResults } from './components/VerseResults'
import { addRecentSearch, getRecentSearches } from './hooks/useRecentSearches'
import { searchBySubject } from './services/bibleApi'
import { readAppUrlState, writeAppUrlState } from './utils/urlState'
import type { SearchResult } from './types'
import type { AppMode } from './types/media'

const emptyResult: SearchResult = {
  verses: [],
  matchedTopics: [],
  query: '',
  source: 'topics',
}

const SCROLL_THRESHOLD = 80
const FAB_THRESHOLD = 400
const MAIN_SEARCH_ID = 'subject-search'

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export default function App() {
  const initialUrlRef = useRef(readAppUrlState())
  const initialSubjectsQuery =
    initialUrlRef.current.mode === 'subjects' ? initialUrlRef.current.q : ''

  const [mode, setMode] = useState<AppMode>(initialUrlRef.current.mode)
  const [query, setQuery] = useState(initialSubjectsQuery)
  const [activeQuery, setActiveQuery] = useState(initialSubjectsQuery)
  const [result, setResult] = useState<SearchResult>(emptyResult)
  const [isSearching, setIsSearching] = useState(Boolean(initialSubjectsQuery))
  const [error, setError] = useState<string | null>(null)
  const [headerCompact, setHeaderCompact] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches())
  const mainRef = useRef<HTMLElement>(null)
  const didInitUrlSearch = useRef(false)
  const headerCompactRef = useRef(false)
  const showFabRef = useRef(false)

  const runSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      setActiveQuery('')
      setResult(emptyResult)
      setError(null)
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
    setIsSearching(true)
    setActiveQuery(trimmed)
    setError(null)
    setMobileSearchOpen(false)

    try {
      const searchResult = await searchBySubject(trimmed)
      setResult(searchResult)
      setRecentSearches(addRecentSearch(trimmed))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed'
      setError(message)
      setResult(emptyResult)
    } finally {
      setIsSearching(false)
    }
  }, [])

  function handleModeChange(next: AppMode) {
    setMode(next)
    setQuery('')
    setActiveQuery('')
    setResult(emptyResult)
    setError(null)
    setMobileSearchOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function exploreSubject(topicName: string) {
    handleModeChange('subjects')
    setQuery(topicName)
    runSearch(topicName)
  }

  const handleClearSearch = useCallback(() => {
    setQuery('')
    setActiveQuery('')
    setResult(emptyResult)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const focusSearch = useCallback(() => {
    const el = document.getElementById(MAIN_SEARCH_ID)
    if (el) {
      el.focus()
      scrollToTop()
    } else if (headerCompactRef.current && mode === 'subjects') {
      setMobileSearchOpen(true)
      scrollToTop()
    }
  }, [mode, scrollToTop])

  useEffect(() => {
    const { q, mode: urlMode } = initialUrlRef.current
    if (!didInitUrlSearch.current && q && urlMode === 'subjects') {
      didInitUrlSearch.current = true
      runSearch(q)
    }
  }, [runSearch])

  useEffect(() => {
    writeAppUrlState(mode, mode === 'subjects' && activeQuery ? activeQuery : undefined)
  }, [mode, activeQuery])

  useEffect(() => {
    if (!headerCompact) setMobileSearchOpen(false)
  }, [headerCompact])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const nextCompact = y > SCROLL_THRESHOLD
      const nextFab = y > FAB_THRESHOLD

      if (nextCompact !== headerCompactRef.current) {
        headerCompactRef.current = nextCompact
        setHeaderCompact(nextCompact)
      }
      if (nextFab !== showFabRef.current) {
        showFabRef.current = nextFab
        setShowFab(nextFab)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && mode === 'subjects' && !isEditableTarget(e.target)) {
        e.preventDefault()
        focusSearch()
      }
      if (e.key === 'Escape' && activeQuery && !isEditableTarget(e.target)) {
        handleClearSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mode, activeQuery, focusSearch, handleClearSearch])

  const isSubjects = mode === 'subjects'
  const isStories = mode === 'stories'

  const pageTitle = isSubjects
    ? 'NIV Subject Search'
    : isStories
      ? 'Stories & Scripture'
      : 'Spotify Lyrics & Scripture'

  const pageDescription = isSubjects
    ? 'Find Bible verses by the subjects that matter to you — love, hope, forgiveness, and more.'
    : isStories
      ? 'Discover curated stories or search Goodreads & Letterboxd to compare any book or film with Scripture.'
      : 'Search any song on Spotify and compare its lyrics to NIV verses on matching themes.'

  const compactTitle = isSubjects ? 'Subjects' : isStories ? 'Stories' : 'Lyrics'

  const searchBarProps = {
    value: query,
    onChange: setQuery,
    onSearch: () => runSearch(query),
    isSearching,
    recentSearches,
    onRecentSelect: (term: string) => {
      setQuery(term)
      runSearch(term)
    },
  }

  return (
    <div className="app-shell relative min-h-screen">
      <SkipLink />

      <div className="site-header__hero safe-top">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-8 text-center sm:gap-6 sm:px-6 sm:py-10">
          <div className="animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
              <BookIcon className="h-5 w-5 text-gold" />
            </div>
            <p className="section-eyebrow">Holy Scripture</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              {pageTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {pageDescription}
            </p>
          </div>

          <AppNav mode={mode} onModeChange={handleModeChange} />

          {isSubjects && <SearchBar {...searchBarProps} inputId={MAIN_SEARCH_ID} />}
        </div>
      </div>

      <header
        className={`site-header--fixed safe-top ${headerCompact ? 'is-visible' : 'is-hidden'}`}
        aria-hidden={!headerCompact}
        inert={!headerCompact}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 sm:gap-4 sm:px-6">
          <button
            type="button"
            onClick={scrollToTop}
            className="touch-manipulation flex shrink-0 items-center gap-2 rounded-lg px-1 py-1 text-navy transition hover:text-gold active:scale-95"
            aria-label="Scroll to top"
            tabIndex={headerCompact ? 0 : -1}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
              <BookIcon className="h-4 w-4 text-gold" />
            </span>
            <span className="hidden font-display text-sm font-semibold sm:inline">{compactTitle}</span>
          </button>

          <div className="min-w-0 flex flex-1 justify-center">
            <AppNav mode={mode} onModeChange={handleModeChange} compact />
          </div>

          {isSubjects && (
            <>
              <button
                type="button"
                onClick={() => setMobileSearchOpen((open) => !open)}
                className="touch-manipulation flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-parchment-dark bg-white text-navy transition hover:border-gold hover:text-gold md:hidden active:scale-95"
                aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
                aria-expanded={mobileSearchOpen}
                tabIndex={headerCompact ? 0 : -1}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
              </button>
              <div className="hidden w-full max-w-[220px] md:block lg:max-w-xs">
                <SearchBar {...searchBarProps} compact autoFocus={false} inputId="subject-search-compact" />
              </div>
            </>
          )}
        </div>

        {headerCompact && isSubjects && mobileSearchOpen && (
          <div className="border-t border-parchment-dark/50 px-4 py-3 md:hidden">
            <SearchBar
              key="mobile-search"
              {...searchBarProps}
              compact
              autoFocus
              inputId="subject-search-mobile"
            />
          </div>
        )}
      </header>

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        key={mode}
        className="relative z-10 mx-auto max-w-6xl px-4 py-10 outline-none sm:px-6"
      >
        {isSubjects ? (
          activeQuery ? (
            <div>
              <button type="button" onClick={handleClearSearch} className="back-link mb-6">
                <span aria-hidden>←</span> Browse all subjects
              </button>
              <VerseResults
                verses={result.verses}
                matchedTopics={result.matchedTopics}
                query={activeQuery}
                apiUnavailable={result.apiUnavailable ?? false}
                error={error}
                isSearching={isSearching}
              />
            </div>
          ) : (
            <SubjectGrid
              activeQuery={activeQuery}
              onSelect={(topicName) => {
                setQuery(topicName)
                runSearch(topicName)
              }}
            />
          )
        ) : isStories ? (
          <MediaShowcase onExploreTheme={exploreSubject} />
        ) : (
          <SpotifyLyricsCompare onExploreTheme={exploreSubject} />
        )}
      </main>

      <footer className="relative z-10 border-t border-parchment-dark/70 py-8 text-center safe-bottom">
        <p className="mx-auto max-w-lg px-4 text-xs leading-relaxed text-ink-muted">
          Scripture quotations from the Holy Bible, New International Version&reg;. Copyright &copy; Biblica, Inc.
          Used by permission via API.Bible.
        </p>
      </footer>

      <ScrollToTop visible={showFab} onClick={scrollToTop} />
    </div>
  )
}
