import type { TopicMatch, Verse } from './index'

export interface SpotifyTrackResult {
  id: string
  name: string
  artist: string
  album: string
  albumArtUrl: string | null
  previewUrl: string | null
  spotifyUrl: string
}

export interface LyricScriptureParallel {
  id: string
  lyricLine: string
  theme: string
  topicId: string
  connection: string
  verseIds: string[]
  verses: Verse[]
}

export interface LyricsComparisonResult {
  track: SpotifyTrackResult
  lyrics: string
  parallels: LyricScriptureParallel[]
  matchedTopics: TopicMatch[]
  lyricsUnavailable?: boolean
  apiUnavailable?: boolean
}

export interface ManualTrackInput {
  name: string
  artist: string
  album?: string
  albumArtUrl?: string | null
  spotifyUrl?: string
}
