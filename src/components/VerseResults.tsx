import { useMemo, useState } from 'react'
import type { TopicMatch, Verse } from '../types'
import { isNewTestament, isOldTestament } from '../utils/passageLookup'
import { hapticLight } from '../utils/haptics'
import { copyVersesResult, shareVersesResult } from '../utils/verseShare'
import { useToast } from '../hooks/useToast'
import { VerseCard } from './VerseCard'
import { HorizontalChipRow } from './HorizontalChipRow'

interface VerseResultsProps {
  verses: Verse[]
  matchedTopics: TopicMatch[]
  query: string
  apiUnavailable: boolean
  error?: string | null
  isSearching?: boolean
  onFavoriteChange?: () => void
  onSuggestionSelect?: (term: string) => void
}

const RECOVERY_SUGGESTIONS = ['hope', 'prayer', 'strength', 'peace', 'forgiveness']

function VerseSkeleton() {
  return (
    <div className="rounded-2xl border border-parchment-dark bg-white p-6 shadow-sm">
      <div className="mb-4 flex justify-between gap-4">
        <div className="skeleton h-6 w-36" />
        <div className="skeleton h-8 w-16 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  )
}

export function VerseResults({
  verses,
  matchedTopics,
  query,
  apiUnavailable,
  error,
  isSearching,
  onFavoriteChange,
  onSuggestionSelect,
}: VerseResultsProps) {
  const { showToast } = useToast()
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'ot' | 'nt'>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'topics' | 'api'>('all')

  const filteredVerses = useMemo(() => {
    return verses.filter((v) => {
      if (testamentFilter === 'ot' && !isOldTestament(v.id)) return false
      if (testamentFilter === 'nt' && !isNewTestament(v.id)) return false
      if (sourceFilter === 'topics' && v.source !== 'topics') return false
      if (sourceFilter === 'api' && v.source !== 'api' && v.source !== 'reference') return false
      return true
    })
  }, [verses, testamentFilter, sourceFilter])

  async function handleCopyAll() {
    await copyVersesResult(query, verses)
    hapticLight()
    showToast(`${verses.length} verses copied`)
  }

  async function handleShareAll() {
    try {
      const outcome = await shareVersesResult(query, verses)
      hapticLight()
      showToast(outcome === 'shared' ? 'Results shared' : 'Results copied')
    } catch {
      // User dismissed share sheet
    }
  }

  if (isSearching) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4" aria-busy="true" aria-label="Loading results">
        <div className="skeleton mx-auto h-7 w-48" />
        <VerseSkeleton />
        <VerseSkeleton />
        <VerseSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="font-semibold text-red-800">Something went wrong</p>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="mx-auto max-w-xl text-center text-ink-muted">
        <p className="text-lg">Enter a subject above or tap a topic to discover relevant NIV verses.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {verses.length > 0
          ? `${verses.length} verse${verses.length === 1 ? '' : 's'} found for ${query}`
          : !apiUnavailable
            ? `No verses found for ${query}`
            : ''}
      </div>

      {matchedTopics.length > 0 && (
        <section className="animate-fade-in-up" aria-label="Matched topics">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-ink-muted uppercase">
            Topics matching &ldquo;{query}&rdquo;
          </h2>
          <HorizontalChipRow className="pb-0.5" ariaLabel="Matched topics">
            {matchedTopics.map((topic) => (
              <span
                key={topic.topicId}
                className="rounded-full border border-navy/10 bg-navy/5 px-3.5 py-1.5 text-sm text-navy transition-colors hover:border-gold/30 hover:bg-gold/5"
                title={topic.description}
              >
                {topic.topicName}
              </span>
            ))}
          </HorizontalChipRow>
        </section>
      )}

      {apiUnavailable && (
        <div className="animate-fade-in-up rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <p className="font-semibold">Verse text temporarily unavailable</p>
          <p className="mt-2 text-sm leading-relaxed">
            The Bible API is not configured on the server. Passage references for your search are shown below.
          </p>
          {matchedTopics.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium">Referenced passages for your search:</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {matchedTopics.flatMap((topic) =>
                  topic.verseIds.map((id) => (
                    <li key={`${topic.topicId}-${id}`} className="rounded-lg bg-white px-2.5 py-1 text-sm">
                      {formatPassageId(id)}
                    </li>
                  )),
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {verses.length > 0 ? (
        <section aria-label="Search results">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold text-navy">
              {filteredVerses.length} verse{filteredVerses.length === 1 ? '' : 's'} found
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-ink-muted transition hover:border-gold hover:text-gold active:scale-95"
              >
                Copy all
              </button>
              <button
                type="button"
                onClick={handleShareAll}
                className="touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-ink-muted transition hover:border-gold hover:text-gold active:scale-95"
              >
                Share
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <FilterChip label="All" active={testamentFilter === 'all'} onClick={() => setTestamentFilter('all')} />
            <FilterChip label="Old Testament" active={testamentFilter === 'ot'} onClick={() => setTestamentFilter('ot')} />
            <FilterChip label="New Testament" active={testamentFilter === 'nt'} onClick={() => setTestamentFilter('nt')} />
          </div>
          <HorizontalChipRow className="mb-4 pb-0.5" ariaLabel="Filter by source">
            <FilterChip label="All sources" active={sourceFilter === 'all'} onClick={() => setSourceFilter('all')} />
            <FilterChip label="Curated" active={sourceFilter === 'topics'} onClick={() => setSourceFilter('topics')} />
            <FilterChip label="Full-text" active={sourceFilter === 'api'} onClick={() => setSourceFilter('api')} />
          </HorizontalChipRow>

          <div className="stagger-children flex flex-col gap-4">
            {filteredVerses.map((verse) => (
              <VerseCard key={verse.id} verse={verse} onFavoriteChange={onFavoriteChange} />
            ))}
          </div>
          {filteredVerses.length === 0 && (
            <p className="text-center text-ink-muted">No verses match the current filters.</p>
          )}
        </section>
      ) : (
        !apiUnavailable && (
          <div className="animate-fade-in-up rounded-2xl border border-dashed border-parchment-dark bg-white/60 p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-parchment">
              <svg className="h-6 w-6 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
            </div>
            <p className="text-ink-muted">
              No verses found for &ldquo;{query}&rdquo;.
            </p>
            <p className="mt-2 text-sm text-ink-muted/80">Try one of these subjects:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {RECOVERY_SUGGESTIONS.filter((s) => s !== query.trim().toLowerCase()).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    hapticLight()
                    onSuggestionSelect?.(term)
                  }}
                  disabled={!onSuggestionSelect}
                  className="touch-manipulation rounded-full border border-parchment-dark bg-white px-4 py-1.5 text-sm font-medium capitalize text-navy transition hover:border-gold hover:text-gold active:scale-95 disabled:cursor-default disabled:opacity-60"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition ${
        active ? 'border-navy bg-navy text-white' : 'border-parchment-dark text-ink-muted hover:border-gold'
      }`}
    >
      {label}
    </button>
  )
}

function formatPassageId(id: string): string {
  const bookNames: Record<string, string> = {
    GEN: 'Genesis',
    EXO: 'Exodus',
    LEV: 'Leviticus',
    NUM: 'Numbers',
    DEU: 'Deuteronomy',
    JOS: 'Joshua',
    JDG: 'Judges',
    RUT: 'Ruth',
    '1SA': '1 Samuel',
    '2SA': '2 Samuel',
    '1KI': '1 Kings',
    '2KI': '2 Kings',
    '1CH': '1 Chronicles',
    '2CH': '2 Chronicles',
    EZR: 'Ezra',
    NEH: 'Nehemiah',
    EST: 'Esther',
    JOB: 'Job',
    PSA: 'Psalm',
    PRO: 'Proverbs',
    ECC: 'Ecclesiastes',
    SNG: 'Song of Songs',
    ISA: 'Isaiah',
    JER: 'Jeremiah',
    LAM: 'Lamentations',
    EZK: 'Ezekiel',
    DAN: 'Daniel',
    HOS: 'Hosea',
    JOL: 'Joel',
    AMO: 'Amos',
    OBA: 'Obadiah',
    JON: 'Jonah',
    MIC: 'Micah',
    NAH: 'Nahum',
    HAB: 'Habakkuk',
    ZEP: 'Zephaniah',
    HAG: 'Haggai',
    ZEC: 'Zechariah',
    MAL: 'Malachi',
    MAT: 'Matthew',
    MRK: 'Mark',
    LUK: 'Luke',
    JHN: 'John',
    ACT: 'Acts',
    ROM: 'Romans',
    '1CO': '1 Corinthians',
    '2CO': '2 Corinthians',
    GAL: 'Galatians',
    EPH: 'Ephesians',
    PHP: 'Philippians',
    PHI: 'Philippians',
    COL: 'Colossians',
    '1TH': '1 Thessalonians',
    '2TH': '2 Thessalonians',
    '1TI': '1 Timothy',
    '2TI': '2 Timothy',
    TIT: 'Titus',
    PHM: 'Philemon',
    HEB: 'Hebrews',
    JAS: 'James',
    '1PE': '1 Peter',
    '2PE': '2 Peter',
    '1JN': '1 John',
    '2JN': '2 John',
    '3JN': '3 John',
    JUD: 'Jude',
    REV: 'Revelation',
  }

  const [book, chapter, ...rest] = id.split('.')
  const bookName = bookNames[book] ?? book
  const versePart = rest.length > 0 ? `:${rest.join('-')}` : ''
  return `${bookName} ${chapter}${versePart}`
}
