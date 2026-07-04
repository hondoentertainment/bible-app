import type { Verse } from '../types'
import { VerseActions } from './VerseActions'

interface VerseCardProps {
  verse: Verse
}

export function VerseCard({ verse }: VerseCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="p-6 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold text-navy sm:text-2xl">
            {verse.reference}
          </h3>
          <VerseActions verse={verse} />
        </div>

        <div className="verse-pullquote">
          <p className="font-display text-lg leading-[1.75] text-ink sm:text-xl">
            {verse.text}
          </p>
        </div>

        <p className="mt-5 flex items-center gap-2 text-xs tracking-wide text-ink-muted uppercase">
          <span className="h-px flex-1 bg-parchment-dark" aria-hidden />
          New International Version
          <span className="h-px flex-1 bg-parchment-dark" aria-hidden />
        </p>
      </div>
    </article>
  )
}
