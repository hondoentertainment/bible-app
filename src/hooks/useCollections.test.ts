// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addVerseToCollection,
  createCollection,
  deleteCollection,
  getCollections,
  getCollectionsForVerse,
  isVerseInCollection,
  removeVerseFromCollection,
  renameCollection,
  toggleVerseInCollection,
} from './useCollections'
import type { Verse } from '../types'

const verse = (id: string): Verse => ({ id, reference: id, text: `Text ${id}` })

describe('useCollections', () => {
  beforeEach(() => localStorage.clear())

  it('creates collections and rejects empty names', () => {
    const created = createCollection('Anxiety')
    expect(created?.name).toBe('Anxiety')
    expect(createCollection('   ')).toBeNull()
    expect(getCollections()).toHaveLength(1)
  })

  it('adds and dedupes verses within a collection', () => {
    const c = createCollection('Hope')!
    addVerseToCollection(c.id, verse('JHN.3.16'))
    addVerseToCollection(c.id, verse('JHN.3.16'))
    addVerseToCollection(c.id, verse('PSA.23.1'))
    const [collection] = getCollections()
    expect(collection.verses.map((v) => v.id)).toEqual(['PSA.23.1', 'JHN.3.16'])
  })

  it('reports membership and reverse lookup', () => {
    const a = createCollection('A')!
    const b = createCollection('B')!
    addVerseToCollection(a.id, verse('JHN.3.16'))
    addVerseToCollection(b.id, verse('JHN.3.16'))
    expect(isVerseInCollection(a.id, 'JHN.3.16')).toBe(true)
    expect(getCollectionsForVerse('JHN.3.16').sort()).toEqual([a.id, b.id].sort())
  })

  it('toggles a verse in and out of a collection', () => {
    const c = createCollection('Peace')!
    expect(toggleVerseInCollection(c.id, verse('PHP.4.6')).inCollection).toBe(true)
    expect(isVerseInCollection(c.id, 'PHP.4.6')).toBe(true)
    expect(toggleVerseInCollection(c.id, verse('PHP.4.6')).inCollection).toBe(false)
    expect(isVerseInCollection(c.id, 'PHP.4.6')).toBe(false)
  })

  it('renames and removes verses and collections', () => {
    const c = createCollection('Old')!
    addVerseToCollection(c.id, verse('JHN.3.16'))
    renameCollection(c.id, 'New')
    expect(getCollections()[0].name).toBe('New')
    removeVerseFromCollection(c.id, 'JHN.3.16')
    expect(getCollections()[0].verses).toHaveLength(0)
    deleteCollection(c.id)
    expect(getCollections()).toHaveLength(0)
  })

  it('orders collections by most recently updated', () => {
    let now = 1_000_000
    vi.spyOn(Date, 'now').mockImplementation(() => (now += 1000))
    try {
      const a = createCollection('A')!
      createCollection('B')!
      // Touch A so it becomes the most recently updated.
      addVerseToCollection(a.id, verse('JHN.3.16'))
      expect(getCollections()[0].id).toBe(a.id)
    } finally {
      vi.restoreAllMocks()
    }
  })
})

afterEach(() => vi.restoreAllMocks())
