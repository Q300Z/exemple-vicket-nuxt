<script setup lang="ts">
import { VICKET_FIELD_MAP } from '../utils/vicket.fields'

/**
 * Component Factory responsible for dynamic field rendering (SRP/DIP).
 */
interface Props {
  modelValue: unknown
  question: {
    id: string
    type: string
    label: string
    required?: boolean
    options?: { id: string, label: string, value: string }[]
  }
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <component
    :is="VICKET_FIELD_MAP[question.type] || VICKET_FIELD_MAP.TEXT"
    :model-value="modelValue"
    :question="question"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
