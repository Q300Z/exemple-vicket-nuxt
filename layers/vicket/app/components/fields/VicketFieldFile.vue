<script setup lang="ts">
/**
 * Component responsible for file upload rendering (SRP).
 */
interface Props {
  modelValue: unknown
  question: { id: string, label: string }
}

defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const { buckets, previews, addFiles, removeFile } = useFiles()

const onFilesAdded = (questionId: string, files: FileList | File[]) => {
  addFiles(questionId, files)
  emit('update:modelValue', buckets.value[questionId]?.length > 0 ? true : undefined)
}

const onFileRemoved = (questionId: string, index: number) => {
  removeFile(questionId, index)
  emit('update:modelValue', buckets.value[questionId]?.length > 0 ? true : undefined)
}
</script>

<template>
  <div class="space-y-4">
    <VicketFileDropZone @files-added="onFilesAdded(question.id, $event)" />

    <div
      v-if="buckets[question.id]?.length"
      class="grid grid-cols-1 gap-2"
    >
      <VicketFilePreview
        v-for="(file, i) in buckets[question.id]"
        :key="file.name"
        :file="file"
        :preview-url="previews[`${question.id}-${file.name}`]"
        @remove="onFileRemoved(question.id, i)"
      />
    </div>
  </div>
</template>
