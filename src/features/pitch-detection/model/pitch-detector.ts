import { detectPitch } from '../../../shared/lib/pitch-detection';
import { findClosestNote } from '../../../shared/lib/note-utils';

export interface PitchDetectionResult {
  frequency: number | null;
  note: string | null;
}

export function detectPitchFromBuffer(buffer: Float32Array, sampleRate: number): PitchDetectionResult {
  const frequency = detectPitch(buffer, sampleRate);
  
  if (frequency) {
    const note = findClosestNote(frequency);
    return {
      frequency,
      note,
    };
  }
  
  return {
    frequency: null,
    note: null,
  };
} 