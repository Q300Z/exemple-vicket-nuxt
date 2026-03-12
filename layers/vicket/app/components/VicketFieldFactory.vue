<script setup lang="ts">
import { VICKET_FIELD_MAP } from '../utils/vicket.fields'

/**
 * Component Factory responsible for dynamic field rendering (SRP/DIP).
 * Wrapped in UFormField (Nuxt UI v4) for automatic label and error management.
 */
interface Props {
  modelValue: unknown
  question: {
    id: string
    type: string
    label: string
    required?: boolean
    description?: string
    placeholder?: string
    options?: { id: string, label: string, value: string }[]
  }
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <UFormField
    :name="question.id"
    :label="question.label"
    :description="question.description"
    :required="question.required"
    class="w-full"
  >
    <component
      :is="VICKET_FIELD_MAP[question.type] || VICKET_FIELD_MAP.TEXT"
      :model-value="modelValue"
      :question="question"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </UFormField>
</template>
