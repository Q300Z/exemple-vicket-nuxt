<script setup lang="ts">
/**
 * Component responsible for file drop zone UI and events (SRP).
 */
const emit = defineEmits(['files-added'])

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    emit('files-added', e.dataTransfer.files)
  }
}

const onFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    emit('files-added', target.files)
    target.value = '' // Reset for same file selection
  }
}
</script>

<template>
  <div
    class="relative border-2 border-dashed rounded-2xl p-8 transition-all text-center cursor-pointer overflow-hidden group"
    :class="[
      isDragging
        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 scale-[1.01] ring-4 ring-primary-500/10'
        : 'border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-gray-50/50 dark:hover:bg-gray-900/50'
    ]"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
  >
    <!-- Background Decoration -->
    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <UIcon
        name="i-lucide-upload-cloud"
        class="w-24 h-24 text-primary"
      />
    </div>

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      multiple
      @change="onFileSelect"
    >

    <div class="space-y-3 relative z-10">
      <div class="mx-auto w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
        <UIcon
          name="i-lucide-plus"
          class="w-6 h-6 text-primary"
        />
      </div>
      <div>
        <p class="text-base font-bold text-gray-900 dark:text-white">
          Cliquer ou glisser vos fichiers
        </p>
        <p class="text-sm text-gray-500 mt-1">
          Images, PDF, documents (Max 10MB)
        </p>
      </div>
    </div>
  </div>
</template>
