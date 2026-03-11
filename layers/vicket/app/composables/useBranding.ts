/**
 * Composable handling theme and branding logic (SRP).
 */
export const useBranding = () => {
  const appConfig = useAppConfig()

  // List of available primary colors in Nuxt UI v4 / Tailwind 4 context
  const availableColors = [
    'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky'
  ]

  const setPrimaryColor = (color: string) => {
    if (availableColors.includes(color)) {
      appConfig.ui.colors.primary = color
    }
  }

  /**
   * Generates a deterministic color based on a string (initials/name)
   */
  const getAvatarColor = (seed: string): string => {
    if (!seed) return 'primary'

    // Explicit colors for known types
    if (seed === 'Support' || seed === 'agent') return 'emerald'
    if (seed === 'You' || seed === 'reporter') return 'primary'
    if (seed === 'System' || seed === 'system') return 'gray'

    // Simple hash function for others
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Pick a color from the list based on hash
    const index = Math.abs(hash) % availableColors.length
    return availableColors[index]
  }
  return {
    availableColors,
    currentPrimary: computed(() => appConfig.ui.colors.primary),
    setPrimaryColor,
    getAvatarColor
  }
}
