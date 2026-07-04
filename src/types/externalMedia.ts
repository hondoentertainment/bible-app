import type { LoadedParallel } from './media'
import type { TopicMatch } from './index'

export interface BookSearchResult {
  id: string
  title: string
  authors: string[]
  year: string | null
  coverUrl: string | null
  goodreadsUrl: string
}

export interface MovieSearchResult {
  id: string
  title: string
  year: string | null
  overview: string
  posterUrl: string | null
  letterboxdUrl: string
  tagline?: string | null
}

export interface ExternalMediaCompareOptions {
  maxParallels?: number
  versesPerParallel?: number
  maxTopics?: number
}

export const DEFAULT_EXTERNAL_COMPARE_OPTIONS: ExternalMediaCompareOptions = {
  maxParallels: 5,
  versesPerParallel: 2,
  maxTopics: 8,
}

export interface ExternalMediaComparisonResult {
  type: 'book' | 'movie'
  title: string
  creator: string
  year: string | null
  summary: string
  coverUrl: string | null
  externalUrl: string
  externalLabel: 'Goodreads' | 'Letterboxd'
  parallels: LoadedParallel[]
  matchedTopics: TopicMatch[]
  apiUnavailable?: boolean
  descriptionUnavailable?: boolean
}

export interface RecentExternalMedia {
  type: 'book' | 'movie'
  id: string
  title: string
  creator: string
}
