import React, { useEffect, useState } from 'react';
import { Note, Difficulty } from '../../../shared/types';
import { DIFFICULTY_LEVELS } from '../../../shared/config/constants';
import { Button } from '../../../shared/ui/Button';
import { ScorePanel } from '../../score-panel';
import { WaveformDisplay } from '../../waveform-display';
import './GamePanel.css';

interface GamePanelProps {
  score: number;
  streak: number;
  melody: Note[];
  userInputNotes: Note[];
  matchedIndices: number[];
  difficulty: Difficulty;
  isPlaying: boolean;
  isListening: boolean;
  feedback: string | null;
  detectedPitch: number | null;
  detectedNote: string | null;
  audioBuffer: Float32Array;
  sampleRate: number;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onPlayMelody: () => void;
  onStopListening: () => void;
  onReplayMelody: () => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({
  score,
  streak,
  melody,
  userInputNotes,
  matchedIndices,
  difficulty,
  isPlaying,
  isListening,
  feedback,
  detectedPitch,
  detectedNote,
  audioBuffer,
  sampleRate,
  onDifficultyChange,
  onPlayMelody,
  onStopListening,
  onReplayMelody,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    if (feedback) {
      setShowFeedback(true);
      setFadeOut(false);
    } else if (showFeedback) {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        setShowFeedback(false);
        setFadeOut(false);
      }, 500); // match CSS transition
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  return (
    <div className="game-panel">
      <h1 className="game-panel__title">Ear Warrior</h1>
      
      <ScorePanel stats={{ score, streak }} />
      
      <div className="game-panel__controls">
        <label className="game-panel__difficulty-label">
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            disabled={isPlaying || isListening}
            className="game-panel__difficulty-select"
          >
            {DIFFICULTY_LEVELS.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </label>
        
        <Button
          onClick={onPlayMelody}
          disabled={isPlaying || isListening}
          variant="primary"
        >
          {isPlaying ? 'Playing...' : 'Play Melody'}
        </Button>
        
        {isListening && (
          <>
            <Button
              onClick={onStopListening}
              variant="danger"
              size="small"
            >
              Stop
            </Button>
            <Button
              onClick={onReplayMelody}
              variant="secondary"
              size="small"
            >
              Replay Melody
            </Button>
          </>
        )}
      </div>
      
      <WaveformDisplay
        buffer={audioBuffer}
        pitch={detectedPitch}
        detectedNote={detectedNote}
        matchedIndices={matchedIndices}
        melodyLength={melody.length}
        sampleRate={sampleRate}
      />
      
      <div className="game-panel__notes">
        <div className="game-panel__melody-notes">
          {melody.map((note, idx) => (
            <div
              key={idx}
              className={`game-panel__note ${
                matchedIndices.includes(idx) ? 'game-panel__note--matched' : ''
              }`}
            >
              {note}
            </div>
          ))}
        </div>
        
        <div className="game-panel__user-notes">
          {userInputNotes.map((note, idx) => (
            <div key={idx} className="game-panel__note game-panel__note--user">
              {note}
            </div>
          ))}
        </div>
      </div>
      
      {showFeedback && (
        <div className={`game-panel__feedback${fadeOut ? ' game-panel__feedback--hidden' : ''}`}>
          {feedback}
          {feedback === 'Success!' ? ' 🎉' : feedback === 'Try again!' ? ' ❌' : ''}
        </div>
      )}
      
      <div className="game-panel__instructions">
        <span>
          Sing or play the melody you hear!<br/>
          Get the sequence right to earn points.
        </span>
      </div>
    </div>
  );
}; 