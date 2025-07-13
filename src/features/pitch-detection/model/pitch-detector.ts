import { findClosestNote } from '../../../shared/lib/note-utils'
import { detectPitch } from '../../../shared/lib/pitch-detection'

export interface PitchDetectionResult {
  frequency: number | null;
  note: string | null;
}

export function detectPitchFromBuffer (buffer: Float32Array, sampleRate: number): PitchDetectionResult {
  const frequency = detectPitch(buffer, sampleRate)

  if (frequency) {
    const note = findClosestNote(frequency)
    return {
      frequency,
      note,
    }
  }

  return {
    frequency: null,
    note: null,
  }
}

export function calculateAverageFrequency (frequencies: number[]): number | null {
  if (frequencies.length === 0) return null

  const validFrequencies = frequencies.filter(f => f !== null && f > 0)
  if (validFrequencies.length === 0) return null

  const sum = validFrequencies.reduce((acc, freq) => acc + freq, 0)
  return sum / validFrequencies.length
}