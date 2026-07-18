import { expect, test } from '@playwright/test'

test.describe('critical path smoke', () => {
  test('subjects home loads with search and browse', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'App sections' })).toBeVisible()
    await expect(page.getByLabel('Browse subjects')).toBeVisible()
  })

  test('stories mode shows Books Movies TV sections and opens curated story', async ({ page }) => {
    await page.goto('/?mode=stories')
    await expect(page.getByRole('tab', { name: /Books/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Movies/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /TV/i })).toBeVisible()

    await page.goto('/?mode=stories&story=shawshank')
    await expect(page.getByRole('heading', { name: /Shawshank/i })).toBeVisible()
  })

  test('lyrics and quote modes mount', async ({ page }) => {
    await page.goto('/?mode=lyrics')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await page.goto('/?mode=quote')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
