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
    window.setTimeout(() => setCopied(false), 2500)
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="p-6 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold text-navy sm:text-2xl">
            {verse.reference}
          </h3>
          <button
            type="button"
            onClick={copyVerse}
            className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
              copied
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-parchment-dark text-ink-muted hover:border-gold hover:text-gold'
            }`}
            aria-label={`Copy ${verse.reference}`}
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        <div className="verse-pullquote">
          <p className="font-display text-lg leading-[1.75] text-ink sm:text-xl">
            {verse.text}
          </p>
        </div>

        <p className="mt-5 flex items-center gap-2 text-xs tracking-wide text-ink-muted uppercase">
          <span className="h-px flex-1 bg-parchment-dark" aria-hidden />
          New International Version
          <span className="h-px flex-1 bg-parchment-dark" aria-hidden />
        </p>
      </div>
    </article>
  )
}
