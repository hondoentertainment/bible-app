import { useMemo, useState } from 'react'
import {
  FEATURED_TOPICS,
  TOPIC_CATEGORIES,
  TOPICS,
  getTopicsByCategory,
  type Topic,
} from '../data/topics'

interface SubjectGridProps {
  onSelect: (topicName: string) => void
  activeQuery?: string
}

const CATEGORY_ACCENTS: Record<string, string> = {
  all: 'border-gold bg-gold/5',
  foundations: 'border-gold bg-gold/[0.07]',
  character: 'border-navy bg-navy/[0.04]',
  struggles: 'border-amber-700 bg-amber-700/[0.06]',
  life: 'border-emerald-800 bg-emerald-800/[0.05]',
}

const CATEGORY_TAB_ACTIVE: Record<string, string> = {
  all: 'border-gold bg-gold text-white',
  foundations: 'border-gold bg-gold text-white',
  character: 'border-navy bg-navy text-white',
  struggles: 'border-amber-700 bg-amber-800 text-white',
  life: 'border-emerald-800 bg-emerald-900 text-white',
}

function isTopicActive(topic: Topic, activeQuery?: string): boolean {
  if (!activeQuery) return false
  const q = activeQuery.toLowerCase()
  return (
    topic.name.toLowerCase() === q ||
    topic.keywords.some((k) => k === q) ||
    topic.id === q
  )
}

function TopicCard({
  topic,
  accent,
  isActive,
  onSelect,
}: {
  topic: Topic
  accent: string
  isActive: boolean
  onSelect: (name: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(topic.name)}
      aria-pressed={isActive}
      className={`group flex flex-col rounded-xl border p-4 text-left transition-all duration-300 ${
        isActive
          ? 'border-gold bg-gold/10 shadow-md ring-2 ring-gold/30'
          : `border-parchment-dark/80 bg-white hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg ${accent}`
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-display text-lg font-semibold leading-tight ${
            isActive ? 'text-gold' : 'text-navy group-hover:text-gold'
          }`}
        >
          {topic.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive ? 'bg-gold/20 text-gold' : 'bg-parchment text-ink-muted'
          }`}
        >
          {topic.verseIds.length}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-snug text-ink-muted">{topic.description}</p>
      <span
        className={`mt-3 text-xs font-semibold tracking-wide uppercase ${
          isActive ? 'text-gold' : 'text-ink-muted/70 group-hover:text-gold'
        }`}
      >
        Explore verses →
      </span>
    </button>
  )
}

export function SubjectGrid({ onSelect, activeQuery }: SubjectGridProps) {
  const [category, setCategory] = useState('all')
  const [filter, setFilter] = useState('')

  const visibleTopics = useMemo(() => {
    const base = getTopicsByCategory(category)
    const q = filter.trim().toLowerCase()
    if (!q) return base

    return base.filter(
      (topic) =>
        topic.name.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.keywords.some((k) => k.includes(q)),
    )
  }, [category, filter])

  const accent = CATEGORY_ACCENTS[category] ?? CATEGORY_ACCENTS.all

  return (
    <section className="w-full animate-fade-in-up" aria-label="Browse subjects">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
          Browse by Subject
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-ink-muted">
          <span className="font-semibold text-navy">{TOPICS.length}</span> life topics with curated NIV passages — pick one to begin.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap justify-center gap-2 sm:justify-start"
          role="tablist"
          aria-label="Subject categories"
        >
          <CategoryTab
            id="all"
            label="All"
            count={TOPICS.length}
            active={category === 'all'}
            onClick={() => setCategory('all')}
          />
          {TOPIC_CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat.id}
              id={cat.id}
              label={cat.name}
              count={cat.topicIds.length}
              active={category === cat.id}
              onClick={() => setCategory(cat.id)}
            />
          ))}
        </div>

        <label className="relative w-full sm:w-56">
          <span className="sr-only">Filter subjects</span>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter subjects…"
            className="w-full rounded-lg border border-parchment-dark bg-white py-2.5 pr-3 pl-9 text-base text-ink placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
          />
          <svg
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </label>
      </div>

      {category !== 'all' && (
        <p className="mb-4 text-center text-sm text-ink-muted sm:text-left">
          {TOPIC_CATEGORIES.find((c) => c.id === category)?.description}
        </p>
      )}

      {visibleTopics.length > 0 ? (
        <ul className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleTopics.map((topic) => (
            <li key={topic.id}>
              <TopicCard
                topic={topic}
                accent={accent}
                isActive={isTopicActive(topic, activeQuery)}
                onSelect={onSelect}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-parchment-dark bg-white/50 py-16 text-center text-ink-muted">
          No subjects match &ldquo;{filter}&rdquo;. Try a different word.
        </p>
      )}

      {category === 'all' && !filter && (
        <div className="mt-10 border-t border-parchment-dark/70 pt-8">
          <p className="mb-3 text-center text-xs font-semibold tracking-[0.15em] text-ink-muted uppercase">
            Popular picks
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {FEATURED_TOPICS.map((topic) => {
              const isActive = isTopicActive(topic, activeQuery)
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onSelect(topic.name)}
                  className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-gold bg-gold text-white'
                      : 'border-parchment-dark bg-white text-ink-muted hover:border-gold hover:text-navy'
                  }`}
                >
                  {topic.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function CategoryTab({
  id,
  label,
  count,
  active,
  onClick,
}: {
  id: string
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? CATEGORY_TAB_ACTIVE[id] ?? CATEGORY_TAB_ACTIVE.all
          : 'border-parchment-dark bg-white text-ink-muted hover:border-gold/40 hover:text-navy'
      }`}
    >
      {label}
      <span className={`ml-1.5 text-xs ${active ? 'text-white/80' : 'text-ink-muted/70'}`}>
        {count}
      </span>
    </button>
  )
}
