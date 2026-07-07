// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearReadingHistory,
  getReadingHistory,
  recordVerseView,
  removeReadingHistory,
} from './useReadingHistory'

const verse = (id: string, reference = id, text = `Text ${id}`) => ({ id, reference, text })

describe('useReadingHistory', () => {
  beforeEach(() => {
    localStorage.clear()
    clearReadingHistory()
  })

  it('records views most-recent-first', () => {
    recordVerseView(verse('JHN.3.16'))
    recordVerseView(verse('PSA.23.1'))
    const history = getReadingHistory()
    expect(history.map((e) => e.id)).toEqual(['PSA.23.1', 'JHN.3.16'])
  })

  it('dedupes by verse id and moves the repeat to the front', () => {
    recordVerseView(verse('JHN.3.16'))
    recordVerseView(verse('PSA.23.1'))
    recordVerseView(verse('JHN.3.16'))
    const history = getReadingHistory()
    expect(history).toHaveLength(2)
    expect(history[0].id).toBe('JHN.3.16')
  })

  it('truncates stored verse text', () => {
    recordVerseView(verse('JHN.3.16', 'John 3:16', 'x'.repeat(500)))
    expect(getReadingHistory()[0].text.length).toBeLessThanOrEqual(160)
  })

  it('ignores entries without an id or reference', () => {
    recordVerseView(verse('', 'John 3:16'))
    recordVerseView({ id: 'X', reference: '', text: 'y' })
    expect(getReadingHistory()).toHaveLength(0)
  })

  it('removes and clears entries', () => {
    recordVerseView(verse('JHN.3.16'))
    recordVerseView(verse('PSA.23.1'))
    removeReadingHistory('JHN.3.16')
    expect(getReadingHistory().map((e) => e.id)).toEqual(['PSA.23.1'])
    clearReadingHistory()
    expect(getReadingHistory()).toHaveLength(0)
  })
})
