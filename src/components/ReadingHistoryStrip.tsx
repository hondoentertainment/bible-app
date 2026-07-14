import { useEffect, useState } from 'react'
import {
  READING_HISTORY_EVENT,
  clearReadingHistory,
  getReadingHistory,
  type ReadingHistoryEntry,
} from '../hooks/useReadingHistory'

interface ReadingHistoryStripProps {
  onSelect: (reference: string) => void
}

export function ReadingHistoryStrip({ onSelect }: ReadingHistoryStripProps) {
  const [entries, setEntries] = useState<ReadingHistoryEntry[]>([])

  useEffect(() => {
    const sync = () => setEntries(getReadingHistory())
    sync()
    window.addEventListener(READING_HISTORY_EVENT, sync)
    return () => window.removeEventListener(READING_HISTORY_EVENT, sync)
  }, [])

  if (entries.length === 0) return null

  return (
    <section className="mb-10 w-full" aria-label="Recently read verses">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-navy">
          <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recently read
        </h2>
        <button
          type="button"
          onClick={() => clearReadingHistory()}
          className="touch-manipulation rounded-lg px-2 py-1 text-xs font-medium text-ink-muted transition hover:text-navy"
        >
          Clear
        </button>
      </div>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {entries.slice(0, 12).map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry.reference)}
            title={entry.text}
            className="group flex h-[6.25rem] w-[11.5rem] shrink-0 flex-col rounded-xl border border-parchment-dark bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md active:scale-[0.98]"
          >
            <span className="truncate font-display text-sm font-semibold text-navy group-hover:text-gold">
              {entry.reference}
            </span>
            <span className="mt-1 line-clamp-2 flex-1 text-xs leading-snug text-ink-muted">
              {entry.text || '\u00A0'}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
