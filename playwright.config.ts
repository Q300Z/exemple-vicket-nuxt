import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * Playwright configuration for Nuxt 4 (SRP).
 */
export default defineConfig({
  testDir: fileURLToPath(new URL('./layers/vicket/tests/e2e', import.meta.url)),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    // Disable animations for stability
    contextOptions: {
      reducedMotion: 'reduce'
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'NUXT_SSR=false pnpm run build && NUXT_SSR=false pnpm run preview',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 180 * 1000
  }
})
