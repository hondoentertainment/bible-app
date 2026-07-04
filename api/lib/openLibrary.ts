import { rankByPartialMatch, scorePartialMatch } from './partialMatch.js'

export interface BookSearchResult {
  id: string
  title: string
  authors: string[]
  year: string | null
  coverUrl: string | null
  goodreadsUrl: string
}

function goodreadsSearchUrl(title: string, authors: string[]): string {
  const q = authors.length > 0 ? `${title} ${authors[0]}` : title
  return `https://www.goodreads.com/search?q=${encodeURIComponent(q)}`
}

function coverUrl(coverId?: number): string | null {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null
}

type OpenLibraryDoc = {
  key?: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
}

function docToResult(doc: OpenLibraryDoc): BookSearchResult | null {
  if (!doc.key || !doc.title) return null
  const title = doc.title
  const authors = doc.author_name ?? []
  return {
    id: doc.key,
    title,
    authors,
    year: doc.first_publish_year ? String(doc.first_publish_year) : null,
    coverUrl: coverUrl(doc.cover_i),
    goodreadsUrl: goodreadsSearchUrl(title, authors),
  }
}

async function fetchOpenLibrarySearch(q: string, limit: number): Promise<OpenLibraryDoc[]> {
  const params = new URLSearchParams({
    q,
    limit: String(limit),
    fields: 'key,title,author_name,first_publish_year,cover_i',
  })

  const response = await fetch(`https://openlibrary.org/search.json?${params}`)
  if (!response.ok) return []

  const data = (await response.json()) as { docs?: OpenLibraryDoc[] }
  return data.docs ?? []
}

function dedupeBooks(books: BookSearchResult[]): BookSearchResult[] {
  const seen = new Set<string>()
  return books.filter((book) => {
    if (seen.has(book.id)) return false
    seen.add(book.id)
    return true
  })
}

function bookLabel(book: BookSearchResult): string {
  return `${book.title} ${book.authors.join(' ')}`
}

export async function searchBooks(query: string, limit = 10): Promise<BookSearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const fetchLimit = Math.max(limit * 2, 20)
  const primaryDocs = await fetchOpenLibrarySearch(trimmed, fetchLimit)

  let docs = primaryDocs

  // Partial title/author fallback when the query is short or a single token
  const tokens = trimmed.split(/\s+/).filter(Boolean)
  if (tokens.length === 1 && tokens[0].length >= 2) {
    const token = tokens[0]
    const [titleDocs, authorDocs] = await Promise.all([
      fetchOpenLibrarySearch(`title:${token}*`, fetchLimit),
      fetchOpenLibrarySearch(`author:${token}*`, fetchLimit),
    ])
    docs = [...primaryDocs, ...titleDocs, ...authorDocs]
  }

  const books = dedupeBooks(
    docs.map(docToResult).filter((book): book is BookSearchResult => book !== null),
  )

  const ranked = rankByPartialMatch(books, trimmed, bookLabel)
  const minScore = trimmed.length >= 3 ? 15 : 0

  return ranked
    .filter((book) => scorePartialMatch(bookLabel(book), trimmed) >= minScore)
    .slice(0, limit)
}

export async function fetchBookDescription(workKey: string): Promise<string> {
  const details = await fetchBookDetails(workKey)
  return details.description || details.firstSentence || details.title
}

export interface BookDetails {
  description: string
  firstSentence: string
  title: string
}

export async function fetchBookDetails(workKey: string): Promise<BookDetails> {
  const key = workKey.startsWith('/works/') ? workKey : `/works/${workKey}`
  const response = await fetch(`https://openlibrary.org${key}.json`)
  if (!response.ok) {
    return { description: '', firstSentence: '', title: '' }
  }

  const data = (await response.json()) as {
    description?: string | { type?: string; value?: string }
    first_sentence?: string | { type?: string; value?: string }
    title?: string
  }

  const description =
    typeof data.description === 'string'
      ? data.description
      : data.description?.value ?? ''

  const firstSentence =
    typeof data.first_sentence === 'string'
      ? data.first_sentence
      : data.first_sentence?.value ?? ''

  return {
    description,
    firstSentence,
    title: data.title ?? '',
  }
}
