import React from 'react';
import { GameStats } from '../../../shared/types';
import './ScorePanel.css';

interface ScorePanelProps {
  stats: GameStats;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ stats }) => {
  return (
    <div className="score-panel">
      <span className="score-panel__item">
        Score: {stats.score} ⭐
      </span>
      <span className="score-panel__item">
        Streak: {stats.streak} 🔥
      </span>
    </div>
  );
}; 