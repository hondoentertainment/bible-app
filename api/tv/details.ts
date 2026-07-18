import { getTvDetails } from '../lib/tmdb.js'

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

  const id = typeof req.query.id === 'string' ? req.query.id.trim() : ''
  if (!id) {
    return res.status(400).json({ error: 'Query parameter id is required' })
  }

  try {
    const show = await getTvDetails(id)
    if (!show) {
      return res.status(404).json({ error: 'TV show not found', code: 'TV_NOT_FOUND' })
    }
    return res.status(200).json({ show })
  } catch {
    return res.status(502).json({ error: 'TV details lookup failed' })
  }
}
