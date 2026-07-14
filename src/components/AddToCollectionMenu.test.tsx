// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from './Toast'
import { AddToCollectionMenu } from './AddToCollectionMenu'
import { getCollections, getCollectionsForVerse } from '../hooks/useCollections'
import type { Verse } from '../types'

const verse: Verse = { id: 'JHN.3.16', reference: 'John 3:16', text: 'For God so loved the world.' }

function renderMenu() {
  return render(
    <ToastProvider>
      <AddToCollectionMenu verse={verse} />
    </ToastProvider>,
  )
}

afterEach(() => cleanup())
beforeEach(() => localStorage.clear())

describe('AddToCollectionMenu', () => {
  it('creates a collection and adds the verse to it', async () => {
    renderMenu()
    await userEvent.click(screen.getByRole('button', { name: /add John 3:16 to a collection/i }))

    await userEvent.type(screen.getByPlaceholderText('New collection…'), 'Anxiety')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    const collections = getCollections()
    expect(collections).toHaveLength(1)
    expect(collections[0].name).toBe('Anxiety')
    expect(getCollectionsForVerse('JHN.3.16')).toEqual([collections[0].id])
  })

  it('toggles membership via the collection list', async () => {
    renderMenu()
    await userEvent.click(screen.getByRole('button', { name: /add John 3:16 to a collection/i }))

    // Create a collection (also adds the verse).
    await userEvent.type(screen.getByPlaceholderText('New collection…'), 'Hope')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(getCollectionsForVerse('JHN.3.16')).toHaveLength(1)

    // Toggling the checkbox item removes it.
    const item = screen.getByRole('menuitemcheckbox', { name: /Hope/ })
    await userEvent.click(item)
    expect(getCollectionsForVerse('JHN.3.16')).toHaveLength(0)
  })

  it('reflects the in-collection count on the trigger', async () => {
    renderMenu()
    const trigger = screen.getByRole('button', { name: /add John 3:16 to a collection/i })
    await userEvent.click(trigger)
    await userEvent.type(screen.getByPlaceholderText('New collection…'), 'Faith')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByRole('button', { name: /add John 3:16 to a collection/i }).textContent).toContain('In 1')
  })
})
