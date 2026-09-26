import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ForbiddenState } from './States'

describe('ForbiddenState', () => {
  it('annonce un accès interdit', () => {
    render(<ForbiddenState />)
    expect(screen.getByRole('alert')).toHaveTextContent('Accès interdit')
  })
})
