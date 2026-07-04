import { searchBooks } from '../lib/openLibrary.js'

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

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' })
  }

  try {
    const books = await searchBooks(q)
    return res.status(200).json({ books, configured: true })
  } catch {
    return res.status(502).json({ error: 'Book search failed' })
  }
}
