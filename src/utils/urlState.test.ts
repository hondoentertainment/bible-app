// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { readAppUrlState, writeAppUrlState } from './urlState'

function setSearch(search: string) {
  window.history.replaceState(null, '', search || window.location.pathname)
}

describe('readAppUrlState', () => {
  beforeEach(() => setSearch(''))

  it('defaults to the subjects mode with empty fields', () => {
    const state = readAppUrlState()
    expect(state).toEqual({
      mode: 'subjects',
      q: '',
      storyId: '',
      artist: '',
      track: '',
      quoteTitle: '',
      quoteText: '',
    })
  })

  it('falls back to subjects for an invalid mode', () => {
    setSearch('?mode=bogus')
    expect(readAppUrlState().mode).toBe('subjects')
  })

  it('parses a lyrics deep link', () => {
    setSearch('?mode=lyrics&artist=Hillsong&track=Oceans')
    const state = readAppUrlState()
    expect(state.mode).toBe('lyrics')
    expect(state.artist).toBe('Hillsong')
    expect(state.track).toBe('Oceans')
  })
})

describe('writeAppUrlState / readAppUrlState round trip', () => {
  beforeEach(() => setSearch(''))

  it('omits the mode param for the default subjects mode', () => {
    writeAppUrlState({ mode: 'subjects', q: 'hope' })
    expect(window.location.search).toBe('?q=hope')
    expect(readAppUrlState().q).toBe('hope')
  })

  it('serializes a story deep link', () => {
    writeAppUrlState({ mode: 'stories', storyId: 'prodigal-son' })
    const state = readAppUrlState()
    expect(state.mode).toBe('stories')
    expect(state.storyId).toBe('prodigal-son')
  })

  it('encodes and restores quote text losslessly', () => {
    const quoteText = 'To be, or not to be — that is the question.'
    writeAppUrlState({ mode: 'quote', quoteTitle: 'Hamlet', quoteText })
    const state = readAppUrlState()
    expect(state.mode).toBe('quote')
    expect(state.quoteTitle).toBe('Hamlet')
    expect(state.quoteText).toBe(quoteText)
  })

  it('drops overly long quotes from the URL', () => {
    const longQuote = 'a'.repeat(4000)
    writeAppUrlState({ mode: 'quote', quoteText: longQuote })
    expect(window.location.search).not.toContain('quote=')
  })
})
