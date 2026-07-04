import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { fetchLyrics } from './api/lib/lrcLib.ts'
import { isSpotifyConfigured, searchSpotifyTracks } from './api/lib/spotify.ts'

function jsonResponse(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function readQueryParam(url: string, key: string): Promise<string> {
  const q = url.includes('?') ? url.slice(url.indexOf('?') + 1) : ''
  return new URLSearchParams(q).get(key)?.trim() ?? ''
}

function devApiPlugin(env: Record<string, string>) {
  Object.assign(process.env, env)

  return {
    name: 'dev-api',
    configureServer(server: {
      middlewares: {
        use: (path: string, handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void
      }
    }) {
      server.middlewares.use('/api/bible', async (req, res, next) => {
        const apiKey = env.BIBLE_API_KEY
        if (!apiKey) {
          return jsonResponse(res, 503, { error: 'Missing BIBLE_API_KEY in .env' })
        }

        const path = req.url ?? '/'
        const url = `https://api.scripture.api.bible/v1${path}`

        try {
          const response = await fetch(url, {
            headers: { 'api-key': apiKey, Accept: 'application/json' },
          })
          const body = await response.text()
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(body)
        } catch {
          next()
        }
      })

      server.middlewares.use('/api/spotify/status', async (_req, res) => {
        jsonResponse(res, 200, { configured: isSpotifyConfigured() })
      })

      server.middlewares.use('/api/spotify/search', async (req, res) => {
        if (!isSpotifyConfigured()) {
          return jsonResponse(res, 503, { error: 'Spotify API not configured', code: 'SPOTIFY_NOT_CONFIGURED' })
        }

        const q = await readQueryParam(req.url ?? '', 'q')
        if (!q) return jsonResponse(res, 400, { error: 'Query parameter q is required' })

        try {
          const tracks = await searchSpotifyTracks(q)
          jsonResponse(res, 200, { tracks, configured: true })
        } catch {
          jsonResponse(res, 502, { error: 'Spotify search failed' })
        }
      })

      server.middlewares.use('/api/lyrics', async (req, res) => {
        const artist = await readQueryParam(req.url ?? '', 'artist')
        const track = await readQueryParam(req.url ?? '', 'track')
        if (!artist || !track) {
          return jsonResponse(res, 400, { error: 'artist and track parameters are required' })
        }

        try {
          const lyrics = await fetchLyrics(artist, track)
          if (!lyrics) {
            return jsonResponse(res, 404, { error: 'Lyrics not found', code: 'LYRICS_NOT_FOUND' })
          }
          jsonResponse(res, 200, lyrics)
        } catch {
          jsonResponse(res, 502, { error: 'Lyrics lookup failed' })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      devApiPlugin(env),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'pwa-icon.svg'],
        manifest: {
          name: 'Scripture Search — NIV Bible App',
          short_name: 'Scripture',
          description: 'Search NIV verses by subject, explore stories paired with Scripture, and compare lyrics to biblical themes.',
          theme_color: '#1a2744',
          background_color: '#f7f2e8',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/pwa-icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/pwa-icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
          navigateFallback: '/index.html',
        },
      }),
    ],
  }
})
