import { describe, it, expect, vi } from 'vitest'
import { useBranding } from '../../app/composables/useBranding'

// Mock Nuxt App Config
vi.stubGlobal('useAppConfig', () => ({
  ui: {
    colors: {
      primary: 'blue'
    }
  }
}))

describe('useBranding', () => {
  it('should generate deterministic colors based on seed', () => {
    const { getAvatarColor } = useBranding()

    const color1 = getAvatarColor('User A')
    const color2 = getAvatarColor('User A')
    const color3 = getAvatarColor('User B')

    expect(color1).toBe(color2)
    expect(color1).not.toBe(color3)
  })

  it('should pick from the available colors list', () => {
    const { getAvatarColor, availableColors } = useBranding()
    const color = getAvatarColor('Random String')

    expect(availableColors).toContain(color)
  })
})
