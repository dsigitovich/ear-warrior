import { 
  PolySynth, 
  Synth, 
  Filter, 
  FrequencyEnvelope, 
  Chorus, 
  Reverb, 
  PingPongDelay, 
  Distortion, 
  LFO, 
  Destination,
  start,
  now
} from 'tone'

export interface SynthParams {
  // Oscillator params
  waveform: 'sawtooth' | 'square' | 'triangle' | 'sine'
  detune: number
  
  // Filter params
  filterType: 'lowpass' | 'highpass' | 'bandpass'
  cutoff: number
  resonance: number
  filterEnvAmount: number
  
  // Envelope params
  attack: number
  decay: number
  sustain: number
  release: number
  
  // Effects params
  chorusWet: number
  reverbWet: number
  delayTime: number
  delayFeedback: number
  delayWet: number
  
  // Analog character
  drift: number
  warmth: number
  saturation: number
}

export class AnalogSynthEngine {
  private synth: PolySynth
  private filter: Filter
  private envelope: FrequencyEnvelope
  private chorus: Chorus
  private reverb: Reverb
  private delay: PingPongDelay
  private saturation: Distortion
  private warmthFilter: Filter
  private driftLFO: LFO
  
  private isInitialized = false
  
  constructor() {
    // Create the main synthesizer with analog-style oscillators
    this.synth = new PolySynth(Synth, {
      oscillator: {
        type: 'sawtooth',
        detune: 0
      },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8
      }
    })
    
    // Create analog-style filter
    this.filter = new Filter({
      type: 'lowpass',
      frequency: 2000,
      Q: 8
    })
    
    // Filter envelope for movement
    this.envelope = new FrequencyEnvelope({
      min: 200,
      max: 4000,
      attack: 0.1,
      decay: 0.4,
      sustain: 0.3,
      release: 1.2
    })
    
    // Analog warmth filter (subtle high-cut)
    this.warmthFilter = new Filter({
      type: 'lowpass',
      frequency: 8000,
      Q: 0.5
    })
    
    // Saturation for analog character
    this.saturation = new Distortion(0.1)
    
    // Drift LFO for analog instability
    this.driftLFO = new LFO({
      frequency: 0.1,
      amplitude: 5
    })
    
    // Effects chain
    this.chorus = new Chorus({
      frequency: 0.5,
      delayTime: 3.5,
      depth: 0.8,
      wet: 0.3
    })
    
    this.reverb = new Reverb({
      roomSize: 0.8,
      dampening: 3000,
      wet: 0.2
    })
    
    this.delay = new PingPongDelay({
      delayTime: '8n',
      feedback: 0.3,
      wet: 0.1
    })
    
