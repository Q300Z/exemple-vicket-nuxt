import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LandingFeatures from '../../components/landing/LandingFeatures.vue'
import LandingHero from '../../components/landing/LandingHero.vue'
import LandingStats from '../../components/landing/LandingStats.vue'
import LandingTechSection from '../../components/landing/LandingTechSection.vue'

describe('Landing Components (God Mode)', () => {
  it('renders LandingFeatures correctly', async () => {
    const wrapper = await mountSuspended(LandingFeatures)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders LandingHero correctly', async () => {
    const wrapper = await mountSuspended(LandingHero)
    expect(wrapper.exists()).toBe(true)
    // Try to click primary button if exists
    const btn = wrapper.find('button')
    if (btn.exists()) {
      await btn.trigger('click')
    }
  })

  it('renders LandingStats correctly', async () => {
    const wrapper = await mountSuspended(LandingStats)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders LandingTechSection correctly', async () => {
    const wrapper = await mountSuspended(LandingTechSection)
    expect(wrapper.exists()).toBe(true)
  })
})
