import { fetchLyrics } from './lib/lrcLib.js'

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

  const artist = typeof req.query.artist === 'string' ? req.query.artist.trim() : ''
  const track = typeof req.query.track === 'string' ? req.query.track.trim() : ''

  if (!artist || !track) {
    return res.status(400).json({ error: 'artist and track parameters are required' })
  }

  try {
    const lyrics = await fetchLyrics(artist, track)
    if (!lyrics) {
      return res.status(404).json({ error: 'Lyrics not found', code: 'LYRICS_NOT_FOUND' })
    }
    return res.status(200).json(lyrics)
  } catch {
    return res.status(502).json({ error: 'Lyrics lookup failed' })
  }
}
