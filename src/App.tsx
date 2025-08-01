import React from 'react'
import { ScorePanel } from './components/ScorePanel'
import { Game } from './components/Game'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="app">
      <main className="app-main">
        <div className="game-layout">
          <ScorePanel />
          <Game />
        </div>
      </main>
    </div>
  )
}

export default App
