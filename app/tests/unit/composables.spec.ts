import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useReadingProgress } from '../../composables/useReadingProgress'

describe('useReadingProgress', () => {
  it('calculates progress correctly on scroll', async () => {
    // Define properties on documentElement
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 250, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, configurable: true })

    // We need a component to trigger onMounted
    let scrollProgress: { value: number }
    const TestComponent = defineComponent({
      setup() {
        const res = useReadingProgress()
        scrollProgress = res.scrollProgress
        return () => h('div')
      }
    })

    mount(TestComponent)
    
    // Trigger scroll event manually
    window.dispatchEvent(new Event('scroll'))
    
    expect(scrollProgress.value).toBe(50)
  })

  it('handles zero height documents', async () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 500, configurable: true })
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, configurable: true })
    
    let scrollProgress: { value: number }
    const TestComponent = defineComponent({
      setup() {
        const res = useReadingProgress()
        scrollProgress = res.scrollProgress
        return () => h('div')
      }
    })

    mount(TestComponent)
    window.dispatchEvent(new Event('scroll'))
    
    expect(scrollProgress.value).toBe(0)
  })
})
