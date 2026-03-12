import { describe, it, expect, vi } from 'vitest'
import { useSupportData } from '../../app/composables/useSupportData'

describe('useSupportData (Repository)', () => {
  it('fetchInit should update websiteName', async () => {
    // Mock global $fetch
    global.$fetch = vi.fn().mockResolvedValue({
      success: true,
      data: { website: { name: 'Nuxt 4 Support' } }
    }) as any

    const { tickets } = useSupportData()
    await tickets.fetchInit()

    expect(tickets.websiteName.value).toBe('Nuxt 4 Support')
  })
})
