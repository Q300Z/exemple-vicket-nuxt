import { describe, it, expect } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { useSupportData } from '../../app/composables/useSupportData'

describe('useSupportData (Repository)', () => {
  it('fetchInit should update websiteName', async () => {
    // Official Nuxt 4 way to mock API responses
    registerEndpoint('/api/vicket/init', () => ({
      success: true,
      data: { website: { name: 'Nuxt 4 Support' }, templates: [] }
    }))

    const repo = useSupportData()
    await repo.fetchInit()

    expect(repo.websiteName.value).toBe('Nuxt 4 Support')
  })
})
