declare const process: { env: Record<string, string | undefined> }

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) return null

  const data = (await response.json()) as { access_token: string; expires_in: number }
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  return data.access_token
}

export interface SpotifyTrackResult {
  id: string
  name: string
  artist: string
  album: string
  albumArtUrl: string | null
  previewUrl: string | null
  spotifyUrl: string
}

export async function searchSpotifyTracks(query: string, limit = 10): Promise<SpotifyTrackResult[]> {
  const token = await getSpotifyToken()
  if (!token) throw new Error('SPOTIFY_NOT_CONFIGURED')

  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: String(limit),
  })

  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error('Spotify search failed')

  const data = (await response.json()) as {
    tracks?: {
      items?: Array<{
        id: string
        name: string
        preview_url: string | null
        external_urls?: { spotify?: string }
        album?: { name?: string; images?: Array<{ url: string }> }
        artists?: Array<{ name: string }>
      }>
    }
  }

  return (data.tracks?.items ?? []).map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists?.map((a) => a.name).join(', ') ?? 'Unknown Artist',
    album: track.album?.name ?? '',
    albumArtUrl: track.album?.images?.[0]?.url ?? null,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
  }))
}

export function isSpotifyConfigured(): boolean {
  return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET)
}
