import { describe, expect, it } from 'vitest'
import { fitVerseText, wrapText } from './verseImage'

// Simple measure: 1 unit per character.
const charWidth = (text: string) => text.length

describe('wrapText', () => {
  it('keeps text on one line when it fits', () => {
    expect(wrapText(charWidth, 'short verse', 100)).toEqual(['short verse'])
  })

  it('wraps words that exceed the max width', () => {
    // maxWidth 10 → "the quick" (9) fits, adding " brown" (15) does not.
    const lines = wrapText(charWidth, 'the quick brown fox', 10)
    expect(lines).toEqual(['the quick', 'brown fox'])
  })

  it('never drops a word that is wider than maxWidth', () => {
    const lines = wrapText(charWidth, 'antidisestablishmentarianism ok', 5)
    expect(lines[0]).toBe('antidisestablishmentarianism')
    expect(lines).toContain('ok')
  })

  it('collapses extra whitespace', () => {
    expect(wrapText(charWidth, '  a   b  ', 100)).toEqual(['a b'])
  })
})

describe('fitVerseText', () => {
  // width proportional to size and length; height = lines * size * ratio.
  const measureAt = (size: number, text: string) => size * text.length

  it('chooses the largest size that fits the height budget', () => {
    const text = 'the quick brown fox jumps over the lazy dog'
    const { fontSize, lines } = fitVerseText(measureAt, text, 600, 300, [80, 40, 20], 1)
    // At 80px lines are tall; a smaller size should be chosen to fit 300px.
    expect(fontSize).toBeLessThan(80)
    const height = lines.length * fontSize * 1
    expect(height).toBeLessThanOrEqual(300)
  })

  it('falls back to the smallest size when nothing fits', () => {
    const text = 'word '.repeat(50).trim()
    const { fontSize } = fitVerseText(measureAt, text, 100, 50, [60, 40, 24], 1)
    expect(fontSize).toBe(24)
  })
})
