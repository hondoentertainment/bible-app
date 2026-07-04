import { isSpotifyConfigured } from '../lib/spotify'

interface VercelRequest {
  method?: string
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ configured: isSpotifyConfigured() })
}
