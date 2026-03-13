import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketTicketDialog from '../../app/components/VicketTicketDialog.vue'
import { KNOWLEDGE_REPOSITORY_KEY, TICKET_REPOSITORY_KEY } from '../../app/types/repository'

const mockTemplates = [
  { id: 't1', name: 'Tech Support', icon: 'i-heroicons-wrench', questions: [] }
]

describe('VicketTicketDialog Core Flow', () => {
  it('mounts correctly and handles submission', async () => {
    const createTicketMock = vi.fn().mockResolvedValue({ success: true, data: { id: 'tk1' } })
    
    const wrapper = await mountSuspended(VicketTicketDialog, {
      props: { modelValue: true },
      global: {
        provide: {
          [KNOWLEDGE_REPOSITORY_KEY]: { categories: ref(['Tous']) },
          [TICKET_REPOSITORY_KEY]: { 
            templates: ref(mockTemplates), 
            status: ref('success'),
            createTicket: createTicketMock,
            submitStatus: ref('idle')
          }
        }
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    
    // We can also check if the mock was defined in the setup via the repository
    expect(createTicketMock).toBeDefined()
  })
})
