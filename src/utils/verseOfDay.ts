import { TOPICS } from '../data/topics'
import {
  getFallbackVerseById,
  getFallbackVerseForDay,
  type FallbackVerse,
} from '../data/fallbackVerses'

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

/**
 * Resolves a bundled fallback verse to display when the live API is
 * unavailable. Prefers bundled text for the selected verse; otherwise picks a
 * deterministic curated verse for the day.
 */
export function getFallbackVerseOfDay(date: Date = new Date()): FallbackVerse {
  const selection = getVerseOfDay(date)
  return getFallbackVerseById(selection.verseId) ?? getFallbackVerseForDay(dayIndex(date))
}
