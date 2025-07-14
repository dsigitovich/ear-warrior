import { useState } from 'react'
import { AnalogSynth } from '../../../features/analog-synth'
import './analog-synth-widget.module.scss'

export function AnalogSynthWidget() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="analog-synth-widget">
      <button 
        className={`synth-toggle ${isVisible ? 'active' : ''}`}
        onClick={() => setIsVisible(!isVisible)}
        title="Toggle Analog Synthesizer"
      >
        🎹 Analog Synth
      </button>
      
      {isVisible && (
        <div className="synth-panel">
          <AnalogSynth />
        </div>
      )}
    </div>
  )
}