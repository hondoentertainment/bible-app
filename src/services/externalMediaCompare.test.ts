// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  compareBookToScripture,
  compareMovieToScripture,
  compareQuoteToScripture,
  searchBooks,
  searchMovies,
} from './externalMediaCompare'
import type { BookSearchResult, MovieSearchResult } from '../types/externalMedia'

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

/** Default fetch mock: resolves passages and returns empty media results. */
function defaultHandler(url: string): Response {
  if (url.includes('/passages/')) {
    const id = decodeURIComponent(url.split('/passages/')[1].split('?')[0])
    return jsonResponse({ data: { id, reference: id.replace(/\./g, ' '), content: `Text for ${id}` } })
  }
  return jsonResponse({}, 404)
}

function installFetch(handler: (url: string) => Response) {
  const spy = vi.fn(async (input: RequestInfo | URL) => handler(String(input)))
  vi.stubGlobal('fetch', spy)
  return spy
}

describe('compareQuoteToScripture', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it('matches themes in the quote and loads verses for each parallel', async () => {
    installFetch(defaultHandler)
    const quote =
      'Love is patient and kind. Even in fear there is hope, and love endures beyond all things.'
    const result = await compareQuoteToScripture(quote, 'A Reflection on Love')

    expect(result.title).toBe('A Reflection on Love')
    expect(result.parallels.length).toBeGreaterThan(0)
    expect(result.matchedTopics.some((t) => t.topicId === 'love')).toBe(true)
    // Verses were resolved for the parallels.
    expect(result.parallels[0].verses.length).toBeGreaterThan(0)
    expect(result.apiUnavailable).toBe(false)
  })

  it('respects the maxParallels option', async () => {
    installFetch(defaultHandler)
    const quote =
      'Love and hope and peace and joy and faith and mercy and grace fill this hopeful, joyful, faithful life.'
    const result = await compareQuoteToScripture(quote, 'Many Themes', { maxParallels: 2 })
    expect(result.parallels.length).toBeLessThanOrEqual(2)
  })

  it('defaults the title when none is provided', async () => {
    installFetch(defaultHandler)
    const result = await compareQuoteToScripture('Love covers a multitude of shortcomings.', '')
    expect(result.title).toBe('Your quote')
  })

  it('still resolves parallels (with empty verses) when passages are unavailable', async () => {
    installFetch((url) => {
      if (url.includes('/passages/')) return jsonResponse({ error: 'no key' }, 503)
      return jsonResponse({}, 404)
    })
    const result = await compareQuoteToScripture('Love and hope remain steadfast forever.', 'Quote')
    expect(result.parallels.length).toBeGreaterThan(0)
  })
})

describe('searchBooks / searchMovies', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns books from the API', async () => {
    const books: BookSearchResult[] = [
      { id: 'b1', title: 'Mere Christianity', authors: ['C.S. Lewis'], year: '1952', coverUrl: '', goodreadsUrl: '' },
    ]
    installFetch(() => jsonResponse({ books }))
    await expect(searchBooks('mere christianity')).resolves.toEqual(books)
  })

  it('throws a typed error when TMDB is not configured', async () => {
    installFetch(() => jsonResponse({ code: 'TMDB_NOT_CONFIGURED' }, 503))
    await expect(searchMovies('the matrix')).rejects.toThrow('TMDB_NOT_CONFIGURED')
  })

  it('throws on a generic movie search failure', async () => {
    installFetch(() => jsonResponse({ error: 'boom' }, 500))
    await expect(searchMovies('the matrix')).rejects.toThrow('Movie search failed')
  })
})

describe('compareBookToScripture', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it('builds a comparison from book details', async () => {
    installFetch((url) => {
      if (url.includes('/books/details')) {
        return jsonResponse({
          title: 'The Pilgrim',
          firstSentence: 'A journey of faith and hope begins.',
          description: 'A story about faith, hope, and perseverance through trials.',
        })
      }
      return defaultHandler(url)
    })

    const book: BookSearchResult = {
      id: 'b1',
      title: 'The Pilgrim',
      authors: ['John Bunyan'],
      year: '1678',
      coverUrl: '',
      goodreadsUrl: 'https://goodreads.com/x',
    }
    const result = await compareBookToScripture(book)

    expect(result.type).toBe('book')
    expect(result.creator).toBe('John Bunyan')
    expect(result.externalLabel).toBe('Goodreads')
    expect(result.descriptionUnavailable).toBe(false)
    expect(result.parallels.length).toBeGreaterThan(0)
  })

  it('marks description unavailable when details are missing', async () => {
    installFetch((url) => {
      if (url.includes('/books/details')) return jsonResponse({ error: 'not found' }, 404)
      return defaultHandler(url)
    })
    const book: BookSearchResult = {
      id: 'b2',
      title: 'Obscure Title',
      authors: [],
      year: null,
      coverUrl: '',
      goodreadsUrl: '',
    }
    const result = await compareBookToScripture(book)
    expect(result.descriptionUnavailable).toBe(true)
    expect(result.creator).toBe('Unknown author')
  })
})

describe('compareMovieToScripture', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it('returns descriptionUnavailable when a movie has no text to compare', async () => {
    const movie: MovieSearchResult = {
      id: 'm1',
      title: 'Silent Film',
      year: '1925',
      overview: '',
      tagline: '',
      posterUrl: '',
      letterboxdUrl: '',
    }
    installFetch((url) => {
      if (url.includes('/movies/details')) return jsonResponse({ movie })
      return defaultHandler(url)
    })

    const result = await compareMovieToScripture(movie)
    expect(result.type).toBe('movie')
    expect(result.descriptionUnavailable).toBe(true)
    expect(result.parallels).toEqual([])
  })
})
