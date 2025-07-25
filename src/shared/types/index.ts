export type Note =
  | 'E3' | 'F3' | 'F#3' | 'G3' | 'G#3' | 'A3' | 'A#3' | 'B3'
  | 'C4' | 'C#4' | 'D4' | 'D#4' | 'E4' | 'F4' | 'F#4' | 'G4' | 'G#4' | 'A4' | 'A#4' | 'B4'
  | 'C5' | 'C#5' | 'D5' | 'D#5' | 'E5' | 'F5' | 'F#5' | 'G5' | 'G#5' | 'A5' | 'A#5' | 'B5'
  | 'C6';

export type Difficulty = 'elementary' | 'easy' | 'medium' | 'hard';

export type GameState = 'idle' | 'playing' | 'listening' | 'success' | 'error';

export interface Interval {
  name: string;
  semitones: number;
}

export interface DifficultyLevel {
  label: string;
  value: Difficulty;
  notes: number;
}

export interface GameStats {
  score: number;
  streak: number;
}

export interface MelodyResult {
  isCorrect: boolean;
  matchedIndices: number[];
  userInput: Note[];
}