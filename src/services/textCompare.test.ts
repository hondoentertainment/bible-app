import { describe, expect, it } from 'vitest'
import { extractCompareLines } from './textCompare'

describe('extractCompareLines', () => {
  it('prioritizes repeated chorus lines for songs', () => {
    const lyrics = 'Verse one line here\nHallelujah\nHallelujah\nAnother verse line'
    const lines = extractCompareLines(lyrics, 'song')
    expect(lines[0].toLowerCase()).toBe('hallelujah')
  })

  it('returns sentences for books', () => {
    const text = 'First opening sentence of the book. Second sentence follows here.'
    const lines = extractCompareLines(text, 'book')
    expect(lines[0]).toContain('First opening')
  })
})
