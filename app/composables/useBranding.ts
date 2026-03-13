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

  const availableRadii = [
    { label: 'Carré', value: 'none' },
    { label: 'Fin', value: 'sm' },
    { label: 'Standard', value: 'md' },
    { label: 'Arrondi', value: 'lg' },
    { label: 'Pillule', value: 'xl' }
  ]

  // Persistance (VueUse)
  const persistedColor = useLocalStorage('vicket-branding-color', appConfig.ui.colors.primary)
  const persistedRadius = useLocalStorage('vicket-branding-radius', appConfig.ui.radius)

  // Sync with AppConfig on init and changes
  watchEffect(() => {
    appConfig.ui.colors.primary = persistedColor.value
    appConfig.ui.radius = persistedRadius.value
  })

  const setPrimaryColor = (color: string) => {
    if (availableColors.includes(color)) {
      persistedColor.value = color
    }
  }

  const setRadius = (radius: string) => {
    persistedRadius.value = radius
  }

  const getAvatarColor = (type: string) => {
    if (type === 'reporter') return persistedColor.value
    if (type === 'agent') return 'neutral'
    return 'neutral'
  }

  return {
    availableColors,
    availableRadii,
    currentPrimary: computed(() => persistedColor.value),
    currentRadius: computed(() => persistedRadius.value),
    setPrimaryColor,
    setRadius,
    getAvatarColor
  }
}
