import { describe, it, expect } from 'vitest'
import { MemoryCacheProvider } from '../../server/utils/cache'

describe('Server Cache Utility', () => {
  it('stores and retrieves data', async () => {
    const cache = new MemoryCacheProvider<string>()
    await cache.set('test', 'data')
    expect(await cache.get('test')).toBe('data')
  })

  it('expires data after TTL', async () => {
    const cache = new MemoryCacheProvider<string>()
    // We set TTL to -1 to force immediate expiration
    await cache.set('expired', 'old', -1)
    expect(await cache.get('expired')).toBeNull()
  })
})
