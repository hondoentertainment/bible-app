import { TOPICS } from '../data/topics'

export interface VerseOfDaySelection {
  verseId: string
  topicId: string
  topicName: string
  dateKey: string
}

function dateKeyFor(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

function dayIndex(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

/** Deterministic daily verse from curated topic pools. */
export function getVerseOfDay(date: Date = new Date()): VerseOfDaySelection {
  const day = dayIndex(date)
  const topic = TOPICS[day % TOPICS.length]
  const verseId = topic.verseIds[day % topic.verseIds.length]

  return {
    verseId,
    topicId: topic.id,
    topicName: topic.name,
    dateKey: dateKeyFor(date),
  }
}
