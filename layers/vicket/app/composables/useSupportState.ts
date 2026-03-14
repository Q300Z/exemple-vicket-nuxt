import type { TicketTemplate, SupportInitResponse } from '../types/vicket'

/**
 * Composable handling global support UI state (SRP).
 */
export const useSupportState = () => {
  const isDialogOpen = useState('vicket-dialog-open', () => false)
  const templates = useState<TicketTemplate[]>('vicket-templates', () => [])
  const isFallback = useState<boolean>('vicket-is-fallback', () => false)
  const isLoading = useState('vicket-loading', () => false)
  const loadError = useState<string | null>('vicket-load-error', () => null)
  const prefilledData = useState<{ template_id?: string, answers?: Record<string, string> } | null>('vicket-prefilled-data', () => null)
  const customValidators = useState<Record<string, unknown>>('vicket-custom-validators', () => ({}))
  const isDistractionFree = useState('vicket-distraction-free', () => false)
  const apiLatency = useState<number | null>('vicket-api-latency', () => null)

  const openDialog = (data?: { template_id?: string, answers?: Record<string, string> }) => {
    prefilledData.value = data || null
    isDialogOpen.value = true
    if (templates.value.length === 0 && !isLoading.value) {
      loadTemplates()
    }
  }

  const loadTemplates = async () => {
    isLoading.value = true
    loadError.value = null
    const start = Date.now()
    try {
      const response = await $fetch<SupportInitResponse>('/api/vicket/init')
      const end = Date.now()
      apiLatency.value = end - start
      
      const data = response.data
      templates.value = data.templates || []
      isFallback.value = !!data.isFallback
      // eslint-disable-next-line no-console
      console.log('[Vicket] Templates loaded:', templates.value.length, 'Fallback:', isFallback.value, 'Latency:', apiLatency.value, 'ms')
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to load Vicket templates:', error)
      loadError.value = error instanceof Error ? error.message : 'Erreur inconnue'
      // If server failed, we might still want to trigger fallback UI
      isFallback.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    isDialogOpen,
    templates,
    isFallback,
    isLoading,
    loadError,
    prefilledData,
    customValidators,
    isDistractionFree,
    apiLatency,
    openDialog,
    loadTemplates
  }
}
