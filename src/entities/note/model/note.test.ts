import { Note } from './note'

describe('Note', () => {
  describe('constructor', () => {
    it('should create a note with valid properties', () => {
      const note = new Note('C', 4, 261.63)

      expect(note.name).toBe('C')
      expect(note.octave).toBe(4)
      expect(note.frequency).toBe(261.63)
    })

    it('should create a note with default octave when not provided', () => {
      const note = new Note('A', undefined, 440)

      expect(note.name).toBe('A')
      expect(note.octave).toBe(4) // default octave
      expect(note.frequency).toBe(440)
    })
  })

  describe('toString', () => {
    it('should return note name with octave', () => {
      const note = new Note('C', 4, 261.63)

      expect(note.toString()).toBe('C4')
    })

    it('should return note name with octave when octave is provided', () => {
      const note = new Note('A', undefined, 440)

      expect(note.toString()).toBe('A4')
    })
  })

  describe('equals', () => {
    it('should return true for notes with same name and octave', () => {
      const note1 = new Note('C', 4, 261.63)
      const note2 = new Note('C', 4, 261.63)

      expect(note1.equals(note2)).toBe(true)
    })

    it('should return false for notes with different names', () => {
      const note1 = new Note('C', 4, 261.63)
      const note2 = new Note('D', 4, 293.66)

      expect(note1.equals(note2)).toBe(false)
    })

    it('should return false for notes with different octaves', () => {
      const note1 = new Note('C', 4, 261.63)
      const note2 = new Note('C', 5, 523.25)

      expect(note1.equals(note2)).toBe(false)
    })

    it('should return true for notes with same name but undefined octave', () => {
      const note1 = new Note('A', undefined, 440)
      const note2 = new Note('A', undefined, 440)

      expect(note1.equals(note2)).toBe(true)
    })
  })

  describe('getMidiNote', () => {
    it('should return correct MIDI note number for C4', () => {
      const note = new Note('C', 4, 261.63)

      expect(note.getMidiNote()).toBe(60)
    })

    it('should return correct MIDI note number for A4', () => {
      const note = new Note('A', 4, 440)

      expect(note.getMidiNote()).toBe(69)
    })

    it('should return correct MIDI note number for C5', () => {
      const note = new Note('C', 5, 523.25)

      expect(note.getMidiNote()).toBe(72)
    })

    it('should return correct MIDI note number for A3', () => {
      const note = new Note('A', 3, 220)

      expect(note.getMidiNote()).toBe(57)
    })
  })

  describe('static fromMidiNote', () => {
    it('should create note from MIDI note 60 (C4)', () => {
      const note = Note.fromMidiNote(60)

      expect(note.name).toBe('C')
      expect(note.octave).toBe(4)
      expect(note.frequency).toBeCloseTo(261.63, 1)
    })

    it('should create note from MIDI note 69 (A4)', () => {
      const note = Note.fromMidiNote(69)

      expect(note.name).toBe('A')
      expect(note.octave).toBe(4)
      expect(note.frequency).toBeCloseTo(440, 1)
    })

    it('should create note from MIDI note 72 (C5)', () => {
      const note = Note.fromMidiNote(72)

      expect(note.name).toBe('C')
      expect(note.octave).toBe(5)
      expect(note.frequency).toBeCloseTo(523.25, 1)
    })

    it('should throw error for invalid MIDI note numbers', () => {
      expect(() => Note.fromMidiNote(-1)).toThrow('Invalid MIDI note number')
      expect(() => Note.fromMidiNote(128)).toThrow('Invalid MIDI note number')
    })
  })

  describe('static fromFrequency', () => {
    it('should create note from frequency 261.63 (C4)', () => {
      const note = Note.fromFrequency(261.63)

      expect(note.name).toBe('C')
      expect(note.octave).toBe(4)
      expect(note.frequency).toBeCloseTo(261.63, 1)
    })

    it('should create note from frequency 440 (A4)', () => {
      const note = Note.fromFrequency(440)

      expect(note.name).toBe('A')
      expect(note.octave).toBe(4)
      expect(note.frequency).toBeCloseTo(440, 1)
    })

    it('should create note from frequency 523.25 (C5)', () => {
      const note = Note.fromFrequency(523.25)

      expect(note.name).toBe('C')
      expect(note.octave).toBe(5)
      expect(note.frequency).toBeCloseTo(523.25, 1)
    })

    it('should throw error for frequencies outside valid range', () => {
      expect(() => Note.fromFrequency(0)).toThrow('Frequency out of range')
      expect(() => Note.fromFrequency(20001)).toThrow('Frequency out of range')
    })
  })
})