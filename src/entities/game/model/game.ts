import { Melody } from '../../melody/model/melody'
import { Note } from '../../note/model/note'

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

export function createGame (melody: Melody) {
  return new Game(melody)
}