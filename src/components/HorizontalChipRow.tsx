import type { ReactNode } from 'react'

interface HorizontalChipRowProps {
  children: ReactNode
  className?: string
  ariaLabel?: string
}

/** Horizontally scrollable chip row — prevents flex-wrap layout freeze with many items. */
export function HorizontalChipRow({ children, className = '', ariaLabel }: HorizontalChipRowProps) {
  return (
    <div
      className={`chip-scroll-row flex flex-nowrap gap-2 ${className}`}
      role={ariaLabel ? 'list' : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  )
}
