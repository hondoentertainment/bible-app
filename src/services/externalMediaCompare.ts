import { TOPICS, searchTopics, type Topic } from '../data/topics'
import { extractCompareLines } from './textCompare'
import { fetchPassages } from './bibleApi'
import type {
  BookSearchResult,
  ExternalMediaCompareOptions,
  ExternalMediaComparisonResult,
  MovieSearchResult,
  QuoteComparisonResult,
} from '../types/externalMedia'
import { DEFAULT_EXTERNAL_COMPARE_OPTIONS } from '../types/externalMedia'
import type { TopicMatch } from '../types'
import type { LoadedParallel, ScriptureParallel } from '../types/media'

function scoreTextAgainstTopic(text: string, topic: Topic): number {
  const lower = text.toLowerCase()
  let score = 0
  for (const keyword of topic.keywords) {
    if (lower.includes(keyword.toLowerCase())) {
      score += keyword.includes(' ') ? 4 : 2
    }
  }
  if (lower.includes(topic.name.toLowerCase())) score += 3
  return score
}

function findBestLineForTopic(lines: string[], topic: Topic): string | null {
  let best: { line: string; score: number } | null = null
  for (const line of lines) {
    const score = scoreTextAgainstTopic(line, topic)
    if (score > 0 && (!best || score > best.score)) {
      best = { line, score }
    }
  }
  return best?.line ?? null
}

function buildTopicMatches(topics: Topic[]): TopicMatch[] {
  return topics.map((topic) => ({
    topicId: topic.id,
    topicName: topic.name,
    description: topic.description,
    score: 0,
    verseIds: topic.verseIds,
  }))
}

