import { fetchBookDetails } from '../lib/openLibrary.js'

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
    const details = await fetchBookDetails(id)
    if (!details.description && !details.firstSentence && !details.title) {
      return res.status(404).json({ error: 'Description not found', code: 'DESCRIPTION_NOT_FOUND' })
    }
    return res.status(200).json(details)
  } catch {
    return res.status(502).json({ error: 'Book details lookup failed' })
  }
}
