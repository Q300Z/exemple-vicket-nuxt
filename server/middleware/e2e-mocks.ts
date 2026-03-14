import { defineEventHandler } from 'h3'

/**
 * Server-side mock middleware for E2E tests (Industrial Standard).
 * This intercepts API calls during SSR to avoid 401/500 errors in CI.
 */
export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''
  
  // Only intercept /api/vicket calls if we are in test environment
  if (process.env.NODE_ENV !== 'production' || !url.startsWith('/api/vicket')) return

  // Mock Support Init (Templates)
  if (url.includes('/api/vicket/init')) {
    return {
      success: true,
      data: {
        website: { name: 'E2E Test Site' },
        templates: [
          { id: 't1', name: 'Tech Support', icon: 'i-lucide-wrench' },
          { id: 't2', name: 'Billing', icon: 'i-lucide-credit-card' }
        ]
      }
    }
  }

  // Mock Articles List
  if (url.includes('/api/vicket/articles') && !url.includes('XYZ-NON-EXISTENT-STUFF')) {
    return {
      success: true,
      data: [
        { id: 'a1', title: 'Comment configurer Vicket', slug: 'configurer-vicket', content: '<h2>Etape 1</h2>', category: 'Technique' },
        { id: 'a2', title: 'Facturation FAQ', slug: 'facturation', content: '<h2>Pay</h2>', category: 'Support' }
      ]
    }
  }

  // Mock Empty Search
  if (url.includes('XYZ-NON-EXISTENT-STUFF')) {
    return { success: true, data: [] }
  }
})
