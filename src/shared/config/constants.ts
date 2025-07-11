import { Note, Interval, DifficultyLevel } from '../types';

export const NOTES: Note[] = [
  'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6'
];

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
];

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { label: 'Elementary', value: 'elementary', notes: 1 },
  { label: 'Easy', value: 'easy', notes: 3 },
  { label: 'Medium', value: 'medium', notes: 5 },
  { label: 'Hard', value: 'hard', notes: 8 },
];

export const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  BUFFER_SIZE: 2048,
  MIN_FREQUENCY: 80,
  MAX_FREQUENCY: 1000,
  MIN_CORRELATION: 0.7,
  MIN_RMS: 0.01,
  NOTE_DURATION: '8n',
  NOTE_INTERVAL: 0.8,
} as const;

export const GAME_CONFIG = {
  SUCCESS_SCORE_MULTIPLIER: 10,
  FEEDBACK_DURATION: 1000,
  SUCCESS_DELAY: 1200,
  ERROR_FEEDBACK_DURATION: 700,
} as const; 