import { describe, expect, it } from 'vitest'
import { loginSchema } from './loginSchema'

describe('loginSchema', () => {
  it('refuse une adresse invalide', () => {
    const result = loginSchema.safeParse({ email: 'pas-un-email', password: 'secret', remember: false })
    expect(result.success).toBe(false)
  })

  it('accepte des identifiants renseignés', () => {
    const result = loginSchema.safeParse({ email: 'admin@ceeac.local', password: 'secret', remember: true })
    expect(result.success).toBe(true)
  })
})
