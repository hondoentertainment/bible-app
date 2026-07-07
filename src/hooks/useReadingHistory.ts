import type { Verse } from '../types'

const STORAGE_KEY = 'bible-app-reading-history'
const MAX_ENTRIES = 24

/** Fired whenever the reading history changes so open views can refresh. */
export const READING_HISTORY_EVENT = 'reading-history-change'

export interface ReadingHistoryEntry {
  id: string
  reference: string
  text: string
  viewedAt: number
}

function read(): ReadingHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (e): e is ReadingHistoryEntry =>
        e &&
        typeof e.id === 'string' &&
        typeof e.reference === 'string' &&
        typeof e.viewedAt === 'number',
    )
  } catch {
    return []
  }
}

function write(entries: ReadingHistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    window.dispatchEvent(new Event(READING_HISTORY_EVENT))
  } catch {
    // storage may be unavailable (private mode); fail silently
  }
}

export function getReadingHistory(): ReadingHistoryEntry[] {
  return read().sort((a, b) => b.viewedAt - a.viewedAt)
}

/** Records (or refreshes) a verse the reader has opened, most-recent-first. */
export function recordVerseView(verse: Pick<Verse, 'id' | 'reference' | 'text'>): void {
  if (!verse.id || !verse.reference) return
  const entry: ReadingHistoryEntry = {
    id: verse.id,
    reference: verse.reference,
    text: (verse.text ?? '').slice(0, 160),
    viewedAt: Date.now(),
  }
  const next = [entry, ...read().filter((e) => e.id !== verse.id)].slice(0, MAX_ENTRIES)
  write(next)
}

export function removeReadingHistory(id: string): ReadingHistoryEntry[] {
  const next = read().filter((e) => e.id !== id)
  write(next)
  return next.sort((a, b) => b.viewedAt - a.viewedAt)
}

export function clearReadingHistory(): void {
  write([])
}
