import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Automated Accessibility Audit (WCAG 2.2 AA).
 * Uses Axe-core to scan key support interfaces.
 */
test.describe('Accessibility (a11y) Audits', () => {
  
  test('landing page should have no detectable a11y violations', async ({ page }) => {
    await page.goto('/')
    
    // Inject and run axe
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('support index should have no detectable a11y violations', async ({ page }) => {
    await page.goto('/support')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('ticket dialog should be accessible when open', async ({ page }) => {
    await page.goto('/support')
    
    // Open the dialog - using more robust locator
    const openBtn = page.getByRole('button', { name: /Ouvrir un ticket|Nouveau Ticket/i }).first()
    await openBtn.click({ force: true })
    
    // Wait for modal content to be stable
    await page.waitForSelector('.vk-dialog-content', { state: 'visible' })

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.vk-dialog-content') // Focus scan on the dialog content
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
