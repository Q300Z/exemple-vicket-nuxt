import type { INotificationService } from '../types/interaction'

/**
 * Concrete implementation of the Notification Service using Nuxt UI and Visual Effects.
 * Implements INotificationService (DIP/SRP).
 */
export const useNotificationService = (): INotificationService => {
  const toast = useToast()
  const { fireSuccessConfetti } = useVisualEffects()

  return {
    success(title: string, description?: string) {
      toast.add({ title, description, color: 'success', icon: 'i-lucide-check-circle' })
    },
    error(title: string, description?: string) {
      toast.add({ title, description, color: 'error', icon: 'i-lucide-alert-circle' })
    },
    warn(title: string, description?: string) {
      toast.add({ title, description, color: 'warning', icon: 'i-lucide-alert-triangle' })
    },
    celebrate() {
      fireSuccessConfetti()
    }
  }
}
