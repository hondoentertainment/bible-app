import { useEffect } from 'react'
import type { Verse } from '../types'
import { VerseActions } from './VerseActions'
import { PassageExpander } from './PassageExpander'
import { CrossReferences } from './CrossReferences'
import { VerseAudioButton } from './VerseAudioButton'
import { recordVerseView } from '../hooks/useReadingHistory'

interface VerseCardProps {
  verse: Verse
  onFavoriteChange?: () => void
}

export function VerseCard({ verse, onFavoriteChange }: VerseCardProps) {
  useEffect(() => {
    recordVerseView(verse)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verse.id])

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="p-6 sm:p-7">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-navy sm:text-2xl">
              {verse.reference}
            </h3>
            {verse.source && (
              <span className="mt-1 inline-block rounded-full bg-parchment px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-muted">
                {verse.source === 'topics' ? 'Curated' : verse.source === 'reference' ? 'Reference' : 'Search'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <VerseAudioButton text={verse.text} reference={verse.reference} />
            <VerseActions verse={verse} onFavoriteChange={onFavoriteChange} />
          </div>
        </div>

        <div className="verse-pullquote">
          <p className="font-display text-lg leading-[1.75] text-ink sm:text-xl">
            {verse.text}
          </p>
        </div>

        {verse.secondaryText && (
          <div className="mt-4 rounded-xl border border-parchment-dark bg-parchment/40 p-4">
            <p className="text-xs font-semibold uppercase text-ink-muted">{verse.secondaryReference ?? 'ESV'}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{verse.secondaryText}</p>
          </div>
        )}

        <div className="mt-5 border-t border-parchment-dark/60 pt-4">
          <PassageExpander verseId={verse.id} reference={verse.reference} />
          <CrossReferences verseId={verse.id} />
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
