import { useState } from 'react'
import { useGameSession } from '../processes/game-session'
import { getMelodyNotes } from '../entities/melody/model/melody'
import { ScorePanel } from '../widgets/score-panel'
import { WaveformDisplay } from '../widgets/waveform-display'
import { Button } from '../shared/ui/Button'
import { RoosterIcon } from '../shared/ui/RoosterIcon'
import { DIFFICULTY_LEVELS } from '../shared/config/constants'
import { useDifficultyStore } from '../shared/store/difficulty-store'
import { Difficulty } from '../shared/types'
import './UnifiedGamePage.css'

export function UnifiedGamePage() {
  const [gameStarted, setGameStarted] = useState(false)
  const difficulty = useDifficultyStore((s: any) => s.difficulty)
  const setDifficulty = useDifficultyStore((s: any) => s.setDifficulty)
  
  const {
    game,
    audioBuffer,
    playMelody,
    stopListening,
    replayMelody,
  } = useGameSession()
  
  const melodyNotes = game.currentMelody ? getMelodyNotes(game.currentMelody) : []

  const handleStartGame = () => {
    setGameStarted(true)
    setTimeout(() => playMelody(), 300)
  }

  const handleNewGame = () => {
    stopListening()
    setGameStarted(false)
  }

  const handlePlayAgain = () => {
    playMelody()
  }

  return (
    <div className="unified-game-page">
      <div className="unified-game-container">
        {/* Header */}
        <div className="unified-game-header">
          <RoosterIcon width={48} height={36} jumping={game.state === 'playing'} />
          <h1 className="unified-game-title">Ear Warrior</h1>
          <div className="unified-game-subtitle">Train Your Musical Ear</div>
        </div>

        {/* Game Stats - Always visible when game started */}
        {gameStarted && (
          <ScorePanel stats={game.stats} attemptsLeft={game.attemptsLeft} />
        )}

        {/* Main Game Area */}
        <div className="unified-game-main">
          {!gameStarted ? (
            // Start Screen
            <div className="unified-game-start">
              <div className="unified-game-difficulty">
                <label htmlFor="difficulty" className="unified-game-difficulty-label">
                  Select Difficulty:
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as Difficulty)}
                  className="unified-game-difficulty-select"
                >
                  {DIFFICULTY_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              
              <Button onClick={handleStartGame} variant="primary" size="large">
                Start Game
              </Button>
              
              <div className="unified-game-instructions">
                <p>🎵 Listen to the melody and sing it back!</p>
                <p>🎤 Use your microphone to match the notes</p>
                <p>⭐ Earn points for correct sequences</p>
                <p>🔥 Build your streak for bonus points</p>
              </div>
            </div>
          ) : (
            // Game Screen
            <div className="unified-game-active">
              {/* Game Controls */}
              <div className="unified-game-controls">
                <Button
                  onClick={handlePlayAgain}
                  disabled={game.state === 'playing' || game.state === 'listening'}
                  variant="primary"
                >
                  {game.state === 'playing' ? 'Playing...' : 'Play Melody'}
                </Button>
                
                {game.state === 'listening' && (
                  <>
                    <Button
                      onClick={stopListening}
                      variant="danger"
                      size="small"
                    >
                      Stop
                    </Button>
                    <Button
                      onClick={replayMelody}
                      variant="secondary"
                      size="small"
                    >
                      Replay
                    </Button>
                  </>
                )}
                
                <Button
                  onClick={handleNewGame}
                  variant="secondary"
                  size="small"
                >
                  New Game
                </Button>
              </div>

              {/* Waveform Display */}
              <WaveformDisplay
                buffer={audioBuffer}
                pitch={game.detectedPitch}
                detectedNote={game.detectedNote}
                matchedIndices={game.matchedIndices}
                melodyLength={melodyNotes.length}
                sampleRate={44100}
              />

              {/* Notes Display */}
              <div className="unified-game-notes">
                {melodyNotes.length > 0 && (
                  <div className="unified-game-notes-section">
                    <div className="unified-game-notes-label">Target Melody:</div>
                    <div className="unified-game-melody-notes">
                      {melodyNotes.map((note, idx) => (
                        <div
                          key={idx}
                          className={`unified-game-note ${
                            game.matchedIndices.includes(idx) ? 'unified-game-note--matched' : ''
                          }`}
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {game.userInput.length > 0 && (
                  <div className="unified-game-notes-section">
                    <div className="unified-game-notes-label">Your Input:</div>
                    <div className="unified-game-user-notes">
                      {game.userInput.map((note, idx) => (
                        <div key={idx} className="unified-game-note unified-game-note--user">
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {game.feedback && (
                <div className="unified-game-feedback">
                  {game.feedback}
                  {game.feedback === 'Success!' ? ' 🎉' : game.feedback === 'Try again!' ? ' ❌' : ''}
                </div>
              )}

              {/* Current Status */}
              <div className="unified-game-status">
                {game.state === 'listening' && (
                  <div className="unified-game-status-listening">
                    🎤 Listening... {game.detectedNote ? `Detected: ${game.detectedNote}` : 'Sing the melody!'}
                  </div>
                )}
                {game.state === 'playing' && (
                  <div className="unified-game-status-playing">
                    🎵 Playing melody...
                  </div>
                )}
                {game.state === 'idle' && melodyNotes.length === 0 && (
                  <div className="unified-game-status-idle">
                    Press "Play Melody" to start a new challenge!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}