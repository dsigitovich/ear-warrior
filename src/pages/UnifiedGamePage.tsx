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
import { getRandomSmokeText, getSmokeTexts } from '../shared/lib/smoke-texts'
import './UnifiedGamePage.css'

export function UnifiedGamePage () {
  const [isPlaying, setIsPlaying] = useState(false)
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

  const handlePlayAgain = () => {
    setIsPlaying(true)
    setTimeout(() => {
      playMelody()
    }, 500)
  }

  const handleStop = () => {
    stopListening()
    setIsPlaying(false)
  }

  const handleReplay = () => {
    replayMelody()
  }

  return (
    <div className="unified-game-page">
      {/* График и логотип на всю ширину экрана */}
      {isPlaying && (
        <>
          <div className="fullscreen-header">
            <RoosterIcon width={64} height={48} jumping={game.state === 'playing'} />
            <h1 className="fullscreen-title">Ear Warrior</h1>
            <div className="fullscreen-subtitle">Train Your Musical Ear</div>
            <div className="fullscreen-score-panel-wrapper">
              <ScorePanel stats={game.stats} attemptsLeft={game.attemptsLeft} fullscreen />
            </div>
          </div>
          <div className="fullscreen-waveform">
            <WaveformDisplay
              buffer={audioBuffer}
              pitch={game.detectedPitch}
              detectedNote={game.detectedNote}
              matchedIndices={game.matchedIndices}
              melodyLength={melodyNotes.length}
              sampleRate={44100}
            />
            <div className="unified-game-playing-controls">
              {game.state === 'listening' && (
                <>
                  <Button
                    onClick={handleStop}
                    variant="danger"
                    size="small"
                  >
                    Stop
                  </Button>
                  <Button
                    onClick={handleReplay}
                    variant="secondary"
                    size="small"
                  >
                    Replay
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {/* Всё остальное только если не isPlaying */}
      {!isPlaying && (
        <div className="unified-game-container">
          <div className="unified-game-header">
            <RoosterIcon width={48} height={36} jumping={game.state === 'playing'} />
            <h1 className="unified-game-title">Ear Warrior</h1>
            <div className="unified-game-subtitle">Train Your Musical Ear</div>
          </div>
          <div className="unified-game-main">
            <div className="unified-game-controls">
              <Button
                onClick={handlePlayAgain}
                disabled={game.state === 'playing' || game.state === 'listening'}
                variant="primary"
              >
                {game.state === 'playing' ? 'Playing...' : 'Play Melody'}
              </Button>
            </div>
            <div className="unified-game-content">
              <div className="unified-game-difficulty">
                <label htmlFor="difficulty" className="unified-game-difficulty-label">
                  Difficulty:
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as Difficulty)}
                  className="unified-game-difficulty-select"
                  disabled={game.state === 'playing' || game.state === 'listening'}
                >
                  {DIFFICULTY_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              <ScorePanel stats={game.stats} attemptsLeft={game.attemptsLeft} />
              <div className="unified-game-instructions">
                <h3>🎵 How to Play</h3>
                {getSmokeTexts('instructions', 4).map((instruction, idx) => (
                  <p key={idx}>• {instruction}</p>
                ))}
              </div>
              <div className="unified-game-tips">
                <h3>💡 Pro Tips</h3>
                {getSmokeTexts('tips', 3).map((tip, idx) => (
                  <p key={idx}>• {tip}</p>
                ))}
              </div>
              <div className="unified-game-features">
                <h3>🎯 Game Features</h3>
                {getSmokeTexts('features', 3).map((feature, idx) => (
                  <p key={idx}>• {feature}</p>
                ))}
              </div>
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
              {game.feedback && (
                <div className="unified-game-feedback">
                  {game.feedback}
                  {game.feedback === 'Success!' ? ' 🎉' : game.feedback === 'Try again!' ? ' ❌' : ''}
                  {game.feedback === 'Success!' && (
                    <p className="unified-game-feedback-encouragement">
                      {getRandomSmokeText('progressMessages')}
                    </p>
                  )}
                  {game.feedback === 'Try again!' && (
                    <p className="unified-game-feedback-encouragement">
                      {getRandomSmokeText('encouragements')}
                    </p>
                  )}
                </div>
              )}
              <div className="unified-game-status">
                {game.state === 'listening' && (
                  <div className="unified-game-status-listening">
                    🎤 {getRandomSmokeText('gameStates')} {game.detectedNote ? `Detected: ${game.detectedNote}` : 'Sing the melody!'}
                  </div>
                )}
                {game.state === 'playing' && (
                  <div className="unified-game-status-playing">
                    🎵 {getRandomSmokeText('loadingStates')}
                  </div>
                )}
                {game.state === 'idle' && melodyNotes.length === 0 && (
                  <div className="unified-game-status-idle">
                    {getRandomSmokeText('encouragements')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}