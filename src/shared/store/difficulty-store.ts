import { create } from 'zustand'
import { Difficulty } from '../types'

interface DifficultyState {
  difficulty: Difficulty
  setDifficulty: (difficulty: Difficulty) => void
}

export const useDifficultyStore = create<DifficultyState>(set => ({
  difficulty: 'elementary',
  setDifficulty: difficulty => set({ difficulty })
}))