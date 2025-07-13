import { Melody } from './melody'
import { Note } from '../../note/model/note'

describe('Melody', () => {
  const createTestNotes = () => [
    new Note('C', 4, 261.63),
    new Note('D', 4, 293.66),
    new Note('E', 4, 329.63),
    new Note('F', 4, 349.23),
    new Note('G', 4, 392.00)
  ]

  describe('constructor', () => {
    it('should create a melody with notes', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      expect(melody.notes).toEqual(notes)
      expect(melody.length).toBe(5)
    })

    it('should create an empty melody', () => {
      const melody = new Melody([])

      expect(melody.notes).toEqual([])
      expect(melody.length).toBe(0)
    })
  })

  describe('length', () => {
    it('should return the number of notes in the melody', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      expect(melody.length).toBe(5)
    })

    it('should return 0 for empty melody', () => {
      const melody = new Melody([])

      expect(melody.length).toBe(0)
    })
  })

  describe('getNoteAt', () => {
    it('should return the note at the specified index', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      expect(melody.getNoteAt(0)).toEqual(notes[0])
      expect(melody.getNoteAt(2)).toEqual(notes[2])
      expect(melody.getNoteAt(4)).toEqual(notes[4])
    })

    it('should return undefined for invalid index', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      expect(melody.getNoteAt(-1)).toBeUndefined()
      expect(melody.getNoteAt(5)).toBeUndefined()
      expect(melody.getNoteAt(10)).toBeUndefined()
    })

    it('should return undefined for empty melody', () => {
      const melody = new Melody([])

      expect(melody.getNoteAt(0)).toBeUndefined()
    })
  })

  describe('addNote', () => {
    it('should add a note to the melody', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)
      const newNote = new Note('A', 4, 440)

      melody.addNote(newNote)

      expect(melody.length).toBe(6)
      expect(melody.getNoteAt(5)).toEqual(newNote)
    })

    it('should add a note to empty melody', () => {
      const melody = new Melody([])
      const newNote = new Note('C', 4, 261.63)

      melody.addNote(newNote)

      expect(melody.length).toBe(1)
      expect(melody.getNoteAt(0)).toEqual(newNote)
    })
  })

  describe('removeNoteAt', () => {
    it('should remove note at specified index', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      melody.removeNoteAt(2)

      expect(melody.length).toBe(4)
      expect(melody.getNoteAt(0)).toEqual(notes[0])
      expect(melody.getNoteAt(1)).toEqual(notes[1])
      expect(melody.getNoteAt(2)?.name).toBe('F')
      expect(melody.getNoteAt(2)?.octave).toBe(4)
      expect(melody.getNoteAt(2)?.frequency).toBe(349.23)
      expect(melody.getNoteAt(3)?.name).toBe('G')
      expect(melody.getNoteAt(3)?.octave).toBe(4)
      expect(melody.getNoteAt(3)?.frequency).toBe(392.00)
    })

    it('should not remove note for invalid index', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      melody.removeNoteAt(-1)
      melody.removeNoteAt(5)

      expect(melody.length).toBe(5)
      expect(melody.notes).toEqual(notes)
    })

    it('should not remove note from empty melody', () => {
      const melody = new Melody([])

      melody.removeNoteAt(0)

      expect(melody.length).toBe(0)
    })
  })

  describe('clear', () => {
    it('should remove all notes from melody', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      melody.clear()

      expect(melody.length).toBe(0)
      expect(melody.notes).toEqual([])
    })

    it('should clear empty melody', () => {
      const melody = new Melody([])

      melody.clear()

      expect(melody.length).toBe(0)
    })
  })

  describe('getFrequencyAt', () => {
    it('should return frequency at specified index', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      expect(melody.getFrequencyAt(0)).toBe(261.63)
      expect(melody.getFrequencyAt(2)).toBe(329.63)
      expect(melody.getFrequencyAt(4)).toBe(392.00)
    })

    it('should return undefined for invalid index', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      expect(melody.getFrequencyAt(-1)).toBeUndefined()
      expect(melody.getFrequencyAt(5)).toBeUndefined()
    })

    it('should return undefined for empty melody', () => {
      const melody = new Melody([])

      expect(melody.getFrequencyAt(0)).toBeUndefined()
    })
  })

  describe('getNoteNames', () => {
    it('should return array of note names', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      expect(melody.getNoteNames()).toEqual(['C', 'D', 'E', 'F', 'G'])
    })

    it('should return empty array for empty melody', () => {
      const melody = new Melody([])

      expect(melody.getNoteNames()).toEqual([])
    })
  })

  describe('getFrequencies', () => {
    it('should return array of frequencies', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)

      expect(melody.getFrequencies()).toEqual([261.63, 293.66, 329.63, 349.23, 392.00])
    })

    it('should return empty array for empty melody', () => {
      const melody = new Melody([])

      expect(melody.getFrequencies()).toEqual([])
    })
  })

  describe('clone', () => {
    it('should create a deep copy of the melody', () => {
      const notes = createTestNotes()
      const melody = new Melody(notes)
      const clonedMelody = melody.clone()

      expect(clonedMelody).not.toBe(melody)
      expect(clonedMelody.notes).toEqual(melody.notes)
      expect(clonedMelody.length).toBe(melody.length)
    })

    it('should clone empty melody', () => {
      const melody = new Melody([])
      const clonedMelody = melody.clone()

      expect(clonedMelody).not.toBe(melody)
      expect(clonedMelody.notes).toEqual([])
      expect(clonedMelody.length).toBe(0)
    })
  })

  describe('equals', () => {
    it('should return true for identical melodies', () => {
      const notes1 = createTestNotes()
      const notes2 = createTestNotes()
      const melody1 = new Melody(notes1)
      const melody2 = new Melody(notes2)

      expect(melody1.equals(melody2)).toBe(true)
    })

    it('should return false for melodies with different notes', () => {
      const notes1 = createTestNotes()
      const notes2 = [new Note('A', 4, 440), new Note('B', 4, 493.88)]
      const melody1 = new Melody(notes1)
      const melody2 = new Melody(notes2)

      expect(melody1.equals(melody2)).toBe(false)
    })

    it('should return false for melodies with different lengths', () => {
      const notes1 = createTestNotes()
      const notes2 = createTestNotes().slice(0, 3)
      const melody1 = new Melody(notes1)
      const melody2 = new Melody(notes2)

      expect(melody1.equals(melody2)).toBe(false)
    })

    it('should return true for empty melodies', () => {
      const melody1 = new Melody([])
      const melody2 = new Melody([])

      expect(melody1.equals(melody2)).toBe(true)
    })
  })
})