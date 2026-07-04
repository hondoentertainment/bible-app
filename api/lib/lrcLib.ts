export interface LyricsResult {
  plainLyrics: string
  syncedLyrics: string | null
  source: 'lrclib'
}

export async function fetchLyrics(artist: string, track: string): Promise<LyricsResult | null> {
  const params = new URLSearchParams({
    artist_name: artist,
    track_name: track,
  })

  const direct = await fetch(`https://lrclib.net/api/get?${params}`)
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
    `https://lrclib.net/api/search?q=${encodeURIComponent(`${artist} ${track}`)}`,
  )
  if (!search.ok) return null

  const results = (await search.json()) as Array<{
    plainLyrics?: string
    syncedLyrics?: string
    artistName?: string
    trackName?: string
  }>

  const match = results.find(
    (r) =>
      r.plainLyrics &&
      r.trackName?.toLowerCase().includes(track.toLowerCase().slice(0, 8)),
  ) ?? results.find((r) => r.plainLyrics)

  if (!match?.plainLyrics) return null

  return {
    plainLyrics: match.plainLyrics,
    syncedLyrics: match.syncedLyrics ?? null,
    source: 'lrclib',
  }
}
