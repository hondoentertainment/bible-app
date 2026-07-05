import { describe, expect, it } from 'vitest'
import { normalizePassageId } from '../services/bibleApi'
import {
  TOPICS,
  TOPIC_CATEGORIES,
  getTopicById,
  searchTopics,
} from './topics'

/** Canonical API.Bible / USFM book codes. */
const VALID_BOOK_CODES = new Set([
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
  '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
  'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
  'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL', 'MAT',
  'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP',
  'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE',
  '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
])

function bookCodesInId(normalizedId: string): string[] {
  // A normalized id may be a range "BOOK.C.V-BOOK.C.V"; grab each segment's book.
  return normalizedId.split('-').map((segment) => segment.split('.')[0])
}

describe('topics data integrity', () => {
  it('has at least one topic', () => {
    expect(TOPICS.length).toBeGreaterThan(0)
  })

  it('has unique topic ids', () => {
    const ids = TOPICS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every topic a name, description, keywords, and verses', () => {
    for (const topic of TOPICS) {
      expect(topic.name.trim(), topic.id).not.toBe('')
      expect(topic.description.trim(), topic.id).not.toBe('')
      expect(topic.keywords.length, topic.id).toBeGreaterThan(0)
      expect(topic.verseIds.length, topic.id).toBeGreaterThan(0)
    }
  })

  it('every verse id normalizes to a valid API.Bible book code', () => {
    const offenders: string[] = []
    for (const topic of TOPICS) {
      for (const verseId of topic.verseIds) {
        const normalized = normalizePassageId(verseId)
        for (const code of bookCodesInId(normalized)) {
          if (!VALID_BOOK_CODES.has(code)) {
            offenders.push(`${topic.id}: ${verseId} → ${normalized} (bad code "${code}")`)
          }
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('every verse id has a chapter and verse component', () => {
    const offenders: string[] = []
    for (const topic of TOPICS) {
      for (const verseId of topic.verseIds) {
        // Expect BOOK.CHAPTER.VERSE (optionally a range); at minimum 3 dot-parts.
        const firstSegment = verseId.split('-')[0]
        if (firstSegment.split('.').length < 3) {
          offenders.push(`${topic.id}: ${verseId}`)
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })
})

describe('topic categories', () => {
  it('references only real topic ids', () => {
    const known = new Set(TOPICS.map((t) => t.id))
    const offenders: string[] = []
    for (const category of TOPIC_CATEGORIES) {
      for (const topicId of category.topicIds) {
        if (!known.has(topicId)) offenders.push(`${category.id}: ${topicId}`)
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('assigns every topic to exactly one category', () => {
    const counts = new Map<string, number>()
    for (const category of TOPIC_CATEGORIES) {
      for (const topicId of category.topicIds) {
        counts.set(topicId, (counts.get(topicId) ?? 0) + 1)
      }
    }
    const unassigned = TOPICS.filter((t) => !counts.has(t.id)).map((t) => t.id)
    const duplicated = [...counts.entries()].filter(([, n]) => n > 1).map(([id]) => id)
    expect(unassigned, `unassigned: ${unassigned.join(', ')}`).toEqual([])
    expect(duplicated, `in multiple categories: ${duplicated.join(', ')}`).toEqual([])
  })
})

describe('searchTopics', () => {
  it('returns an empty array for blank queries', () => {
    expect(searchTopics('')).toEqual([])
    expect(searchTopics('   ')).toEqual([])
  })

  it('finds a topic by exact keyword', () => {
    const results = searchTopics('love')
    expect(results[0]?.id).toBe('love')
  })

  it('is case-insensitive', () => {
    expect(searchTopics('LOVE')[0]?.id).toBe('love')
  })

  it('matches on a partial word', () => {
    const results = searchTopics('forgive')
    expect(results.some((t) => t.id === 'forgiveness')).toBe(true)
  })

  it('returns nothing for gibberish', () => {
    expect(searchTopics('zzzznotarealtopic')).toEqual([])
  })

  it('ranks the best match first', () => {
    const results = searchTopics('anxiety')
    expect(results[0]?.id).toBe('anxiety')
  })
})

describe('getTopicById', () => {
  it('returns a known topic', () => {
    expect(getTopicById('faith')?.name).toBe('Faith')
  })

  it('returns undefined for an unknown id', () => {
    expect(getTopicById('nope')).toBeUndefined()
  })
})
