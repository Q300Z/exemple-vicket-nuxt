/**
 * Composable responsible for managing multiple file buckets (SRP).
 * Useful for forms with multiple file inputs.
 */
export const useFiles = (maxSizeMB = 10) => {
  // Buckets: Record<bucketKey, File[]>
  const buckets = useState<Record<string, File[]>>('vicket-file-buckets', () => ({}))
  const previews = useState<Record<string, string>>('vicket-file-previews', () => ({}))

  const clearAll = () => {
    Object.values(previews.value).forEach(url => URL.revokeObjectURL(url))
    buckets.value = {}
    previews.value = {}
  }

  const getBucket = (key: string) => computed(() => buckets.value[key] || [])

  const addFiles = (key: string, newFiles: FileList | File[] | null) => {
    if (!newFiles) return

    const validFiles = Array.from(newFiles).filter((file) => {
      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > maxSizeMB) {
        try {
          useToast().add({
            title: 'Fichier trop volumineux',
            description: `${file.name} dépasse la limite de ${maxSizeMB}MB.`,
            color: 'error'
          })
        } catch {
          // Toast not available in some test contexts
        }
        return false
      }
      return true
    })

    if (!buckets.value[key]) buckets.value[key] = []
    buckets.value[key] = [...buckets.value[key], ...validFiles]

    // Generate previews for images
    validFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        previews.value[`${key}-${file.name}`] = url
      }
    })
  }

  const removeFile = (key: string, index: number) => {
    const bucket = buckets.value[key]
    if (!bucket) return

    const file = bucket[index]
    if (file) {
      const previewKey = `${key}-${file.name}`
      if (previews.value[previewKey]) {
        URL.revokeObjectURL(previews.value[previewKey])
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [previewKey]: _, ...rest } = previews.value
        previews.value = rest
      }

      const newBucket = [...bucket]
      newBucket.splice(index, 1)
      buckets.value[key] = newBucket
    }
  }

  return {
    buckets,
    previews,
    getBucket,
    addFiles,
    removeFile,
    clearAll
  }
}
