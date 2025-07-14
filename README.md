# Ear Warrior

Musical ear training game with analog synthesizer integration.

## 🎹 New Feature: Analog Synthesizer

Experience warm analog sounds while training your musical ear! The built-in analog synthesizer adds a new dimension to your practice sessions.

### Features

- **🎸 Lead Sounds**: Sharp and cutting lead tones perfect for melodies
- **🌊 Pad Sounds**: Warm and atmospheric textures for ambient practice  
- **🔊 Bass Sounds**: Deep and punchy bass tones with character
- **⚡ Arp Sounds**: Quick and percussive sounds for rhythmic training

### Analog Character

- **Drift**: Subtle pitch instability for authentic analog feel
- **Warmth**: High-frequency rolloff for vintage character
- **Saturation**: Harmonic distortion for analog richness
- **Effects**: Built-in chorus, reverb, and ping-pong delay

### How to Use

1. Click the **🎹 Analog Synth** button (purple, top-right corner)
2. Choose from 4 preset sounds: Lead, Pad, Bass, or Arp
3. Play notes using the virtual keyboard
4. Adjust parameters with the analog-style knobs:
   - **Oscillator**: Waveform selection and detuning
   - **Filter**: Cutoff, resonance, and envelope amount
   - **Envelope**: Attack, decay, sustain, release (ADSR)
   - **Effects**: Chorus, reverb, and delay controls
   - **Analog Character**: Drift, warmth, and saturation

### Technical Details

Built with:
- **Tone.js** for audio synthesis and effects
- **React** for the user interface  
- **Zustand** for state management
- **Feature Slice Design** architecture

The synthesizer uses polyphonic synthesis with:
- Multiple oscillator waveforms (sawtooth, square, triangle, sine)
- Analog-style filter with resonance
- Frequency envelope for filter modulation  
- LFO for pitch drift simulation
- Professional effects chain

## Development

```bash
npm install
npm run dev
```

## Original Game Features

This project includes all the original Ear Warrior functionality plus the new analog synthesizer enhancement.
