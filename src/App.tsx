import React from 'react'
import { ScorePanel } from './components/ScorePanel'
import { Game } from './components/Game'
import { DifficultySelector } from './components/DifficultySelector'
import { useGameStore } from './store/gameStore'
import './App.css'

const App: React.FC = () => {
  const { isGameStarted } = useGameStore()

  return (
    <div className="app">
      <main className="app-main">
        <div className="game-layout">
          <ScorePanel />
          {!isGameStarted && <DifficultySelector />}
          <Game />
        </div>
      </main>
    </div>
  )
}

export default App
