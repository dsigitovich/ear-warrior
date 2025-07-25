import React, { useEffect, useState } from 'react'
import { Note } from '../../../shared/types'
import { Button } from '../../../shared/ui/Button'
import { ScorePanel } from '../../score-panel'
import { WaveformDisplay } from '../../waveform-display'
import './GamePanel.css'

interface GamePanelProps {
  score: number;
  streak: number;
  attemptsLeft: number;
  melody: Note[];
  userInputNotes: Note[];
  matchedIndices: number[];
  isPlaying: boolean;
  isListening: boolean;
  feedback: string | null;
  detectedPitch: number | null;
  detectedNote: string | null;
  audioBuffer: Float32Array;
  sampleRate: number;
  onPlayMelody: () => void;
  onStopListening: () => void;
  onReplayMelody: () => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({
  score,
  streak,
  attemptsLeft,
  melody,
  userInputNotes,
  matchedIndices,
  isPlaying,
  isListening,
  feedback,
  detectedPitch,
  detectedNote,
  audioBuffer,
  sampleRate,
  onPlayMelody,
  onStopListening,
  onReplayMelody,
}) => {
  const [showFeedback, setShowFeedback] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  useEffect(() => {
    if (feedback) {
      setShowFeedback(true)
      setFadeOut(false)
    } else if (showFeedback) {
      setFadeOut(true)
      const timeout = setTimeout(() => {
        setShowFeedback(false)
        setFadeOut(false)
      }, 500) // match CSS transition
      return () => clearTimeout(timeout)
    }
  }, [feedback])

  return (
    <div className="game-panel">
      <h1 className="game-panel__title">Ear Warrior</h1>

      <ScorePanel stats={{ score, streak }} attemptsLeft={attemptsLeft} />

      <div className="game-panel__controls">
        {/* Difficulty selection removed */}

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
  )
}