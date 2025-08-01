import { render } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import App from '../../App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('displays the score panel', () => {
    const { getByText } = render(<App />)
    expect(getByText(/Current Score/i)).toBeTruthy()
  })

  it('shows the start game button', () => {
    const { getByText } = render(<App />)
    expect(getByText(/Start Game/i)).toBeTruthy()
  })

  it('displays the main game layout', () => {
    const { container } = render(<App />)
    const gameLayout = container.querySelector('.game-layout')
    expect(gameLayout).toBeTruthy()
  })
})
