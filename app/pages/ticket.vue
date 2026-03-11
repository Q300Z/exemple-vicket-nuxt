<script setup lang="ts">
import { NOTIFICATION_SERVICE_KEY } from '../../layers/vicket/app/types/interaction'

/* ── State ── */
const route = useRoute()
const notifications = inject(NOTIFICATION_SERVICE_KEY)
if (!notifications) throw new Error('Notification Service not provided')

const { getAvatarColor } = useBranding()
const token = computed(() => String(route.query.token || ''))
const hasToken = computed(() => token.value.trim().length > 0)

const thread = ref<TicketThread | null>(null)
const content = ref('')
const isLoading = ref(true)
const isSending = ref(false)

const { previews, addFiles, removeFile, clearAll, getBucket } = useFiles()
const replyFiles = getBucket('reply')

/* ── Polling Logic (SRP / DIP) ── */
const { isPolling, startPolling } = useTicketPolling(token, (updatedData) => {
  // Only update if new messages arrive to avoid flashing (SRP: comparison logic)
  if (updatedData.messages.length !== thread.value?.messages.length) {
    thread.value = updatedData
  }
})

/* ── Computed ── */
const firstReporterMessage = computed(() => {
  if (!thread.value?.messages) return null
  const sorted = [...thread.value.messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  return sorted.find(m => m.author_type === 'reporter') || null
})

const sortedMessages = computed(() => {
  if (!thread.value?.messages) return []
  return [...thread.value.messages]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .filter(m => !firstReporterMessage.value || m.id !== firstReporterMessage.value.id)
})

const summaryAnswers = computed(() => {
  if (!thread.value?.answers) return []
  return thread.value.answers.filter((answer) => {
    if (answer.attachments && answer.attachments.length > 0) return true
    if (answer.answer && answer.answer.trim().length > 0) return true
    return false
  })
})

/* ── Methods ── */
const loadThread = async () => {
  if (!hasToken.value) {
    isLoading.value = false
    notifications.error('Erreur', 'Jeton de ticket manquant.')
    return
  }

  isLoading.value = true
  try {
    const data = await fetchTicketThread(token.value)
    thread.value = data

    // Start polling once loaded (OCP: extensibility)
    if (data.status?.label.toLowerCase() !== 'closed') {
      startPolling()
    }
  } catch (loadError) {
    notifications.error(
      'Erreur de chargement',
      loadError instanceof Error ? loadError.message : 'Impossible de charger le ticket.'
    )
    throw loadError // Re-throw for Error Boundary
  } finally {
    isLoading.value = false
  }
}

const onSubmitReply = async () => {
  if (!content.value.trim() && replyFiles.value.length === 0) {
    notifications.warn('Validation', 'Le contenu du message est requis.')
    return
  }

  isSending.value = true
  try {
    await sendReply(token.value, content.value.trim(), replyFiles.value)
    content.value = ''
    clearAll()
    notifications.success('Succès', 'Réponse envoyée.')
    await loadThread() // Refresh and reset polling
  } catch (replyError) {
    notifications.error(
      'Erreur',
      replyError instanceof Error ? replyError.message : 'Impossible d\'envoyer la réponse.'
    )
  } finally {
    isSending.value = false
  }
}

/* ── Lifecycle ── */
watch(
  () => token.value,
  () => {
    void loadThread()
  },
  { immediate: true }
)
</script>

<template>
  <UContainer class="py-8 max-w-3xl">
    <NuxtErrorBoundary>
      <!-- Back link & Live Status -->
      <div class="mb-6 flex items-center justify-between">
        <UButton
          to="/support"
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
          class="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          Retour au support
        </UButton>

        <div
          v-if="isPolling && thread"
          class="flex items-center gap-2 animate-in fade-in duration-500"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Suivi en direct actif
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="isLoading"
        class="space-y-6"
      >
        <div class="space-y-3">
          <USkeleton class="h-10 w-3/4" />
          <div class="flex gap-2">
            <USkeleton class="h-6 w-20 rounded-full" />
            <USkeleton class="h-6 w-16 rounded-full" />
          </div>
        </div>
        <UCard>
          <template #header>
            <USkeleton class="h-5 w-32" />
          </template>
          <div class="space-y-4">
            <USkeleton
              v-for="i in 3"
              :key="i"
              class="h-20 w-full rounded-xl"
            />
          </div>
        </UCard>
      </div>

      <!-- Thread -->
      <div
        v-else-if="thread"
        class="space-y-8"
      >
        <!-- Header -->
        <div class="space-y-4">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{ thread.title }}
            </h1>
            <div class="flex items-center gap-2">
              <UBadge
                v-if="thread.id"
                variant="subtle"
                color="neutral"
                class="font-mono px-3 py-1"
              >
                #{{ thread.id.slice(0, 8) }}
              </UBadge>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <VicketStatusBadge
              v-if="thread.status?.label"
              :label="thread.status.label"
            />
            <UBadge
              v-if="thread.priority?.label && thread.priority.label.toLowerCase() !== 'low'"
              color="warning"
              variant="subtle"
              class="px-3 py-1 rounded-full"
            >
              Priorité : {{ thread.priority.label }}
            </UBadge>
          </div>
        </div>

        <!-- Summary -->
        <UCard
          v-if="summaryAnswers.length > 0"
          class="subtle-gradient overflow-hidden border-primary-100 dark:border-primary-900/30"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-clipboard-list"
                class="w-5 h-5 text-primary"
              />
              <span class="font-bold text-gray-900 dark:text-white">Détails du formulaire</span>
            </div>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              v-for="answer in summaryAnswers"
              :key="answer.id"
              class="space-y-1.5"
            >
              <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {{ answer.question_label || "Question" }}
              </p>
              <div class="text-sm text-gray-700 dark:text-gray-300">
                <div
                  v-if="answer.attachments && answer.attachments.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <UButton
                    v-for="attachment in answer.attachments"
                    :key="attachment.id"
                    :to="attachment.url"
                    target="_blank"
                    icon="i-lucide-paperclip"
                    size="xs"
                    variant="soft"
                    color="primary"
                    class="rounded-lg"
                  >
                    {{ attachment.original_filename }}
                  </UButton>
                </div>
                <p
                  v-else
                  class="whitespace-pre-wrap leading-relaxed"
                >
                  {{ formatAnswerText(answer.answer) || "-" }}
                </p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Description -->
        <UCard
          v-if="firstReporterMessage"
          class="subtle-gradient"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-message-square"
                class="w-5 h-5 text-primary"
              />
              <span class="font-bold text-gray-900 dark:text-white">Message initial</span>
            </div>
          </template>
          <VicketContentRenderer :content="firstReporterMessage.content" />
          <template
            v-if="firstReporterMessage.attachments?.length"
            #footer
          >
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="att in firstReporterMessage.attachments"
                :key="att.id"
                :to="att.url"
                target="_blank"
                icon="i-lucide-image"
                size="sm"
                variant="soft"
                color="neutral"
              >
                {{ att.original_filename }}
              </UButton>
            </div>
          </template>
        </UCard>

        <!-- Conversation -->
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <UIcon
                name="i-lucide-history"
                class="w-5 h-5 text-primary"
              />
              Historique des échanges
            </h2>
          </div>

          <!-- Messages -->
          <div class="space-y-10 pt-4">
            <div
              v-if="sortedMessages.length === 0"
              class="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800"
            >
              <UIcon
                name="i-lucide-message-circle-off"
                class="w-12 h-12 text-gray-300 mx-auto mb-3"
              />
              <p class="text-gray-500">
                Aucun autre message pour le moment.
              </p>
            </div>
            <div
              v-for="message in sortedMessages"
              :key="message.id"
            >
              <!-- ── SYSTEM MESSAGE (Timeline Style) ── -->
              <div
                v-if="message.author_type === 'system'"
                class="flex justify-center my-4"
              >
                <div class="flex items-center gap-3 px-4 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <UIcon
                    name="i-lucide-info"
                    class="w-3.5 h-3.5 text-gray-500"
                  />
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div
                    class="text-[11px] font-medium text-gray-500 italic"
                    v-html="message.content"
                  />
                  <span class="text-[9px] text-gray-500 font-bold uppercase ml-1">
                    {{ formatDate(message.created_at) }}
                  </span>
                </div>
              </div>

              <!-- ── USER/AGENT MESSAGE (Bubble Style) ── -->
              <div
                v-else
                :class="[
                  'flex gap-4 group',
                  message.author_type === 'reporter' ? 'flex-row-reverse' : 'flex-row'
                ]"
              >
                <!-- Avatar -->
                <UAvatar
                  :alt="AUTHOR_LABELS[message.author_type] || '?'"
                  size="md"
                  class="ring-2 ring-white dark:ring-gray-900 shadow-md shrink-0"
                  :color="getAvatarColor(message.author_type)"
                  :ui="{ rounded: 'rounded-xl' }"
                />

                <div :class="['flex flex-col max-w-[85%] space-y-1.5', message.author_type === 'reporter' ? 'items-end' : 'items-start']">
                  <div class="flex items-center gap-2 px-1">
                    <span class="text-xs font-bold text-gray-900 dark:text-white">
                      {{ AUTHOR_LABELS[message.author_type] || message.author_type }}
                    </span>
                    <span class="text-[10px] text-gray-500 font-medium">
                      {{ formatDate(message.created_at) }}
                    </span>
                  </div>

                  <div
                    :class="[
                      'px-5 py-3.5 text-sm shadow-sm border transition-all',
                      message.author_type === 'reporter'
                        ? 'bg-primary-600 text-white border-transparent rounded-2xl rounded-tr-none'
                        : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-none group-hover:border-primary-500/30'
                    ]"
                  >
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div
                      class="prose prose-sm max-w-none leading-relaxed"
                      :class="{ 'prose-invert': message.author_type === 'reporter' }"
                      v-html="message.content"
                    />

                    <div
                      v-if="message.attachments?.length"
                      class="mt-4 flex flex-wrap gap-2 pt-3 border-t border-black/5 dark:border-white/5"
                    >
                      <UButton
                        v-for="att in message.attachments"
                        :key="att.id"
                        :to="att.url"
                        target="_blank"
                        icon="i-lucide-paperclip"
                        size="xs"
                        variant="ghost"
                        :color="message.author_type === 'reporter' ? 'white' : 'primary'"
                        class="rounded-lg hover:bg-white/10 dark:hover:bg-white/5"
                      >
                        {{ att.original_filename }}
                      </UButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Compose -->
          <UCard
            v-if="thread.status?.label.toLowerCase() !== 'closed'"
            class="ring-2 ring-primary-500/10 shadow-xl overflow-hidden mt-12"
          >
            <form
              class="space-y-4"
              @submit.prevent="onSubmitReply"
            >
              <UTextarea
                v-model="content"
                placeholder="Écrivez votre message de réponse..."
                :rows="4"
                autoresize
                variant="none"
                class="w-full text-base p-4 focus:ring-0"
              />

              <div class="p-4 bg-gray-50/50 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <VicketFileDropZone @files-added="addFiles('reply', $event)" />

                <div
                  v-if="replyFiles.length > 0"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  <VicketFilePreview
                    v-for="(file, i) in replyFiles"
                    :key="file.name"
                    :file="file"
                    :preview-url="previews[`reply-${file.name}`]"
                    @remove="removeFile('reply', i)"
                  />
                </div>

                <div class="flex justify-end">
                  <UButton
                    type="submit"
                    icon="i-lucide-send"
                    size="lg"
                    :loading="isSending"
                    class="rounded-full px-8 shadow-lg shadow-primary-500/20"
                  >
                    Envoyer la réponse
                  </UButton>
                </div>
              </div>
            </form>
          </UCard>
        </div>
      </div>

      <!-- Fallback UI -->
      <template #error="{ error, recover }">
        <VicketErrorFallback
          :error="error"
          @retry="loadThread().then(() => recover())"
        />
      </template>
    </NuxtErrorBoundary>
  </UContainer>
</template>
