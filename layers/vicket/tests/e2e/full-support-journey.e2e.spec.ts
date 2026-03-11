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
    const supportLink = page.getByRole('link', { name: /Support|Aide/i }).first()
    await supportLink.click()
    await expect(page).toHaveURL(/\/support/)

    // 3. Search for a non-existent solution
    const searchInput = page.getByPlaceholder(/Rechercher/i)
    await searchInput.fill('XYZ-NON-EXISTENT-STUFF')
    await searchInput.press('Enter')

    // 4. Verify Empty State and click CTA
    await expect(page.locator('text=Aucun résultat trouvé')).toBeVisible()
    const openTicketBtn = page.getByRole('button', { name: /Contacter le support|Ouvrir un ticket/i }).first()
    await openTicketBtn.click()

    // 5. Form Step 1: Identification
    await expect(page.locator('text=Votre adresse email')).toBeVisible()
    await page.locator('input[type="email"]').fill('tester@example.com')
    
    // If there are multiple templates, select the first one
    const templates = await page.locator('input[type="radio"]').all()
    if (templates.length > 0) {
      await templates[0].check()
    }

    await page.getByRole('button', { name: /Continuer/i }).click()

    // 6. Form Step 2: Details
    await expect(page.locator('text=Sujet de la demande')).toBeVisible()
    await page.getByPlaceholder(/Ex: Problème de connexion/i).fill('E2E Test Ticket')
    
    // Fill dynamic questions if they exist (Factory check)
    const textareas = await page.locator('textarea').all()
    for (const area of textareas) {
      await area.fill('This is an automated E2E test message.')
    }

    // 7. Submission
    await page.getByRole('button', { name: /Soumettre/i }).click()

    // 8. Success Verification
    // Increase timeout for API latency
    await expect(page.locator('text=Ticket créé avec succès')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=Un lien sécurisé vous a été envoyé')).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: /Fermer la fenêtre/i }).click()
    await expect(page.locator('text=Ticket créé avec succès')).not.toBeVisible()
  })
})
