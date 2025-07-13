import { Difficulty } from '../../../shared/types'
import { NOTES, INTERVALS, DIFFICULTY_LEVELS } from '../../../shared/config/constants'

export function generateMelodyWithIntervals (difficulty: Difficulty): string[] {
  const level = DIFFICULTY_LEVELS.find(l => l.value === difficulty) || DIFFICULTY_LEVELS[1]
  const notesCount = level.notes

  const melody: string[] = []
  let currentNoteIndex = Math.floor(Math.random() * NOTES.length)

  for (let i = 0; i < notesCount; i++) {
    melody.push(NOTES[currentNoteIndex])

    if (i < notesCount - 1) {
      // Choose a random interval for the next note
      const interval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)]

      // Calculate next note index with interval
      let nextNoteIndex = currentNoteIndex + interval.semitones

      // Keep within the NOTES array bounds
      if (nextNoteIndex >= NOTES.length) {
        nextNoteIndex = currentNoteIndex - interval.semitones
      }
      if (nextNoteIndex < 0) {
        nextNoteIndex = currentNoteIndex + interval.semitones
      }

      currentNoteIndex = nextNoteIndex
    }
  }

  return melody
}

export function generateRandomMelody (length: number = 5): string[] {
  const melody: string[] = []
  for (let i = 0; i < length; i++) {
    melody.push(NOTES[Math.floor(Math.random() * NOTES.length)])
  }
  return melody
}