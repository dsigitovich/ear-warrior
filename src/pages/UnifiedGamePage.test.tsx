import { render } from '@testing-library/react'
import { UnifiedGamePage } from './UnifiedGamePage'

// Mock the useGameSession hook
jest.mock('../processes/game-session', () => ({
  useGameSession: () => ({
    game: {
      currentMelody: null,
      state: 'idle',
      attemptsLeft: 3,
      stats: { score: 0, streak: 0 },
      userInput: [],
      matchedIndices: [],
      detectedNote: null,
      feedback: null
    },
    playMelody: jest.fn(),
    stopListening: jest.fn(),
    replayMelody: jest.fn()
  })
}))

// Mock the useDifficultyStore hook
jest.mock('../shared/store/difficulty-store', () => ({
  useDifficultyStore: (selector: (state: { difficulty: string; setDifficulty: jest.Mock }) => unknown) => {
    const state = { difficulty: 'easy', setDifficulty: jest.fn() }
    return selector(state)
  }
}))

describe('UnifiedGamePage', () => {
  it('should render without crashing', () => {
    render(<UnifiedGamePage />)
    // Basic test to ensure the component renders
    expect(document.body).toBeInTheDocument()
  })
})
