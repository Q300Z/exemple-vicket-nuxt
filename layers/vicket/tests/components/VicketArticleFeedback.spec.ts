import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketArticleFeedback from '../../app/components/VicketArticleFeedback.vue'
import { NOTIFICATION_SERVICE_KEY, ENGAGEMENT_REPOSITORY_KEY } from '../../app/types/repository'

// Mock confetti globally for this test file
vi.mock('canvas-confetti', () => ({
  default: vi.fn().mockResolvedValue(undefined)
}))

describe('VicketArticleFeedback', () => {
  const mockNotification = { success: vi.fn(), error: vi.fn() }
  const mockEngagement = { submitFeedback: vi.fn() }

  it('renders feedback buttons', async () => {
    const wrapper = await mountSuspended(VicketArticleFeedback, {
      props: { articleId: '123' },
      global: {
        provide: {
          [NOTIFICATION_SERVICE_KEY as any]: mockNotification,
          [ENGAGEMENT_REPOSITORY_KEY as any]: mockEngagement
        }
      }
    })
    
    expect(wrapper.text()).toContain('aidé')
    expect(wrapper.findAll('button').length).toBe(2)
  })

  it.skip('handles positive feedback', async () => {
    const wrapper = await mountSuspended(VicketArticleFeedback, {
      props: { articleId: '123' },
      global: {
        provide: {
          [NOTIFICATION_SERVICE_KEY as any]: mockNotification,
          [ENGAGEMENT_REPOSITORY_KEY as any]: mockEngagement
        }
      }
    })
    
    const yesBtn = wrapper.find('button')
    
    if (!yesBtn.exists()) {
      throw new Error('No buttons found in VicketArticleFeedback')
    }
    
    mockEngagement.submitFeedback.mockResolvedValue({ success: true })
    await yesBtn.trigger('click')
    
    // Wait for the async handleVote logic
    await new Promise(resolve => setTimeout(resolve, 300))
    
    expect(mockEngagement.submitFeedback).toHaveBeenCalled()
    expect(mockNotification.success).toHaveBeenCalled()
  })
})
