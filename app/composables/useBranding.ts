/**
 * Composable handling theme and branding logic for the DEMO.
 * Defined in 'app/' to keep the 'vicket' layer agnostic.
 */
export const useBranding = () => {
  const appConfig = useAppConfig()

  const availableColors = [
    'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky'
  ]

  const setPrimaryColor = (color: string) => {
    if (availableColors.includes(color)) {
      appConfig.ui.colors.primary = color
    }
  }

  return {
    availableColors,
    currentPrimary: computed(() => appConfig.ui.colors.primary),
    setPrimaryColor
  }
}
