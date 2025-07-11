import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { GamePage } from './pages/game'
import './App.css'

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/game' element={<GamePage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
