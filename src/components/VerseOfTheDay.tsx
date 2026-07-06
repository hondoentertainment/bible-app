import { useEffect, useState } from 'react'
import { fetchPassage } from '../services/bibleApi'
import { getVerseOfDay } from '../utils/verseOfDay'
import type { Verse } from '../types'

interface VerseOfTheDayProps {
  onExplore: (topicName: string) => void
}

export function VerseOfTheDay({ onExplore }: VerseOfTheDayProps) {
  const [verse, setVerse] = useState<Verse | null>(null)
  const [topicName, setTopicName] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    const { verseId, topicName: topic } = getVerseOfDay()
    setTopicName(topic)

    fetchPassage(verseId)
      .then((v) => {
        if (!active) return
        setVerse(v)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  // Hide entirely if the API is unavailable — no empty shell.
  if (status === 'error') return null

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <section
      className="votd mx-auto mb-10 w-full max-w-3xl animate-fade-in-up overflow-hidden rounded-3xl border border-gold/30 bg-white shadow-sm"
      aria-label="Verse of the day"
    >
      <div className="flex items-center justify-between gap-3 border-b border-parchment-dark/70 bg-gold/5 px-6 py-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M3 12h2m14 0h2M5.6 18.4l1.4-1.4m10-10l1.4-1.4" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
          Verse of the Day
        </p>
        <span className="text-xs text-ink-muted">{today}</span>
      </div>

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {status === 'loading' ? (
          <div className="space-y-3" aria-hidden>
            <div className="skeleton h-5 w-32" />
            <div className="skeleton h-6 w-full" />
            <div className="skeleton h-6 w-5/6" />
          </div>
        ) : (
          verse && (
            <>
              <h2 className="font-display text-xl font-semibold text-navy sm:text-2xl">{verse.reference}</h2>
              <p className="mt-3 font-display text-lg leading-[1.8] text-ink sm:text-2xl">
                {verse.text}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onExplore(topicName)}
                  className="touch-manipulation rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light active:scale-95"
                >
                  Explore {topicName}
                </button>
                <span className="text-xs uppercase tracking-wide text-ink-muted">
                  New International Version
                </span>
              </div>
            </>
          )
        )}
      </div>
    </section>
  )
}
