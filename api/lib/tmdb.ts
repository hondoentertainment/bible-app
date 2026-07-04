declare const process: { env: Record<string, string | undefined> }

import { rankByPartialMatch, scorePartialMatch } from './partialMatch.js'

export interface MovieSearchResult {
  id: string
  title: string
  year: string | null
  overview: string
  posterUrl: string | null
  letterboxdUrl: string
  tagline?: string | null
}

export function isTmdbConfigured(): boolean {
  return Boolean(process.env.TMDB_API_KEY)
}

function letterboxdSearchUrl(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug ? `https://letterboxd.com/search/${slug}/` : 'https://letterboxd.com/search/'
}

export async function searchMovies(query: string, limit = 10): Promise<MovieSearchResult[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) throw new Error('TMDB_NOT_CONFIGURED')

  const params = new URLSearchParams({
    api_key: apiKey,
    query,
    include_adult: 'false',
    language: 'en-US',
  })

  const response = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`)
  if (!response.ok) throw new Error('TMDB search failed')

  const data = (await response.json()) as {
    results?: Array<{
      id: number
      title: string
      release_date?: string
      overview?: string
      poster_path?: string | null
    }>
  }

  const movies = (data.results ?? []).map((movie) => mapMovie(movie))

  const ranked = rankByPartialMatch(movies, query.trim(), (m) => m.title)
  const minScore = query.trim().length >= 3 ? 15 : 0

  return ranked
    .filter((movie) => scorePartialMatch(movie.title, query.trim()) >= minScore)
    .slice(0, limit)
}

function mapMovie(
  movie: {
    id: number
    title: string
    release_date?: string
    overview?: string
    poster_path?: string | null
    tagline?: string
  },
): MovieSearchResult {
  return {
    id: String(movie.id),
    title: movie.title,
    year: movie.release_date?.slice(0, 4) ?? null,
    overview: movie.overview ?? '',
    posterUrl: movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : null,
    letterboxdUrl: letterboxdSearchUrl(movie.title),
    tagline: movie.tagline?.trim() || null,
  }
}

export async function getMovieDetails(id: string): Promise<MovieSearchResult | null> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) throw new Error('TMDB_NOT_CONFIGURED')

  const params = new URLSearchParams({ api_key: apiKey, language: 'en-US' })
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?${params}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error('TMDB details failed')

  const data = (await response.json()) as {
    id: number
    title: string
    release_date?: string
    overview?: string
    poster_path?: string | null
    tagline?: string
  }

  return mapMovie(data)
}
