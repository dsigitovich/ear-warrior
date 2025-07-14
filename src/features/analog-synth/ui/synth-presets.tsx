import { analogSynthStore } from '../model/analog-synth-store'
import './synth-presets.module.scss'

const PRESETS = [
  { id: 'lead', name: '🎸 Lead', description: 'Sharp and cutting lead sound' },
  { id: 'pad', name: '🌊 Pad', description: 'Warm and atmospheric pad' },
  { id: 'bass', name: '🔊 Bass', description: 'Deep and punchy bass' },
  { id: 'arp', name: '⚡ Arp', description: 'Quick and percussive arp' }
]

export function SynthPresets() {
  const { currentPreset, setPreset } = analogSynthStore()

  return (
    <div className="synth-presets">
      <h3 className="presets-title">Presets</h3>
      <div className="presets-grid">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`preset-button ${currentPreset === preset.id ? 'active' : ''}`}
            onClick={() => setPreset(preset.id)}
            title={preset.description}
          >
            <span className="preset-icon">{preset.name.split(' ')[0]}</span>
            <span className="preset-name">{preset.name.split(' ')[1]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}