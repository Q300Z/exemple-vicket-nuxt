/**
 * Composable responsible for system status simulation/fetching (SRP).
 */
export const useSystemStatus = () => {
  const status = useState<'operational' | 'degraded' | 'outage'>('system-status', () => 'operational')
  const lastChecked = useState('system-status-checked', () => new Date().toISOString())

  const checkStatus = async () => {
    // In a real app, fetch from Statuspage or your API
    // Here we simulate stability
    lastChecked.value = new Date().toISOString()
  }

  const statusLabel = computed(() => {
    switch (status.value) {
      case 'operational': return 'Tous les systèmes sont opérationnels'
      case 'degraded': return 'Performances dégradées'
      case 'outage': return 'Interruption de service'
      default: return 'État inconnu'
    }
  })

  const statusColor = computed(() => {
    switch (status.value) {
      case 'operational': return 'success'
      case 'degraded': return 'warning'
      case 'outage': return 'error'
      default: return 'neutral'
    }
  })

  return {
    status,
    statusLabel,
    statusColor,
    lastChecked,
    checkStatus
  }
}
