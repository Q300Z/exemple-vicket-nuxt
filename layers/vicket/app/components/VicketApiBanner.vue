<script setup lang="ts">
/**
 * Global API Availability Banner (SRP).
 * Appears when Vicket API is unreachable or unconfigured.
 */
const { isFallback, loadTemplates, apiLatency } = useSupportState()

const latencyColor = computed(() => {
  if (!apiLatency.value) return 'text-gray-400'
  if (apiLatency.value < 200) return 'text-green-400'
  if (apiLatency.value < 500) return 'text-amber-400'
  return 'text-red-400'
})

// Trigger check on mount
onMounted(() => {
  loadTemplates()
})
</script>

<template>
  <div 
    class="relative z-50" 
    role="region"
    aria-label="API Status"
  >
    <div
      v-if="isFallback"
      class="bg-error-500 text-white py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg"
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

    <!-- API Health Dashboard (Showcase Observability) -->
    <aside
      v-else-if="apiLatency"
      aria-label="Vicket API Health Status"
      class="fixed bottom-4 left-4 bg-gray-900/90 text-white p-3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-left-4 duration-700 pointer-events-none select-none lg:pointer-events-auto"
    >
      <div class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
      </div>
      
      <div class="flex flex-col">
        <span class="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 leading-none mb-1">Vicket API Health</span>
        <div class="flex items-center gap-3">
          <span class="text-[10px] font-bold">Operational</span>
          <span class="w-px h-2 bg-white/20" />
          <span :class="['text-[10px] font-mono font-bold', latencyColor]">{{ apiLatency }}ms</span>
        </div>
      </div>
    </aside>
  </div>
</template>
