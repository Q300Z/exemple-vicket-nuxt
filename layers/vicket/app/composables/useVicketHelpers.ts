import {
  stripHtml,
  sanitizeHtml,
  isFileAnswer,
  formatAnswerText,
  calculateReadingTime
} from '../utils/vicket.helpers'

/**
 * Composable providing industrial Vicket helpers (Legacy Sync).
 */
export const useVicketHelpers = () => {
  return {
    stripHtml,
    sanitizeHtml,
    isFileAnswer,
    formatAnswerText,
    calculateReadingTime
  }
}
