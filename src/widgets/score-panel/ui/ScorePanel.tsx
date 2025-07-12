import React from 'react'
import { GameStats } from '../../../shared/types'
import './ScorePanel.css'

interface ScorePanelProps {
  stats: GameStats;
  attemptsLeft: number;
  fullscreen?: boolean;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ stats, attemptsLeft, fullscreen }) => {
  return (
    <div className={`score-panel${fullscreen ? ' score-panel--fullscreen' : ''}`}>
      <span className="score-panel__item">
        Score: {stats.score} ⭐
      </span>
      <span className="score-panel__item">
        Streak: {stats.streak} 🔥
      </span>
      <span className="score-panel__item score-panel__item--attempts">
        Attempts:
        <span className="score-panel__hearts">
          {Array.from({ length: attemptsLeft }).map((_, i) => (
            <span key={i} role="img" aria-label="heart">❤️</span>
          ))}
        </span>
      </span>
    </div>
  )
}