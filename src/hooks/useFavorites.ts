import type { Verse } from '../types'

const VERSES_KEY = 'bible-app-favorite-verses'
const COMPARISONS_KEY = 'bible-app-favorite-comparisons'
const MAX_VERSES = 50
const MAX_COMPARISONS = 30

export interface SavedComparison {
  key: string
  kind: 'story' | 'lyrics' | 'quote'
  title: string
  subtitle?: string
  storyId?: string
  artist?: string
  track?: string
  quoteText?: string
  savedAt: number
}

function readVerses(): Verse[] {
  try {
    const raw = localStorage.getItem(VERSES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (v): v is Verse =>
        v && typeof v.id === 'string' && typeof v.reference === 'string' && typeof v.text === 'string',
    )
  } catch {
    return []
  }
}

function writeVerses(verses: Verse[]) {
  localStorage.setItem(VERSES_KEY, JSON.stringify(verses))
}

function readComparisons(): SavedComparison[] {
  try {
    const raw = localStorage.getItem(COMPARISONS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (c): c is SavedComparison =>
        c &&
        typeof c.key === 'string' &&
        typeof c.kind === 'string' &&
        typeof c.title === 'string' &&
        typeof c.savedAt === 'number',
    )
  } catch {
    return []
  }
}

function writeComparisons(comparisons: SavedComparison[]) {
  localStorage.setItem(COMPARISONS_KEY, JSON.stringify(comparisons))
}

export function getFavoriteVerses(): Verse[] {
  return readVerses()
}

export function isVerseFavorite(verseId: string): boolean {
  return readVerses().some((v) => v.id === verseId)
}

export function addFavoriteVerse(verse: Verse): Verse[] {
  const next = [verse, ...readVerses().filter((v) => v.id !== verse.id)].slice(0, MAX_VERSES)
  writeVerses(next)
  return next
}

export function removeFavoriteVerse(verseId: string): Verse[] {
  const next = readVerses().filter((v) => v.id !== verseId)
  writeVerses(next)
  return next
}

export function toggleFavoriteVerse(verse: Verse): { favorites: Verse[]; saved: boolean } {
  if (isVerseFavorite(verse.id)) {
    return { favorites: removeFavoriteVerse(verse.id), saved: false }
  }
  return { favorites: addFavoriteVerse(verse), saved: true }
}

export function getFavoriteComparisons(): SavedComparison[] {
  return readComparisons().sort((a, b) => b.savedAt - a.savedAt)
}

export function isComparisonFavorite(key: string): boolean {
  return readComparisons().some((c) => c.key === key)
}

export function addFavoriteComparison(comparison: SavedComparison): SavedComparison[] {
  const without = readComparisons().filter((c) => c.key !== comparison.key)
  const next = [{ ...comparison, savedAt: Date.now() }, ...without].slice(0, MAX_COMPARISONS)
  writeComparisons(next)
  return next
}

export function removeFavoriteComparison(key: string): SavedComparison[] {
  const next = readComparisons().filter((c) => c.key !== key)
  writeComparisons(next)
  return next
}

export function toggleFavoriteComparison(comparison: SavedComparison): {
  favorites: SavedComparison[]
  saved: boolean
} {
  if (isComparisonFavorite(comparison.key)) {
    return { favorites: removeFavoriteComparison(comparison.key), saved: false }
  }
  return { favorites: addFavoriteComparison(comparison), saved: true }
}

export function storyComparisonKey(storyId: string): string {
  return `story:${storyId}`
}

export function lyricsComparisonKey(artist: string, track: string): string {
  return `lyrics:${artist.toLowerCase()}|${track.toLowerCase()}`
}

export function quoteComparisonKey(title: string, text: string): string {
  const snippet = text.slice(0, 80).toLowerCase()
  return `quote:${title.toLowerCase()}|${snippet}`
}
