import type { Verse } from '../types'

const STORAGE_KEY = 'bible-app-collections'
const MAX_COLLECTIONS = 40
const MAX_VERSES_PER_COLLECTION = 200

/** Fired whenever collections change so open views can refresh. */
export const COLLECTIONS_EVENT = 'collections-change'

export interface Collection {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  verses: Verse[]
}

function read(): Collection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (c): c is Collection =>
        c &&
        typeof c.id === 'string' &&
        typeof c.name === 'string' &&
        Array.isArray(c.verses),
    )
  } catch {
    return []
  }
}

function write(collections: Collection[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections))
    window.dispatchEvent(new Event(COLLECTIONS_EVENT))
  } catch {
    // storage unavailable; fail silently
  }
}

function makeId(): string {
  return `col-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function getCollections(): Collection[] {
  return read().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function createCollection(name: string): Collection | null {
  const trimmed = name.trim()
  if (!trimmed) return null
  const existing = read()
  if (existing.length >= MAX_COLLECTIONS) return null

  const now = Date.now()
  const collection: Collection = {
    id: makeId(),
    name: trimmed.slice(0, 60),
    createdAt: now,
    updatedAt: now,
    verses: [],
  }
  write([collection, ...existing])
  return collection
}

export function renameCollection(id: string, name: string): Collection[] {
  const trimmed = name.trim()
  if (!trimmed) return getCollections()
  const next = read().map((c) =>
    c.id === id ? { ...c, name: trimmed.slice(0, 60), updatedAt: Date.now() } : c,
  )
  write(next)
  return getCollections()
}

export function deleteCollection(id: string): Collection[] {
  write(read().filter((c) => c.id !== id))
  return getCollections()
}

export function isVerseInCollection(id: string, verseId: string): boolean {
  const collection = read().find((c) => c.id === id)
  return collection ? collection.verses.some((v) => v.id === verseId) : false
}

/** Returns the ids of every collection that contains the given verse. */
export function getCollectionsForVerse(verseId: string): string[] {
  return read()
    .filter((c) => c.verses.some((v) => v.id === verseId))
    .map((c) => c.id)
}

export function addVerseToCollection(id: string, verse: Verse): Collection[] {
  const next = read().map((c) => {
    if (c.id !== id || c.verses.some((v) => v.id === verse.id)) return c
    return {
      ...c,
      verses: [verse, ...c.verses].slice(0, MAX_VERSES_PER_COLLECTION),
      updatedAt: Date.now(),
    }
  })
  write(next)
  return getCollections()
}

export function removeVerseFromCollection(id: string, verseId: string): Collection[] {
  const next = read().map((c) =>
    c.id === id
      ? { ...c, verses: c.verses.filter((v) => v.id !== verseId), updatedAt: Date.now() }
      : c,
  )
  write(next)
  return getCollections()
}

/** Toggles a verse in a collection and reports its new membership. */
export function toggleVerseInCollection(id: string, verse: Verse): { inCollection: boolean } {
  if (isVerseInCollection(id, verse.id)) {
    removeVerseFromCollection(id, verse.id)
    return { inCollection: false }
  }
  addVerseToCollection(id, verse)
  return { inCollection: true }
}
