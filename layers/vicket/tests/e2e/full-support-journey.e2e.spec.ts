import { test, expect } from '@playwright/test'

/**
 * End-to-End test for the complete Support Journey (SOLID Validation).
 */
test.describe('Vicket Full Support Journey', () => {
  test('should allow a user to search, fail to find an article, and create a ticket', async ({ page }) => {
    // 1. Arrival on Homepage
    await page.goto('/')
    await expect(page).toHaveTitle(/Vicket/)

    // 2. Navigate to Support Center
    await page.getByRole('link', { name: /Centre d'aide/i }).first().click({ force: true })
    await page.waitForURL(/\/support/, { timeout: 15000 })
    
    // Ensure we are on the support page and data is ready
    await expect(page.getByRole('heading', { name: /aider/i })).toBeVisible({ timeout: 15000 })
    await page.waitForLoadState('networkidle')

    // 3. Search for a non-existent solution
    const searchInput = page.getByPlaceholder(/Rechercher/i)
    await searchInput.fill('XYZ-NON-EXISTENT-STUFF')
    await searchInput.press('Enter')

    // 4. Verify Empty State and click CTA
    await expect(page.getByText(/Aucun résultat trouvé/i)).toBeVisible({ timeout: 15000 })
    const openTicketBtn = page.getByRole('button', { name: /Contacter le support|Ouvrir un ticket/i }).first()
    await openTicketBtn.click({ force: true })

    // 5. Form Step 1: Category Selection
    await expect(page.getByRole('heading', { name: /aide|aider/i })).toBeVisible({ timeout: 15000 })
    
    // Select first category
    await page.locator('button').filter({ hasText: /Support|Bug|Technique/i }).first().click({ force: true })

    // 6. Form Step 2: Details
    await page.getByLabel('Sujet').fill('E2E Test Ticket')

    // Fill dynamic questions if they exist (Factory check)
    const textareas = await page.locator('textarea').all()
    for (const area of textareas) {
      await area.fill('This is an automated E2E test message.')
    }

    // 7. Submission
    await page.getByRole('button', { name: 'Envoyer' }).click({ force: true })

    // 8. Success Verification
    await expect(page.getByText('Demande envoyée !')).toBeVisible({ timeout: 15000 })

    // Close modal
    await page.getByRole('button', { name: 'Fermer' }).click({ force: true })
    await expect(page.locator('.vk-dialog-content')).not.toBeVisible()
  })
})
