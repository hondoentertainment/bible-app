import { useEffect, useState } from 'react'
import type { Verse } from '../types'
import { fetchChapterContext } from '../services/bibleApi'
import { hapticLight } from '../utils/haptics'

interface PassageExpanderProps {
  verseId: string
  reference: string
  compact?: boolean
}

export function PassageExpander({ verseId, reference, compact = false }: PassageExpanderProps) {
  const [expanded, setExpanded] = useState(false)
  const [chapter, setChapter] = useState<Verse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setExpanded(false)
    setChapter(null)
    setError(null)
  }, [verseId])

  async function handleToggle() {
    if (expanded) {
      setExpanded(false)
      return
    }

    if (chapter) {
      setExpanded(true)
      hapticLight()
      return
    }

    setLoading(true)
    setError(null)
    try {
      const passage = await fetchChapterContext(verseId)
      setChapter(passage)
      setExpanded(true)
      hapticLight()
    } catch {
      setError('Could not load surrounding passage.')
    } finally {
      setLoading(false)
    }
  }

  const btnClass = compact
    ? 'touch-manipulation flex min-h-[36px] items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95'
    : 'touch-manipulation flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-95'

  return (
    <div className={compact ? '' : 'mt-3'}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        aria-expanded={expanded}
        className={`${btnClass} ${
          expanded
            ? 'border-gold/50 bg-gold/10 text-gold'
            : 'border-parchment-dark text-ink-muted hover:border-gold hover:text-gold'
        }`}
      >
        {loading ? (
          <>
            <SpinnerIcon />
            {compact ? null : 'Loading…'}
          </>
        ) : expanded ? (
          <>
            <ChevronUpIcon />
            {compact ? null : 'Hide passage'}
          </>
        ) : (
          <>
            <BookIcon />
            {compact ? null : 'Read passage'}
          </>
        )}
      </button>

      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}

      {expanded && chapter && (
        <div className="mt-3 rounded-xl border border-parchment-dark bg-parchment/30 p-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-gold uppercase">
            Full chapter · {chapter.reference}
          </p>
          <p className="text-sm leading-relaxed text-ink whitespace-pre-wrap">{chapter.text}</p>
          <p className="mt-3 text-xs text-ink-muted">
            Showing full chapter context for {reference}.
          </p>
        </div>
      )}
    </div>
  )
}

function BookIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
