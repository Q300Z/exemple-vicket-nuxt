/**
 * Granular Error Types for Vicket (SRP).
 * Allows the UI to distinguish between different failure modes.
 */

export class VicketError extends Error {
  constructor(message: string, public code: string, public status?: number) {
    super(message)
    this.name = 'VicketError'
  }
}

export class VicketNetworkError extends VicketError {
  constructor(message = 'Erreur réseau ou timeout.') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'VicketNetworkError'
  }
}

export class VicketValidationError extends VicketError {
  constructor(message: string, public details: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 422)
    this.name = 'VicketValidationError'
  }
}

export class VicketAuthError extends VicketError {
  constructor(message = 'Non autorisé.') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'VicketAuthError'
  }
}
