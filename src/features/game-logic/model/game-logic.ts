import { GAME_CONFIG } from '../../../shared/config/constants';
import { MelodyEntity, getMelodyNotes } from '../../../entities/melody/model/melody';

export interface GameLogicResult {
  isCorrect: boolean;
  matchedIndices: number[];
  shouldContinue: boolean;
  score: number;
  streak: number;
}

export function checkMelodyMatch(
  userInput: string[],
  melody: MelodyEntity,
  currentScore: number,
  currentStreak: number
): GameLogicResult {
  const melodyNotes = getMelodyNotes(melody);
  const isCorrectSoFar = userInput.every((note, index) => note === melodyNotes[index]);
  
  if (!isCorrectSoFar) {
    return {
      isCorrect: false,
      matchedIndices: [],
      shouldContinue: false,
      score: currentScore,
      streak: 0, // Reset streak on error
    };
  }
  
  const matchedIndices = userInput.map((_, index) => index);
  const isComplete = userInput.length === melodyNotes.length;
  
  if (isComplete) {
    const newScore = currentScore + GAME_CONFIG.SUCCESS_SCORE_MULTIPLIER * melodyNotes.length;
    const newStreak = currentStreak + 1;
    
    return {
      isCorrect: true,
      matchedIndices,
      shouldContinue: false,
      score: newScore,
      streak: newStreak,
    };
  }
  
  return {
    isCorrect: true,
    matchedIndices,
    shouldContinue: true,
    score: currentScore,
    streak: currentStreak,
  };
}

export function calculateScore(melodyLength: number, streak: number): number {
  return GAME_CONFIG.SUCCESS_SCORE_MULTIPLIER * melodyLength * (1 + streak * 0.1);
} 