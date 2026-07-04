import type { LyricScriptureParallel } from '../types/lyrics'
import type { SpotifyTrackResult } from '../types/lyrics'
import { VerseActions } from './VerseActions'

interface LyricParallelCardProps {
  parallel: LyricScriptureParallel
  index: number
  track: SpotifyTrackResult
}

export function LyricParallelCard({ parallel, index, track }: LyricParallelCardProps) {
  return (
    <article
      id={`parallel-${parallel.id}`}
      className="scroll-target overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between border-b border-parchment-dark bg-gradient-to-r from-[#1DB954]/10 via-parchment/60 to-gold/10 px-5 py-3">
        <span className="text-xs font-semibold tracking-[0.15em] text-navy uppercase">
          Parallel {index + 1} · {parallel.theme}
        </span>
        <span className="hidden text-xs text-ink-muted sm:inline">Song ↔ Scripture</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-parchment-dark bg-gradient-to-br from-[#1DB954]/[0.06] to-white p-6 lg:border-r lg:border-b-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB954]/15 text-[#1DB954]">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </span>
            <p className="text-xs font-semibold tracking-wide text-[#1a7a3a] uppercase">The song says</p>
          </div>
          <blockquote className="verse-pullquote font-display text-xl leading-relaxed text-navy italic sm:text-2xl">
            {parallel.lyricLine}
          </blockquote>
          <footer className="mt-3 text-sm text-ink-muted">
            — {track.name} · {track.artist}
          </footer>
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
              {parallel.verseIds.join(' · ')}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
