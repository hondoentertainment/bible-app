import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AppNav } from './components/AppNav'
import { BottomNav } from './components/BottomNav'
import { OfflineBanner } from './components/OfflineBanner'
import { ScrollToTop } from './components/ScrollToTop'
import { SearchBar } from './components/SearchBar'
import { SkipLink } from './components/SkipLink'
import { SubjectGrid } from './components/SubjectGrid'
import { ThemeToggle } from './components/ThemeToggle'
import { ViewFallback } from './components/ViewFallback'

const MediaShowcase = lazy(() =>
  import('./components/MediaShowcase').then((m) => ({ default: m.MediaShowcase })),
)
const QuoteCompareView = lazy(() =>
  import('./components/QuoteCompareView').then((m) => ({ default: m.QuoteCompareView })),
)
const SpotifyLyricsCompare = lazy(() =>
  import('./components/SpotifyLyricsCompare').then((m) => ({ default: m.SpotifyLyricsCompare })),
)
import { VerseResults } from './components/VerseResults'
import { ReadingSettingsPanel } from './components/ReadingSettingsPanel'
import { initReadingSettings } from './hooks/useReadingSettings'
import { maybeShowDailyNotification } from './hooks/useDailyNotification'
import { addRecentSearch, getRecentSearches } from './hooks/useRecentSearches'
import type { SavedComparison } from './hooks/useFavorites'
import { searchBySubject } from './services/bibleApi'
import { trackEvent } from './utils/analytics'
import { scrollToTop } from './utils/scroll'
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
  const initial = initialUrlRef.current

  const [mode, setMode] = useState<AppMode>(initial.mode)
  const [query, setQuery] = useState(initial.mode === 'subjects' ? initial.q : '')
  const [activeQuery, setActiveQuery] = useState(initial.mode === 'subjects' ? initial.q : '')
  const [result, setResult] = useState<SearchResult>(emptyResult)
  const [isSearching, setIsSearching] = useState(Boolean(initial.mode === 'subjects' && initial.q))
  const [error, setError] = useState<string | null>(null)
  const [headerCompact, setHeaderCompact] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches())
  const [favoritesVersion, setFavoritesVersion] = useState(0)
  const [storyId, setStoryId] = useState(initial.storyId)
  const [lyricsArtist, setLyricsArtist] = useState(initial.artist)
  const [lyricsTrack, setLyricsTrack] = useState(initial.track)
  const [quoteText, setQuoteText] = useState(initial.quoteText)
  const [quoteTitle, setQuoteTitle] = useState(initial.quoteTitle)

  const mainRef = useRef<HTMLElement>(null)
  const didInitUrlSearch = useRef(false)
  const headerCompactRef = useRef(false)
  const showFabRef = useRef(false)

  const syncUrl = useCallback(
    (overrides: Partial<{
      mode: AppMode
      q: string
      storyId: string
      artist: string
      track: string
      quoteTitle: string
      quoteText: string
    }> = {}) => {
      writeAppUrlState({
        mode: overrides.mode ?? mode,
        q: overrides.q ?? (mode === 'subjects' ? activeQuery : ''),
        storyId: overrides.storyId ?? storyId,
        artist: overrides.artist ?? lyricsArtist,
        track: overrides.track ?? lyricsTrack,
        quoteTitle: overrides.quoteTitle ?? quoteTitle,
        quoteText: overrides.quoteText ?? quoteText,
      })
    },
    [mode, activeQuery, storyId, lyricsArtist, lyricsTrack, quoteTitle, quoteText],
  )

  const runSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      setActiveQuery('')
      setResult(emptyResult)
      setError(null)
      return
    }

    scrollToTop()
    setIsSearching(true)
    setActiveQuery(trimmed)
    setError(null)
    setMobileSearchOpen(false)

    try {
      const searchResult = await searchBySubject(trimmed)
      setResult(searchResult)
      setRecentSearches(addRecentSearch(trimmed))
      trackEvent('search', {
        query: trimmed.slice(0, 60),
        results: searchResult.verses.length,
        source: searchResult.source,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed'
      setError(message)
      setResult(emptyResult)
    } finally {
      setIsSearching(false)
    }
  }, [])

  function handleModeChange(next: AppMode) {
    trackEvent('mode_change', { mode: next })
    setMode(next)
    setQuery('')
    setActiveQuery('')
    setResult(emptyResult)
    setError(null)
    setMobileSearchOpen(false)
    setStoryId('')
    setLyricsArtist('')
    setLyricsTrack('')
    setQuoteText('')
    setQuoteTitle('')
    scrollToTop()
    writeAppUrlState({ mode: next, q: '', storyId: '', artist: '', track: '', quoteTitle: '', quoteText: '' })
  }

  function exploreSubject(topicName: string) {
    handleModeChange('subjects')
    setQuery(topicName)
    runSearch(topicName)
  }

  function openStory(id: string) {
    setMode('stories')
    setStoryId(id)
    writeAppUrlState({ mode: 'stories', q: '', storyId: id, artist: '', track: '', quoteTitle: '', quoteText: '' })
    scrollToTop()
  }

  function openSong(artist: string, track: string) {
    setMode('lyrics')
    setLyricsArtist(artist)
    setLyricsTrack(track)
    writeAppUrlState({ mode: 'lyrics', q: '', storyId: '', artist, track, quoteTitle: '', quoteText: '' })
    scrollToTop()
  }

  function handleOpenComparison(comparison: SavedComparison) {
    if (comparison.kind === 'story' && comparison.storyId) {
      setMode('stories')
      setStoryId(comparison.storyId)
      writeAppUrlState({
        mode: 'stories',
        q: '',
        storyId: comparison.storyId,
        artist: '',
        track: '',
        quoteTitle: '',
        quoteText: '',
      })
      scrollToTop()
      return
    }

    if (comparison.kind === 'lyrics' && comparison.artist && comparison.track) {
      setMode('lyrics')
      setLyricsArtist(comparison.artist)
      setLyricsTrack(comparison.track)
      writeAppUrlState({
        mode: 'lyrics',
        q: '',
        storyId: '',
        artist: comparison.artist,
        track: comparison.track,
        quoteTitle: '',
        quoteText: '',
      })
      scrollToTop()
      return
    }

    if (comparison.kind === 'quote' && comparison.quoteText) {
      setMode('quote')
      setQuoteText(comparison.quoteText)
      setQuoteTitle(comparison.title)
      writeAppUrlState({
        mode: 'quote',
        q: '',
        storyId: '',
        artist: '',
        track: '',
        quoteTitle: comparison.title,
        quoteText: comparison.quoteText,
      })
      scrollToTop()
    }
  }

  const handleClearSearch = useCallback(() => {
    setQuery('')
    setActiveQuery('')
    setResult(emptyResult)
    setError(null)
    scrollToTop()
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
  }, [mode])

  const bumpFavorites = useCallback(() => {
    setFavoritesVersion((v) => v + 1)
  }, [])

  useEffect(() => {
    initReadingSettings()
    maybeShowDailyNotification()
  }, [])

  useEffect(() => {
    if (!didInitUrlSearch.current && initial.q && initial.mode === 'subjects') {
      didInitUrlSearch.current = true
      runSearch(initial.q)
    }
  }, [runSearch, initial.q, initial.mode])

  useEffect(() => {
    syncUrl()
  }, [syncUrl])

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
  const isQuote = mode === 'quote'

  const pageTitle = isSubjects
    ? 'NIV Subject Search'
    : isStories
      ? 'Stories & Scripture'
      : isQuote
        ? 'Quote & Scripture'
        : 'Spotify Lyrics & Scripture'

  const pageDescription = isSubjects
    ? 'Find Bible verses by the subjects that matter to you — love, hope, forgiveness, and more.'
    : isStories
      ? 'Discover curated stories or search Goodreads & Letterboxd to compare any book or film with Scripture.'
      : isQuote
        ? 'Paste any quote, poem, or speech and discover matching NIV passages.'
        : 'Search any song on Spotify and compare its lyrics to NIV verses on matching themes.'

  const compactTitle = isSubjects ? 'Subjects' : isStories ? 'Stories' : isQuote ? 'Quote' : 'Lyrics'

  useEffect(() => {
    const base = activeQuery ? `${activeQuery} — ${pageTitle}` : pageTitle
    const fullTitle = `${base} | Scripture Search`
    document.title = fullTitle

    const setMeta = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', pageDescription)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', pageDescription)
    setMeta('meta[name="twitter:title"]', fullTitle)
    setMeta('meta[name="twitter:description"]', pageDescription)
  }, [pageTitle, pageDescription, activeQuery])

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

      <div className="site-header__hero safe-top relative">
        <div className="absolute right-4 top-4 z-10 sm:right-6">
          <ThemeToggle />
        </div>
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
        inert={headerCompact ? undefined : true}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 sm:gap-4 sm:px-6">
          <button
            type="button"
            onClick={() => scrollToTop({ smooth: true })}
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

          <ThemeToggle className="shrink-0" tabIndex={headerCompact ? 0 : -1} />

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
        className="animate-fade-in relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-28 outline-none sm:px-6 md:pb-10"
      >
        <Suspense fallback={<ViewFallback />}>
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
                onFavoriteChange={bumpFavorites}
                onSuggestionSelect={(term) => {
                  setQuery(term)
                  runSearch(term)
                }}
              />
            </div>
          ) : (
            <SubjectGrid
              activeQuery={activeQuery}
              onSelect={(topicName) => {
                setQuery(topicName)
                runSearch(topicName)
              }}
              onExploreTheme={exploreSubject}
              onOpenComparison={handleOpenComparison}
              onOpenStory={openStory}
              onOpenSong={openSong}
              favoritesVersion={favoritesVersion}
            />
          )
        ) : isStories ? (
          <MediaShowcase
            onExploreTheme={exploreSubject}
            initialStoryId={storyId}
            onStoryUrlChange={(id) => setStoryId(id ?? '')}
            onOpenStory={openStory}
            onOpenSong={openSong}
          />
        ) : isQuote ? (
          <QuoteCompareView
            onExploreTheme={exploreSubject}
            initialQuote={quoteText}
            initialTitle={quoteTitle}
            onUrlChange={(text, title) => {
              setQuoteText(text)
              setQuoteTitle(title)
            }}
          />
        ) : (
          <SpotifyLyricsCompare
            onExploreTheme={exploreSubject}
            initialArtist={lyricsArtist}
            initialTrack={lyricsTrack}
            onLyricsUrlChange={(artist, track) => {
              setLyricsArtist(artist ?? '')
              setLyricsTrack(track ?? '')
            }}
          />
        )}
        </Suspense>
      </main>

      <footer className="relative z-10 border-t border-parchment-dark/70 py-8 text-center safe-bottom">
        <p className="mx-auto max-w-lg px-4 text-xs leading-relaxed text-ink-muted">
          Scripture quotations from the Holy Bible, New International Version&reg;. Copyright &copy; Biblica, Inc.
          Used by permission via API.Bible.
        </p>
      </footer>

      <ScrollToTop visible={showFab} onClick={() => scrollToTop({ smooth: true })} />
      <ReadingSettingsPanel />
      <OfflineBanner />
      <BottomNav mode={mode} onModeChange={handleModeChange} />
    </div>
  )
}
