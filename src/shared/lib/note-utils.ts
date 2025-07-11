import { Note } from '../types';
import { NOTES } from '../config/constants';
import * as Tone from 'tone';

export function getNoteIndex(note: Note): number {
  return NOTES.indexOf(note);
}

export function getNoteFromIndex(index: number): Note {
  return NOTES[index];
}

export function findClosestNote(frequency: number): Note {
  const noteFrequencies = NOTES.map((note) => Tone.Frequency(note).toFrequency());
  const closest = noteFrequencies.reduce((prev, curr) =>
    Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
  );
  return NOTES[noteFrequencies.indexOf(closest)];
}

export function getNoteFrequency(note: Note): number {
  return Tone.Frequency(note).toFrequency();
} 