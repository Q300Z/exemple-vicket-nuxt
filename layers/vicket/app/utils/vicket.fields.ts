import type { Component } from 'vue'
import VicketFieldText from '../components/fields/VicketFieldText.vue'
import VicketFieldTextarea from '../components/fields/VicketFieldTextarea.vue'
import VicketFieldSelect from '../components/fields/VicketFieldSelect.vue'
import VicketFieldCheckbox from '../components/fields/VicketFieldCheckbox.vue'
import VicketFieldFile from '../components/fields/VicketFieldFile.vue'

/**
 * Component Registry for dynamic fields (SRP/OCP).
 */
export const VICKET_FIELD_MAP: Record<string, Component> = {
  TEXT: VicketFieldText,
  TEXTAREA: VicketFieldTextarea,
  SELECT: VicketFieldSelect,
  CHECKBOX: VicketFieldCheckbox,
  FILE: VicketFieldFile,
  DATE: VicketFieldText // Fallback to text for date if specialized not available
}
