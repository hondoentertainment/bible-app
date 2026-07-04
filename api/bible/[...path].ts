declare const process: { env: Record<string, string | undefined> }

interface VercelRequest {
  method?: string
  url?: string
  query: Record<string, string | string[] | undefined>
  headers: Record<string, string | string[] | undefined>
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => VercelResponse
  send: (body: string) => void
  json: (body: unknown) => void
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.BIBLE_API_KEY

  if (!apiKey) {
    return res.status(503).json({ error: 'Bible API key not configured on server' })
  }

  const pathParam = req.query.path
  const segments = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : []
  const apiPath = `/${segments.join('/')}`

  const queryIndex = req.url?.indexOf('?') ?? -1
  const query = queryIndex >= 0 ? req.url!.slice(queryIndex) : ''

  try {
    const response = await fetch(`https://api.scripture.api.bible/v1${apiPath}${query}`, {
      headers: {
        'api-key': apiKey,
        Accept: 'application/json',
      },
    })

    const body = await response.text()
    res.status(response.status).setHeader('Content-Type', 'application/json').send(body)
  } catch {
    res.status(502).json({ error: 'Bible API request failed' })
  }
}
