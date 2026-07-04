import type { LoadedParallel, MediaType } from '../types/media'
import { VerseActions } from './VerseActions'

interface ScriptureParallelCardProps {
  parallel: LoadedParallel
  index: number
  mediaTitle: string
  mediaType: MediaType
}

const TYPE_STYLES: Record<MediaType, { bg: string; label: string; icon: string }> = {
  book: {
    bg: 'from-navy/[0.06] to-white',
    label: 'text-navy',
    icon: 'bg-navy/10 text-navy',
  },
  movie: {
    bg: 'from-indigo-900/[0.06] to-white',
    label: 'text-indigo-900',
    icon: 'bg-indigo-900/10 text-indigo-900',
  },
  song: {
    bg: 'from-[#1DB954]/[0.06] to-white',
    label: 'text-[#1a7a3a]',
    icon: 'bg-[#1DB954]/15 text-[#1DB954]',
  },
}

export function ScriptureParallelCard({
  parallel,
  index,
  mediaTitle,
  mediaType,
}: ScriptureParallelCardProps) {
  const styles = TYPE_STYLES[mediaType]

  return (
    <article
      id={`parallel-${parallel.id}`}
      className="overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between border-b border-parchment-dark bg-gradient-to-r from-parchment/80 via-white to-gold/10 px-5 py-3">
        <span className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">
          Parallel {index + 1} · {parallel.theme}
        </span>
        <span className="hidden text-xs text-ink-muted sm:inline">Story ↔ Scripture</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className={`border-b border-parchment-dark bg-gradient-to-br p-6 lg:border-r lg:border-b-0 ${styles.bg}`}>
          <div className="mb-3 flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${styles.icon}`}>
              <MediaTypeIcon type={mediaType} />
            </span>
            <p className={`text-xs font-semibold tracking-wide uppercase ${styles.label}`}>
              From {mediaTitle}
            </p>
          </div>
          <blockquote className="verse-pullquote font-display text-xl leading-relaxed text-navy italic sm:text-2xl">
            {parallel.mediaLine.text}
          </blockquote>
          {parallel.mediaLine.attribution && (
            <footer className="mt-3 text-sm text-ink-muted">— {parallel.mediaLine.attribution}</footer>
          )}
        </div>

        <div className="bg-gradient-to-br from-white to-gold/[0.06] p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <p className="text-xs font-semibold tracking-wide text-gold uppercase">Scripture speaks</p>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-ink">{parallel.connection}</p>

          {parallel.verses.length > 0 ? (
            <div className="flex flex-col gap-3">
              {parallel.verses.map((verse) => (
                <div
                  key={verse.id}
                  className="rounded-xl border border-parchment-dark/80 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-sm font-semibold text-navy">{verse.reference}</p>
                    <VerseActions verse={verse} compact />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{verse.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-parchment-dark bg-white/50 p-4 text-sm text-ink-muted">
              {parallel.verseIds.map((id) => (
                <span key={id} className="mr-2 inline-block rounded bg-parchment px-2 py-0.5">
                  {formatPassageId(id)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function MediaTypeIcon({ type }: { type: MediaType }) {
  if (type === 'book') {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }
  if (type === 'movie') {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    )
  }
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  )
}

function formatPassageId(id: string): string {
  const bookNames: Record<string, string> = {
    GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy',
    JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
    '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles',
    EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalm', PRO: 'Proverbs',
    ECC: 'Ecclesiastes', SNG: 'Song of Songs', ISA: 'Isaiah', JER: 'Jeremiah',
    LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel',
    AMO: 'Amos', OBA: 'Obadiah', JON: 'Jonah', MIC: 'Micah', NAH: 'Nahum', HAB: 'Habakkuk',
    ZEP: 'Zephaniah', HAG: 'Haggai', ZEC: 'Zechariah', MAL: 'Malachi', MAT: 'Matthew',
    MRK: 'Mark', LUK: 'Luke', JHN: 'John', ACT: 'Acts', ROM: 'Romans',
    '1CO': '1 Corinthians', '2CO': '2 Corinthians', GAL: 'Galatians', EPH: 'Ephesians',
    PHP: 'Philippians', PHI: 'Philippians', COL: 'Colossians', '1TH': '1 Thessalonians',
    '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy', TIT: 'Titus',
    PHM: 'Philemon', HEB: 'Hebrews', JAS: 'James', '1PE': '1 Peter', '2PE': '2 Peter',
    '1JN': '1 John', '2JN': '2 John', '3JN': '3 John', JUD: 'Jude', REV: 'Revelation',
  }

  const [book, chapter, ...rest] = id.split('.')
  const bookName = bookNames[book] ?? book
  const versePart = rest.length > 0 ? `:${rest.join('-')}` : ''
  return `${bookName} ${chapter}${versePart}`
}
