import { 
  KNOWLEDGE_REPOSITORY_KEY, 
  TICKET_REPOSITORY_KEY, 
  ENGAGEMENT_REPOSITORY_KEY 
} from '#vicket/types/repository'
import { NOTIFICATION_SERVICE_KEY } from '#vicket/types/interaction'

/**
 * Composable responsible for injecting Vicket services into the application (DIP).
 * Keeps app.vue clean and centralizes the provider logic.
 */
export const useVicketInjection = () => {
  const { knowledge, tickets, engagement } = useSupportData()
  const notificationService = useNotificationService()

  // Provide for DIP (Specialized interfaces)
  provide(KNOWLEDGE_REPOSITORY_KEY, knowledge)
  provide(TICKET_REPOSITORY_KEY, tickets)
  provide(ENGAGEMENT_REPOSITORY_KEY, engagement)
  provide(NOTIFICATION_SERVICE_KEY, notificationService)

  return {
    knowledge,
    tickets,
    engagement,
    notificationService
  }
}
