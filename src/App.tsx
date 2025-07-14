import React from 'react'
import { UnifiedGamePage } from './pages/UnifiedGamePage'
import { AnalogSynthWidget } from './widgets/analog-synth-widget'
import './App.css'

const App: React.FC = () => {
  return (
    <>
      <UnifiedGamePage />
      <AnalogSynthWidget />
    </>
  )
}

export default App
