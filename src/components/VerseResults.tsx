import type { TopicMatch, Verse } from '../types'
import { VerseCard } from './VerseCard'

interface VerseResultsProps {
  verses: Verse[]
  matchedTopics: TopicMatch[]
  query: string
  apiUnavailable: boolean
  error?: string | null
}

export function VerseResults({ verses, matchedTopics, query, apiUnavailable, error }: VerseResultsProps) {
  if (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
        <p className="font-semibold">Something went wrong</p>
        <p className="mt-2 text-sm">{error}</p>
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
      {matchedTopics.length > 0 && (
        <section aria-label="Matched topics">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-ink-muted uppercase">
            Topics matching &ldquo;{query}&rdquo;
          </h2>
          <div className="flex flex-wrap gap-2">
            {matchedTopics.map((topic) => (
              <span
                key={topic.topicId}
                className="rounded-full bg-navy/5 px-3 py-1.5 text-sm text-navy"
                title={topic.description}
              >
                {topic.topicName}
              </span>
            ))}
          </div>
        </section>
      )}

      {apiUnavailable && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
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
          <h2 className="mb-4 font-display text-2xl font-semibold text-navy">
            {verses.length} verse{verses.length === 1 ? '' : 's'} found
          </h2>
          <div className="flex flex-col gap-4">
            {verses.map((verse) => (
              <VerseCard key={verse.id} verse={verse} />
            ))}
          </div>
        </section>
      ) : (
        !apiUnavailable && (
          <div className="rounded-2xl border border-parchment-dark bg-white p-8 text-center text-ink-muted">
            <p>No verses found for &ldquo;{query}&rdquo;. Try another subject like hope, prayer, or strength.</p>
          </div>
        )
      )}
    </div>
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
