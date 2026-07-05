import { useState } from 'react'
import type { Verse } from '../types'
import { isVerseFavorite, toggleFavoriteVerse } from '../hooks/useFavorites'
import { hapticLight } from '../utils/haptics'
import { copyVerseText, shareVerseText } from '../utils/verseShare'
import { useToast } from '../hooks/useToast'

interface VerseActionsProps {
  verse: Verse
  compact?: boolean
  onFavoriteChange?: () => void
}

export function VerseActions({ verse, compact = false, onFavoriteChange }: VerseActionsProps) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [saved, setSaved] = useState(() => isVerseFavorite(verse.id))

  async function handleCopy() {
    await copyVerseText(verse)
    hapticLight()
    setCopied(true)
    showToast(`${verse.reference} copied to clipboard`)
    window.setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    try {
      const result = await shareVerseText(verse)
      hapticLight()
      setShared(true)
      showToast(result === 'shared' ? `${verse.reference} shared` : `${verse.reference} copied to clipboard`)
      window.setTimeout(() => setShared(false), 2000)
    } catch {
      // User dismissed the native share sheet
    }
  }

  function handleFavorite() {
    const { saved: isSaved } = toggleFavoriteVerse(verse)
    setSaved(isSaved)
    hapticLight()
    showToast(isSaved ? `${verse.reference} saved` : `${verse.reference} removed from favorites`)
    onFavoriteChange?.()
  }

  const btnClass = compact
    ? 'touch-manipulation flex min-h-[36px] items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95'
    : 'touch-manipulation flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-95'

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={handleFavorite}
        className={`${btnClass} ${
          saved
            ? 'border-gold/50 bg-gold/10 text-gold'
            : 'border-parchment-dark text-ink-muted hover:border-gold hover:text-gold'
        }`}
        aria-label={saved ? `Remove ${verse.reference} from favorites` : `Save ${verse.reference}`}
        aria-pressed={saved}
      >
        <HeartIcon filled={saved} />
        {compact ? null : saved ? 'Saved' : 'Save'}
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className={`${btnClass} ${
          copied
            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
            : 'border-parchment-dark text-ink-muted hover:border-gold hover:text-gold'
        }`}
        aria-label={`Copy ${verse.reference}`}
      >
        {copied ? (
          <>
            <CheckIcon />
            {compact ? null : 'Copied'}
          </>
        ) : (
          <>
            <CopyIcon />
            {compact ? null : 'Copy'}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className={`${btnClass} ${
          shared
            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
            : 'border-parchment-dark text-ink-muted hover:border-gold hover:text-gold'
        }`}
        aria-label={`Share ${verse.reference}`}
      >
        {shared ? (
          <>
            <CheckIcon />
            {compact ? null : 'Done'}
          </>
        ) : (
          <>
            <ShareIcon />
            {compact ? null : 'Share'}
          </>
        )}
      </button>
    </div>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
