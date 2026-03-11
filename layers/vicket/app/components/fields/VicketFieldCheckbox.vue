<script setup lang="ts">
/**
 * Component responsible for checkbox group rendering (SRP).
 */
interface Props {
  modelValue: unknown
  question: { id: string, label: string, options?: { id: string, label: string, value: string }[] }
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const toggleValue = (optionValue: string, checked: boolean) => {
  const current = Array.isArray(props.modelValue) ? props.modelValue : []
  const next = checked
    ? [...new Set([...current, optionValue])]
    : current.filter((item: string) => item !== optionValue)
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-2 pt-1">
    <UCheckbox
      v-for="option in question.options || []"
      :key="option.id"
      :label="option.label"
      :model-value="Array.isArray(modelValue) && modelValue.includes(option.value)"
      class="p-2 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      @update:model-value="toggleValue(option.value, $event)"
    />
  </div>
</template>
