import { test, expect } from '@playwright/test'

/**
 * Visual & Branding Regression Tests (SOLID).
 * Ensures runtime white-labeling works across theme shifts.
 */
test.describe('Branding & Visual Integrity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('applies primary color changes correctly', async ({ page }) => {
    // Open branding selector
    await page.getByLabel('Personnaliser l\'apparence').click()
    
    // Switch to Emerald
    await page.getByRole('menuitemcheckbox', { name: 'Emerald' }).click()
    
    // Verify that the logo pastille has the new color (emerald-500 approx)
    const logoPastille = page.locator('.w-8.h-8.rounded-lg.bg-\\[var\\(--ui-primary\\)\\]')
    await expect(logoPastille).toBeVisible()
    
    // The CSS variable should be updated
    const primaryVar = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-primary'))
    expect(primaryVar).toContain('var(--color-emerald-500)')
  })

  test('applies border radius changes correctly', async ({ page }) => {
    await page.getByLabel('Personnaliser l\'apparence').click()
    
    // Switch to "Carré" (radius: none)
    await page.getByRole('menuitemcheckbox', { name: 'Carré' }).click()
    
    const radiusVar = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-radius'))
    expect(radiusVar).toBe('none')

    // Switch to "Pillule" (radius: xl)
    await page.getByLabel('Personnaliser l\'apparence').click()
    await page.getByRole('menuitemcheckbox', { name: 'Pillule' }).click()
    
    const radiusVarXl = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-radius'))
    expect(radiusVarXl).toBe('xl')
  })

  test('maintains visual consistency on support index', async ({ page }) => {
    await page.goto('/support')
    
    // Check that categories buttons are rendered with the correct theme
    const categoryBtn = page.getByRole('button', { name: 'Tous' })
    await expect(categoryBtn).toHaveClass(/bg-primary/)
    
    // Visual snapshot would be here in a real environment with:
    // await expect(page).toHaveScreenshot('support-index-default.png')
  })
})
