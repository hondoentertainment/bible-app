// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReadingHistoryStrip } from './ReadingHistoryStrip'
import { clearReadingHistory, recordVerseView } from '../hooks/useReadingHistory'

afterEach(() => cleanup())
beforeEach(() => {
  localStorage.clear()
  clearReadingHistory()
})

describe('ReadingHistoryStrip', () => {
  it('renders nothing when there is no history', () => {
    const { container } = render(<ReadingHistoryStrip onSelect={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders recently read verses and fires onSelect with the reference', async () => {
    recordVerseView({ id: 'JHN.3.16', reference: 'John 3:16', text: 'For God so loved the world.' })
    const onSelect = vi.fn()
    render(<ReadingHistoryStrip onSelect={onSelect} />)

    const chip = screen.getByRole('button', { name: /John 3:16/ })
    await userEvent.click(chip)
    expect(onSelect).toHaveBeenCalledWith('John 3:16')
  })

  it('clears history when Clear is pressed', async () => {
    recordVerseView({ id: 'JHN.3.16', reference: 'John 3:16', text: 'text' })
    render(<ReadingHistoryStrip onSelect={() => {}} />)
    expect(screen.getByText('John 3:16')).toBeTruthy()

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.queryByText('John 3:16')).toBeNull()
  })
})
