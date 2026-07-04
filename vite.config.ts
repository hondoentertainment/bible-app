import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

function bibleApiProxy(apiKey: string | undefined) {
  return {
    name: 'bible-api-proxy',
    configureServer(server: { middlewares: { use: (path: string, handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use('/api/bible', async (req, res, next) => {
        if (!apiKey) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing BIBLE_API_KEY in .env' }))
          return
        }

        const path = req.url ?? '/'
        const url = `https://api.scripture.api.bible/v1${path}`

        try {
          const response = await fetch(url, {
            headers: {
              'api-key': apiKey,
              Accept: 'application/json',
            },
          })

          const body = await response.text()
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(body)
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), bibleApiProxy(env.BIBLE_API_KEY)],
  }
})
