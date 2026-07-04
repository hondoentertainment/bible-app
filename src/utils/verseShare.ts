import type { Verse } from '../types'

export function formatVerseText(verse: Verse): string {
  return `"${verse.text}" — ${verse.reference} (NIV)`
}

export async function copyVerseText(verse: Verse): Promise<void> {
  await navigator.clipboard.writeText(formatVerseText(verse))
}

export async function shareVerseText(verse: Verse): Promise<'shared' | 'copied'> {
  const text = formatVerseText(verse)

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: verse.reference, text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err
      }
    }
  }

  await copyVerseText(verse)
  return 'copied'
}
