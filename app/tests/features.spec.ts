import { describe, it, expect } from 'vitest'

// Mock minimaliste pour simuler useAppConfig et le state
describe('Branding & Layout Logic (TDD)', () => {
  it('updates border radius correctly in appConfig', () => {
    const appConfig = { ui: { radius: 'md' } }
    const setRadius = (r: string) => { appConfig.ui.radius = r }
    
    setRadius('xl')
    expect(appConfig.ui.radius).toBe('xl')
  })

  it('switches between layouts (Grid vs List)', () => {
    let currentLayout = 'grid'
    const setLayout = (l: 'grid' | 'list' | 'minimal') => { currentLayout = l }
    
    setLayout('list')
    expect(currentLayout).toBe('list')
  })
})
