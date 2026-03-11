import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketBreadcrumbs from '../../app/components/VicketBreadcrumbs.vue'

describe('VicketBreadcrumbs', () => {
  it('should generate correct crumbs for /support/my-article', async () => {
    vi.stubGlobal('useRoute', () => ({
      path: '/support/my-article'
    }))

    const wrapper = await mountSuspended(VicketBreadcrumbs)
    const text = wrapper.text()
    
    expect(text).toContain('Accueil')
    expect(text).toContain('Centre de Support')
    expect(text.toLowerCase()).toContain('my article')
  })
})
