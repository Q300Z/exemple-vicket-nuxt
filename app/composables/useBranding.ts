/**
 * Enhanced Composable for DEMO branding with persistence (OCP).
 * Handles Primary Color and Border Radius using LocalStorage.
 */
export const useBranding = () => {
  const appConfig = useAppConfig()

  const availableColors = [
    'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky'
  ]

  // Persistance (VueUse)
  const persistedColor = useLocalStorage('vicket-branding-color', appConfig.ui.colors.primary)

  // Sync with AppConfig on init and changes
  watchEffect(() => {
    appConfig.ui.colors.primary = persistedColor.value
  })

  const setPrimaryColor = (color: string) => {
    if (availableColors.includes(color)) {
      persistedColor.value = color
    }
  }

  const getAvatarColor = (type: string) => {
    if (type === 'reporter') return persistedColor.value
    if (type === 'agent') return 'neutral'
    return 'neutral'
  }

  return {
    availableColors,
    currentPrimary: computed(() => persistedColor.value),
    setPrimaryColor,
    getAvatarColor
  }
}
