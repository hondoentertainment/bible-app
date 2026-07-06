import { useEffect, useMemo, useState } from 'react'
import { HorizontalChipRow } from './HorizontalChipRow'
import {
  TOPIC_CATEGORIES,
  TOPICS,
  getTopicsByCategory,
  type Topic,
} from '../data/topics'
import { TopicIcon } from './TopicIcon'
import { VerseOfDay } from './VerseOfDay'
import { FavoritesPanel } from './FavoritesPanel'
import type { SavedComparison } from '../hooks/useFavorites'
import { RecommendationsPanel } from './RecommendationsPanel'
import { ReadingPlanSection } from './ReadingPlanSection'

interface SubjectGridProps {
  onSelect: (topicName: string) => void
  activeQuery?: string
  onExploreTheme: (topicName: string) => void
  onOpenComparison: (comparison: SavedComparison) => void
  onOpenStory: (storyId: string) => void
  onOpenSong: (artist: string, track: string) => void
  favoritesVersion?: number
}

const PAGE_SIZE = 9

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
  isActive,
  onSelect,
}: {
  topic: Topic
  isActive: boolean
  onSelect: (name: string) => void
}) {
  const passageLabel = `${topic.verseIds.length} passage${topic.verseIds.length === 1 ? '' : 's'}`

  return (
    <button
      type="button"
      onClick={() => onSelect(topic.name)}
      aria-pressed={isActive}
      className={`subject-card group flex h-full flex-col rounded-2xl border bg-white p-5 text-left shadow-sm transition-all duration-300 sm:p-6 ${
        isActive
          ? 'border-gold ring-2 ring-gold/25 shadow-md'
          : 'border-parchment-dark/60 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <TopicIcon topicId={topic.id} />
        <span className="shrink-0 rounded-full bg-parchment px-2 py-0.5 text-[0.65rem] font-semibold text-ink-muted">
          {passageLabel}
        </span>
      </div>

      <h3
        className={`line-clamp-2 min-h-[2.5em] font-display text-xl font-semibold leading-tight text-navy ${
          isActive ? 'text-gold' : 'group-hover:text-gold'
        }`}
      >
        {topic.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
        {topic.description}
      </p>
      <span
        className={`mt-auto pt-4 text-[0.65rem] font-semibold tracking-[0.18em] uppercase ${
          isActive ? 'text-gold' : 'text-ink-muted/70 group-hover:text-gold'
        }`}
      >
        Explore verses →
      </span>
    </button>
  )
}

export function SubjectGrid({
  onSelect,
  activeQuery,
  onExploreTheme,
  onOpenComparison,
  onOpenStory,
  onOpenSong,
  favoritesVersion = 0,
}: SubjectGridProps) {
  const [category, setCategory] = useState('all')
  const [filter, setFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredTopics = useMemo(() => {
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

  const visibleTopics = filteredTopics.slice(0, visibleCount)
  const hasMore = visibleCount < filteredTopics.length

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [category, filter])

  return (
    <section className="w-full animate-fade-in-up" aria-label="Browse subjects">
      <VerseOfDay onExploreTheme={onExploreTheme} />

      <FavoritesPanel key={favoritesVersion} onOpenComparison={onOpenComparison} />

      <RecommendationsPanel
        onExploreSubject={onExploreTheme}
        onOpenStory={onOpenStory}
        onOpenSong={onOpenSong}
      />

      <ReadingPlanSection onExploreSubject={onExploreTheme} />

      <div className="browse-subjects mt-4">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
            Browse by Subject
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-muted sm:mx-0">
            <span className="font-semibold text-navy">{TOPICS.length}</span> life topics with curated
            NIV passages — pick one to begin.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <HorizontalChipRow className="min-w-0 flex-1" ariaLabel="Subject categories">
            <CategoryTab
              label="All"
              count={TOPICS.length}
              active={category === 'all'}
              onClick={() => setCategory('all')}
            />
            {TOPIC_CATEGORIES.map((cat) => (
              <CategoryTab
                key={cat.id}
                label={cat.name}
                count={cat.topicIds.length}
                active={category === cat.id}
                onClick={() => setCategory(cat.id)}
              />
            ))}
          </HorizontalChipRow>

          <label className="relative w-full shrink-0 lg:w-64">
            <span className="sr-only">Filter subjects</span>
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter subjects…"
              className="w-full rounded-full border border-parchment-dark bg-white py-2.5 pr-4 pl-10 text-base text-ink placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
            />
            <svg
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted"
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
          <p className="mb-3 text-sm text-ink-muted">
            {TOPIC_CATEGORIES.find((c) => c.id === category)?.description}
          </p>
        )}

        {filteredTopics.length > 0 && (
          <p className="mb-5 text-xs font-medium tracking-wide text-ink-muted/80 uppercase" aria-live="polite">
            Showing {visibleTopics.length} of {filteredTopics.length}
            {filter.trim() ? ` matching “${filter.trim()}”` : ' subjects'}
          </p>
        )}

        {visibleTopics.length > 0 ? (
          <>
            <ul className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {visibleTopics.map((topic) => (
                <li key={topic.id} className="flex">
                  <TopicCard
                    topic={topic}
                    isActive={isTopicActive(topic, activeQuery)}
                    onSelect={onSelect}
                  />
                </li>
              ))}
            </ul>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="touch-manipulation rounded-full border border-parchment-dark bg-white px-8 py-3 text-sm font-semibold text-navy shadow-sm transition hover:border-gold hover:text-gold active:scale-[0.98]"
                >
                  Load {Math.min(PAGE_SIZE, filteredTopics.length - visibleCount)} more
                  <span className="text-ink-muted"> · {filteredTopics.length - visibleCount} left</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-parchment-dark bg-white/50 py-16 text-center text-ink-muted">
            No subjects match &ldquo;{filter}&rdquo;. Try a different word.
          </p>
        )}
      </div>
    </section>
  )
}

function CategoryTab({
  label,
  count,
  active,
  onClick,
}: {
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
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? 'border-gold bg-gold text-white shadow-sm'
          : 'border-parchment-dark bg-white text-ink-muted hover:border-gold/50 hover:text-navy'
      }`}
    >
      {label}
      <span className={`ml-1.5 text-xs ${active ? 'text-white/85' : 'text-ink-muted/70'}`}>
        {count}
      </span>
    </button>
  )
}
