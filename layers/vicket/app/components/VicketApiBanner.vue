<script setup lang="ts">
/**
 * Global API Availability Banner (SRP).
 * Appears when Vicket API is unreachable or unconfigured.
 */
const { isFallback, loadTemplates } = useSupportState()

// Trigger check on mount
onMounted(() => {
  loadTemplates()
})
</script>

<template>
  <div
    v-if="isFallback"
    class="bg-error-500 text-white py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 relative z-50 shadow-lg"
  >
    <UIcon name="i-lucide-alert-triangle" class="w-4 h-4" />
    <span>{{ $t('vicket.api_unavailable') }}</span>
    <UButton
      variant="subtle"
      color="neutral"
      size="xs"
      :label="$t('common.retry')"
      icon="i-lucide-refresh-cw"
      class="ml-4 bg-white/20 hover:bg-white/30 text-white border-none"
      @click="loadTemplates"
    />
  </div>
</template>
