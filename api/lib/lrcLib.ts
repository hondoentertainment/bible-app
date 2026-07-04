export interface LyricsResult {
  plainLyrics: string
  syncedLyrics: string | null
  source: 'lrclib'
}

const LRCLIB_HEADERS = {
  'User-Agent': 'ScriptureSearch/1.0 (https://github.com/hondoentertainment/bible-app)',
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function partialWordMatch(needle: string, haystack: string): boolean {
  return (
    needle.length >= 2 &&
    (haystack.includes(needle) ||
      haystack.split(' ').some((part) => part.startsWith(needle) || needle.startsWith(part)))
  )
}

function isLikelyMatch(
  result: { artistName?: string; trackName?: string },
  artist: string,
  track: string,
): boolean {
  const artistNorm = normalize(artist)
  const trackNorm = normalize(track)
  const resultArtist = normalize(result.artistName ?? '')
  const resultTrack = normalize(result.trackName ?? '')

  const artistMatch =
    !artistNorm ||
    resultArtist.includes(artistNorm) ||
    artistNorm.includes(resultArtist) ||
    artistNorm.split(' ').some((part) => partialWordMatch(part, resultArtist))

  const trackMatch =
    !trackNorm ||
    resultTrack.includes(trackNorm) ||
    trackNorm.includes(resultTrack) ||
    trackNorm.split(' ').some((part) => partialWordMatch(part, resultTrack))

  if (artistNorm && trackNorm) return artistMatch && trackMatch
  return artistMatch || trackMatch
}

export async function fetchLyrics(artist: string, track: string): Promise<LyricsResult | null> {
  const params = new URLSearchParams({
    artist_name: artist,
    track_name: track,
  })

  const direct = await fetch(`https://lrclib.net/api/get?${params}`, {
    headers: LRCLIB_HEADERS,
  })
  if (direct.ok) {
    const data = (await direct.json()) as { plainLyrics?: string; syncedLyrics?: string }
    if (data.plainLyrics) {
      return {
        plainLyrics: data.plainLyrics,
        syncedLyrics: data.syncedLyrics ?? null,
        source: 'lrclib',
      }
    }
  }

  const search = await fetch(
    `https://lrclib.net/api/search?q=${encodeURIComponent(`${artist} ${track}`.trim())}`,
    { headers: LRCLIB_HEADERS },
  )
  if (!search.ok) return null

  const results = (await search.json()) as Array<{
    plainLyrics?: string
    syncedLyrics?: string
    artistName?: string
    trackName?: string
  }>

  const match =
    results.find((r) => r.plainLyrics && isLikelyMatch(r, artist, track)) ??
    results.find(
      (r) =>
        r.plainLyrics &&
        (partialWordMatch(normalize(track), normalize(r.trackName ?? '')) ||
          partialWordMatch(normalize(artist), normalize(r.artistName ?? ''))),
    ) ??
    results.find((r) => r.plainLyrics)

  if (!match?.plainLyrics) return null

  return {
    plainLyrics: match.plainLyrics,
    syncedLyrics: match.syncedLyrics ?? null,
    source: 'lrclib',
  }
}
