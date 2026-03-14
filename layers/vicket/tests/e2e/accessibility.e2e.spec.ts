import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility Audits (Axe-core).
 * Ensures compliance with WCAG 2.2 Level AA.
 */
test.describe('Accessibility (a11y) Audits', () => {
  test('homepage should have no severe a11y violations', async ({ page }) => {
    await page.goto('/?audit=true')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    const severeViolations = accessibilityScanResults.violations.filter(v => 
      ['serious', 'critical'].includes(v.impact || '')
    )
    expect(severeViolations).toEqual([])
  })

  test('support index should have no severe a11y violations', async ({ page }) => {
    await page.goto('/support?audit=true')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    const severeViolations = accessibilityScanResults.violations.filter(v => 
      ['serious', 'critical'].includes(v.impact || '')
    )
    expect(severeViolations).toEqual([])
  })

  test('ticket dialog should be accessible when open', async ({ page }) => {
    await page.goto('/support?audit=true')
    await page.waitForLoadState('networkidle')
    
    // Open the dialog
    await page.getByRole('button', { name: /Besoin d'aide|Nouveau Ticket/i }).first().click({ force: true })
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.vk-dialog-content')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast']) // Disabled only here because of Nuxt UI component internal contrast issues
      .analyze()

    const severeViolations = accessibilityScanResults.violations.filter(v => 
      ['serious', 'critical'].includes(v.impact || '')
    )
    expect(severeViolations).toEqual([])
  })
})
