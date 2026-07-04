import { MEDIA_TYPE_LABELS } from '../data/media-comparisons'
import type { LoadedMediaComparison } from '../types/media'

export function formatMediaComparisonText(comparison: LoadedMediaComparison): string {
  const typeLabel = MEDIA_TYPE_LABELS[comparison.type]
  const lines = [
    `${comparison.title}${comparison.creator ? ` — ${comparison.creator}` : ''}`,
    `${typeLabel} & Scripture comparison (NIV)`,
    comparison.summary,
    '',
  ]

  for (const [i, parallel] of comparison.parallels.entries()) {
    lines.push(`Parallel ${i + 1}: ${parallel.theme}`)
    lines.push(`"${parallel.mediaLine.text}"`)
    if (parallel.mediaLine.attribution) {
      lines.push(`— ${parallel.mediaLine.attribution}`)
    }
    lines.push(parallel.connection)
    for (const verse of parallel.verses) {
      lines.push(`  ${verse.reference}: ${verse.text}`)
    }
    if (parallel.verses.length === 0 && parallel.verseIds.length > 0) {
      lines.push(`  References: ${parallel.verseIds.join(', ')}`)
    }
    lines.push('')
  }

  return lines.join('\n').trim()
}

export async function copyMediaComparison(comparison: LoadedMediaComparison): Promise<void> {
  await navigator.clipboard.writeText(formatMediaComparisonText(comparison))
}

export async function shareMediaComparison(
  comparison: LoadedMediaComparison,
): Promise<'shared' | 'copied'> {
  const text = formatMediaComparisonText(comparison)
  const title = `${comparison.title} — Stories & Scripture`

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
    }
  }

  await copyMediaComparison(comparison)
  return 'copied'
}