async function compareTextToScripture(
  text: string,
  title: string,
  kind: 'book' | 'movie' | 'song' | 'generic',
  options: ExternalMediaCompareOptions,
): Promise<{
  parallels: LoadedParallel[]
  matchedTopics: TopicMatch[]
  apiUnavailable: boolean
}> {
  const opts = { ...DEFAULT_EXTERNAL_COMPARE_OPTIONS, ...options }
  const maxParallels = opts.maxParallels!
  const versesPerParallel = opts.versesPerParallel!
  const maxTopics = opts.maxTopics!

  const lines = extractCompareLines(text, kind)
  const fullText = text.toLowerCase()

  const topicScores = TOPICS.map((topic) => ({
    topic,
    score: scoreTextAgainstTopic(fullText, topic),
  }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxTopics)

  const matchedTopics =
    topicScores.length > 0
      ? topicScores.map((t) => t.topic)
      : searchTopics(title).slice(0, Math.min(3, maxTopics))

  const parallels: ScriptureParallel[] = []
  const usedLines = new Set<string>()

  for (const topic of matchedTopics) {
    if (parallels.length >= maxParallels) break

    const mediaLine = findBestLineForTopic(lines, topic)
    if (!mediaLine || usedLines.has(mediaLine)) continue
    usedLines.add(mediaLine)

    parallels.push({
      id: `${topic.id}-${parallels.length}`,
      theme: topic.name,
      mediaLine: { text: mediaLine },
      verseIds: topic.verseIds.slice(0, versesPerParallel),
      connection: `${topic.description}. This ${title} touches on "${topic.name.toLowerCase()}" — a theme woven throughout Scripture.`,
    })
  }

  if (parallels.length === 0 && lines.length > 0) {
    const excerpt = lines.find((s) => s.length > 40) ?? lines[0]
    const fallbackTopic = matchedTopics[0] ?? TOPICS[0]
    parallels.push({
      id: 'fallback',
      theme: fallbackTopic.name,
      mediaLine: { text: excerpt },
      verseIds: fallbackTopic.verseIds.slice(0, versesPerParallel),
      connection: `Explore how "${title}" relates to ${fallbackTopic.name.toLowerCase()} in Scripture.`,
    })
  }

  const limitedParallels = parallels.slice(0, maxParallels)
  const loadedParallels: LoadedParallel[] = limitedParallels.map((p) => ({ ...p, verses: [] }))
  const allVerseIds = [...new Set(limitedParallels.flatMap((p) => p.verseIds))]
  let apiUnavailable = false

  try {
    const verses = await fetchPassages(allVerseIds)
    const verseById = Object.fromEntries(verses.map((v) => [v.id, v]))
    for (const parallel of loadedParallels) {
      parallel.verses = parallel.verseIds
        .map((id) => verseById[id])
        .filter((v): v is NonNullable<typeof v> => v !== undefined)
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'API_UNAVAILABLE') {
      apiUnavailable = true
    } else {
      throw err
    }
  }

  return {
    parallels: loadedParallels,
    matchedTopics: buildTopicMatches(matchedTopics),
    apiUnavailable,
  }
}

export async function compareQuoteToScripture(
  quoteText: string,
  title: string,
  options: ExternalMediaCompareOptions = {},
): Promise<QuoteComparisonResult> {
  const trimmed = quoteText.trim()
  const displayTitle = title.trim() || 'Your quote'

  const { parallels, matchedTopics, apiUnavailable } = await compareTextToScripture(
    trimmed,
    displayTitle,
    'generic',
    options,
  )

  return {
    title: displayTitle,
    quoteText: trimmed,
    parallels,
    matchedTopics,
    apiUnavailable,
  }
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('Book search failed')
  const data = (await response.json()) as { books: BookSearchResult[] }
  return data.books
}

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  const response = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`)

  if (response.status === 503) {
    const data = (await response.json()) as { code?: string }
    if (data.code === 'TMDB_NOT_CONFIGURED') {
      throw new Error('TMDB_NOT_CONFIGURED')
    }
  }

  if (!response.ok) throw new Error('Movie search failed')
  const data = (await response.json()) as { movies: MovieSearchResult[] }
  return data.movies
}

async function fetchBookDetailsClient(id: string): Promise<{
  description: string
  firstSentence: string
  title: string
}> {
  const response = await fetch(`/api/books/details?id=${encodeURIComponent(id)}`)
  if (response.status === 404) throw new Error('DESCRIPTION_NOT_FOUND')
  if (!response.ok) throw new Error('Book details lookup failed')
  return (await response.json()) as { description: string; firstSentence: string; title: string }
}

export async function fetchMovieDetails(id: string): Promise<MovieSearchResult> {
  const response = await fetch(`/api/movies/details?id=${encodeURIComponent(id)}`)
  if (response.status === 404) throw new Error('MOVIE_NOT_FOUND')
  if (!response.ok) throw new Error('Movie details lookup failed')
  const data = (await response.json()) as { movie: MovieSearchResult }
  return data.movie
}

function buildMovieCompareText(movie: MovieSearchResult): string {
  const parts = [movie.tagline, movie.overview].filter((p) => p && p.trim())
  return parts.join('\n\n')
}

export async function compareBookToScripture(
  book: BookSearchResult,
  options: ExternalMediaCompareOptions = {},
): Promise<ExternalMediaComparisonResult> {
  let description = ''
  let firstSentence = ''
  let descriptionUnavailable = false

  try {
    const details = await fetchBookDetailsClient(book.id)
    description = details.description
    firstSentence = details.firstSentence
  } catch (err) {
    if (err instanceof Error && err.message === 'DESCRIPTION_NOT_FOUND') {
      descriptionUnavailable = true
    } else {
      throw err
    }
  }

  const creator = book.authors.join(', ') || 'Unknown author'
  const compareText =
    [firstSentence, description].filter(Boolean).join('\n\n') || `${book.title} by ${creator}`

  const { parallels, matchedTopics, apiUnavailable } = await compareTextToScripture(
    compareText,
    book.title,
    'book',
    options,
  )

  return {
    type: 'book',
    title: book.title,
    creator,
    year: book.year,
    summary: (description || firstSentence).slice(0, 280) || `Compare themes in ${book.title} with Scripture.`,
    coverUrl: book.coverUrl,
    externalUrl: book.goodreadsUrl,
    externalLabel: 'Goodreads',
    parallels,
    matchedTopics,
    apiUnavailable,
    descriptionUnavailable,
  }
}

export async function compareMovieToScripture(
  movie: MovieSearchResult,
  options: ExternalMediaCompareOptions = {},
): Promise<ExternalMediaComparisonResult> {
  let resolved = movie
  try {
    resolved = await fetchMovieDetails(movie.id)
  } catch {
    // use search result if details fail
  }

  const creator = resolved.year ? `Released ${resolved.year}` : ''
  const compareText = buildMovieCompareText(resolved)

  if (!compareText.trim()) {
    return {
      type: 'movie',
      title: resolved.title,
      creator,
      year: resolved.year,
      summary: `Compare themes in ${resolved.title} with Scripture.`,
      coverUrl: resolved.posterUrl,
      externalUrl: resolved.letterboxdUrl,
      externalLabel: 'Letterboxd',
      parallels: [],
      matchedTopics: [],
      descriptionUnavailable: true,
    }
  }

  const { parallels, matchedTopics, apiUnavailable } = await compareTextToScripture(
    compareText,
    resolved.title,
    'movie',
    options,
  )

  return {
    type: 'movie',
    title: resolved.title,
    creator,
    year: resolved.year,
    summary: compareText.slice(0, 280),
    coverUrl: resolved.posterUrl,
    externalUrl: resolved.letterboxdUrl,
    externalLabel: 'Letterboxd',
    parallels,
    matchedTopics,
    apiUnavailable,
  }
}
