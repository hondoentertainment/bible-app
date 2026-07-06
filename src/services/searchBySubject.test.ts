// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { searchBySubject } from './bibleApi'

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

/** Fetch mock that mimics API.Bible passage + search endpoints. */
function installFetch(handler: (url: string) => Response) {
  const spy = vi.fn(async (input: RequestInfo | URL) => handler(String(input)))
  vi.stubGlobal('fetch', spy)
  return spy
}

const passageHandler = (url: string): Response => {
  if (url.includes('/passages/')) {
    const id = decodeURIComponent(url.split('/passages/')[1].split('?')[0])
    return jsonResponse({ data: { id, reference: id.replace(/\./g, ' '), content: `Text for ${id}` } })
  }
  if (url.includes('/search?')) {
    return jsonResponse({
      data: { verses: [{ id: 'PRO.3.5', reference: 'Proverbs 3:5', content: 'Trust in the Lord.' }] },
    })
  }
  return jsonResponse({}, 404)
}

describe('searchBySubject', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns empty result for a blank query without hitting the network', async () => {
    const spy = installFetch(passageHandler)
    const result = await searchBySubject('   ')
    expect(result.verses).toEqual([])
    expect(result.matchedTopics).toEqual([])
    expect(spy).not.toHaveBeenCalled()
  })

  it('combines curated topic verses and full-text results for a subject', async () => {
    installFetch(passageHandler)
    const result = await searchBySubject('love')

    expect(result.matchedTopics.some((t) => t.topicId === 'love')).toBe(true)
    expect(result.verses.length).toBeGreaterThan(0)
    // Curated verses (topics) + the mocked full-text verse (api) => source 'both'.
    expect(result.source).toBe('both')
    expect(result.verses.some((v) => v.source === 'topics')).toBe(true)
    expect(result.verses.some((v) => v.source === 'api')).toBe(true)
  })

  it('routes a scripture reference to a single passage lookup', async () => {
    const spy = installFetch(passageHandler)
    const result = await searchBySubject('John 3:16')

    expect(result.source).toBe('api')
    expect(result.matchedTopics).toEqual([])
    expect(result.verses).toHaveLength(1)
    expect(result.verses[0].source).toBe('reference')
    // Only the single passage endpoint should have been queried.
    const urls = spy.mock.calls.map((c) => String(c[0]))
    expect(urls.every((u) => u.includes('/passages/'))).toBe(true)
  })

  it('deduplicates verses that appear in both curated and full-text sources', async () => {
    // Force the full-text search to echo a verse id that is also a curated verse.
    installFetch((url) => {
      if (url.includes('/search?')) {
        return jsonResponse({
          data: { verses: [{ id: 'JHN.3.16', reference: 'John 3:16', content: 'For God so loved...' }] },
        })
      }
      return passageHandler(url)
    })

    const result = await searchBySubject('love')
    const ids = result.verses.map((v) => v.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('flags apiUnavailable when the backend returns 503', async () => {
    installFetch(() => jsonResponse({ error: 'unconfigured' }, 503))
    const result = await searchBySubject('hope')

    expect(result.apiUnavailable).toBe(true)
    expect(result.verses).toEqual([])
    // Topics still matched so the UI can show references.
    expect(result.matchedTopics.length).toBeGreaterThan(0)
  })
})
