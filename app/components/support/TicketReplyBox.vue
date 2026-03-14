<script setup lang="ts">
/**
 * Ticket Reply area (SRP).
 * Self-contained file handling and composition logic.
 */
interface Props {
  isSending: boolean
}
defineProps<Props>()
const emit = defineEmits(['submit'])

const content = defineModel<string>({ default: '' })
const { previews, addFiles, removeFile, getBucket } = useFiles()
const replyFiles = getBucket('reply')

const handleSubmit = () => {
  emit('submit', { 
    content: content.value, 
    files: replyFiles.value 
  })
}

// Exposed for the parent to clear after success
defineExpose({
  clear: () => {
    content.value = ''
    // clearAll from useFiles handles all buckets, but here we just need reply logic
  }
})
</script>

<template>
  <UCard class="ring-2 ring-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] shadow-xl overflow-hidden mt-12">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <UTextarea
        v-model="content"
        :placeholder="$t('vicket.reply_placeholder')"
        :rows="4"
        autoresize
        variant="none"
        class="w-full text-base p-4 focus:ring-0 text-[var(--ui-text-default)]"
      />

      <div class="p-4 bg-[color-mix(in_srgb,var(--ui-bg-accented)_50%,transparent)] border-t border-[var(--ui-border)] space-y-4">
        <VicketFileDropZone @files-added="addFiles('reply', $event)" />

        <div v-if="replyFiles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            :label="$t('vicket.send_reply')"
            class="rounded-full px-8 shadow-lg shadow-[color-mix(in_srgb,var(--ui-primary)_20%,transparent)]"
            :ui="{ label: 'text-[var(--ui-bg)] font-bold' }"
          />
        </div>
      </div>
    </form>
  </UCard>
</template>
