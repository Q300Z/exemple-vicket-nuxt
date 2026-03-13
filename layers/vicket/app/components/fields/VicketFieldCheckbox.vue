<script setup lang="ts">
/**
 * Component responsible for checkbox group rendering (SRP).
 * Uses UCheckboxGroup (Nuxt UI v4) for standardized behavior.
 */
interface Props {
  modelValue: unknown
  question: { 
    id: string
    label: string
    options?: { id: string, label: string, value: string }[] 
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => Array.isArray(props.modelValue) ? props.modelValue : [],
  set: (val) => emit('update:modelValue', val)
})

const options = computed(() => {
  return (props.question.options || []).map(opt => ({
    label: opt.label,
    value: opt.value ?? opt.id // Fallback to id if value is missing (common in Vicket API)
  }))
})
</script>

<template>
  <div class="pt-2">
    <UCheckboxGroup
      v-model="value"
      :items="options"
      class="gap-3"
    />
  </div>
</template>
