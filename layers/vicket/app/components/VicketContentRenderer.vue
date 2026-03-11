<script setup lang="ts">
/**
 * Component responsible for rendering pre-processed content (SRP).
 * Highlighting and IDs are handled on the server for better performance.
 */
interface Props {
  content: string
}

defineProps<Props>()
</script>

<template>
  <div class="vicket-content prose dark:prose-invert max-w-none">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="content" />
  </div>
</template>

<style>
/* ────────────────────────────────────────────── */
/*  Refined Typography (SRP: Logic localized here) */
/* ────────────────────────────────────────────── */

.vicket-content {
  line-height: 1.8;
  font-size: 15px;
}

.vicket-content p {
  margin-bottom: 1rem;
}

.vicket-content p:last-child {
  margin-bottom: 0;
}

.vicket-content blockquote {
  border-left-width: 4px;
  border-left-color: var(--ui-primary);
  background-color: var(--ui-primary-50);
  padding: 0.75rem 1.25rem;
  font-style: italic;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  margin: 1.5rem 0;
}

.dark .vicket-content blockquote {
  background-color: rgba(var(--ui-primary), 0.1);
}

.vicket-content pre {
  background-color: #f9fafb !important;
  padding: 1rem !important;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin: 1.5rem 0;
  overflow-x: auto;
}

.dark .vicket-content pre {
  background-color: #111827 !important;
  border-color: #374151;
}

.vicket-content code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background-color: #f3f4f6;
  color: var(--ui-primary);
}

.dark .vicket-content code {
  background-color: #1f2937;
}

.vicket-content pre code {
  background-color: transparent !important;
  padding: 0 !important;
  color: inherit !important;
}

.vicket-content ul, .vicket-content ol {
  margin: 1rem 0 1rem 1.5rem;
}

.vicket-content ul li {
  list-style-type: disc;
  margin-bottom: 0.5rem;
}

.vicket-content ol li {
  list-style-type: decimal;
  margin-bottom: 0.5rem;
}
</style>
