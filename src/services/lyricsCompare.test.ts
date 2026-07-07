// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  compareLyricsToScripture,
  compareTrackFromSpotify,
  fetchTrackLyrics,
  getSpotifyStatus,
  searchSpotify,
} from './lyricsCompare'
import type { SpotifyTrackResult } from '../types/lyrics'

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

function passageHandler(url: string): Response {
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

const track: SpotifyTrackResult = {
  id: 't1',
  name: 'Amazing Grace',
  artist: 'Traditional',
  album: 'Hymns',
  albumArtUrl: null,
  previewUrl: null,
  spotifyUrl: 'https://open.spotify.com/track/t1',
}

describe('spotify + lyrics API wrappers', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('throws a typed error when Spotify is not configured', async () => {
    installFetch(() => jsonResponse({ code: 'SPOTIFY_NOT_CONFIGURED' }, 503))
    await expect(searchSpotify('grace')).rejects.toThrow('SPOTIFY_NOT_CONFIGURED')
  })

  it('reports Spotify unconfigured via status check', async () => {
    installFetch(() => jsonResponse({ code: 'SPOTIFY_NOT_CONFIGURED' }, 503))
    await expect(getSpotifyStatus()).resolves.toBe(false)
  })

  it('returns tracks on a successful search', async () => {
    installFetch(() => jsonResponse({ tracks: [track], configured: true }))
    await expect(searchSpotify('grace')).resolves.toEqual([track])
  })

  it('throws LYRICS_NOT_FOUND on a 404', async () => {
    installFetch(() => jsonResponse({ error: 'missing' }, 404))
    await expect(fetchTrackLyrics('Traditional', 'Amazing Grace')).rejects.toThrow('LYRICS_NOT_FOUND')
  })
})

describe('compareLyricsToScripture', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it('matches themes and resolves verses for parallels', async () => {
    installFetch(passageHandler)
    const lyrics =
      'Amazing grace how sweet the sound\nMy fears were relieved by hope and love\nThrough grace I am found and loved'
    const result = await compareLyricsToScripture(track, lyrics)

    expect(result.track.name).toBe('Amazing Grace')
    expect(result.parallels.length).toBeGreaterThan(0)
    expect(result.matchedTopics.length).toBeGreaterThan(0)
    expect(result.parallels[0].verses.length).toBeGreaterThan(0)
  })

  it('honors the maxParallels option', async () => {
    installFetch(passageHandler)
    const lyrics = 'love hope peace joy faith grace mercy\nhopeful joyful faithful loving peaceful'
    const result = await compareLyricsToScripture(track, lyrics, { maxParallels: 1 })
    expect(result.parallels.length).toBeLessThanOrEqual(1)
  })
})

describe('compareTrackFromSpotify', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it('flags lyricsUnavailable when lyrics are missing', async () => {
    installFetch((url) => {
      if (url.includes('/api/lyrics')) return jsonResponse({ error: 'missing' }, 404)
      return passageHandler(url)
    })
    const result = await compareTrackFromSpotify(track)
    expect(result.lyricsUnavailable).toBe(true)
    expect(result.parallels).toEqual([])
  })

  it('produces a full comparison when lyrics are found', async () => {
    installFetch((url) => {
      if (url.includes('/api/lyrics')) {
        return jsonResponse({ plainLyrics: 'grace and love and hope abound in this song of faith' })
      }
      return passageHandler(url)
    })
    const result = await compareTrackFromSpotify(track)
    expect(result.lyricsUnavailable).toBeFalsy()
    expect(result.parallels.length).toBeGreaterThan(0)
  })
})
