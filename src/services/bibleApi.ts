import { NIV_BIBLE_ID, searchTopics, type Topic } from '../data/topics'
import type { BibleSearchResponse, SearchResult, TopicMatch, Verse } from '../types'

const API_BASE = '/api/bible'
const verseCache = new Map<string, Verse>()

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)]
}

async function bibleFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)

  if (response.status === 503) {
    throw new Error('API_KEY_MISSING')
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Bible API error (${response.status})`)
  }

  return response.json() as Promise<T>
}

export function hasApiKeyConfigured(): boolean {
  return Boolean(import.meta.env.VITE_BIBLE_API_KEY)
}

export async function fetchPassage(passageId: string): Promise<Verse> {
  const cached = verseCache.get(passageId)
  if (cached) return cached

  const data = await bibleFetch<{
    data?: {
      id?: string
      reference?: string
      content?: string
      text?: string
    }
  }>(
    `/bibles/${NIV_BIBLE_ID}/passages/${encodeURIComponent(passageId)}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true`,
  )

  const verse: Verse = {
    id: data.data?.id ?? passageId,
    reference: data.data?.reference ?? passageId,
    text: stripHtml(data.data?.content ?? data.data?.text ?? ''),
  }

  verseCache.set(passageId, verse)
  return verse
}

export async function fetchPassages(passageIds: string[]): Promise<Verse[]> {
  const results = await Promise.allSettled(passageIds.map((id) => fetchPassage(id)))

  return results
    .filter((result): result is PromiseFulfilledResult<Verse> => result.status === 'fulfilled')
    .map((result) => result.value)
}

export async function searchBibleText(query: string, limit = 20): Promise<Verse[]> {
  const data = await bibleFetch<BibleSearchResponse>(
    `/bibles/${NIV_BIBLE_ID}/search?query=${encodeURIComponent(query)}&limit=${limit}&sort=relevance`,
  )

  return (data.data?.verses ?? []).map((verse) => ({
    id: verse.id,
    reference: verse.reference ?? verse.id,
    text: stripHtml(verse.content ?? verse.text ?? ''),
  }))
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

export async function searchBySubject(query: string): Promise<SearchResult> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { verses: [], matchedTopics: [], query: trimmed, source: 'topics' }
  }

  const matchedTopics = searchTopics(trimmed)
  const topicVerseIds = uniqueIds(matchedTopics.flatMap((topic) => topic.verseIds))

  let apiVerses: Verse[] = []
  let topicVerses: Verse[] = []

  if (hasApiKeyConfigured()) {
    const [topicResults, apiResults] = await Promise.allSettled([
      fetchPassages(topicVerseIds.slice(0, 24)),
      searchBibleText(trimmed, 15),
    ])

    if (topicResults.status === 'fulfilled') topicVerses = topicResults.value
    if (apiResults.status === 'fulfilled') apiVerses = apiResults.value
  }

  const seen = new Set<string>()
  const verses: Verse[] = []

  for (const verse of [...topicVerses, ...apiVerses]) {
    if (seen.has(verse.id)) continue
    seen.add(verse.id)
    verses.push(verse)
  }

  const source: SearchResult['source'] =
    topicVerses.length > 0 && apiVerses.length > 0
      ? 'both'
      : apiVerses.length > 0
        ? 'api'
        : 'topics'

  return {
    verses,
    matchedTopics: buildTopicMatches(matchedTopics),
    query: trimmed,
    source,
  }
}

export async function getTopicVerses(topicId: string): Promise<SearchResult> {
  const topic = searchTopics(topicId)[0]
  if (!topic) {
    return { verses: [], matchedTopics: [], query: topicId, source: 'topics' }
  }

  let verses: Verse[] = []
  if (hasApiKeyConfigured()) {
    verses = await fetchPassages(topic.verseIds)
  }

  return {
    verses,
    matchedTopics: buildTopicMatches([topic]),
    query: topic.name,
    source: 'topics',
  }
}
