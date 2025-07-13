import { Melody } from '../../melody/model/melody'
import { Note } from '../../note/model/note'
import { Difficulty } from '../../../shared/types'

export interface GameEntity {
  difficulty: Difficulty
  state: 'idle' | 'playing' | 'listening'
  currentMelody: Melody | null
  userInput: string[]
  matchedIndices: number[]
  detectedNote: string | null
  feedback: string | null
  attemptsLeft: number
  stats: {
    score: number
    streak: number
  }
}

export class Game {
  public currentNoteIndex: number = 0
  public score: number = 0
  public isGameOver: boolean = false
  public isPlaying: boolean = false

  constructor (public melody: Melody) {
    this.isGameOver = melody.length === 0
  }

  start (): void {
    if (!this.isGameOver && !this.isPlaying) {
      this.isPlaying = true
      this.currentNoteIndex = 0
      this.score = 0
      this.isGameOver = false
    }
  }

  pause (): void {
    if (this.isPlaying) {
      this.isPlaying = false
    }
  }

  reset (): void {
    this.currentNoteIndex = 0
    this.score = 0
    this.isPlaying = false
    this.isGameOver = this.melody.length === 0
  }

  nextNote (): void {
    if (this.isPlaying && !this.isGameOver) {
      this.currentNoteIndex++
      if (this.currentNoteIndex >= this.melody.length) {
        this.isGameOver = true
        this.isPlaying = false
      }
    }
  }

  getCurrentNote (): Note | undefined {
    return this.melody.getNoteAt(this.currentNoteIndex)
  }

  getCurrentFrequency (): number | undefined {
    return this.melody.getFrequencyAt(this.currentNoteIndex)
  }

  addScore (points: number): void {
    this.score = Math.max(0, this.score + points)
  }

  getProgress (): number {
    if (this.melody.length === 0) {
      return 0
    }

    // For new game (not started), return 0
    if (!this.isPlaying && this.currentNoteIndex === 0) {
      return 0
    }

    // For completed game, return 100
    if (this.currentNoteIndex >= this.melody.length) {
      return 100
    }

    // Progress should be based on completed notes (currentNoteIndex + 1)
    return Math.round(((this.currentNoteIndex + 1) / this.melody.length) * 100)
  }

  isLastNote (): boolean {
    return this.currentNoteIndex === this.melody.length - 1
  }

  getRemainingNotes (): number {
    // Remaining notes should be melody.length - (currentNoteIndex + 1)
    return Math.max(0, this.melody.length - (this.currentNoteIndex + 1))
  }
}

export function createGame (difficulty: Difficulty): GameEntity {
  return {
    difficulty,
    state: 'idle',
    currentMelody: null,
    userInput: [],
    matchedIndices: [],
    detectedNote: null,
    feedback: null,
    attemptsLeft: 3,
    stats: {
      score: 0,
      streak: 0
    }
  }
}

export function setGameState (game: GameEntity, state: GameEntity['state']): GameEntity {
  return { ...game, state }
}

export function setCurrentMelody (game: GameEntity, melody: Melody): GameEntity {
  return { ...game, currentMelody: melody }
}

export function addUserInput (game: GameEntity, note: string): GameEntity {
  return { ...game, userInput: [...game.userInput, note] }
}

export function setMatchedIndices (game: GameEntity, indices: number[]): GameEntity {
  return { ...game, matchedIndices: indices }
}

export function setFeedback (game: GameEntity, feedback: string | null): GameEntity {
  return { ...game, feedback }
}

export function setDetectedPitch (game: GameEntity): GameEntity {
  return { ...game }
}

export function setDetectedNote (game: GameEntity, note: string | null): GameEntity {
  return { ...game, detectedNote: note }
}

export function resetGameInput (game: GameEntity): GameEntity {
  return { ...game, userInput: [], matchedIndices: [], detectedNote: null }
}

export function updateGameStats (game: GameEntity, score: number, streak: number): GameEntity {
  return {
    ...game,
    stats: {
      score: game.stats.score + score,
      streak
    }
  }
}