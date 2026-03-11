<script setup lang="ts">
/**
 * Component responsible for single text input rendering (SRP).
 */
interface Props {
  modelValue: unknown
  question: { id: string, label: string }
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <UInput
    :model-value="String(modelValue || '')"
    size="lg"
    class="w-full"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
