import { isTmdbConfigured, searchTv } from '../lib/tmdb.js'

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

  if (!isTmdbConfigured()) {
    return res.status(503).json({ error: 'TMDB API not configured', code: 'TMDB_NOT_CONFIGURED' })
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' })
  }

  try {
    const shows = await searchTv(q)
    return res.status(200).json({ shows, configured: true })
  } catch {
    return res.status(502).json({ error: 'TV search failed' })
  }
}
