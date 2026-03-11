/**
 * Generic UI interfaces for purely visual components (ISP).
 * Decouples UI from domain models.
 */

/**
 * Interface for anything that can be navigated to.
 */
export interface INavigable {
  label: string
  to: string
  icon?: string
}

/**
 * Interface for simple display items.
 */
export interface IDisplayItem {
  id: string
  title: string
  description?: string
  metadata?: string
}
