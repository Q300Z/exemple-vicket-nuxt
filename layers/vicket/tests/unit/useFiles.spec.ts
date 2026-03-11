import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFiles } from '../../app/composables/useFiles'

// Realistic Nuxt useState mock (persistent by key)
let stateStore: Record<string, unknown> = {}
vi.stubGlobal('useState', (key: string, init: () => unknown) => {
  if (!stateStore[key]) {
    stateStore[key] = ref(init())
  }
  return stateStore[key]
})

// Mock Nuxt useToast
vi.stubGlobal('useToast', () => ({
  add: vi.fn()
}))

describe('useFiles', () => {
  beforeEach(() => {
    // Clear the state store before each test
    stateStore = {}
  })

  it('should add valid files to a bucket', () => {
    const { addFiles, getBucket } = useFiles()
    const bucketKey = 'add-test-bucket'
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })

    addFiles(bucketKey, [mockFile])

    const bucket = getBucket(bucketKey)
    expect(bucket.value).toHaveLength(1)
    expect(bucket.value[0].name).toBe('test.txt')
  })

  it('should reject files exceeding maxSizeMB', () => {
    const { addFiles, getBucket } = useFiles(1) // 1 MB limit
    const bucketKey = 'reject-test-bucket'
    // Create a 2MB file
    const content = new Uint8Array(2 * 1024 * 1024)
    const mockFile = new File([content], 'large.txt', { type: 'text/plain' })

    addFiles(bucketKey, [mockFile])

    const bucket = getBucket(bucketKey)
    expect(bucket.value).toHaveLength(0)
  })

  it('should remove files from correct bucket', () => {
    const { addFiles, removeFile, getBucket } = useFiles()
    const key1 = 'bucket1'
    const key2 = 'bucket2'
    const file1 = new File(['1'], 'file1.txt')
    const file2 = new File(['2'], 'file2.txt')

    addFiles(key1, [file1])
    addFiles(key2, [file2])

    removeFile(key1, 0)

    expect(getBucket(key1).value).toHaveLength(0)
    expect(getBucket(key2).value).toHaveLength(1)
  })
})
