import type { LoadedParallel } from '../types/media'

interface ScriptureParallelCardProps {
  parallel: LoadedParallel
  index: number
  mediaTitle: string
}

export function ScriptureParallelCard({ parallel, index, mediaTitle }: ScriptureParallelCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="border-b border-parchment-dark bg-gradient-to-r from-parchment/80 to-parchment/40 px-5 py-3">
        <span className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">
          Parallel {index + 1} · {parallel.theme}
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-parchment-dark p-6 lg:border-r lg:border-b-0">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            From {mediaTitle}
          </p>
          <blockquote className="verse-pullquote font-display text-xl leading-relaxed text-navy italic sm:text-2xl">
            {parallel.mediaLine.text}
          </blockquote>
          {parallel.mediaLine.attribution && (
            <footer className="mt-3 text-sm text-ink-muted">— {parallel.mediaLine.attribution}</footer>
          )}
        </div>

        <div className="bg-gradient-to-br from-white to-parchment/30 p-6">
          <p className="mb-3 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Scripture speaks
          </p>
          <p className="mb-4 text-sm leading-relaxed text-ink">{parallel.connection}</p>

          {parallel.verses.length > 0 ? (
            <div className="flex flex-col gap-3">
              {parallel.verses.map((verse) => (
                <div
                  key={verse.id}
                  className="rounded-xl border border-parchment-dark/80 bg-white p-4"
                >
                  <p className="font-display text-sm font-semibold text-navy">{verse.reference}</p>
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
