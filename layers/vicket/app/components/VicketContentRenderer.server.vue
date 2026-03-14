<script setup lang="ts">
/**
 * Component responsible for rendering pre-processed content (SRP).
 * Highlighting and IDs are handled on the server for better performance.
 * Optimized as a Nuxt Island (.server.vue).
 */
interface Props {
  content: string
}

defineProps<Props>()
</script>

<template>
  <div class="vk-prose">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="content" />
  </div>
</template>
