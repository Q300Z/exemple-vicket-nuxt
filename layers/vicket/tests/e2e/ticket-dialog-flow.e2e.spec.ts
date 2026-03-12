import { test, expect } from '@playwright/test'

/**
 * Ticket Dialog State Flow Tests (SRP).
 * Validates the multi-step creation process.
 */
test.describe('Ticket Dialog Multi-step Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('navigates through steps correctly', async ({ page }) => {
    // 1. Open Dialog
    await page.getByRole('button', { name: 'Ouvrir un ticket' }).first().click()
    
    // Check we are at step: category
    await expect(page.getByText('Comment pouvons-nous vous aider ?')).toBeVisible()
    
    // 2. Select a category (template)
    // We assume templates are loaded (mocked in server/api/init)
    const firstCategory = page.locator('button:has-text("Problème Technique"), button:has-text("Assistance")').first()
    await firstCategory.click()
    
    // 3. Check we are at step: form
    await expect(page.getByRole('button', { name: 'Envoyer ma demande' })).toBeVisible()
    await expect(page.locator('button i.i-lucide-arrow-left')).toBeVisible() // Back button
    
    // 4. Fill form (basic validation check)
    // We don't submit to keep the test clean and reproducible
    await page.locator('button i.i-lucide-arrow-left').click()
    
    // Check we are back to category selection
    await expect(page.getByText('Comment pouvons-nous vous aider ?')).toBeVisible()
  })

  test('displays error state on failure', async ({ page }) => {
    // This test would ideally use a route mock to force a 422 or 500
    await page.route('**/api/vicket/tickets', route => route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({ errors: { subject: ['Le sujet est requis'] } })
    }))

    await page.getByRole('button', { name: 'Ouvrir un ticket' }).first().click()
    await page.locator('button').filter({ hasText: /./ }).nth(3).click() // Select any template
    
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
    
    // Check error switcher UI
    await expect(page.getByText('Données invalides')).toBeVisible()
    await expect(page.getByText('subject:')).toBeVisible()
  })
})
