import { NOTES } from '../config/constants'

export function getNoteFrequency (noteName: string, octave: number): number {
  if (!NOTES.includes(noteName)) {
    throw new Error('Invalid note name')
  }
  if (octave < -1 || octave > 9) {
    // eslint-disable-next-line no-console
    console.log('getNoteFrequency error:', { noteName, octave })
    throw new Error('Invalid octave')
  }

  const noteIndex = NOTES.indexOf(noteName)
  if (noteIndex === -1) throw new Error('Invalid note name for frequency calc')
  const midiNote = noteIndex + (octave + 1) * 12
  return 440 * Math.pow(2, (midiNote - 69) / 12)
}

export function getNoteFromFrequency (frequency: number): { note: string; octave: number; frequency: number } {
  if (frequency < 20 || frequency > 20000) {
    throw new Error('Frequency out of range')
  }

  // Find the closest note to the given frequency
  if (!NOTES[0]) throw new Error('NOTES array is empty')
  let closestNote: string = NOTES[0]
  let closestOctave: number = 4
  let minDifference = Infinity

  for (let octave = 0; octave <= 9; octave++) {
    for (const noteName of NOTES) {
      const noteFreq = getNoteFrequency(noteName, octave)
      const difference = Math.abs(noteFreq - frequency)

      if (difference < minDifference) {
        minDifference = difference
        closestNote = noteName
        closestOctave = octave
      }
    }
  }

  if (closestNote === undefined) throw new Error('Could not find closest note')

  return {
    note: closestNote,
    octave: closestOctave,
    frequency: getNoteFrequency(closestNote, closestOctave)
  }
}

export function getMidiNoteNumber (noteName: string, octave: number): number {
  if (!NOTES.includes(noteName)) {
    throw new Error('Invalid note name')
  }
  if (octave < 0 || octave > 9) {
    throw new Error('Invalid octave')
  }

  const noteIndex = NOTES.indexOf(noteName)
  if (noteIndex === -1) throw new Error('Invalid note name for midi calc')
  return noteIndex + (octave + 1) * 12
}

export function getNoteFromMidi (midiNote: number): { note: string; octave: number; frequency: number } {
  if (midiNote < 0 || midiNote > 127) {
    throw new Error('Invalid MIDI note number')
  }

  let octave = Math.floor(midiNote / 12) - 1
  const noteIndex = midiNote % 12
  const noteName = NOTES[noteIndex]
  if (noteName === undefined) throw new Error('Invalid note index for midi')
  if (octave > 9) octave = 9
  // Диагностика
  if (midiNote === 127) {
    // eslint-disable-next-line no-console
    console.log('MIDI 127:', { octave, noteName })
  }
  const frequency = getNoteFrequency(noteName, octave)

  return {
    note: noteName,
    octave,
    frequency
  }
}

export function isValidFrequency (frequency: number): boolean {
  return frequency >= 20 && frequency <= 20000
}

export function isValidMidiNote (midiNote: number): boolean {
  return midiNote >= 0 && midiNote <= 127
}

export function findClosestNote (frequency: number): string | null {
  if (!isValidFrequency(frequency)) {
    return null
  }

  const result = getNoteFromFrequency(frequency)
  return result.note
}