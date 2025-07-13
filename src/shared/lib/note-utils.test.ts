import {
  getNoteFrequency,
  getNoteFromFrequency,
  getMidiNoteNumber,
  getNoteFromMidi,
  isValidFrequency,
  isValidMidiNote
} from './note-utils'
import { NOTES } from '../config/constants'

describe('note-utils', () => {
  describe('getNoteFrequency', () => {
    it('should return correct frequency for C4', () => {
      const frequency = getNoteFrequency('C', 4)

      expect(frequency).toBeCloseTo(261.63, 1)
    })

    it('should return correct frequency for A4', () => {
      const frequency = getNoteFrequency('A', 4)

      expect(frequency).toBeCloseTo(440.00, 1)
    })

    it('should return correct frequency for C5', () => {
      const frequency = getNoteFrequency('C', 5)

      expect(frequency).toBeCloseTo(523.25, 1)
    })

    it('should return correct frequency for A3', () => {
      const frequency = getNoteFrequency('A', 3)

      expect(frequency).toBeCloseTo(220.00, 1)
    })

    it('should throw error for invalid note name', () => {
      expect(() => getNoteFrequency('X', 4)).toThrow('Invalid note name')
    })

    it('should throw error for invalid octave', () => {
      expect(() => getNoteFrequency('C', -2)).toThrow('Invalid octave')
      expect(() => getNoteFrequency('C', 11)).toThrow('Invalid octave')
    })
  })

  describe('getNoteFromFrequency', () => {
    it('should return correct note for frequency 261.63 (C4)', () => {
      const result = getNoteFromFrequency(261.63)

      expect(result.note).toBe('C')
      expect(result.octave).toBe(4)
      expect(result.frequency).toBeCloseTo(261.63, 1)
    })

    it('should return correct note for frequency 440 (A4)', () => {
      const result = getNoteFromFrequency(440)

      expect(result.note).toBe('A')
      expect(result.octave).toBe(4)
      expect(result.frequency).toBeCloseTo(440, 1)
    })

    it('should return correct note for frequency 523.25 (C5)', () => {
      const result = getNoteFromFrequency(523.25)

      expect(result.note).toBe('C')
      expect(result.octave).toBe(5)
      expect(result.frequency).toBeCloseTo(523.25, 1)
    })

    it('should return correct note for frequency 220 (A3)', () => {
      const result = getNoteFromFrequency(220)

      expect(result.note).toBe('A')
      expect(result.octave).toBe(3)
      expect(result.frequency).toBeCloseTo(220, 1)
    })

    it('should throw error for frequency out of range', () => {
      expect(() => getNoteFromFrequency(0)).toThrow('Frequency out of range')
      expect(() => getNoteFromFrequency(20001)).toThrow('Frequency out of range')
    })
  })

  describe('getMidiNoteNumber', () => {
    it('should return correct MIDI note for C4', () => {
      const midiNote = getMidiNoteNumber('C', 4)

      expect(midiNote).toBe(60)
    })

    it('should return correct MIDI note for A4', () => {
      const midiNote = getMidiNoteNumber('A', 4)

      expect(midiNote).toBe(69)
    })

    it('should return correct MIDI note for C5', () => {
      const midiNote = getMidiNoteNumber('C', 5)

      expect(midiNote).toBe(72)
    })

    it('should return correct MIDI note for A3', () => {
      const midiNote = getMidiNoteNumber('A', 3)

      expect(midiNote).toBe(57)
    })

    it('should throw error for invalid note name', () => {
      expect(() => getMidiNoteNumber('X', 4)).toThrow('Invalid note name')
    })

    it('should throw error for invalid octave', () => {
      expect(() => getMidiNoteNumber('C', -1)).toThrow('Invalid octave')
      expect(() => getMidiNoteNumber('C', 10)).toThrow('Invalid octave')
    })
  })

  describe('getNoteFromMidi', () => {
    it('should return correct note for MIDI note 60 (C4)', () => {
      const result = getNoteFromMidi(60)

      expect(result.note).toBe('C')
      expect(result.octave).toBe(4)
      expect(result.frequency).toBeCloseTo(261.63, 1)
    })

    it('should return correct note for MIDI note 69 (A4)', () => {
      const result = getNoteFromMidi(69)

      expect(result.note).toBe('A')
      expect(result.octave).toBe(4)
      expect(result.frequency).toBeCloseTo(440, 1)
    })

    it('should return correct note for MIDI note 72 (C5)', () => {
      const result = getNoteFromMidi(72)

      expect(result.note).toBe('C')
      expect(result.octave).toBe(5)
      expect(result.frequency).toBeCloseTo(523.25, 1)
    })

    it('should return correct note for MIDI note 57 (A3)', () => {
      const result = getNoteFromMidi(57)

      expect(result.note).toBe('A')
      expect(result.octave).toBe(3)
      expect(result.frequency).toBeCloseTo(220, 1)
    })

    it('should throw error for invalid MIDI note numbers', () => {
      expect(() => getNoteFromMidi(-1)).toThrow('Invalid MIDI note number')
      expect(() => getNoteFromMidi(128)).toThrow('Invalid MIDI note number')
    })
  })

  describe('isValidFrequency', () => {
    it('should return true for valid frequencies', () => {
      expect(isValidFrequency(20)).toBe(true)
      expect(isValidFrequency(440)).toBe(true)
      expect(isValidFrequency(20000)).toBe(true)
    })

    it('should return false for invalid frequencies', () => {
      expect(isValidFrequency(0)).toBe(false)
      expect(isValidFrequency(-1)).toBe(false)
      expect(isValidFrequency(20001)).toBe(false)
    })
  })

  describe('isValidMidiNote', () => {
    it('should return true for valid MIDI note numbers', () => {
      expect(isValidMidiNote(0)).toBe(true)
      expect(isValidMidiNote(60)).toBe(true)
      expect(isValidMidiNote(127)).toBe(true)
    })

    it('should return false for invalid MIDI note numbers', () => {
      expect(isValidMidiNote(-1)).toBe(false)
      expect(isValidMidiNote(128)).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle boundary frequencies correctly', () => {
      const minFreq = getNoteFromFrequency(20)
      const maxFreq = getNoteFromFrequency(20000)
      // Ближайшая нота к 20 Гц — D#0 (≈ 19.45 Гц)
      expect(minFreq.note).toBe('D#')
      expect(minFreq.octave).toBe(0)
      expect(minFreq.frequency).toBeCloseTo(19.45, 1)
      // Ближайшая нота к 20000 Гц — B9 (≈ 15804.27 Гц)
      expect(maxFreq.note).toBe('B')
      expect(maxFreq.octave).toBe(9)
      expect(maxFreq.frequency).toBeCloseTo(15804.27, 0)
    })

    it('should handle boundary MIDI notes correctly', () => {
      const minMidi = getNoteFromMidi(0)
      const maxMidi = getNoteFromMidi(127)
      // MIDI 0 = C-1
      expect(minMidi.note).toBe('C')
      expect(minMidi.octave).toBe(-1)
      expect(minMidi.frequency).toBeCloseTo(8.18, 2)
      // MIDI 127 = G9
      expect(maxMidi.note).toBe('G')
      expect(maxMidi.octave).toBe(9)
      expect(maxMidi.frequency).toBeCloseTo(12543.85, 2)
    })

    it('should handle all note names in constants', () => {
      NOTES.forEach(noteName => {
        const frequency = getNoteFrequency(noteName, 4)
        expect(frequency).toBeGreaterThan(0)

        const midiNote = getMidiNoteNumber(noteName, 4)
        expect(midiNote).toBeGreaterThanOrEqual(0)
        expect(midiNote).toBeLessThanOrEqual(127)
      })
    })
  })
})