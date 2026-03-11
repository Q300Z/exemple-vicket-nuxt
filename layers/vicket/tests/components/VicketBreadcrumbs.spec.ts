import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketBreadcrumbs from '../../app/components/VicketBreadcrumbs.vue'

describe.skip("VicketBreadcrumbs", () => {
  it('should generate correct crumbs for /support/my-article', async () => {
    // Better mock for route
    vi.stubGlobal('useRoute', () => ({
      path: '/support/my-article',
      matched: []
    }))

    const wrapper = await mountSuspended(VicketBreadcrumbs)
    
    // Nuxt UI might render items in a way that wrapper.text() is empty initially
    // Check HTML content or items computed property
    const html = wrapper.html()
    
    expect(html).toContain('Accueil')
    expect(html).toContain('Centre de Support')
  })
})
