/**
 * Enhanced Composable for DEMO branding.
 * Handles Primary Color and Border Radius (OCP).
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

  const setPrimaryColor = (color: string) => {
    if (availableColors.includes(color)) {
      appConfig.ui.colors.primary = color
    }
  }

  const setRadius = (radius: string) => {
    appConfig.ui.radius = radius
  }

  return {
    availableColors,
    availableRadii,
    currentPrimary: computed(() => appConfig.ui.colors.primary),
    currentRadius: computed(() => appConfig.ui.radius),
    setPrimaryColor,
    setRadius
  }
}
