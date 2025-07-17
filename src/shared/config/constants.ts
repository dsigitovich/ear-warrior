import { Interval, DifficultyLevel } from '../types'

export const NOTES: string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]

export const INTERVALS: Interval[] = [
  { name: 'Unison', semitones: 0 },
  { name: 'Minor Second', semitones: 1 },
  { name: 'Major Second', semitones: 2 },
  { name: 'Minor Third', semitones: 3 },
  { name: 'Major Third', semitones: 4 },
  { name: 'Perfect Fourth', semitones: 5 },
  { name: 'Perfect Fifth', semitones: 7 },
  { name: 'Minor Sixth', semitones: 8 },
  { name: 'Major Sixth', semitones: 9 },
  { name: 'Minor Seventh', semitones: 10 },
  { name: 'Major Seventh', semitones: 11 },
  { name: 'Octave', semitones: 12 }
]

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { label: 'Elementary', value: 'elementary', notes: 1 },
  { label: 'Easy', value: 'easy', notes: 3 },
  { label: 'Medium', value: 'medium', notes: 5 },
  { label: 'Hard', value: 'hard', notes: 8 },
]

export const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  BUFFER_SIZE: 2048,
  MIN_FREQUENCY: 80,
  MAX_FREQUENCY: 1000,
  MIN_CORRELATION: 0.7,
  MIN_RMS: 0.01,
  NOTE_DURATION: '0.5n',
  NOTE_INTERVAL: 0.6,
  RECORDING_DURATION: 100, // Reduced from 1000ms to 100ms for faster input response
} as const

export const GAME_CONFIG = {
  SUCCESS_SCORE_MULTIPLIER: 10,
  FEEDBACK_DURATION: 500, // Reduced from 2000ms to 500ms
  SUCCESS_DELAY: 200, // Reduced from 1000ms to 200ms
  ERROR_FEEDBACK_DURATION: 500, // Reduced from 1500ms to 500ms
} as const