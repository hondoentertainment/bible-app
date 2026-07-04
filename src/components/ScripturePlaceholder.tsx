import { PLACEHOLDER_VERSES, type PlaceholderVerseKind } from '../data/placeholderVerses'

type ScripturePlaceholderSize = 'xs' | 'sm' | 'md' | 'lg'

interface ScripturePlaceholderProps {
  kind: PlaceholderVerseKind
  size?: ScripturePlaceholderSize
  className?: string
}

export function ScripturePlaceholder({
  kind,
  size = 'sm',
  className = '',
}: ScripturePlaceholderProps) {
  const verse = PLACEHOLDER_VERSES[kind]
  const label = `${verse.reference}: ${verse.text}`

  if (size === 'xs') {
    const [book, ref] = verse.shortRef.split(' ')
    return (
      <span
        className={`flex flex-col items-center justify-center text-center leading-none ${className}`}
        aria-label={label}
      >
        <span className="text-[0.5rem] font-bold uppercase tracking-wide">{book}</span>
        <span className="text-[0.55rem] font-semibold">{ref}</span>
      </span>
    )
  }

  if (size === 'sm') {
    const [book, ref] = verse.shortRef.split(' ')
    return (
      <div
        className={`flex shrink-0 flex-col items-center justify-center rounded bg-parchment px-1 text-center ${className}`}
        aria-label={label}
      >
        <span className="text-[0.55rem] font-bold leading-tight text-navy">{book}</span>
        <span className="text-[0.55rem] leading-tight text-gold">{ref}</span>
      </div>
    )
  }

  if (size === 'md') {
    return (
      <div
        className={`flex shrink-0 flex-col items-center justify-center rounded-lg bg-parchment px-1.5 py-1 text-center ${className}`}
        aria-label={label}
      >
        <p className="line-clamp-3 text-[0.6rem] leading-snug text-navy italic">
          &ldquo;{verse.text}&rdquo;
        </p>
        <p className="mt-1 text-[0.55rem] font-semibold text-gold">{verse.reference}</p>
      </div>
    )
  }

  return (
    <div
      className={`flex shrink-0 flex-col justify-center rounded-xl bg-parchment p-3 text-center ${className}`}
      aria-label={label}
    >
      <p className="font-display text-sm leading-snug text-navy italic sm:text-base">
        &ldquo;{verse.text}&rdquo;
      </p>
      <p className="mt-2 text-xs font-semibold text-gold">{verse.reference}</p>
    </div>
  )
}
