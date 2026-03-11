import type { InjectionKey } from 'vue'
import type { z } from 'zod'

/**
 * Type defining custom validators for Vicket form fields (OCP).
 * Key is the question ID, value is a Zod schema.
 */
export type VicketCustomValidators = Record<string, z.ZodTypeAny>

/**
 * Injection Key for custom validators.
 */
export const VICKET_VALIDATORS_KEY = Symbol('VICKET_VALIDATORS') as InjectionKey<VicketCustomValidators>
