import { test, expect } from '@playwright/test'

/**
 * E2E test for ticket creation flow with dynamic fields.
 */
test.describe('Vicket Ticket Creation Flow', () => {
  
  test('should allow a user to select a template and submit a ticket', async ({ page }) => {
    // 1. Intercept Init to ensure we have templates
    await page.route('**/api/vicket/init', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            website: { name: 'E2E Support' },
            templates: [
              {
                id: 'tpl-1',
                name: 'Technical Issue',
                description: 'Report a technical problem',
                questions: [
                  { id: 'q-subject', label: 'Subject', type: 'TEXT', required: true, order: 0 },
                  { id: 'q-msg', label: 'Message', type: 'TEXTAREA', required: true, order: 1 }
                ]
              }
            ]
          }
        })
      })
    })

    // 2. Intercept Ticket Creation
    await page.route('**/api/vicket/tickets', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { ticket_id: '123' } })
      })
    })

    // 3. Go to support and open dialog
    await page.goto('/support')
    await page.getByRole('button', { name: 'Nouveau Ticket' }).first().click({ force: true })

    // 4. Select template
    await page.getByText('Report a technical problem').click({ force: true })

    // 5. Fill fields
    await page.getByLabel('Subject').fill('Test E2E Subject')
    await page.getByLabel('Message').fill('This is a test message from Playwright')

    // 6. Submit
    await page.getByRole('button', { name: 'Envoyer' }).click()

    // 7. Verify success state
    await expect(page.getByText('Demande envoyée !')).toBeVisible()
  })
})
