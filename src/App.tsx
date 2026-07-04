import { useCallback, useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { TopicChips } from './components/TopicChips'
import { VerseResults } from './components/VerseResults'
import { searchBySubject } from './services/bibleApi'
import type { SearchResult } from './types'

const emptyResult: SearchResult = {
  verses: [],
  matchedTopics: [],
  query: '',
  source: 'topics',
}

export default function App() {
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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#fff9ee_0%,_#f7f2e8_45%,_#ebe3d4_100%)]">
      <header className="border-b border-parchment-dark/70 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-10 text-center sm:px-6">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-gold uppercase">Holy Scripture</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-navy sm:text-5xl">
              NIV Subject Search
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Find Bible verses by the subjects that matter to you — love, hope, forgiveness, and more.
            </p>
          </div>

          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={() => runSearch(query)}
            isSearching={isSearching}
          />

          <TopicChips
            activeQuery={activeQuery}
            onSelect={(topicName) => {
              setQuery(topicName)
              runSearch(topicName)
            }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <VerseResults
          verses={result.verses}
          matchedTopics={result.matchedTopics}
          query={activeQuery}
          apiUnavailable={result.apiUnavailable ?? false}
          error={error}
        />
      </main>

      <footer className="border-t border-parchment-dark/70 py-6 text-center text-xs text-ink-muted">
        Scripture quotations from the Holy Bible, New International Version&reg;. Copyright &copy; Biblica, Inc.
        Used by permission via API.Bible.
      </footer>
    </div>
  )
}
