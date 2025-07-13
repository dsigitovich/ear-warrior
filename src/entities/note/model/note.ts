import { NOTES } from '../../../shared/config/constants'

export class Note {
  constructor (
    public name: string,
    public octave: number | undefined = 4,
    public frequency: number
  ) {
    if (!NOTES.includes(name)) {
      throw new Error('Invalid note name')
    }
    if (octave !== undefined && (octave < 0 || octave > 10)) {
      throw new Error('Invalid octave')
    }
  }

  toString (): string {
    return this.octave !== undefined && this.octave !== null ? `${this.name}${this.octave}` : this.name
  }

  equals (other: Note): boolean {
    return this.name === other.name && this.octave === other.octave
  }

  getMidiNote (): number {
    const noteIndex = NOTES.indexOf(this.name)
    return noteIndex + ((this.octave ?? 4) + 1) * 12
  }

  static fromMidiNote (midiNote: number): Note {
    if (midiNote < 0 || midiNote > 127) {
      throw new Error('Invalid MIDI note number')
    }

    const octave = Math.floor(midiNote / 12) - 1
    const noteIndex = midiNote % 12
    const noteName = NOTES[noteIndex]
    const frequency = this.calculateFrequency(noteName, octave)

    return new Note(noteName, octave, frequency)
  }

  static fromFrequency (frequency: number): Note {
    if (frequency < 20 || frequency > 20000) {
      throw new Error('Frequency out of range')
    }

    // Find the closest note to the given frequency
    let closestNote = NOTES[0]
    let closestOctave = 4
    let minDifference = Infinity

    for (let octave = 0; octave <= 10; octave++) {
      for (const noteName of NOTES) {
        const noteFreq = this.calculateFrequency(noteName, octave)
        const difference = Math.abs(noteFreq - frequency)

        if (difference < minDifference) {
          minDifference = difference
          closestNote = noteName
          closestOctave = octave
        }
      }
    }

    return new Note(closestNote, closestOctave, frequency)
  }

  private static calculateFrequency (noteName: string, octave: number): number {
    const noteIndex = NOTES.indexOf(noteName)
    const midiNote = noteIndex + (octave + 1) * 12
    return 440 * Math.pow(2, (midiNote - 69) / 12)
  }
}