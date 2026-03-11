/**
 * Interface for Cache Providers (LSP).
 * Allows switching between Memory, Redis, or Nitro Storage.
 */
export interface ICacheProvider<T> {
  /**
   * Retrieves an item from the cache.
   */
  get(key: string): Promise<T | null>

  /**
   * Stores an item in the cache.
   */
  set(key: string, value: T, ttlSeconds?: number): Promise<void>

  /**
   * Removes an item from the cache.
   */
  delete(key: string): Promise<void>
}
