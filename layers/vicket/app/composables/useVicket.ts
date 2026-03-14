/**
 * Core Vicket Composable (SRP).
 * Logic-only, types are in ../types/vicket.ts
 */
export const useVicket = () => {
  const config = useRuntimeConfig().public
  const apiUrl = (config.vicketApiUrl as string || '').replace(/\/+$/, '')

  return {
    apiUrl
  }
}
