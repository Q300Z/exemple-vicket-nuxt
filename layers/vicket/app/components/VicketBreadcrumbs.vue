<script setup lang="ts">
import type { INavigable } from '../types/ui'

/**
 * Component responsible for automatic breadcrumb navigation (SRP/ISP).
 * Decoupled from domain: only cares about INavigable objects.
 */
const route = useRoute()

const { t } = useI18n()

const breadcrumbs = computed<INavigable[]>(() => {
  const path = route?.path || ''
  const parts = path.split('/').filter(Boolean)

  // Base item
  const items: INavigable[] = [{ label: t('common.breadcrumb_home'), to: '/', icon: 'i-lucide-home' }]

  let currentPath = ''
  parts.forEach((part) => {
    currentPath += `/${part}`

    let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
    if (part === 'support') label = t('common.support_center')

    // Explicit interface fulfillment (ISP)
    const navigable: INavigable = {
      label,
      to: currentPath,
      icon: part === 'support' ? 'i-lucide-life-buoy' : undefined
    }

    items.push(navigable)
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
