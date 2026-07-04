export type MediaType = 'book' | 'song' | 'movie'

export interface MediaLine {
  text: string
  attribution?: string
}

export interface ScriptureParallel {
  id: string
  theme: string
  mediaLine: MediaLine
  verseIds: string[]
  connection: string
}

export interface MediaComparison {
  id: string
  title: string
  type: MediaType
  creator?: string
  summary: string
  parallels: ScriptureParallel[]
  cautions?: string[]
}

export interface LoadedParallel extends ScriptureParallel {
  verses: import('./index').Verse[]
}

export interface LoadedMediaComparison extends MediaComparison {
  parallels: LoadedParallel[]
  apiUnavailable?: boolean
}

export type AppMode = 'subjects' | 'stories' | 'lyrics'
