import { create } from 'zustand'
import { AnalogSynthEngine, SynthParams } from './analog-synth-engine'

interface AnalogSynthState {
  engine: AnalogSynthEngine | null
  isInitialized: boolean
  currentPreset: string
  params: SynthParams
  
  // Actions
  initializeEngine: () => Promise<void>
  updateParams: (newParams: Partial<SynthParams>) => void
  playNote: (note: string, duration?: string) => void
  playMelody: (notes: string[], tempo?: number) => void
  setPreset: (preset: string) => void
  dispose: () => void
}

const defaultParams: SynthParams = {
  // Oscillator
  waveform: 'sawtooth',
  detune: 0,
  
  // Filter
  filterType: 'lowpass',
  cutoff: 2000,
  resonance: 8,
  filterEnvAmount: 0.5,
  
  // Envelope
  attack: 0.1,
  decay: 0.3,
  sustain: 0.4,
  release: 0.8,
  
  // Effects
  chorusWet: 0.3,
  reverbWet: 0.2,
  delayTime: 0.125,
  delayFeedback: 0.3,
  delayWet: 0.1,
  
  // Analog character
  drift: 0.2,
  warmth: 0.4,
  saturation: 0.1
}

export const analogSynthStore = create<AnalogSynthState>((set, get) => ({
  engine: null,
  isInitialized: false,
  currentPreset: 'lead',
  params: defaultParams,
  
  initializeEngine: async () => {
    const { engine } = get()
    
    if (engine) {
      await engine.initialize()
      set({ isInitialized: true })
      return
    }
    
    try {
      const newEngine = new AnalogSynthEngine()
      await newEngine.initialize()
      
      // Apply default params
      newEngine.updateParams(defaultParams)
      newEngine.setLeadSound() // Default to lead sound
      
      set({ 
        engine: newEngine, 
        isInitialized: true 
      })
    } catch (error) {
      console.error('Failed to initialize analog synth engine:', error)
      throw error
    }
  },
  
  updateParams: (newParams: Partial<SynthParams>) => {
    const { engine, params } = get()
    
    if (!engine) return
    
    const updatedParams = { ...params, ...newParams }
    engine.updateParams(newParams)
    
    set({ params: updatedParams })
  },
  
  playNote: (note: string, duration = '4n') => {
    const { engine } = get()
    if (!engine) return
    
    engine.playNote(note, duration)
  },
  
  playMelody: (notes: string[], tempo = 120) => {
    const { engine } = get()
    if (!engine) return
    
    engine.playMelody(notes, tempo)
  },
  
  setPreset: (preset: string) => {
    const { engine } = get()
    if (!engine) return
    
    switch (preset) {
      case 'lead':
        engine.setLeadSound()
        break
      case 'pad':
        engine.setPadSound()
        break
      case 'bass':
        engine.setBassSound()
        break
      case 'arp':
        engine.setArpSound()
        break
      default:
        engine.setLeadSound()
    }
    
    set({ currentPreset: preset })
  },
  
  dispose: () => {
    const { engine } = get()
    if (engine) {
      engine.dispose()
    }
    
    set({ 
      engine: null, 
      isInitialized: false 
    })
  }
}))