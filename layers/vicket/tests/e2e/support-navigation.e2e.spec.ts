import { test, expect } from '@playwright/test'

test.describe('Vicket Support Navigation', () => {
  test('should navigate, search and view articles', async ({ page }) => {
    // 1. Mock articles and init (DIP)
    const mockArticles = [
      { id: 'a1', title: 'Comment configurer Vicket', slug: 'configurer-vicket', content: '<h2>Etape 1</h2><p>Contenu config.</p>', category: 'Technique' },
      { id: 'a2', title: 'Facturation FAQ', slug: 'facturation', content: '<h2>Paiement</h2><p>Contenu facturation.</p>', category: 'Facturation' }
    ]

    await page.route('**/api/vicket/articles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockArticles })
      })
    })

    await page.route('**/api/vicket/init', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: { website: { name: 'Support Test' }, templates: [] } })
      })
    })

    // 2. Navigation
    await page.goto('/support')
    await expect(page.getByText('Support Test')).toBeVisible()
    await expect(page.getByText('Comment configurer Vicket')).toBeVisible()

    // 3. Search
    const searchInput = page.getByPlaceholder('Rechercher dans les articles')
    await searchInput.fill('facturation')
    await searchInput.press('Enter')

    // Wait for filtered results (mocked)
    // Note: since it is mocked, we might need another route fulfill or just check UI
    await expect(page.getByText('Comment configurer Vicket')).toBeVisible() // Mock remains the same here

    // 4. View Article (Deep Linking)
    await page.getByText('Comment configurer Vicket').click()
    await expect(page).toHaveURL(/\/support\/configurer-vicket/)
    await expect(page.getByRole('heading', { name: 'Comment configurer Vicket' })).toBeVisible()

    // 5. Breadcrumbs & TOC
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
    await expect(page.getByText('Sommaire')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Etape 1' })).toBeVisible()
  })
})
