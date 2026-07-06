// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from './Toast'
import { VerseResults } from './VerseResults'
import type { TopicMatch, Verse } from '../types'

function renderResults(props: Partial<Parameters<typeof VerseResults>[0]> = {}) {
  const defaults = {
    verses: [] as Verse[],
    matchedTopics: [] as TopicMatch[],
    query: '',
    apiUnavailable: false,
  }
  return render(
    <ToastProvider>
      <VerseResults {...defaults} {...props} />
    </ToastProvider>,
  )
}

const sampleVerse: Verse = {
  id: 'JHN.3.16',
  reference: 'John 3:16',
  text: 'For God so loved the world.',
  source: 'topics',
}

afterEach(() => cleanup())

describe('VerseResults', () => {
  it('shows a loading skeleton while searching', () => {
    renderResults({ query: 'love', isSearching: true })
    expect(screen.getByLabelText('Loading results')).toBeTruthy()
  })

  it('shows an error message when an error is present', () => {
    renderResults({ query: 'love', error: 'Network exploded' })
    expect(screen.getByText('Something went wrong')).toBeTruthy()
    expect(screen.getByText('Network exploded')).toBeTruthy()
  })

  it('prompts for input when there is no query', () => {
    renderResults({ query: '' })
    expect(screen.getByText(/Enter a subject above/i)).toBeTruthy()
  })

  it('renders verses and a live count when results exist', () => {
    renderResults({ query: 'love', verses: [sampleVerse] })
    expect(screen.getByText('For God so loved the world.')).toBeTruthy()
    expect(screen.getByRole('heading', { name: /1 verse found/i })).toBeTruthy()
  })

  it('offers actionable suggestions on an empty result', async () => {
    const onSuggestionSelect = vi.fn()
    renderResults({ query: 'asdfqwer', verses: [], onSuggestionSelect })

    expect(screen.getAllByText(/No verses found for/i).length).toBeGreaterThan(0)
    const hopeButton = screen.getByRole('button', { name: 'hope' })
    await userEvent.click(hopeButton)
    expect(onSuggestionSelect).toHaveBeenCalledWith('hope')
  })

  it('does not suggest the term that was just searched', () => {
    renderResults({ query: 'hope', verses: [], onSuggestionSelect: vi.fn() })
    expect(screen.queryByRole('button', { name: 'hope' })).toBeNull()
  })

  it('disables suggestions when no handler is provided', () => {
    renderResults({ query: 'asdfqwer', verses: [] })
    const button = screen.getByRole('button', { name: 'prayer' })
    expect(button.hasAttribute('disabled')).toBe(true)
  })

  it('renders matched topic chips', () => {
    const matchedTopics: TopicMatch[] = [
      { topicId: 'love', topicName: 'Love', description: 'God is love', score: 12, verseIds: ['JHN.3.16'] },
    ]
    renderResults({ query: 'love', verses: [sampleVerse], matchedTopics })
    const [region] = screen.getAllByLabelText('Matched topics')
    expect(within(region).getByText('Love')).toBeTruthy()
  })
})
