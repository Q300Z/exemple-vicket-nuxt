import { describe, it, expect } from 'vitest'
import { MemoryCacheProvider } from '../../server/utils/cache'

describe('MemoryCacheProvider', () => {
  it('should store and retrieve items', async () => {
    const cache = new MemoryCacheProvider<string>()
    await cache.set('key', 'value', 10)
    
    const result = await cache.get('key')
    expect(result).toBe('value')
  })

  it('should return null for expired items', async () => {
    const cache = new MemoryCacheProvider<string>()
    await cache.set('key', 'value', -1) // Already expired
    
    const result = await cache.get('key')
    expect(result).toBeNull()
  })

  it('should delete items', async () => {
    const cache = new MemoryCacheProvider<string>()
    await cache.set('key', 'value')
    await cache.delete('key')
    
    const result = await cache.get('key')
    expect(result).toBeNull()
  })
})
