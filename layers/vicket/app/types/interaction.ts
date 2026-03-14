import type { InjectionKey } from 'vue'

/**
 * Interface defining the contract for UI Interactions (Toasts, Effects, etc.) (DIP).
 */
export interface INotificationService {
  /**
   * Shows a success notification.
   */
  success(title: string, description?: string): void

  /**
   * Shows an error notification.
   */
  error(title: string, description?: string): void

  /**
   * Shows a warning notification.
   */
  warn(title: string, description?: string): void

  /**
   * Triggers a visual celebration (e.g. confetti).
   */
  celebrate(): void
}

/**
 * Injection Key for the Notification Service.
 */
export const NOTIFICATION_SERVICE_KEY = 'NOTIFICATION_SERVICE' as unknown as InjectionKey<INotificationService>
