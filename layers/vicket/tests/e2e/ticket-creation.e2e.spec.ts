import { test, expect } from '@playwright/test'

test.describe('Vicket Ticket Creation', () => {
  test('should create a ticket successfully', async ({ page }) => {
    // 1. Intercept Vicket API calls to ensure predictable tests (DIP)
    await page.route('**/api/vicket/init', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            website: { name: 'Support Test' },
            templates: [{ id: 't1', name: 'Question Technique', questions: [] }]
          }
        })
      })
    })

    await page.route('**/api/vicket/tickets', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, emailLimitReached: false })
      })
    })

    // 2. Start the flow
    await page.goto('/')

    // Click Global Support Button
    const supportButton = page.getByRole('button', { name: 'Nouveau Ticket' })
    await supportButton.click()

    // 3. Step 1: Identification
    await expect(page.getByText('Soumettre une demande')).toBeVisible()
    await page.getByLabel('Votre adresse email').fill('test@vicket.app')
    await page.getByRole('button', { name: 'Continuer vers les détails' }).click()

    // 4. Step 2: Details
    await expect(page.getByText('Question Technique')).toBeVisible()
    await page.getByLabel('Sujet de la demande').fill('E2E Test Subject')

    // Submit
    await page.getByRole('button', { name: 'Soumettre ma demande' }).click()

    // 5. Verify Success (SRP: Visual validation)
    await expect(page.getByText('Ticket créé avec succès !')).toBeVisible()
    await expect(page.getByText('Un lien sécurisé vous a été envoyé')).toBeVisible()
  })
})
