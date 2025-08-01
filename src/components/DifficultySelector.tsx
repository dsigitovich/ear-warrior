import React from 'react'
import { useGameStore, Difficulty } from '../store/gameStore'
import './DifficultySelector.css'

export interface DifficultySelectorProps {
  className?: string
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ className = '' }) => {
  const { setDifficulty, difficulty } = useGameStore()

  const difficulties = [
    { id: 'beginner', name: 'Beginner', description: 'Simple melodies, 3-4 notes', color: '#4CAF50' },
    { id: 'intermediate', name: 'Intermediate', description: 'Moderate complexity, 5-6 notes', color: '#FF9800' },
    { id: 'advanced', name: 'Advanced', description: 'Complex melodies, 7-8 notes', color: '#F44336' },
    { id: 'expert', name: 'Expert', description: 'Very complex, 8+ notes', color: '#9C27B0' }
  ]

  return (
    <div className={`difficulty-selector ${className}`}>
      <h3 className="difficulty-title">Select Difficulty Level</h3>
      <div className="difficulty-grid">
        {difficulties.map((level) => (
          <button
            key={level.id}
            className={`difficulty-card ${difficulty === level.id ? 'selected' : ''}`}
            onClick={() => setDifficulty(level.id as Difficulty)}
            style={{ '--accent-color': level.color } as React.CSSProperties}
          >
            <div className="difficulty-icon">
              {level.id === 'beginner' && '🌱'}
              {level.id === 'intermediate' && '🎵'}
              {level.id === 'advanced' && '🎼'}
              {level.id === 'expert' && '🎯'}
            </div>
            <div className="difficulty-content">
              <h4 className="difficulty-name">{level.name}</h4>
              <p className="difficulty-description">{level.description}</p>
            </div>
            {difficulty === level.id && (
              <div className="selected-indicator">✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
