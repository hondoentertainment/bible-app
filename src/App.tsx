import { useCallback, useEffect, useState } from 'react'
import { AppNav } from './components/AppNav'
import { MediaShowcase } from './components/MediaShowcase'
import { SearchBar } from './components/SearchBar'
import { SpotifyLyricsCompare } from './components/SpotifyLyricsCompare'
import { SubjectGrid } from './components/SubjectGrid'
import { VerseResults } from './components/VerseResults'
import { searchBySubject } from './services/bibleApi'
import type { SearchResult } from './types'
import type { AppMode } from './types/media'

const emptyResult: SearchResult = {
  verses: [],
  matchedTopics: [],
  query: '',
  source: 'topics',
}

export default function App() {
  const [mode, setMode] = useState<AppMode>('subjects')
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [result, setResult] = useState<SearchResult>(emptyResult)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      setActiveQuery('')
      setResult(emptyResult)
      setError(null)
      return
    }

    setIsSearching(true)
    setActiveQuery(trimmed)
    setError(null)

    try {
      const searchResult = await searchBySubject(trimmed)
      setResult(searchResult)
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
  }

  function clearSearch() {
    setQuery('')
    setActiveQuery('')
    setResult(emptyResult)
    setError(null)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [mode, activeQuery])

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
      ? 'Discover how famous stories, songs, and films echo timeless biblical themes — line by line.'
      : 'Search any song on Spotify and compare its lyrics to NIV verses on matching themes.'

  return (
    <div className="app-shell relative min-h-screen">
      <header className="relative z-10 border-b border-parchment-dark/70 bg-white/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-8 text-center sm:gap-6 sm:px-6 sm:py-10">
          <div className="animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
              <svg
                className="h-5 w-5 text-gold"
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

          {isSubjects && (
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={() => runSearch(query)}
              isSearching={isSearching}
            />
          )}
        </div>
      </header>

      <main
        key={mode}
        className="relative z-10 mx-auto max-w-6xl animate-fade-in px-4 py-10 sm:px-6"
      >
        {isSubjects ? (
          activeQuery ? (
            <div className="animate-fade-in-up">
              <button type="button" onClick={clearSearch} className="back-link mb-6">
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
          <MediaShowcase />
        ) : (
          <SpotifyLyricsCompare />
        )}
      </main>

      <footer className="relative z-10 border-t border-parchment-dark/70 py-8 text-center safe-bottom">
        <p className="mx-auto max-w-lg px-4 text-xs leading-relaxed text-ink-muted">
          Scripture quotations from the Holy Bible, New International Version&reg;. Copyright &copy; Biblica, Inc.
          Used by permission via API.Bible.
        </p>
      </footer>
    </div>
  )
}
