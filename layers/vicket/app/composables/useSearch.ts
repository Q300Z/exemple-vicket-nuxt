/**
 * Composable responsible for search filtering logic (SRP).
 * Decoupled from UI components.
 */
export const useSearch = <T extends Record<string, unknown>>(items: Ref<T[]>, fields: (keyof T & string)[]) => {
  const query = ref('')
  const { stripHtml } = useContent()

  const filteredItems = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return items.value

    return items.value.filter((item) => {
      return fields.some((field) => {
        const value = item[field]
        if (!value) return false
        const text = field === 'content' ? stripHtml(value) : String(value)
        return text.toLowerCase().includes(q)
      })
    })
  })

  return {
    query,
    filteredItems
  }
}
