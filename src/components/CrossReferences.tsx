import { useEffect, useState } from 'react'
import { fetchPassages } from '../services/bibleApi'
import { getCrossReferences } from '../utils/crossReferences'
import type { Verse } from '../types'
import { formatPassageId } from '../utils/formatPassage'

interface CrossReferencesProps {
  verseId: string
  compact?: boolean
}

export function CrossReferences({ verseId, compact = false }: CrossReferencesProps) {
  const refs = getCrossReferences(verseId)
  const [verses, setVerses] = useState<Verse[]>([])

  useEffect(() => {
    const nextRefs = getCrossReferences(verseId)
    if (nextRefs.length === 0) {
      setVerses([])
      return
    }
    fetchPassages(nextRefs).then(setVerses).catch(() => setVerses([]))
  }, [verseId])

  if (refs.length === 0) return null

  return (
    <div className={compact ? 'mt-3' : 'mt-4'}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Related passages</p>
      {verses.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {verses.map((v) => (
            <li key={v.id} className="rounded-lg border border-parchment-dark/80 bg-parchment/30 px-3 py-2 text-sm">
              <span className="font-semibold text-navy">{v.reference}</span>
              <span className="mt-1 block line-clamp-2 text-ink-muted">{v.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-wrap gap-2">
          {refs.map((id) => (
            <span key={id} className="rounded-md bg-parchment px-2 py-1 text-xs text-ink-muted">
              {formatPassageId(id)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
