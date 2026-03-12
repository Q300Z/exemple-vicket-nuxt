/**
 * Abstraction for notifications (DIP).
 * Allows switching between Browser Web Push, UI Toasts, or System Logs.
 */
export interface INotificationProvider {
  notify(title: string, body: string, options?: { icon?: string; tag?: string }): Promise<void>
}

export class BrowserNotificationProvider implements INotificationProvider {
  async notify(title: string, body: string, options?: { icon?: string; tag?: string }) {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    
    if (Notification.permission === 'granted') {
      new Notification(title, { body, ...options })
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        new Notification(title, { body, ...options })
      }
    }
  }
}
