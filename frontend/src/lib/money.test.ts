import { describe, expect, it } from 'vitest'
import { formatXaf } from './money'

describe('formatXaf', () => {
  it('groupe un entier sans passer par un nombre flottant', () => {
    expect(formatXaf('5000000')).toBe('5\u202f000\u202f000 XAF')
    expect(formatXaf('5000001')).toBe('5\u202f000\u202f001 XAF')
  })
})
