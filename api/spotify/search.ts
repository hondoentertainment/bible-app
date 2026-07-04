import { isSpotifyConfigured, searchSpotifyTracks } from '../lib/spotify'

declare const process: { env: Record<string, string | undefined> }

interface VercelRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isSpotifyConfigured()) {
    return res.status(503).json({ error: 'Spotify API not configured', code: 'SPOTIFY_NOT_CONFIGURED' })
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' })
  }

  try {
    const tracks = await searchSpotifyTracks(q)
    return res.status(200).json({ tracks, configured: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed'
    return res.status(502).json({ error: message })
  }
}
