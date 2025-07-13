import { Difficulty } from '../../../shared/types'
import { NOTES, INTERVALS, DIFFICULTY_LEVELS } from '../../../shared/config/constants'

export function generateMelodyWithIntervals (difficulty: Difficulty): string[] {
  const level = DIFFICULTY_LEVELS.find(l => l.value === difficulty) || DIFFICULTY_LEVELS[1]
  const notesCount = level?.notes ?? 3

  const melody: string[] = []
  let currentNoteIndex = Math.floor(Math.random() * NOTES.length)

  for (let i = 0; i < notesCount; i++) {
    const note = NOTES[currentNoteIndex]
    if (note === undefined) throw new Error('Invalid note index')
    melody.push(note)

    if (i < notesCount - 1) {
      // Choose a random interval for the next note
      const interval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)]
      if (!interval || typeof interval.semitones !== 'number') throw new Error('Invalid interval')

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
    const note = NOTES[Math.floor(Math.random() * NOTES.length)]
    if (note === undefined) throw new Error('Invalid note index')
    melody.push(note)
  }
  return melody
}