<script setup lang="ts">
import type { LayoutMode } from '../composables/useLayoutManager'

/**
 * Advanced Branding & Layout Selector (SRP).
 * Demonstrates the 100% modular architecture of Vicket.
 * Allows runtime control over Colors, Border Radius and View Modes.
 */
const { availableColors, availableRadii, currentPrimary, currentRadius, setPrimaryColor, setRadius } = useBranding()
const { layout, layouts, setView } = useLayoutManager()

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

  // --- SECTION: RADIUS (Design Tokens) ---
  availableRadii.map(r => ({
    label: r.label,
    icon: 'i-lucide-radius',
    onSelect: () => setRadius(r.value),
    checked: currentRadius.value === r.value,
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
        <span class="hidden lg:inline-block capitalize font-bold text-xs">{{ currentPrimary }} • {{ currentRadius }}</span>
      </ClientOnly>
    </UButton>

    <!-- Custom leading for colors section -->
    <template #item-leading="{ item }">
      <div
        v-if="item.color"
        class="w-3 h-3 rounded-full shrink-0 shadow-xs border border-black/10 dark:border-white/20"
        :style="{ backgroundColor: `var(--ui-color-${item.color}-500)` }"
      />
      <UIcon
        v-else
        :name="item.icon"
        class="w-4 h-4"
      />
    </template>
  </UDropdownMenu>
</template>
