import { describe, it, expect } from 'vitest'
import { useStepManager } from '../../app/composables/useStepManager'

describe('useStepManager', () => {
  it('should initialize with the correct step', () => {
    const { step } = useStepManager(['step1', 'step2'], 'step1')
    expect(step.value).toBe('step1')
  })

  it('should navigate to next step', () => {
    const { step, goTo } = useStepManager(['step1', 'step2'], 'step1')
    goTo('step2')
    expect(step.value).toBe('step2')
  })

  it('should go back to previous step', () => {
    const { step, goTo, goBack } = useStepManager(['step1', 'step2'], 'step1')
    goTo('step2')
    goBack()
    expect(step.value).toBe('step1')
  })

  it('should reset steps', () => {
    const { step, goTo, resetSteps } = useStepManager(['step1', 'step2'], 'step1')
    goTo('step2')
    resetSteps()
    expect(step.value).toBe('step1')
  })
})
