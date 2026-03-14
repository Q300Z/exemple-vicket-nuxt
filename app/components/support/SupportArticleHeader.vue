<script setup lang="ts">
/**
 * Elite Article Header component (SRP).
 * Refined typography and structured meta-data pills.
 */
interface Props {
  articleId: string
  title: string
  category?: string
  slug: string
  content?: string
}
const props = defineProps<Props>()

const readingTime = computed(() => calculateReadingTime(props.content || ''))

const { t } = useI18n()
const notifications = inject(NOTIFICATION_SERVICE_KEY)

// --- COPY LOGIC ---
const { copy, copied } = useClipboard()

const onCopy = () => {
  const url = `${window.location.origin}/support/${props.slug}`
  copy(url)
  if (notifications) {
    notifications.success(t('common.success'), t('common.link_copied'))
  }
}

const onShare = async () => {
  const url = `${window.location.origin}/support/${props.slug}`
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.title,
        text: t('support.article.share_text', { title: props.title }),
        url
      })
    } catch (err: unknown) {
      // User cancelled
    }
  } else {
    onCopy()
  }
}
</script>

<template>
  <header class="space-y-10 pb-12 border-b border-[var(--ui-border)]">
    <div class="space-y-6">
      <UBadge
        v-if="category"
        size="md"
        variant="subtle"
        class="rounded-full px-5 font-bold tracking-wide uppercase text-[10px]"
      >
        {{ category }}
      </UBadge>
      
      <h1
        class="text-5xl sm:text-7xl font-black tracking-tighter text-[var(--ui-text-highlighted)] leading-[1.05]"
        :style="{ viewTransitionName: `article-title-${articleId}` }"
      >
        {{ title }}
      </h1>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-8">
      <!-- Meta Pills -->
      <div class="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 shadow-sm">
          <UIcon name="i-lucide-calendar" class="w-4 h-4 text-[var(--ui-primary)]" />
          <span>{{ $t('support.article.recently_updated') }}</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 shadow-sm">
          <UIcon name="i-lucide-clock" class="w-4 h-4 text-[var(--ui-primary)]" />
          <span>{{ $t('support.article.reading_time', { minutes: readingTime }) }}</span>
        </div>
      </div>

      <!-- Action Group -->
      <div class="flex items-center gap-3">
        <UButton
          :icon="copied ? 'i-lucide-check' : 'i-lucide-link'"
          :color="copied ? 'success' : 'neutral'"
          variant="soft"
          class="rounded-full h-11 flex items-center justify-center hover:scale-110 transition-all duration-300 min-w-[44px]"
          aria-label="Copier le lien"
          @click="onCopy"
        />
        <UButton
          icon="i-lucide-share-2"
          variant="soft"
          color="neutral"
          class="rounded-full w-11 h-11 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Partager l'article"
          @click="onShare"
        />
      </div>
    </div>
  </header>
</template>
