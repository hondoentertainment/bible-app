type IconKind =
  | 'heart'
  | 'star'
  | 'sun'
  | 'leaf'
  | 'hands'
  | 'shield'
  | 'mountain'
  | 'book'
  | 'pray'
  | 'gift'
  | 'smile'
  | 'clock'
  | 'cross'
  | 'home'
  | 'users'
  | 'flame'
  | 'scale'
  | 'compass'
  | 'spark'

interface TopicStyle {
  bg: string
  fg: string
  icon: IconKind
}

const TOPIC_STYLES: Record<string, TopicStyle> = {
  love: { bg: 'bg-rose-100', fg: 'text-rose-500', icon: 'heart' },
  faith: { bg: 'bg-amber-100', fg: 'text-amber-600', icon: 'star' },
  hope: { bg: 'bg-sky-100', fg: 'text-sky-600', icon: 'sun' },
  peace: { bg: 'bg-emerald-100', fg: 'text-emerald-600', icon: 'leaf' },
  forgiveness: { bg: 'bg-violet-100', fg: 'text-violet-600', icon: 'hands' },
  anxiety: { bg: 'bg-slate-200', fg: 'text-slate-600', icon: 'shield' },
  strength: { bg: 'bg-teal-100', fg: 'text-teal-700', icon: 'mountain' },
  wisdom: { bg: 'bg-indigo-100', fg: 'text-indigo-600', icon: 'book' },
  prayer: { bg: 'bg-blue-100', fg: 'text-blue-600', icon: 'pray' },
  salvation: { bg: 'bg-amber-100', fg: 'text-amber-700', icon: 'cross' },
  grace: { bg: 'bg-pink-100', fg: 'text-pink-600', icon: 'gift' },
  joy: { bg: 'bg-yellow-100', fg: 'text-yellow-600', icon: 'smile' },
  patience: { bg: 'bg-orange-100', fg: 'text-orange-600', icon: 'clock' },
  healing: { bg: 'bg-green-100', fg: 'text-green-600', icon: 'heart' },
  marriage: { bg: 'bg-rose-100', fg: 'text-rose-600', icon: 'heart' },
  parenting: { bg: 'bg-sky-100', fg: 'text-sky-700', icon: 'home' },
  grief: { bg: 'bg-slate-200', fg: 'text-slate-600', icon: 'hands' },
  anger: { bg: 'bg-red-100', fg: 'text-red-600', icon: 'flame' },
  money: { bg: 'bg-emerald-100', fg: 'text-emerald-700', icon: 'scale' },
  work: { bg: 'bg-stone-200', fg: 'text-stone-700', icon: 'compass' },
  guidance: { bg: 'bg-blue-100', fg: 'text-blue-700', icon: 'compass' },
  worship: { bg: 'bg-violet-100', fg: 'text-violet-700', icon: 'spark' },
  community: { bg: 'bg-cyan-100', fg: 'text-cyan-700', icon: 'users' },
  jesus: { bg: 'bg-amber-100', fg: 'text-amber-700', icon: 'cross' },
  'holy-spirit': { bg: 'bg-orange-100', fg: 'text-orange-500', icon: 'flame' },
  scripture: { bg: 'bg-indigo-100', fg: 'text-indigo-600', icon: 'book' },
  heaven: { bg: 'bg-sky-100', fg: 'text-sky-500', icon: 'sun' },
  'eternal-life': { bg: 'bg-teal-100', fg: 'text-teal-600', icon: 'spark' },
  resurrection: { bg: 'bg-yellow-100', fg: 'text-yellow-600', icon: 'sun' },
  redemption: { bg: 'bg-rose-100', fg: 'text-rose-600', icon: 'cross' },
  blessing: { bg: 'bg-emerald-100', fg: 'text-emerald-600', icon: 'gift' },
  'self-control': { bg: 'bg-slate-200', fg: 'text-slate-600', icon: 'shield' },
  gentleness: { bg: 'bg-pink-100', fg: 'text-pink-500', icon: 'leaf' },
  faithfulness: { bg: 'bg-blue-100', fg: 'text-blue-600', icon: 'shield' },
  goodness: { bg: 'bg-green-100', fg: 'text-green-600', icon: 'heart' },
  discipline: { bg: 'bg-stone-200', fg: 'text-stone-700', icon: 'compass' },
  service: { bg: 'bg-cyan-100', fg: 'text-cyan-700', icon: 'hands' },
  leadership: { bg: 'bg-indigo-100', fg: 'text-indigo-700', icon: 'compass' },
  friendship: { bg: 'bg-amber-100', fg: 'text-amber-600', icon: 'users' },
  hospitality: { bg: 'bg-orange-100', fg: 'text-orange-600', icon: 'home' },
  encouragement: { bg: 'bg-yellow-100', fg: 'text-yellow-600', icon: 'smile' },
  unity: { bg: 'bg-teal-100', fg: 'text-teal-700', icon: 'users' },
  doubt: { bg: 'bg-slate-200', fg: 'text-slate-600', icon: 'compass' },
  fear: { bg: 'bg-blue-100', fg: 'text-blue-600', icon: 'shield' },
  shame: { bg: 'bg-rose-100', fg: 'text-rose-500', icon: 'sun' },
  'spiritual-warfare': { bg: 'bg-red-100', fg: 'text-red-600', icon: 'shield' },
  deliverance: { bg: 'bg-teal-100', fg: 'text-teal-600', icon: 'hands' },
  protection: { bg: 'bg-slate-200', fg: 'text-slate-700', icon: 'shield' },
  calling: { bg: 'bg-violet-100', fg: 'text-violet-600', icon: 'compass' },
  provision: { bg: 'bg-emerald-100', fg: 'text-emerald-700', icon: 'gift' },
  fasting: { bg: 'bg-stone-200', fg: 'text-stone-600', icon: 'clock' },
  meditation: { bg: 'bg-indigo-100', fg: 'text-indigo-600', icon: 'book' },
  reconciliation: { bg: 'bg-pink-100', fg: 'text-pink-600', icon: 'hands' },
  repentance: { bg: 'bg-amber-100', fg: 'text-amber-600', icon: 'flame' },
  baptism: { bg: 'bg-sky-100', fg: 'text-sky-600', icon: 'leaf' },
  communion: { bg: 'bg-rose-100', fg: 'text-rose-600', icon: 'gift' },
  judgment: { bg: 'bg-slate-200', fg: 'text-slate-700', icon: 'scale' },
  'second-coming': { bg: 'bg-yellow-100', fg: 'text-yellow-600', icon: 'sun' },
  sanctification: { bg: 'bg-violet-100', fg: 'text-violet-600', icon: 'spark' },
  transformation: { bg: 'bg-teal-100', fg: 'text-teal-600', icon: 'leaf' },
  adoption: { bg: 'bg-rose-100', fg: 'text-rose-500', icon: 'heart' },
  inheritance: { bg: 'bg-amber-100', fg: 'text-amber-700', icon: 'gift' },
  freedom: { bg: 'bg-sky-100', fg: 'text-sky-600', icon: 'spark' },
  victory: { bg: 'bg-yellow-100', fg: 'text-yellow-600', icon: 'star' },
  promises: { bg: 'bg-emerald-100', fg: 'text-emerald-600', icon: 'star' },
  covenant: { bg: 'bg-indigo-100', fg: 'text-indigo-600', icon: 'scale' },
  discipleship: { bg: 'bg-blue-100', fg: 'text-blue-700', icon: 'compass' },
  'spiritual-gifts': { bg: 'bg-pink-100', fg: 'text-pink-600', icon: 'gift' },
  'fear-of-god': { bg: 'bg-amber-100', fg: 'text-amber-700', icon: 'flame' },
  sovereignty: { bg: 'bg-slate-200', fg: 'text-slate-700', icon: 'mountain' },
  glory: { bg: 'bg-yellow-100', fg: 'text-yellow-600', icon: 'spark' },
  light: { bg: 'bg-amber-100', fg: 'text-amber-500', icon: 'sun' },
  angels: { bg: 'bg-sky-100', fg: 'text-sky-500', icon: 'star' },
}

