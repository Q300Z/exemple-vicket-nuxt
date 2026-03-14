import { test, expect } from '@playwright/test'

/**
 * Ticket Dialog State Flow Tests (SRP).
 * Validates the multi-step creation process.
 */
test.describe('Ticket Dialog Multi-step Flow', () => {
  test('navigates through steps correctly', async ({ page }) => {
    // 1. Setup mock BEFORE navigation
    await page.route('**/api/vicket/init**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          data: { 
            website: { name: 'Test' }, 
            templates: [{ id: 't1', name: 'Tech Support', icon: 'i-heroicons-wrench' }] 
          } 
        })
      })
    })

    await page.goto('/')

    // 2. Open Dialog
    await page.getByRole('button', { name: /Ticket|Besoin/i }).first().click({ force: true })
    
    // Check we are at step: category
    await expect(page.getByRole('heading', { name: /aide|aider/i })).toBeVisible({ timeout: 15000 })
    
    // 3. Select a category (template)
    // We search for any button containing 'Tech Support' or the first available template
    const templateBtn = page.locator('button').filter({ hasText: /Tech Support|Bug|Technique/i }).first()
    await templateBtn.click({ force: true })
    
    // 4. Check we are at step: form
    await expect(page.getByRole('button', { name: /Envoyer|Soumettre/i })).toBeVisible({ timeout: 15000 })
    
    // 5. Back button logic
    await page.locator('button i[class*="i-lucide-arrow-left"]').click({ force: true })
    
    // Check we are back to category selection
    await expect(page.getByRole('heading', { name: /aide|aider/i })).toBeVisible({ timeout: 15000 })
  })

  test('displays error state on failure', async ({ page }) => {
    // Mock a clear failure
    await page.route('**/api/vicket/tickets', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'BAD_REQUEST' })
      })
    })

    await page.getByRole('button', { name: /Ticket|Besoin|Ouvrir/i }).first().click({ force: true })
    await page.locator('.vk-dialog-content button').first().click({ force: true }) 
    
    await page.getByRole('button', { name: /Envoyer|Soumettre/i }).click({ force: true })
    
    // Check error switcher UI
    await expect(page.getByText('Données invalides')).toBeVisible({ timeout: 10000 })
  })
})
