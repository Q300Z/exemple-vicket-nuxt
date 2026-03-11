/**
 * Composable responsible for multi-step navigation logic (SRP).
 */
export const useStepManager = <T extends string>(steps: T[], initialStep: T) => {
  const step = ref<T>(initialStep)
  const history = ref<T[]>([initialStep])

  const goTo = (nextStep: T) => {
    step.value = nextStep
    history.value.push(nextStep)
  }

  const goBack = () => {
    if (history.value.length > 1) {
      history.value.pop()
      step.value = history.value[history.value.length - 1]
    }
  }

  const resetSteps = () => {
    step.value = initialStep
    history.value = [initialStep]
  }

  return {
    step,
    goTo,
    goBack,
    resetSteps
  }
}
