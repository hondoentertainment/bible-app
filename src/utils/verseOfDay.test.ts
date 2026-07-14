import { describe, expect, it } from 'vitest'
import { getFallbackVerseOfDay, getVerseOfDay } from './verseOfDay'
import { FALLBACK_VERSES, getFallbackVerseForDay } from '../data/fallbackVerses'
import { getTopicById } from '../data/topics'

describe('getVerseOfDay', () => {
  it('is deterministic for a given date', () => {
    const date = new Date('2026-03-15T12:00:00Z')
    expect(getVerseOfDay(date)).toEqual(getVerseOfDay(date))
  })

  it('changes across days', () => {
    const a = getVerseOfDay(new Date('2026-03-15T12:00:00Z'))
    const b = getVerseOfDay(new Date('2026-08-02T12:00:00Z'))
    expect(a.verseId === b.verseId && a.topicId === b.topicId).toBe(false)
  })
})

describe('getFallbackVerseOfDay', () => {
  it('always returns a bundled verse with real text', () => {
    const verse = getFallbackVerseOfDay(new Date('2026-03-15T12:00:00Z'))
    expect(verse.text.length).toBeGreaterThan(10)
    expect(verse.reference).toBeTruthy()
    expect(FALLBACK_VERSES.some((v) => v.id === verse.id)).toBe(true)
  })

  it('links every fallback verse to a real topic', () => {
    for (const verse of FALLBACK_VERSES) {
      expect(getTopicById(verse.topicId), `topic for ${verse.reference}`).toBeTruthy()
    }
  })

  it('wraps the day index deterministically', () => {
    const len = FALLBACK_VERSES.length
    expect(getFallbackVerseForDay(0)).toEqual(getFallbackVerseForDay(len))
  })
})
