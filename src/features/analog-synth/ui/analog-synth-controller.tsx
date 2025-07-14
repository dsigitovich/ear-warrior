import { analogSynthStore } from '../model/analog-synth-store'
import { SynthKnob } from './synth-knob'
import './analog-synth-controller.module.scss'

export function AnalogSynthController() {
  const { params, updateParams } = analogSynthStore()

  return (
    <div className="analog-synth-controller">
      <div className="controller-section">
        <h3 className="section-title">Oscillator</h3>
        <div className="knobs-row">
          <div className="waveform-selector">
            <label>Waveform</label>
            <select 
              value={params.waveform} 
              onChange={(e) => updateParams({ waveform: e.target.value as any })}
              className="waveform-select"
            >
              <option value="sawtooth">Saw</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
              <option value="sine">Sine</option>
            </select>
          </div>
          <SynthKnob
            label="Detune"
            value={params.detune}
            min={-50}
            max={50}
            onChange={(value) => updateParams({ detune: value })}
          />
        </div>
      </div>

      <div className="controller-section">
        <h3 className="section-title">Filter</h3>
        <div className="knobs-row">
          <SynthKnob
            label="Cutoff"
            value={params.cutoff}
            min={100}
            max={5000}
            onChange={(value) => updateParams({ cutoff: value })}
          />
          <SynthKnob
            label="Resonance"
            value={params.resonance}
            min={0.1}
            max={20}
            onChange={(value) => updateParams({ resonance: value })}
          />
          <SynthKnob
            label="Env Amount"
            value={params.filterEnvAmount}
            min={0}
            max={1}
            onChange={(value) => updateParams({ filterEnvAmount: value })}
          />
        </div>
      </div>

      <div className="controller-section">
        <h3 className="section-title">Envelope</h3>
        <div className="knobs-row">
          <SynthKnob
            label="Attack"
            value={params.attack}
            min={0.01}
            max={2}
            onChange={(value) => updateParams({ attack: value })}
          />
          <SynthKnob
            label="Decay"
            value={params.decay}
            min={0.1}
            max={2}
            onChange={(value) => updateParams({ decay: value })}
          />
          <SynthKnob
            label="Sustain"
            value={params.sustain}
            min={0}
            max={1}
            onChange={(value) => updateParams({ sustain: value })}
          />
          <SynthKnob
            label="Release"
            value={params.release}
            min={0.1}
            max={3}
            onChange={(value) => updateParams({ release: value })}
          />
        </div>
      </div>

      <div className="controller-section">
        <h3 className="section-title">Effects</h3>
        <div className="knobs-row">
          <SynthKnob
            label="Chorus"
            value={params.chorusWet}
            min={0}
            max={1}
            onChange={(value) => updateParams({ chorusWet: value })}
          />
          <SynthKnob
            label="Reverb"
            value={params.reverbWet}
            min={0}
            max={1}
            onChange={(value) => updateParams({ reverbWet: value })}
          />
          <SynthKnob
            label="Delay"
            value={params.delayWet}
            min={0}
            max={1}
            onChange={(value) => updateParams({ delayWet: value })}
          />
        </div>
      </div>

      <div className="controller-section">
        <h3 className="section-title">Analog Character</h3>
        <div className="knobs-row">
          <SynthKnob
            label="Drift"
            value={params.drift}
            min={0}
            max={1}
            onChange={(value) => updateParams({ drift: value })}
          />
          <SynthKnob
            label="Warmth"
            value={params.warmth}
            min={0}
            max={1}
            onChange={(value) => updateParams({ warmth: value })}
          />
          <SynthKnob
            label="Saturation"
            value={params.saturation}
            min={0}
            max={0.5}
            onChange={(value) => updateParams({ saturation: value })}
          />
        </div>
      </div>
    </div>
  )
}