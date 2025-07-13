import { Note } from '../../note/model/note'
import { NOTES } from '../../../shared/config/constants'

export class Melody {
  constructor (public notes: Note[]) {}

  get length (): number {
    return this.notes.length
  }

  getNoteAt (index: number): Note | undefined {
    return this.notes[index]
  }

  addNote (note: Note): void {
    this.notes.push(note)
  }

  removeNoteAt (index: number): void {
    if (index >= 0 && index < this.notes.length) {
      this.notes.splice(index, 1)
    }
  }

  clear (): void {
    this.notes = []
  }

  getFrequencyAt (index: number): number | undefined {
    const note = this.getNoteAt(index)
    return note?.frequency
  }

  getNoteNames (): string[] {
    return this.notes.map(note => note.name)
  }

  getFrequencies (): number[] {
    return this.notes.map(note => note.frequency)
  }

  clone (): Melody {
    return new Melody([...this.notes])
  }

  equals (other: Melody): boolean {
    if (this.length !== other.length) {
      return false
    }

    for (let i = 0; i < this.length; i++) {
      if (!this.notes[i].equals(other.notes[i])) {
        return false
      }
    }

    return true
  }
}

export function getMelodyNotes (melody: Melody): string[] {
  return melody.getNoteNames()
}

export function createMelody (notes: string[]): Melody {
  // Convert string notes to Note objects
  const noteObjects = notes.map(noteName => {
    // Calculate proper frequency for each note
    const noteIndex = NOTES.indexOf(noteName)
    if (noteIndex === -1) {
      throw new Error(`Invalid note name: ${noteName}`)
    }
    const midiNote = noteIndex + (4 + 1) * 12 // Use octave 4 as default
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12)
    return new Note(noteName, 4, frequency)
  })
  return new Melody(noteObjects)
}