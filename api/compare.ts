import { BIBLICAL_THEMES } from '../src/data/biblical-themes'
import type { ComparisonResult, MediaItem, ThemeMatch } from '../src/types'

interface VercelRequest {
  method?: string
  body?: unknown
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

const THEME_LIST = BIBLICAL_THEMES.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
}))

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'AI analysis not configured' })
  }

  const media = req.body as MediaItem
  if (!media?.title || !media?.type) {
    return res.status(400).json({ error: 'Title and type are required' })
  }

  const typeLabel = { book: 'book', song: 'song', movie: 'movie' }[media.type]

  const prompt = `You are a thoughtful Christian literary and media analyst. Analyze the following ${typeLabel} against biblical themes.

Title: "${media.title}"
${media.description ? `Description: ${media.description}` : ''}

Available biblical themes (use these IDs exactly):
${JSON.stringify(THEME_LIST, null, 2)}

Respond with ONLY valid JSON in this exact shape:
{
  "summary": "2-3 sentence overview of how this work relates to biblical themes",
  "themes": [
    {
      "themeId": "one of the theme ids above",
      "alignment": "strong" | "moderate" | "weak" | "contrast",
      "explanation": "2-3 sentences connecting this specific work to the theme",
      "mediaExamples": ["optional quote or scene reference from the work"]
    }
  ],
  "cautions": ["optional array of theological or content cautions"]
}

Include 3-6 themes, ordered by relevance. Be specific to "${media.title}", not generic.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'AI provider error' })
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return res.status(502).json({ error: 'Empty AI response' })
    }

    const parsed = JSON.parse(content) as {
      summary: string
      themes: Array<{
        themeId: string
        alignment: ThemeMatch['alignment']
        explanation: string
        mediaExamples?: string[]
      }>
      cautions?: string[]
    }

    const themeById = Object.fromEntries(BIBLICAL_THEMES.map((t) => [t.id, t]))

    const themes: ThemeMatch[] = parsed.themes
      .filter((t) => themeById[t.themeId])
      .map((t) => ({
        theme: themeById[t.themeId],
        alignment: t.alignment,
        relevance: t.alignment === 'strong' ? 5 : t.alignment === 'moderate' ? 3 : 1,
        explanation: t.explanation,
        mediaExamples: t.mediaExamples ?? [],
      }))

    const result: ComparisonResult = {
      media,
      summary: parsed.summary,
      themes,
      cautions: parsed.cautions,
      source: 'ai',
    }

    return res.status(200).json(result)
  } catch {
    return res.status(500).json({ error: 'Analysis failed' })
  }
}
