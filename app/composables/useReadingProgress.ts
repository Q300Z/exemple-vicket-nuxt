/**
 * Composable handling reading progress calculation (SRP).
 * Decouples DOM logic from Page components.
 */
export const useReadingProgress = () => {
  const scrollProgress = ref(0)

  const updateProgress = () => {
    const winScroll = document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    scrollProgress.value = height > 0 ? (winScroll / height) * 100 : 0
  }

  onMounted(() => {
    window.addEventListener('scroll', updateProgress, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateProgress)
  })

  return {
    scrollProgress
  }
}
