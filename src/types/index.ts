export interface Verse {
  id: string
  reference: string
  text: string
  secondaryText?: string
  secondaryReference?: string
  source?: 'topics' | 'api' | 'reference'
}

export interface TopicMatch {
  topicId: string
  topicName: string
  description: string
  score: number
  verseIds: string[]
}

export interface SearchResult {
  verses: Verse[]
  matchedTopics: TopicMatch[]
  query: string
  source: 'topics' | 'api' | 'both'
  apiUnavailable?: boolean
}

export interface BibleSearchResponse {
  data?: {
    query?: string
    total?: number
    verseCount?: number
    verses?: Array<{
      id: string
      orgId?: string
      bibleId?: string
      bookId?: string
      chapterId?: string
      reference?: string
      content?: string
      text?: string
    }>
  }
}
