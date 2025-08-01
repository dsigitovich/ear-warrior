import React from 'react'
import { useGameStore } from '../store/gameStore'
import './ScorePanel.css'

export interface ScorePanelProps {
  className?: string
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ className = '' }) => {
  const {
    score,
    highScore,
    currentStreak,
    bestStreak,
    currentLevel,
    totalLevels,
    timeRemaining,
    isGameStarted
  } = useGameStore()

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStreakMultiplier = (streak: number): number => {
    if (streak >= 10) return 4
    if (streak >= 7) return 3
    if (streak >= 4) return 2
    return 1
  }

  const multiplier = getStreakMultiplier(currentStreak)

  return (
    <div className={`score-panel ${className}`}>
      <div className="score-grid">
        {/* Current Score */}
        <div className="score-card primary">
          <div className="score-icon">🎯</div>
          <div className="score-content">
            <h3 className="score-label">Current Score</h3>
            <div className="score-value">{score.toLocaleString()}</div>
          </div>
        </div>

        {/* High Score */}
        <div className="score-card secondary">
          <div className="score-icon">🏆</div>
          <div className="score-content">
            <h3 className="score-label">High Score</h3>
            <div className="score-value">{highScore.toLocaleString()}</div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="score-card accent">
          <div className="score-icon">🔥</div>
          <div className="score-content">
            <h3 className="score-label">Current Streak</h3>
            <div className="score-value">
              {currentStreak}
              {multiplier > 1 && (
                <span className="multiplier">×{multiplier}</span>
              )}
            </div>
          </div>
        </div>

        {/* Best Streak */}
        <div className="score-card info">
          <div className="score-icon">⭐</div>
          <div className="score-content">
            <h3 className="score-label">Best Streak</h3>
            <div className="score-value">{bestStreak}</div>
          </div>
        </div>

        {/* Level Progress */}
        {isGameStarted && (
          <div className="score-card progress">
            <div className="score-icon">📊</div>
            <div className="score-content">
              <h3 className="score-label">Level</h3>
              <div className="score-value">
                {currentLevel}/{totalLevels}
              </div>
            </div>
          </div>
        )}

        {/* Time Remaining */}
        {isGameStarted && (
          <div className="score-card timer">
            <div className="score-icon">⏱️</div>
            <div className="score-content">
              <h3 className="score-label">Time</h3>
              <div className="score-value">{formatTime(timeRemaining)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
