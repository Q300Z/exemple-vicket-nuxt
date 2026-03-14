<script setup lang="ts">
import type { LayoutMode } from '../composables/useLayoutManager'

/**
 * Advanced Branding & Layout Selector (SRP).
 * Demonstrates the 100% modular architecture of Vicket.
 * Allows runtime control over Colors, Border Radius and View Modes.
 */
const { availableColors, currentPrimary, setPrimaryColor } = useBranding()
const { layout, layouts, setView } = useLayoutManager()

const colorMap: Record<string, string> = {
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9'
}

interface DropdownItem {
  label: string
  icon?: string
  color?: string
  onSelect: () => void
  checked: boolean
  type: 'checkbox'
  class?: string
}

const items = computed<DropdownItem[][]>(() => [
  // --- SECTION: LAYOUT (Mode Preview) ---
  layouts.map(l => ({
    label: l.label,
    icon: l.icon,
    onSelect: () => setView(l.id as LayoutMode),
    checked: layout.value === l.id,
    type: 'checkbox' as const
  })),

  // --- SECTION: COLORS (Branding) ---
  availableColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    color: color,
    onSelect: () => setPrimaryColor(color),
    checked: currentPrimary.value === color,
    type: 'checkbox' as const,
    class: currentPrimary.value === color ? 'bg-[color-mix(in_srgb,var(--ui-primary)_5%,transparent)] font-bold' : ''
  }))
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', sideOffset: 8, class: 'min-w-[220px] max-h-[400px] overflow-y-auto' }"
  >
    <UButton
      variant="ghost"
      color="neutral"
      icon="i-lucide-palette"
      class="rounded-full hover:bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)]"
      aria-label="Personnaliser l'apparence"
    >
      <ClientOnly>
        <span class="hidden lg:inline-block capitalize font-bold text-xs">{{ currentPrimary }}</span>
      </ClientOnly>
    </UButton>

    <!-- Custom leading for sections -->
    <template #item-leading="{ item }">
      <div
        v-if="item.color"
        class="w-4 h-4 rounded-full shrink-0 shadow-sm border border-black/10 dark:border-white/20"
        :style="{ backgroundColor: colorMap[item.color] || 'var(--ui-primary)' }"
      />
      <UIcon
        v-else
        :name="item.icon"
        class="w-4 h-4 text-[var(--ui-text-muted)]"
      />
    </template>
  </UDropdownMenu>
</template>
