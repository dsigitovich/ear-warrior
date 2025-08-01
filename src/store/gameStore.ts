import { create } from 'zustand'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface GameState {
  // Game status
  isGameStarted: boolean
  isGamePaused: boolean
  isGameOver: boolean

  // Difficulty and settings
  difficulty: Difficulty
  selectedDifficulty: Difficulty | null

  // Scoring
  score: number
  highScore: number
  currentStreak: number
  bestStreak: number

  // Game mechanics
  currentLevel: number
  totalLevels: number
  timeRemaining: number
  maxTime: number

  // Audio and pitch detection
  isListening: boolean
  currentPitch: number | null
  targetPitch: number | null
  pitchAccuracy: number

  // Actions
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  resetGame: () => void

  setDifficulty: (difficulty: Difficulty) => void
  selectDifficulty: (difficulty: Difficulty) => void

  updateScore: (points: number) => void
  updateStreak: (success: boolean) => void

  setCurrentLevel: (level: number) => void
  setTimeRemaining: (time: number) => void

  setListening: (listening: boolean) => void
  setCurrentPitch: (pitch: number | null) => void
  setTargetPitch: (pitch: number | null) => void
  setPitchAccuracy: (accuracy: number) => void
}

const getInitialState = (): Omit<GameState, keyof {
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  resetGame: () => void
  setDifficulty: (difficulty: Difficulty) => void
  selectDifficulty: (difficulty: Difficulty) => void
  updateScore: (points: number) => void
  updateStreak: (success: boolean) => void
  setCurrentLevel: (level: number) => void
  setTimeRemaining: (time: number) => void
  setListening: (listening: boolean) => void
  setCurrentPitch: (pitch: number | null) => void
  setTargetPitch: (pitch: number | null) => void
  setPitchAccuracy: (accuracy: number) => void
}> => ({
  isGameStarted: false,
  isGamePaused: false,
  isGameOver: false,
  difficulty: 'beginner',
  selectedDifficulty: null,
  score: 0,
  highScore: parseInt(localStorage.getItem('ear-warrior-high-score') || '0'),
  currentStreak: 0,
  bestStreak: 0,
  currentLevel: 1,
  totalLevels: 10,
  timeRemaining: 60,
  maxTime: 60,
  isListening: false,
  currentPitch: null,
  targetPitch: null,
  pitchAccuracy: 0
})

export const useGameStore = create<GameState>((set, get) => ({
  ...getInitialState(),

  startGame: () => {
    const { selectedDifficulty } = get()
    if (!selectedDifficulty) return

    set({
      isGameStarted: true,
      isGamePaused: false,
      isGameOver: false,
      difficulty: selectedDifficulty,
      score: 0,
      currentStreak: 0,
      currentLevel: 1,
      timeRemaining: get().maxTime,
      isListening: false,
      currentPitch: null,
      targetPitch: null,
      pitchAccuracy: 0
    })
  },

  pauseGame: () => set({ isGamePaused: true }),

  resumeGame: () => set({ isGamePaused: false }),

  endGame: () => {
    const { score, highScore } = get()
    const newHighScore = Math.max(score, highScore)

    if (newHighScore > highScore) {
      localStorage.setItem('ear-warrior-high-score', newHighScore.toString())
    }

    set({
      isGameStarted: false,
      isGamePaused: false,
      isGameOver: true,
      highScore: newHighScore
    })
  },

  resetGame: () => {
    set({
      ...getInitialState(),
      highScore: get().highScore
    })
  },

  setDifficulty: (difficulty: Difficulty) => set({ difficulty }),

  selectDifficulty: (difficulty: Difficulty) => set({ selectedDifficulty: difficulty }),

  updateScore: (points: number) => {
    const { score } = get()
    set({ score: score + points })
  },

  updateStreak: (success: boolean) => {
    const { currentStreak, bestStreak } = get()

    if (success) {
      const newStreak = currentStreak + 1
      set({
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, bestStreak)
      })
    } else {
      set({ currentStreak: 0 })
    }
  },

  setCurrentLevel: (level: number) => set({ currentLevel: level }),

  setTimeRemaining: (time: number) => set({ timeRemaining: time }),

  setListening: (listening: boolean) => set({ isListening: listening }),

  setCurrentPitch: (pitch: number | null) => set({ currentPitch: pitch }),

  setTargetPitch: (pitch: number | null) => set({ targetPitch: pitch }),

  setPitchAccuracy: (accuracy: number) => set({ pitchAccuracy: accuracy })
}))
