import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useSupportData } from '../../app/composables/useSupportData'

describe('useSupportData Logic', () => {
  it('provides working repositories', async () => {
    const TestComp = defineComponent({
      setup() {
        const { knowledge, tickets, engagement } = useSupportData()
        return { knowledge, tickets, engagement }
      },
      render: () => h('div')
    })

    const wrapper = await mountSuspended(TestComp)
    const vm = wrapper.vm as unknown as { knowledge: object, tickets: object, engagement: object }
    
    // Check repositories existence
    expect(vm.knowledge).toBeDefined()
    expect(vm.tickets).toBeDefined()
    expect(vm.engagement).toBeDefined()
    
    // Check initial state
    expect(vm.knowledge.categories.value).toContain('Tous')
  })
})
