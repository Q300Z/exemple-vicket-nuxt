import type { LayoutMode } from '../layers/vicket/app/types/vicket'

export type { LayoutMode }

/**
 * Layout Manager (OCP).
 * Handles view modes (Grid, List, Minimal) for the Vicket engine.
 * Defined in 'app/' to allow the host to dictate layout styles.
 */
export const useLayoutManager = () => {
  const layout = useState<LayoutMode>('vicket-layout', () => 'grid')

  const layouts = [
    { id: 'grid', label: 'Grille', icon: 'i-lucide-layout-grid' },
    { id: 'list', label: 'Liste', icon: 'i-lucide-list' },
    { id: 'minimal', label: 'Minimal', icon: 'i-lucide-align-justify' }
  ]

  const setView = (v: LayoutMode) => { layout.value = v }

  return {
    layout,
    layouts,
    setView
  }
}
