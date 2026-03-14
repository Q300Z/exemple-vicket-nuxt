import { 
  KNOWLEDGE_REPOSITORY_KEY, 
  TICKET_REPOSITORY_KEY, 
  ENGAGEMENT_REPOSITORY_KEY 
} from '#vicket/types/repository'
import { NOTIFICATION_SERVICE_KEY } from '#vicket/types/interaction'

export default defineNuxtPlugin((nuxtApp) => {
  const { knowledge, tickets, engagement } = useSupportData()
  const notificationService = useNotificationService()

  // Provide via injection keys for components that use inject()
  // Directly on the vueApp instance for immediate availability
  nuxtApp.vueApp.provide(KNOWLEDGE_REPOSITORY_KEY, knowledge)
  nuxtApp.vueApp.provide(TICKET_REPOSITORY_KEY, tickets)
  nuxtApp.vueApp.provide(ENGAGEMENT_REPOSITORY_KEY, engagement)
  nuxtApp.vueApp.provide(NOTIFICATION_SERVICE_KEY, notificationService)

  return {
    provide: {
      vicket: {
        knowledge,
        tickets,
        engagement,
        notificationService
      }
    }
  }
})