const DEFAULT_STYLE: TopicStyle = { bg: 'bg-gold/10', fg: 'text-gold', icon: 'book' }

function IconGlyph({ kind, className }: { kind: IconKind; className?: string }) {
  switch (kind) {
    case 'heart':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    case 'star':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )
    case 'sun':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )
    case 'leaf':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 019.5 6.5c0-1 .5-2 1.5-3 4 0 7 3 7 7a7 7 0 01-7 9.5z" />
        </svg>
      )
    case 'hands':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a2 2 0 114 0v4M11 11V5a2 2 0 114 0v6M15 11V7a2 2 0 114 0v8a5 5 0 01-5 5h-1a4 4 0 01-4-4v-1" />
        </svg>
      )
    case 'shield':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'mountain':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 21l4-7 4 7M3 21h18M6 14l3-5 3 4 3-6 3 7" />
        </svg>
      )
    case 'pray':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3M8 6c0 2 1.5 4 4 4s4-2 4-4M7 21c0-4 2.5-7 5-7s5 3 5 7" />
        </svg>
      )
    case 'gift':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8M4 12h16M12 22V12M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7s1-5 3.5-5a2.5 2.5 0 010 5H12z" />
        </svg>
      )
    case 'smile':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
      )
    case 'clock':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 6v6l4 2" />
        </svg>
      )
    case 'cross':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" d="M12 4v16M8 8h8" />
        </svg>
      )
    case 'home':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    case 'users':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      )
    case 'flame':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1 3-4 5-4 9a4 4 0 108 0c0-4-3-6-4-9z" />
        </svg>
      )
    case 'scale':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 7h14M7 7l-2 4h4L7 7zm10 0l-2 4h4l-2-4z" />
        </svg>
      )
    case 'compass':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76l-2.12 4.95-4.95 2.12 2.12-4.95 4.95-2.12z" />
        </svg>
      )
    case 'spark':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
        </svg>
      )
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
  }
}

interface TopicIconProps {
  topicId: string
  className?: string
}

export function TopicIcon({ topicId, className = '' }: TopicIconProps) {
  const style = TOPIC_STYLES[topicId] ?? DEFAULT_STYLE
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg} ${className}`}
      aria-hidden
    >
      <IconGlyph kind={style.icon} className={`h-5 w-5 ${style.fg}`} />
    </span>
  )
}
