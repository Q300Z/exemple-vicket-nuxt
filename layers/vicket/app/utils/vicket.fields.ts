import type { Component } from 'vue'
import VicketFieldText from '../components/fields/VicketFieldText.vue'
import VicketFieldTextarea from '../components/fields/VicketFieldTextarea.vue'
import VicketFieldSelect from '../components/fields/VicketFieldSelect.vue'
import VicketFieldCheckbox from '../components/fields/VicketFieldCheckbox.vue'
import VicketFieldFile from '../components/fields/VicketFieldFile.vue'
import VicketFieldDate from '../components/fields/VicketFieldDate.vue'

/**
 * Component Registry for dynamic fields (SRP/OCP).
 */
const COMPONENT_MAP: Record<string, Component> = {
  TEXT: VicketFieldText,
  TEXTAREA: VicketFieldTextarea,
  SELECT: VicketFieldSelect,
  CHECKBOX: VicketFieldCheckbox,
  FILE: VicketFieldFile,
  DATE: VicketFieldDate
}

/**
 * Resolve component by type string (case-insensitive + aliases).
 */
export const resolveVicketComponent = (type: string) => {
  const t = type?.toUpperCase() || 'TEXT'
  
  // Aliases
  if (t === 'CHECKBOXES' || t === 'MULTI_SELECT') return COMPONENT_MAP.CHECKBOX
  if (t === 'INPUT' || t === 'STRING') return COMPONENT_MAP.TEXT
  
  return COMPONENT_MAP[t] || COMPONENT_MAP.TEXT
}

export const VICKET_FIELD_MAP = COMPONENT_MAP
