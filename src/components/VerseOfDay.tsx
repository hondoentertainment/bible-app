import { useEffect, useState } from 'react'
import { fetchPassage } from '../services/bibleApi'
import { getFallbackVerseOfDay, getVerseOfDay } from '../utils/verseOfDay'
import type { Verse } from '../types'
import { VerseActions } from './VerseActions'
import { PassageExpander } from './PassageExpander'

interface VerseOfDayProps {
  onExploreTheme: (topicName: string) => void
}

export function VerseOfDay({ onExploreTheme }: VerseOfDayProps) {
  const selection = getVerseOfDay()
  const [verse, setVerse] = useState<Verse | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setOffline(false)

    fetchPassage(selection.verseId)
      .then((v) => {
        if (!cancelled) setVerse(v)
      })
      .catch(() => {
        if (cancelled) return
        // Never dead-end: fall back to a bundled verse so the hero always
        // shows real Scripture even when the API is unreachable.
        setVerse(getFallbackVerseOfDay())
        setOffline(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selection.verseId, selection.dateKey])

  return (
    <section
      className="mb-10 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.08] via-[var(--surface)] to-navy/[0.04] shadow-sm"
      aria-label="Verse of the day"
    >
      <div className="border-b border-gold/20 bg-gold/[0.06] px-5 py-3 text-center sm:text-left">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Verse of the Day</p>
        <p className="mt-0.5 text-sm text-ink-muted">
          Theme:{' '}
          <button
            type="button"
            onClick={() => onExploreTheme(selection.topicName)}
            className="font-semibold text-navy underline decoration-gold/50 underline-offset-2 transition hover:text-gold"
          >
            {selection.topicName}
          </button>
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {loading && (
          <div className="space-y-3" aria-busy="true">
            <div className="skeleton h-6 w-40" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        )}

        {!loading && verse && (
          <>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-navy">{verse.reference}</h3>
                {offline && (
                  <span className="mt-1 inline-block rounded-full bg-parchment px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-muted">
                    Offline · saved copy
                  </span>
                )}
              </div>
              <VerseActions verse={verse} />
            </div>
            <blockquote className="font-display text-lg leading-relaxed text-ink sm:text-xl">
              {verse.text}
            </blockquote>
            <PassageExpander verseId={verse.id} reference={verse.reference} />
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onExploreTheme(selection.topicName)}
                className="touch-manipulation rounded-full border border-navy bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90 active:scale-95"
              >
                Explore {selection.topicName} →
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
