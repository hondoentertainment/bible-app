import type { MediaComparison, LoadedMediaComparison, LoadedParallel } from '../types/media'
import { fetchPassages } from './bibleApi'

export async function loadMediaComparison(
  comparison: MediaComparison,
): Promise<LoadedMediaComparison> {
  const allVerseIds = comparison.parallels.flatMap((p) => p.verseIds)
  let verses: Awaited<ReturnType<typeof fetchPassages>> = []
  let apiUnavailable = false

  try {
    verses = await fetchPassages(allVerseIds)
  } catch (err) {
    if (err instanceof Error && err.message === 'API_UNAVAILABLE') {
      apiUnavailable = true
    } else {
      throw err
    }
  }

  const verseById = Object.fromEntries(verses.map((v) => [v.id, v]))

  const parallels: LoadedParallel[] = comparison.parallels.map((parallel) => ({
    ...parallel,
    verses: parallel.verseIds
      .map((id) => verseById[id])
      .filter((v): v is NonNullable<typeof v> => v !== undefined),
  }))

  return { ...comparison, parallels, apiUnavailable }
}
