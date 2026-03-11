/**
 * Composable handling global support UI state (SRP).
 */
export const useSupportState = () => {
  const isDialogOpen = useState('vicket-dialog-open', () => false)
  const templates = useState<Template[]>('vicket-templates', () => [])
  const isLoading = useState('vicket-loading', () => false)
  const loadError = useState<string | null>('vicket-load-error', () => null)

  const openDialog = () => {
    console.log('Vicket: openDialog called')
    isDialogOpen.value = true
    if (templates.value.length === 0 && !isLoading.value) {
      loadTemplates()
    }
  }

  const loadTemplates = async () => {
    isLoading.value = true
    loadError.value = null
    try {
      const data = await fetchSupportInit()
      templates.value = data.templates || []
      console.log('[Vicket] Templates loaded:', templates.value.length)
    } catch (error: unknown) {
      console.error('Failed to load Vicket templates:', error)
      loadError.value = error.message || 'Erreur inconnue'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isDialogOpen,
    templates,
    isLoading,
    loadError,
    openDialog,
    loadTemplates
  }
}
