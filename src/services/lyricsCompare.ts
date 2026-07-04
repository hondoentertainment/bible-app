import { TOPICS, searchTopics, type Topic } from '../data/topics'
import { fetchPassages } from './bibleApi'
import type { SpotifyTrackResult } from '../types/lyrics'
import type { LyricScriptureParallel, LyricsComparisonResult, ManualTrackInput, CompareOptions } from '../types/lyrics'
import { DEFAULT_COMPARE_OPTIONS } from '../types/lyrics'
import type { TopicMatch } from '../types'

export interface SpotifySearchResponse {
  tracks: SpotifyTrackResult[]
  configured: boolean
}

export interface SpotifyStatusResponse {
  configured: boolean
}

export async function getSpotifyStatus(): Promise<boolean> {
  try {
    const response = await fetch('/api/spotify/search?q=test')
    if (response.status === 503) {
      const data = (await response.json()) as { code?: string }
      return data.code !== 'SPOTIFY_NOT_CONFIGURED'
    }
    return response.ok || response.status === 502
  } catch {
    return false
  }
}

export async function searchSpotify(query: string): Promise<SpotifyTrackResult[]> {
  const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`)

  if (response.status === 503) {
    const data = (await response.json()) as { code?: string }
    if (data.code === 'SPOTIFY_NOT_CONFIGURED') {
      throw new Error('SPOTIFY_NOT_CONFIGURED')
    }
  }

  if (!response.ok) {
    throw new Error('Spotify search failed')
  }

  const data = (await response.json()) as SpotifySearchResponse
  return data.tracks
}

export async function fetchTrackLyrics(artist: string, track: string): Promise<string> {
  const params = new URLSearchParams({ artist, track })
  const response = await fetch(`/api/lyrics?${params}`)

  if (response.status === 404) {
    throw new Error('LYRICS_NOT_FOUND')
  }

  if (!response.ok) {
    throw new Error('Lyrics lookup failed')
  }

  const data = (await response.json()) as { plainLyrics: string }
  return data.plainLyrics
}

function scoreLineAgainstTopic(line: string, topic: Topic): number {
  const lower = line.toLowerCase()
  let score = 0
  for (const keyword of topic.keywords) {
    if (lower.includes(keyword.toLowerCase())) {
      score += keyword.includes(' ') ? 3 : 1
    }
  }
  if (lower.includes(topic.name.toLowerCase())) score += 2
  return score
}

function findBestLineForTopic(lines: string[], topic: Topic): string | null {
  let best: { line: string; score: number } | null = null
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length < 8) continue
    const score = scoreLineAgainstTopic(trimmed, topic)
    if (score > 0 && (!best || score > best.score)) {
      best = { line: trimmed, score }
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

function toTrackResult(input: ManualTrackInput): SpotifyTrackResult {
  return {
    id: `manual-${input.name}-${input.artist}`.replace(/\s+/g, '-').toLowerCase(),
    name: input.name,
    artist: input.artist,
    album: input.album ?? '',
    albumArtUrl: input.albumArtUrl ?? null,
    previewUrl: null,
    spotifyUrl: input.spotifyUrl ?? '',
  }
}

export async function compareLyricsToScripture(
  trackInput: SpotifyTrackResult | ManualTrackInput,
  lyrics: string,
  options: CompareOptions = {},
): Promise<LyricsComparisonResult> {
  const { maxParallels, versesPerParallel, maxTopics } = {
    ...DEFAULT_COMPARE_OPTIONS,
    ...options,
  }

  const track = 'id' in trackInput && 'spotifyUrl' in trackInput
    ? trackInput as SpotifyTrackResult
    : toTrackResult(trackInput as ManualTrackInput)

  const lines = lyrics.split(/\n/).map((l) => l.trim()).filter(Boolean)

  const topicScores = TOPICS.map((topic) => {
    const fullText = lyrics.toLowerCase()
    let score = 0
    for (const keyword of topic.keywords) {
      const kw = keyword.toLowerCase()
      if (fullText.includes(kw)) score += kw.includes(' ') ? 4 : 2
    }
    return { topic, score }
  })
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxTopics)

  const matchedTopics = topicScores.length > 0
    ? topicScores.map((t) => t.topic)
    : searchTopics(track.name).slice(0, Math.min(3, maxTopics))

  const parallels: LyricScriptureParallel[] = []
  const usedLines = new Set<string>()

  for (const topic of matchedTopics) {
    if (parallels.length >= maxParallels) break

    const lyricLine = findBestLineForTopic(lines, topic)
    if (!lyricLine || usedLines.has(lyricLine)) continue
    usedLines.add(lyricLine)

    parallels.push({
      id: `${topic.id}-${parallels.length}`,
      lyricLine,
      theme: topic.name,
      topicId: topic.id,
      connection: `${topic.description}. This lyric touches on "${topic.name.toLowerCase()}" — a theme woven throughout Scripture.`,
      verseIds: topic.verseIds.slice(0, versesPerParallel),
      verses: [],
    })
  }

  if (parallels.length === 0 && lines.length > 0) {
    const chorus = lines.find((l) => l.length > 20) ?? lines[0]
    const fallbackTopic = matchedTopics[0] ?? TOPICS[0]
    parallels.push({
      id: 'fallback',
      lyricLine: chorus,
      theme: fallbackTopic.name,
      topicId: fallbackTopic.id,
      connection: `Explore how this song relates to ${fallbackTopic.name.toLowerCase()} in Scripture.`,
      verseIds: fallbackTopic.verseIds.slice(0, versesPerParallel),
      verses: [],
    })
  }

  const limitedParallels = parallels.slice(0, maxParallels)
  const allVerseIds = [...new Set(limitedParallels.flatMap((p) => p.verseIds))]
  let apiUnavailable = false

  try {
    const verses = await fetchPassages(allVerseIds)
    const verseById = Object.fromEntries(verses.map((v) => [v.id, v]))
    for (const parallel of limitedParallels) {
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
    track,
    lyrics,
    parallels: limitedParallels,
    matchedTopics: buildTopicMatches(matchedTopics),
    apiUnavailable,
  }
}

export async function compareTrackFromSpotify(
  track: SpotifyTrackResult,
  options: CompareOptions = {},
): Promise<LyricsComparisonResult> {
  let lyrics: string
  try {
    lyrics = await fetchTrackLyrics(track.artist, track.name)
  } catch (err) {
    if (err instanceof Error && err.message === 'LYRICS_NOT_FOUND') {
      return {
        track,
        lyrics: '',
        parallels: [],
        matchedTopics: [],
        lyricsUnavailable: true,
      }
    }
    throw err
  }

  return compareLyricsToScripture(track, lyrics, options)
}
