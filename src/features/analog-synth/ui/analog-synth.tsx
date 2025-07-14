import { useEffect } from 'react'
import { analogSynthStore } from '../model/analog-synth-store'
import { AnalogSynthController } from './analog-synth-controller'
import { SynthPresets } from './synth-presets'
import { SynthKeyboard } from './synth-keyboard'
import './analog-synth.module.scss'

export function AnalogSynth() {
  const { 
    isInitialized, 
    initializeEngine, 
    dispose 
  } = analogSynthStore()

  useEffect(() => {
    initializeEngine().catch(console.error)
    
    return () => {
      dispose()
    }
  }, [initializeEngine, dispose])

  if (!isInitialized) {
    return (
      <div className="analog-synth-loading">
        <div className="loading-spinner">⚡</div>
        <p>Initializing Analog Synth...</p>
      </div>
    )
  }

  return (
    <div className="analog-synth">
      <div className="synth-header">
        <h2 className="synth-title">🎹 Analog Synth</h2>
        <p className="synth-subtitle">Warm analog sounds for your melodies</p>
      </div>
      
      <div className="synth-content">
        <div className="synth-controls">
          <SynthPresets />
          <AnalogSynthController />
        </div>
        
        <div className="synth-interface">
          <SynthKeyboard />
        </div>
      </div>
    </div>
  )
}