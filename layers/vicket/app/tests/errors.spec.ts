import { describe, it, expect } from 'vitest'
import { VicketNetworkError, VicketValidationError, VicketAuthError } from '../utils/errors'

describe('Vicket Errors', () => {
  it('should create a Network Error', () => {
    const err = new VicketNetworkError('Offline')
    expect(err.message).toBe('Offline')
    expect(err.name).toBe('VicketNetworkError')
  })

  it('should create a Validation Error with details', () => {
    const details = { email: ['invalid'] }
    const err = new VicketValidationError('Bad Data', details)
    expect(err.details).toEqual(details)
  })

  it('should create an Auth Error', () => {
    const err = new VicketAuthError('Unauthorized')
    expect(err.message).toBe('Unauthorized')
  })
})
