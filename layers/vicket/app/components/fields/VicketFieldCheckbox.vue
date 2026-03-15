<script setup lang="ts">
/**
 * Component responsible for checkbox rendering (SRP).
 * Handles both single CHECKBOX (boolean) and CHECKBOXES (array/group).
 */
interface Props {
  modelValue: unknown
  question: { 
    id: string
    label: string
    type: string
    options?: { id: string, label: string, value: string }[] 
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// Ensure we have a valid initial state for validation (KISS)
onMounted(() => {
  if (isGroup.value && !Array.isArray(props.modelValue)) {
    emit('update:modelValue', [])
  }
})

const isGroup = computed(() => {
  const type = props.question.type?.toUpperCase()
  return (props.question.options && props.question.options.length > 0) || type === 'CHECKBOXES' || type === 'MULTI_SELECT'
})

// Use a direct computed for bidirectional binding
const internalValue = computed({
  get: () => {
    if (isGroup.value) {
      return Array.isArray(props.modelValue) ? props.modelValue : []
    }
    return !!props.modelValue
  },
  set: (val) => emit('update:modelValue', val)
})

const options = computed(() => {
  return (props.question.options || []).map(opt => ({
    label: opt.label,
    value: opt.value ?? opt.id
  }))
})
</script>

<template>
  <div class="pt-2">
    <!-- Multiple Options Group -->
    <UCheckboxGroup
      v-if="isGroup"
      v-model="internalValue"
      :items="options"
      class="gap-3"
    />

    <!-- Single Boolean Toggle -->
    <UCheckbox
      v-else
      v-model="internalValue"
      :label="question.label"
    />
  </div>
</template>
