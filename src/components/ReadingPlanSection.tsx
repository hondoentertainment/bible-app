import { useEffect, useState } from 'react'
import { READING_PLANS, getPlanProgress, setPlanProgress, type ReadingPlan } from '../data/readingPlans'
import { getTopicById } from '../data/topics'
import { fetchPassage } from '../services/bibleApi'
import type { Verse } from '../types'
import { VerseActions } from './VerseActions'

interface ReadingPlanSectionProps {
  onExploreSubject: (topicName: string) => void
}

export function ReadingPlanSection({ onExploreSubject }: ReadingPlanSectionProps) {
  const [activePlan, setActivePlan] = useState<ReadingPlan | null>(null)

  if (activePlan) {
    return (
      <ReadingPlanView
        plan={activePlan}
        onBack={() => setActivePlan(null)}
        onExploreSubject={onExploreSubject}
      />
    )
  }

  return (
    <section className="mb-10 w-full" aria-label="Reading plans">
      <h2 className="mb-1 font-display text-xl font-semibold text-navy">7-day reading plans</h2>
      <p className="mb-4 text-sm text-ink-muted">One verse and reflection prompt per day</p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {READING_PLANS.map((plan) => {
          const progress = getPlanProgress(plan.id)
          return (
            <li key={plan.id} className="flex h-full">
              <button
                type="button"
                onClick={() => setActivePlan(plan)}
                className="flex h-full min-h-[7.5rem] w-full flex-col rounded-xl border border-parchment-dark bg-white p-4 text-left transition hover:border-gold active:scale-[0.99]"
              >
                <span className="line-clamp-1 font-semibold text-navy">{plan.title}</span>
                <span className="mt-1 line-clamp-2 flex-1 text-sm text-ink-muted">{plan.description}</span>
                <span className="mt-3 text-xs text-gold">
                  {progress > 0 ? `Day ${progress} of 7 · Continue →` : 'Start plan →'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ReadingPlanView({
  plan,
  onBack,
  onExploreSubject,
}: {
  plan: ReadingPlan
  onBack: () => void
  onExploreSubject: (name: string) => void
}) {
  const [progress, setProgress] = useState(() => getPlanProgress(plan.id))
  const dayIndex = Math.min(progress, plan.days.length - 1)
  const day = plan.days[dayIndex] ?? plan.days[0]
  const [verse, setVerse] = useState<Verse | null>(null)

  useEffect(() => {
    fetchPassage(day.verseId).then(setVerse).catch(() => setVerse(null))
  }, [day.verseId])

  function markComplete() {
    const next = Math.min(7, progress + 1)
    setPlanProgress(plan.id, next)
    setProgress(next)
  }

  return (
    <section className="mb-10 w-full animate-fade-in-up">
      <button type="button" onClick={onBack} className="back-link mb-4">
        ← All reading plans
      </button>
      <h2 className="font-display text-2xl font-semibold text-navy">{plan.title}</h2>
      <p className="mt-1 text-ink-muted">Day {day.day} of 7</p>

      <div className="mt-6 rounded-2xl border border-parchment-dark bg-white p-6">
        <p className="text-sm font-semibold text-gold uppercase">Today&apos;s reflection</p>
        <p className="mt-2 text-ink">{day.prompt}</p>

        {verse ? (
          <div className="mt-6 border-t border-parchment-dark pt-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-semibold text-navy">{verse.reference}</h3>
              <VerseActions verse={verse} compact />
            </div>
            <p className="mt-3 font-display text-lg leading-relaxed text-ink">{verse.text}</p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink-muted">Loading verse…</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={markComplete}
            className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90"
          >
            {progress >= 7 ? 'Plan complete — restart' : 'Mark day complete'}
          </button>
          <button
            type="button"
            onClick={() => onExploreSubject(getTopicById(plan.topicId)?.name ?? plan.topicId)}
            className="rounded-full border border-parchment-dark px-4 py-2 text-sm font-semibold text-navy hover:border-gold"
          >
            Explore all {plan.title.replace('7 Days of ', '')} verses
          </button>
        </div>
      </div>
    </section>
  )
}
