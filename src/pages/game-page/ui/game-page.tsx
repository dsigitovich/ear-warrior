import { AnalogSynthWidget } from '../../../widgets/analog-synth-widget'
import './game-page.module.scss'

export function GamePage() {
  return (
    <div className="game-page">
      <header className="game-header">
        <h1>🎵 Ear Warrior</h1>
        <p>Musical ear training with analog warmth</p>
      </header>
      
      <main className="game-content">
        <div className="welcome-message">
          <h2>Welcome to Enhanced Ear Warrior!</h2>
          <p>
            Experience warm analog synthesizer sounds while training your musical ear.
            Click the <strong>🎹 Analog Synth</strong> button to explore different sounds and presets.
          </p>
          
          <div className="features-list">
            <div className="feature">
              <span className="feature-icon">🎸</span>
              <span>Lead & Bass Sounds</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌊</span>
              <span>Atmospheric Pads</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Dynamic Arpeggios</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎛️</span>
              <span>Analog Controls</span>
            </div>
          </div>
          
          <div className="demo-section">
            <h3>Try the Analog Synth:</h3>
            <ol>
              <li>Click the purple <strong>🎹 Analog Synth</strong> button (top-right)</li>
              <li>Choose a preset: Lead, Pad, Bass, or Arp</li>
              <li>Play notes on the virtual keyboard</li>
              <li>Adjust knobs for custom sounds</li>
              <li>Experience warm analog character with drift, warmth, and saturation controls</li>
            </ol>
          </div>
        </div>
      </main>
      
      <AnalogSynthWidget />
    </div>
  )
}