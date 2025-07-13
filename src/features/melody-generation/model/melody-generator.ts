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
      // Filter out unison interval to avoid repetitive melodies
      const availableIntervals = INTERVALS.filter(interval => interval.semitones !== 0)

      let nextNoteIndex: number
      let attempts = 0
      const maxAttempts = 10

      do {
        const interval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)]
        if (!interval || typeof interval.semitones !== 'number') throw new Error('Invalid interval')

        // Calculate next note index with interval
        nextNoteIndex = currentNoteIndex + interval.semitones

        // Properly handle bounds checking
        if (nextNoteIndex >= NOTES.length) {
          // Try going down instead
          nextNoteIndex = currentNoteIndex - interval.semitones
          // If still out of bounds, use modulo to wrap around
          if (nextNoteIndex < 0) {
            nextNoteIndex = (currentNoteIndex + interval.semitones) % NOTES.length
          }
        } else if (nextNoteIndex < 0) {
          // Try going up instead
          nextNoteIndex = currentNoteIndex + interval.semitones
          // If still out of bounds, use modulo to wrap around
          if (nextNoteIndex >= NOTES.length) {
            nextNoteIndex = ((currentNoteIndex - interval.semitones) + NOTES.length) % NOTES.length
          }
        }

        // Final safety check
        if (nextNoteIndex < 0 || nextNoteIndex >= NOTES.length) {
          // Fall back to a safe random note
          nextNoteIndex = Math.floor(Math.random() * NOTES.length)
        }

        attempts++
      } while (nextNoteIndex === currentNoteIndex && attempts < maxAttempts)

      // If we couldn't find a different note after maxAttempts, just use a random different note
      if (nextNoteIndex === currentNoteIndex) {
        do {
          nextNoteIndex = Math.floor(Math.random() * NOTES.length)
        } while (nextNoteIndex === currentNoteIndex && NOTES.length > 1)
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