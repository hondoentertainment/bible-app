export type PlaceholderVerseKind = 'book' | 'movie' | 'song'

export interface PlaceholderVerse {
  reference: string
  shortRef: string
  text: string
}

export const PLACEHOLDER_VERSES: Record<PlaceholderVerseKind, PlaceholderVerse> = {
  book: {
    reference: 'Psalm 119:105',
    shortRef: 'Ps 119:105',
    text: 'Your word is a lamp for my feet, a light on my path.',
  },
  movie: {
    reference: 'Psalm 78:4',
    shortRef: 'Ps 78:4',
    text: 'We will tell the next generation the praiseworthy deeds of the Lord.',
  },
  song: {
    reference: 'Psalm 96:1',
    shortRef: 'Ps 96:1',
    text: 'Sing to the Lord a new song; sing to the Lord, all the earth.',
  },
}
