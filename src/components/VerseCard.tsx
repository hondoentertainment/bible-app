import { useState } from 'react'
import type { Verse } from '../types'

interface VerseCardProps {
  verse: Verse
}

export function VerseCard({ verse }: VerseCardProps) {
  const [copied, setCopied] = useState(false)

  async function copyVerse() {
    const text = `${verse.text} — ${verse.reference} (NIV)`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="group rounded-2xl border border-parchment-dark bg-white p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-semibold text-navy">{verse.reference}</h3>
        <button
          type="button"
          onClick={copyVerse}
          className="shrink-0 rounded-lg border border-parchment-dark px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-gold hover:text-gold"
          aria-label={`Copy ${verse.reference}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="font-display text-lg leading-relaxed text-ink">{verse.text}</p>
      <p className="mt-4 text-xs tracking-wide text-ink-muted uppercase">New International Version</p>
    </article>
  )
}
