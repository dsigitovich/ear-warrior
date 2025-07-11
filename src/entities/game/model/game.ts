import { GameState, GameStats, Difficulty } from '../../../shared/types';
import { MelodyEntity } from '../../melody/model/melody';

export interface GameEntity {
  state: GameState;
  stats: GameStats;
  currentMelody: MelodyEntity | null;
  difficulty: Difficulty;
  userInput: string[];
  matchedIndices: number[];
  feedback: string | null;
  detectedPitch: number | null;
  detectedNote: string | null;
}

export function createGame(difficulty: Difficulty = 'easy'): GameEntity {
  return {
    state: 'idle',
    stats: {
      score: 0,
      streak: 0,
    },
    currentMelody: null,
    difficulty,
    userInput: [],
    matchedIndices: [],
    feedback: null,
    detectedPitch: null,
    detectedNote: null,
  };
}

export function updateGameStats(game: GameEntity, score: number, streak: number): GameEntity {
  return {
    ...game,
    stats: {
      score,
      streak,
    },
  };
}

export function setGameState(game: GameEntity, state: GameState): GameEntity {
  return {
    ...game,
    state,
  };
}

export function setCurrentMelody(game: GameEntity, melody: MelodyEntity | null): GameEntity {
  return {
    ...game,
    currentMelody: melody,
  };
}

export function addUserInput(game: GameEntity, note: string): GameEntity {
  return {
    ...game,
    userInput: [...game.userInput, note],
  };
}

export function setMatchedIndices(game: GameEntity, indices: number[]): GameEntity {
  return {
    ...game,
    matchedIndices: indices,
  };
}

export function setFeedback(game: GameEntity, feedback: string | null): GameEntity {
  return {
    ...game,
    feedback,
  };
}

export function setDetectedPitch(game: GameEntity, pitch: number | null): GameEntity {
  return {
    ...game,
    detectedPitch: pitch,
  };
}

export function setDetectedNote(game: GameEntity, note: string | null): GameEntity {
  return {
    ...game,
    detectedNote: note,
  };
}

export function resetGameInput(game: GameEntity): GameEntity {
  return {
    ...game,
    userInput: [],
    matchedIndices: [],
    feedback: null,
    detectedPitch: null,
    detectedNote: null,
  };
} 