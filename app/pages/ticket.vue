<script setup lang="ts">
import { NOTIFICATION_SERVICE_KEY } from '#vicket/types/interaction'

/**
 * Ticket Thread Orchestrator (Clean Code).
 * Decouples message bubbles and reply logic into domain components.
 */
const route = useRoute()
const notifications = inject(NOTIFICATION_SERVICE_KEY)
if (!notifications) throw new Error('Notification Service not provided')

const { getAvatarColor } = useBranding()
const token = computed(() => String(route.query.token || ''))
const hasToken = computed(() => token.value.trim().length > 0)

const thread = ref<TicketThread | null>(null)
const isLoading = ref(true)
const isSending = ref(false)
const replyBox = ref()

/* ── Ticket Logic Processing (SRP) ── */
const { firstReporterMessage, sortedMessages, summaryAnswers } = useTicketProcessor(thread)

/* ── Polling ── */
const { isPolling, startPolling } = useTicketPolling(token, (updatedData) => {
  if (updatedData.messages.length !== thread.value?.messages.length) {
    thread.value = updatedData
  }
})

/* ── Methods ── */
const { t } = useI18n()

const AUTHOR_LABELS: Record<string, string> = {
  reporter: t('vicket.author_you'),
  agent: t('vicket.author_agent'),
  system: t('vicket.author_system')
}

const loadThread = async () => {
  if (!hasToken.value) return (isLoading.value = false)
  isLoading.value = true
  try {
    const data = await fetchTicketThread(token.value)
    thread.value = data
    if (data.status?.label.toLowerCase() !== 'closed') startPolling()
  } catch {
    notifications.error('Erreur', t('vicket.error_load_thread'))
  } finally { isLoading.value = false }
}

const onReply = async ({ content, files }: { content: string, files: File[] }) => {
  if (!content.trim() && files.length === 0) return notifications.warn('Validation', t('vicket.msg_required'))
  isSending.value = true
  try {
    await sendReply(token.value, content.trim(), files)
    replyBox.value?.clear()
    notifications.success('Succès', t('vicket.reply_sent'))
    await loadThread()
  } catch {
    notifications.error('Erreur', t('vicket.reply_failed'))
  } finally { isSending.value = false }
}

const formatDate = (date: string) => useDateFormat(date, 'DD MMM HH:mm').value

watch(() => token.value, () => loadThread(), { immediate: true })
</script>

<template>
  <UContainer class="py-8 max-w-3xl">
    <NuxtErrorBoundary>
      <div class="mb-6 flex items-center justify-between">
        <UButton to="/support" icon="i-lucide-arrow-left" variant="ghost" color="neutral" size="sm" class="rounded-full" />
        <div v-if="isPolling && thread" class="flex items-center gap-2 animate-in fade-in">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ui-success)] opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--ui-success)]" />
          </span>
          <span class="text-[10px] font-bold text-[var(--ui-text-muted)] uppercase tracking-widest">{{ $t('vicket.live_active') }}</span>
        </div>
      </div>

      <div v-if="isLoading" class="space-y-6">
        <USkeleton class="h-10 w-3/4" />
        <UCard><div class="space-y-4"><USkeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-xl" /></div></UCard>
      </div>

      <div v-else-if="thread" class="space-y-8">
        <!-- Header -->
        <div class="space-y-4">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <h1 class="text-3xl font-bold tracking-tight text-[var(--ui-text-highlighted)]">{{ thread.title }}</h1>
            <UBadge v-if="thread.id" variant="subtle" color="neutral" class="font-mono">#{{ thread.id.slice(0, 8) }}</UBadge>
          </div>
          <div class="flex items-center gap-3">
            <VicketStatusBadge v-if="thread.status?.label" :label="thread.status.label" />
            <UBadge v-if="thread.priority?.label && thread.priority.label.toLowerCase() !== 'low'" color="warning" variant="subtle">{{ $t('vicket.priority', { label: thread.priority.label }) }}</UBadge>
          </div>
        </div>

        <!-- Summary -->
        <UCard v-if="summaryAnswers.length > 0" class="subtle-gradient overflow-hidden border-[color-mix(in_srgb,var(--ui-primary)_10%,var(--ui-border))]">
          <template #header><span class="font-bold">{{ $t('vicket.form_details') }}</span></template>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div v-for="answer in summaryAnswers" :key="answer.id" class="space-y-1">
              <p class="text-[10px] font-bold text-[var(--ui-text-muted)] uppercase">{{ answer.question_label }}</p>
              <p class="text-sm">{{ answer.answer || '-' }}</p>
            </div>
          </div>
        </UCard>

        <!-- Initial Message -->
        <UCard v-if="firstReporterMessage" class="subtle-gradient border-[var(--ui-border)]">
          <template #header><span class="font-bold">{{ $t('vicket.initial_message') }}</span></template>
          <VicketContentRenderer :content="firstReporterMessage.content" />
        </UCard>

        <!-- Thread History -->
        <div class="space-y-10 pt-4">
          <div v-for="message in sortedMessages" :key="message.id">
            <!-- Timeline System Message -->
            <div v-if="message.author_type === 'system'" class="flex justify-center my-4">
              <div class="flex items-center gap-3 px-4 py-1 rounded-full bg-[var(--ui-bg-accented)] border border-[var(--ui-border)] text-[11px] text-[var(--ui-text-muted)] italic">
                <div v-html="message.content" />
                <span class="text-[9px] font-bold uppercase">{{ formatDate(message.created_at) }}</span>
              </div>
            </div>

            <!-- Chat Bubble -->
            <TicketMessageBubble
              v-else
              :message="message"
              :author-label="AUTHOR_LABELS[message.author_type]"
              :avatar-color="getAvatarColor(message.author_type)"
            />
          </div>
        </div>

        <!-- Reply Area -->
        <TicketReplyBox
          v-if="thread.status?.label.toLowerCase() !== 'closed'"
          ref="replyBox"
          :is-sending="isSending"
          @submit="onReply"
        />
      </div>

      <template #error="{ error, recover }">
        <VicketErrorFallback :error="error" @retry="loadThread().then(() => recover())" />
      </template>
    </NuxtErrorBoundary>
  </UContainer>
</template>