    this.setupSignalChain()
  }
  
  private setupSignalChain(): void {
    // Connect filter envelope to filter frequency
    this.envelope.connect(this.filter.frequency)
    
    // Connect drift LFO to oscillator detune
    this.driftLFO.connect(this.synth.voice0.oscillator.detune)
    this.driftLFO.connect(this.synth.voice1?.oscillator.detune)
    this.driftLFO.connect(this.synth.voice2?.oscillator.detune)
    this.driftLFO.connect(this.synth.voice3?.oscillator.detune)
    
    // Main signal chain: Synth -> Filter -> Warmth -> Saturation -> Chorus -> Delay -> Reverb -> Output
    this.synth
      .connect(this.filter)
      .connect(this.warmthFilter)
      .connect(this.saturation)
      .connect(this.chorus)
      .connect(this.delay)
      .connect(this.reverb)
      .connect(Destination)
    
    // Start effects that need to be running
    this.chorus.start()
    this.driftLFO.start()
  }
  
  async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    try {
      await start()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize analog synth:', error)
      throw error
    }
  }
  
  updateParams(params: Partial<SynthParams>): void {
    if (!this.isInitialized) return
    
    // Update oscillator
    if (params.waveform) {
      this.synth.set({
        oscillator: { type: params.waveform }
      })
    }
    
    if (params.detune !== undefined) {
      this.synth.set({
        oscillator: { detune: params.detune }
      })
    }
    
    // Update filter
    if (params.filterType) {
      this.filter.type = params.filterType
    }
    
    if (params.cutoff !== undefined) {
      this.filter.frequency.value = params.cutoff
    }
    
    if (params.resonance !== undefined) {
      this.filter.Q.value = params.resonance
    }
    
    // Update envelope
    if (params.attack !== undefined || params.decay !== undefined || 
        params.sustain !== undefined || params.release !== undefined) {
      this.synth.set({
        envelope: {
          attack: params.attack ?? this.synth.voice0.envelope.attack,
          decay: params.decay ?? this.synth.voice0.envelope.decay,
          sustain: params.sustain ?? this.synth.voice0.envelope.sustain,
          release: params.release ?? this.synth.voice0.envelope.release
        }
      })
    }
    
    // Update filter envelope
    if (params.filterEnvAmount !== undefined) {
      this.envelope.max = 200 + (params.filterEnvAmount * 3800)
    }
    
    // Update effects
    if (params.chorusWet !== undefined) {
      this.chorus.wet.value = params.chorusWet
    }
    
    if (params.reverbWet !== undefined) {
      this.reverb.wet.value = params.reverbWet
    }
    
    if (params.delayTime !== undefined) {
      this.delay.delayTime.value = params.delayTime
    }
    
    if (params.delayFeedback !== undefined) {
      this.delay.feedback.value = params.delayFeedback
    }
    
    if (params.delayWet !== undefined) {
      this.delay.wet.value = params.delayWet
    }
    
    // Update analog character
    if (params.drift !== undefined) {
      this.driftLFO.amplitude.value = params.drift * 10
    }
    
    if (params.warmth !== undefined) {
      this.warmthFilter.frequency.value = 20000 - (params.warmth * 12000)
    }
    
    if (params.saturation !== undefined) {
      this.saturation.distortion = params.saturation
    }
  }
  
  playNote(note: string, duration: string = '4n'): void {
    if (!this.isInitialized) return
    
    try {
      // Add some analog-style randomness to timing and pitch
      const analogDelay = (Math.random() - 0.5) * 0.01 // ±10ms random delay
      const pitchVariation = (Math.random() - 0.5) * 2 // ±2 cents
      
      // Trigger the note with envelope
      this.envelope.triggerAttackRelease(duration)
      
      // Play the note with slight timing variation
      this.synth.triggerAttackRelease(note, duration, now() + analogDelay, 0.7)
      
      // Add subtle pitch variation
      if (this.synth.voice0) {
        this.synth.voice0.oscillator.detune.value += pitchVariation
        setTimeout(() => {
          if (this.synth.voice0) {
            this.synth.voice0.oscillator.detune.value -= pitchVariation
          }
        }, 100)
      }
    } catch (error) {
      console.error('Error playing note:', error)
    }
  }
  
  playMelody(notes: string[], tempo: number = 120): void {
    if (!this.isInitialized || notes.length === 0) return
    
    const noteDuration = 60 / tempo // seconds per beat
    
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.playNote(note, '4n')
      }, index * noteDuration * 1000)
    })
  }
  
  // Preset methods for different analog sounds
  setLeadSound(): void {
    this.updateParams({
      waveform: 'sawtooth',
      cutoff: 3000,
      resonance: 12,
      filterEnvAmount: 0.8,
      attack: 0.01,
      decay: 0.2,
      sustain: 0.6,
      release: 0.5,
      saturation: 0.2,
      warmth: 0.3
    })
  }
  
  setPadSound(): void {
    this.updateParams({
      waveform: 'triangle',
      cutoff: 1500,
      resonance: 4,
      filterEnvAmount: 0.3,
      attack: 0.8,
      decay: 0.5,
      sustain: 0.8,
      release: 2.0,
      chorusWet: 0.4,
      reverbWet: 0.5,
      warmth: 0.6
    })
  }
  
  setBassSound(): void {
    this.updateParams({
      waveform: 'square',
      cutoff: 800,
      resonance: 8,
      filterEnvAmount: 0.6,
      attack: 0.01,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8,
      saturation: 0.3,
      warmth: 0.4
    })
  }
  
  setArpSound(): void {
    this.updateParams({
      waveform: 'sawtooth',
      cutoff: 2500,
      resonance: 10,
      filterEnvAmount: 0.7,
      attack: 0.01,
      decay: 0.1,
      sustain: 0.2,
      release: 0.3,
      delayWet: 0.3,
      delayFeedback: 0.4,
      saturation: 0.15
    })
  }
  
  dispose(): void {
    this.synth.dispose()
    this.filter.dispose()
    this.envelope.dispose()
    this.chorus.dispose()
    this.reverb.dispose()
    this.delay.dispose()
    this.saturation.dispose()
    this.warmthFilter.dispose()
    this.driftLFO.dispose()
  }
}