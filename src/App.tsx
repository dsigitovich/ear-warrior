import React, { useState } from 'react'
import { DifficultySelector } from './components/DifficultySelector'
import { ScorePanel } from './components/ScorePanel'
import { Game } from './components/Game'
import { useGameStore } from './store/gameStore'
import './App.css'

const App: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { isGameStarted } = useGameStore()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            🎵 Ear Warrior
          </h1>
          <p className="app-subtitle">
            Train Your Musical Ear Through Interactive Gaming
          </p>
          <button
            className="fullscreen-button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="game-layout">
          <ScorePanel />

          {!isGameStarted && (
            <div className="welcome-section">
              <h2 className="welcome-title">Welcome to Ear Warrior!</h2>
              <p className="welcome-description">
                Challenge your musical ear by reproducing melodies of increasing complexity.
                Select your difficulty level and start your musical journey!
              </p>
              <DifficultySelector />
            </div>
          )}

          <Game />

          {isGameStarted && (
            <div className="game-info">
              <div className="info-card">
                <h3>🎯 How to Play</h3>
                <ul>
                  <li>Listen to the melody carefully</li>
                  <li>Sing or hum it back into your microphone</li>
                  <li>Match the notes to earn points</li>
                  <li>Build streaks for bonus multipliers!</li>
                </ul>
              </div>

              <div className="info-card">
                <h3>🎤 Tips for Success</h3>
                <ul>
                  <li>Use a quiet environment</li>
                  <li>Sing clearly and confidently</li>
                  <li>Take your time to listen first</li>
                  <li>Practice with easier levels first</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2024 Ear Warrior - Musical Training Game</p>
        <div className="footer-links">
          <span>🎵 Train • 🎶 Learn • 🎸 Master</span>
        </div>
      </footer>
    </div>
  )
}

export default App
