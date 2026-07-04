import { describe, expect, it } from 'vitest'
import { searchCuratedComparisons } from './media-comparisons'

describe('searchCuratedComparisons', () => {
  it('finds partial movie title matches', () => {
    const results = searchCuratedComparisons('shawshank', 'movie')
    expect(results.some((r) => r.id === 'shawshank')).toBe(true)
  })

  it('finds partial book matches', () => {
    const results = searchCuratedComparisons('les mis', 'book')
    expect(results.some((r) => r.id === 'les-miserables')).toBe(true)
  })
})
