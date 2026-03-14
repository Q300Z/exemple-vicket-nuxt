<script setup lang="ts">
/**
 * Component responsible for search input UI and history (SRP).
 */
interface Props {
  modelValue: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  size: 'md'
})

const emit = defineEmits(['update:modelValue', 'search'])

const { history, addToHistory } = useSearchHistory()
const inputRef = ref<{ inputRef: HTMLInputElement } | null>(null)

// --- SHORTCUTS ---
defineShortcuts({
  '/': {
    usingInput: false,
    handler: () => {
      inputRef.value?.inputRef?.focus()
    }
  }
})

const searchQuery = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const onEnter = () => {
  if (searchQuery.value.trim()) {
    addToHistory(searchQuery.value)
    emit('search', searchQuery.value)
  }
}

const useHistory = (q: string) => {
  searchQuery.value = q
  emit('search', q)
}
</script>

<template>
  <div class="space-y-4 w-full">
    <UInput
      ref="inputRef"
      v-model="searchQuery"
      icon="i-lucide-search"
      :placeholder="placeholder || $t('common.search_placeholder')"
      :size="size"
      class="w-full"
      @keyup.enter="onEnter"
      @blur="onEnter"
    />

    <!-- Search History (Internal UI logic) -->
    <div
      v-if="(history?.length || 0) > 0 && !searchQuery"
      class="flex items-center gap-3 animate-in fade-in duration-500"
    >
      <span class="text-[10px] font-bold text-[var(--ui-text-muted)] uppercase tracking-widest">{{ $t('common.recent') }}</span>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="q in history"
          :key="q"
          size="xs"
          variant="subtle"
          color="neutral"
          class="rounded-full px-3"
          @click="useHistory(q)"
        >
          {{ q }}
        </UButton>
      </div>
    </div>
  </div>
</template>
