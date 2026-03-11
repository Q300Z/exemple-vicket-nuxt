import type { ICacheProvider } from './cache.types'

/**
 * In-memory cache implementation (LSP/SRP).
 * Best for development or single-node small apps.
 */
export class MemoryCacheProvider<T> implements ICacheProvider<T> {
  private store = new Map<string, { value: T, expires: number }>()

  async get(key: string): Promise<T | null> {
    const item = this.store.get(key)
    if (!item) return null
    if (Date.now() > item.expires) {
      this.store.delete(key)
      return null
    }
    return item.value
  }

  async set(key: string, value: T, ttlSeconds = 60): Promise<void> {
    this.store.set(key, {
      value,
      expires: Date.now() + (ttlSeconds * 1000)
    })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }
}

/**
 * Nitro-native storage cache implementation (LSP/SRP).
 * Can be configured to use Redis, FS, etc. via Nitro config.
 */
export class StorageCacheProvider<T> implements ICacheProvider<T> {
  private storagePrefix: string

  constructor(prefix = 'vicket') {
    this.storagePrefix = prefix
  }

  async get(key: string): Promise<T | null> {
    return await useStorage().getItem<T>(`${this.storagePrefix}:${key}`)
  }

  async set(key: string, value: T, ttlSeconds = 60): Promise<void> {
    await useStorage().setItem(`${this.storagePrefix}:${key}`, value, { ttl: ttlSeconds })
  }

  async delete(key: string): Promise<void> {
    await useStorage().removeItem(`${this.storagePrefix}:${key}`)
  }
}

/**
 * Factory to create the appropriate cache provider based on env (OCP/LSP).
 */
function createCacheProvider(): ICacheProvider<unknown> {
  // If we are in production or have a dedicated storage configured
  if (process.env.NODE_ENV === 'production' || process.env.VICKET_USE_STORAGE === 'true') {
    return new StorageCacheProvider()
  }
  return new MemoryCacheProvider()
}

/**
 * Singleton instance.
 */
export const serverCache = createCacheProvider()
