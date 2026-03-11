<script setup lang="ts">
/**
 * Component responsible for select input rendering (SRP).
 */
interface Props {
  modelValue: unknown
  question: { id: string, label: string, options?: { label: string, value: string }[] }
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <USelect
    :model-value="String(modelValue || '')"
    :items="question.options?.map(o => ({ label: o.label, value: o.value })) || []"
    size="lg"
    class="w-full"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
