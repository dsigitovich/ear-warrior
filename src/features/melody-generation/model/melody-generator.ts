import { Difficulty } from '../../../shared/types'
import { NOTES, INTERVALS, DIFFICULTY_LEVELS } from '../../../shared/config/constants'

// Global melody history to track all generated melodies
const melodyHistory = new Set<string>()

// Enhanced random number generation with better entropy
function enhancedRandom(): number {
  // Use current timestamp, performance counter, and Math.random for better entropy
  const timestamp = Date.now()
  const performance = typeof window !== 'undefined' && window.performance ? window.performance.now() : 0
  const seed = (timestamp + performance + Math.random() * 1000) % 1
  return seed
}

// Check if a melody is unique (not previously generated)
function isMelodyUnique(melody: string[]): boolean {
  const melodyKey = melody.join('-')
  return !melodyHistory.has(melodyKey)
}

// Add melody to history
function addMelodyToHistory(melody: string[]): void {
  const melodyKey = melody.join('-')
  melodyHistory.add(melodyKey)
}

// Clear melody history (useful for testing or resetting)
export function clearMelodyHistory(): void {
  melodyHistory.clear()
}

// Get the number of unique melodies generated so far
export function getMelodyHistorySize(): number {
  return melodyHistory.size
}

export function generateMelodyWithIntervals (difficulty: Difficulty): string[] {
  const level = DIFFICULTY_LEVELS.find(l => l.value === difficulty) || DIFFICULTY_LEVELS[1]
  const notesCount = level?.notes ?? 3
  
  let melody: string[] = []
  let attempts = 0
  const maxAttempts = 100 // Maximum attempts to find a unique melody

  do {
    melody = []
    let currentNoteIndex = Math.floor(enhancedRandom() * NOTES.length)

    for (let i = 0; i < notesCount; i++) {
      const note = NOTES[currentNoteIndex]
      if (note === undefined) throw new Error('Invalid note index')
      melody.push(note)

      if (i < notesCount - 1) {
        // Filter out unison interval to avoid repetitive melodies
        const availableIntervals = INTERVALS.filter(interval => interval.semitones !== 0)

        let nextNoteIndex: number
        let intervalAttempts = 0
        const maxIntervalAttempts = 10

        do {
          const intervalIndex = Math.floor(enhancedRandom() * availableIntervals.length)
          const interval = availableIntervals[intervalIndex]
          if (!interval || typeof interval.semitones !== 'number') throw new Error('Invalid interval')

          // Add some randomness to interval direction
          const direction = enhancedRandom() > 0.5 ? 1 : -1
          const semitoneOffset = interval.semitones * direction

          // Calculate next note index with interval
          nextNoteIndex = currentNoteIndex + semitoneOffset

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
            nextNoteIndex = Math.floor(enhancedRandom() * NOTES.length)
          }

          intervalAttempts++
        } while (nextNoteIndex === currentNoteIndex && intervalAttempts < maxIntervalAttempts)

        // If we couldn't find a different note after maxIntervalAttempts, just use a random different note
        if (nextNoteIndex === currentNoteIndex) {
          do {
            nextNoteIndex = Math.floor(enhancedRandom() * NOTES.length)
          } while (nextNoteIndex === currentNoteIndex && NOTES.length > 1)
        }

        currentNoteIndex = nextNoteIndex
      }
    }

    attempts++
    
    // If we've tried too many times, break to avoid infinite loop
    if (attempts >= maxAttempts) {
      console.warn(`Could not generate unique melody after ${maxAttempts} attempts. Using potentially duplicate melody.`)
      break
    }
  } while (!isMelodyUnique(melody))

  // Add the unique melody to history
  addMelodyToHistory(melody)
  
  return melody
}

export function generateRandomMelody (length: number = 5): string[] {
  let melody: string[] = []
  let attempts = 0
  const maxAttempts = 100 // Maximum attempts to find a unique melody

  do {
    melody = []
    for (let i = 0; i < length; i++) {
      const noteIndex = Math.floor(enhancedRandom() * NOTES.length)
      const note = NOTES[noteIndex]
      if (note === undefined) throw new Error('Invalid note index')
      melody.push(note)
    }

    attempts++
    
    // If we've tried too many times, break to avoid infinite loop
    if (attempts >= maxAttempts) {
      console.warn(`Could not generate unique melody after ${maxAttempts} attempts. Using potentially duplicate melody.`)
      break
    }
  } while (!isMelodyUnique(melody))

  // Add the unique melody to history
  addMelodyToHistory(melody)
  
  return melody
}