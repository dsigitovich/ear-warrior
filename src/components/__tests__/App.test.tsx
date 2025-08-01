import { render } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import App from '../../App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('displays the welcome message', () => {
    const { getByText } = render(<App />)
    expect(getByText(/Welcome to Ear Warrior!/i)).toBeTruthy()
  })

  it('shows the difficulty selector', () => {
    const { getByText } = render(<App />)
    expect(getByText(/Select Difficulty Level/i)).toBeTruthy()
  })

  it('displays the score panel', () => {
    const { getByText } = render(<App />)
    expect(getByText(/Current Score/i)).toBeTruthy()
  })
})
