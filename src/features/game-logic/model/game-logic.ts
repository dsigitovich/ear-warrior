import { GAME_CONFIG } from '../../../shared/config/constants'
import { Melody, getMelodyNotes } from '../../../entities/melody/model/melody'

export interface GameLogicResult {
  isCorrect: boolean;
  matchedIndices: number[];
  shouldContinue: boolean;
  score: number;
  streak: number;
}

export function checkMelodyMatch (
  userInput: string[],
  melody: Melody | null,
  currentScore: number,
  currentStreak: number
): GameLogicResult {
  if (!melody) {
    return {
      isCorrect: false,
      matchedIndices: [],
      shouldContinue: false,
      score: currentScore,
      streak: 0,
    }
  }
  const melodyNotes = getMelodyNotes(melody)
  const isCorrectSoFar = userInput.every((note, index) => note === melodyNotes[index])

  if (!isCorrectSoFar) {
    return {
      isCorrect: false,
      matchedIndices: [],
      shouldContinue: false,
      score: currentScore,
      streak: 0, // Reset streak on error
    }
  }

  const matchedIndices = userInput.map((_, index) => index)
  const isComplete = userInput.length === melodyNotes.length

  // Only increment score for the last note entered
  let newScore = currentScore
  if (!isComplete && userInput.length > 0) {
    newScore = currentScore + GAME_CONFIG.SUCCESS_SCORE_MULTIPLIER
  }

  if (isComplete) {
    // If the melody is complete, increment score only if it wasn't already incremented for this note
    if (melodyNotes.length === 1) {
      // For single-note melodies, increment once
      newScore = currentScore + GAME_CONFIG.SUCCESS_SCORE_MULTIPLIER
    }
    const newStreak = currentStreak + 1
    return {
      isCorrect: true,
      matchedIndices,
      shouldContinue: false,
      score: newScore,
      streak: newStreak,
    }
  }

  return {
    isCorrect: true,
    matchedIndices,
    shouldContinue: true,
    score: newScore,
    streak: currentStreak,
  }
}

export function calculateScore (melodyLength: number, streak: number): number {
  return GAME_CONFIG.SUCCESS_SCORE_MULTIPLIER * melodyLength * (1 + streak * 0.1)
}