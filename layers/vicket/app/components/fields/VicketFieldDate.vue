<script setup lang="ts">
/**
 * Component responsible for premium date selection (SRP).
 * Uses UCalendar inside a UPopover for a consistent Nuxt UI experience.
 */
interface Props {
  modelValue: unknown
  question: { id: string, label: string }
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const dateValue = computed({
  get: () => props.modelValue ? new Date(String(props.modelValue)) : undefined,
  set: (val) => {
    if (!val) {
      emit('update:modelValue', '')
      return
    }
    // Format as YYYY-MM-DD for API consistency
    const isoDate = val instanceof Date ? val.toISOString().split('T')[0] : String(val)
    emit('update:modelValue', isoDate)
  }
})

const formattedDisplay = computed(() => {
  if (!props.modelValue) return 'Sélectionner une date'
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(String(props.modelValue)))
  } catch {
    return String(props.modelValue)
  }
})
</script>

<template>
  <div class="pt-1">
    <UPopover :content="{ align: 'start', sideOffset: 8 }">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-calendar"
        size="lg"
        class="w-full justify-start text-left font-normal transition-all"
        :class="[
          !modelValue ? 'text-[var(--ui-text-muted)] border-[var(--ui-border-accented)]' : 'text-[var(--ui-text-highlighted)] border-[var(--ui-primary)]/50 bg-[var(--ui-primary)]/5'
        ]"
        :label="formattedDisplay"
      />

      <template #content>
        <div class="p-1 bg-[var(--ui-bg-default)] border border-[var(--ui-border-accented)] rounded-lg shadow-xl dark:shadow-primary/10">
          <!-- @ts-ignore - DateValue type mismatch in UCalendar -->
          <UCalendar
            v-model="dateValue"
            color="primary"
            class="p-1"
          />
        </div>
      </template>
    </UPopover>
  </div>
</template>
