<script setup lang="ts">
/**
 * Individual Message Bubble component (SRP).
 * Handles styling based on author type.
 */
interface Props {
  message: TicketMessage
  authorLabel: string
  avatarColor: string
}
defineProps<Props>()

const formatDate = (date: string) => useDateFormat(date, 'DD MMM HH:mm').value
</script>

<template>
  <div
    :class="[
      'flex gap-4 group',
      message.author_type === 'reporter' ? 'flex-row-reverse' : 'flex-row'
    ]"
  >
    <UAvatar
      :alt="authorLabel"
      size="md"
      class="ring-2 ring-[var(--ui-bg)] shadow-md shrink-0 rounded-xl"
      :color="avatarColor"
      :style="{ viewTransitionName: `ticket-avatar-${message.author_type}` }"
    />

    <div :class="['flex flex-col max-w-[85%] space-y-1.5', message.author_type === 'reporter' ? 'items-end' : 'items-start']">
      <div class="flex items-center gap-2 px-1">
        <span class="text-xs font-bold text-[var(--ui-text-highlighted)]">{{ authorLabel }}</span>
        <span class="text-[10px] text-[var(--ui-text-muted)] font-medium">{{ formatDate(message.created_at) }}</span>
      </div>

      <div
        :class="[
          'px-5 py-3.5 text-sm shadow-sm border transition-all',
          message.author_type === 'reporter'
            ? 'bg-[var(--ui-primary)] text-[var(--ui-bg)] border-transparent rounded-2xl rounded-tr-none'
            : 'bg-[var(--ui-bg)] text-[var(--ui-text-default)] border-[var(--ui-border)] rounded-2xl rounded-tl-none group-hover:border-[color-mix(in_srgb,var(--ui-primary)_30%,var(--ui-border))]'
        ]"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          class="prose prose-sm max-w-none leading-relaxed"
          :class="{ 'prose-invert': message.author_type === 'reporter' }"
          v-html="message.content"
        />

        <div v-if="message.attachments?.length" class="mt-4 flex flex-wrap gap-2 pt-3 border-t border-[color-mix(in_srgb,var(--ui-text-muted)_10%,transparent)]">
          <UButton
            v-for="att in message.attachments"
            :key="att.id"
            :to="att.url"
            target="_blank"
            icon="i-lucide-paperclip"
            size="xs"
            variant="ghost"
            color="neutral"
            class="rounded-lg hover:bg-white/10 dark:hover:bg-white/5"
          >
            {{ att.original_filename }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
