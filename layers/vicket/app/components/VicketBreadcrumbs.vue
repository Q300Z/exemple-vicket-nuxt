<script setup lang="ts">
import type { INavigable } from '../types/ui'

/**
 * Component responsible for automatic breadcrumb navigation (SRP/ISP).
 */
const route = useRoute()

const breadcrumbs = computed<INavigable[]>(() => {
  const path = route?.path || ''
  const parts = path.split('/').filter(Boolean)
  const items: INavigable[] = [{ label: 'Accueil', to: '/', icon: 'i-lucide-home' }]

  let currentPath = ''
  parts.forEach((part) => {
    currentPath += `/${part}`

    let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
    if (part === 'support') label = 'Centre de Support'

    items.push({
      label,
      to: currentPath,
      icon: part === 'support' ? 'i-lucide-life-buoy' : undefined
    })
  })

  return items
})
</script>

<template>
  <UBreadcrumb
    :items="breadcrumbs"
    class="mb-6"
    :ui="{
      list: 'bg-primary-50/50 dark:bg-primary-950/20 px-4 py-2 rounded-full border border-primary-100/50 dark:border-primary-900/30 w-fit',
      link: 'text-xs font-bold uppercase tracking-wider'
    }"
  />
</template>
