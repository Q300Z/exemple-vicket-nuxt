<script setup lang="ts">
/**
 * Component responsible for rendering a file preview (SRP).
 */
interface Props {
  file: File
  previewUrl?: string
}

const props = defineProps<Props>()
defineEmits(['remove'])

const formattedSize = computed(() => {
  const size = props.file.size / 1024
  return size > 1024 ? `${(size / 1024).toFixed(2)} MB` : `${size.toFixed(0)} KB`
})
</script>

<template>
  <div class="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:border-primary-500/30">
    <!-- Image Thumbnail -->
    <div
      v-if="previewUrl"
      class="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0"
    >
      <img
        :src="previewUrl"
        class="w-full h-full object-cover"
        :alt="file.name"
      />
    </div>

    <!-- Generic Icon -->
    <div
      v-else
      class="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0"
    >
      <UIcon
        name="i-lucide-file"
        class="w-6 h-6 text-primary"
      />
    </div>

    <!-- Meta -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-bold truncate text-gray-900 dark:text-white">
        {{ file.name }}
      </p>
      <p class="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
        {{ formattedSize }}
      </p>
    </div>

    <!-- Actions -->
    <UButton
      icon="i-lucide-trash-2"
      variant="ghost"
      color="error"
      size="sm"
      class="hover:bg-error-50 dark:hover:bg-error-950/30 rounded-full"
      @click="$emit('remove')"
    />
  </div>
</template>
