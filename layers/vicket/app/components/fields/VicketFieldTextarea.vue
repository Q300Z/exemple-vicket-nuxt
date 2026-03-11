<script setup lang="ts">
/**
 * Component responsible for textarea rendering (SRP).
 */
interface Props {
  modelValue: unknown
  question: { id: string, label: string }
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <UTextarea
    :model-value="String(modelValue || '')"
    class="w-full"
    :rows="5"
    placeholder="Dites-nous en plus..."
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
