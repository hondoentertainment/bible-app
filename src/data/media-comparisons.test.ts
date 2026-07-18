import { describe, expect, it } from 'vitest'
import {
  FEATURED_STORY_IDS,
  getComparisonsByType,
  getFeaturedStories,
  getSeasonalFeaturedStoryIds,
  searchCuratedComparisons,
} from './media-comparisons'

describe('searchCuratedComparisons', () => {
  it('finds partial movie title matches', () => {
    const results = searchCuratedComparisons('shawshank', 'movie')
    expect(results.some((r) => r.id === 'shawshank')).toBe(true)
  })

  it('finds partial book matches', () => {
    const results = searchCuratedComparisons('les mis', 'book')
    expect(results.some((r) => r.id === 'les-miserables')).toBe(true)
  })

  it('finds curated TV', () => {
    const results = searchCuratedComparisons('chosen', 'tv')
    expect(results.some((r) => r.id === 'the-chosen')).toBe(true)
  })
})

describe('featured stories', () => {
  it('does not feature song types in default featured ids', () => {
    for (const id of FEATURED_STORY_IDS) {
      const item = getComparisonsByType('all').find((m) => m.id === id)
      expect(item?.type).not.toBe('song')
    }
  })

  it('returns seasonal featured stories for Advent', () => {
    const ids = getSeasonalFeaturedStoryIds(new Date('2026-12-10T12:00:00Z'))
    expect(ids).toContain('its-a-wonderful-life')
    expect(getFeaturedStories('movie', new Date('2026-12-10T12:00:00Z')).length).toBeGreaterThan(0)
  })

  it('has curated content in each Stories section', () => {
    expect(getComparisonsByType('book').length).toBeGreaterThanOrEqual(5)
    expect(getComparisonsByType('movie').length).toBeGreaterThanOrEqual(5)
    expect(getComparisonsByType('tv').length).toBeGreaterThanOrEqual(3)
  })
})
