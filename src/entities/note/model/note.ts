import { Note } from '../../../shared/types';
import { getNoteFrequency } from '../../../shared/lib/note-utils';

export interface NoteEntity {
  value: Note;
  frequency: number;
  index: number;
}

export function createNote(note: Note): NoteEntity {
  return {
    value: note,
    frequency: getNoteFrequency(note),
    index: 0, // Will be set by melody
  };
}

export function createNoteWithIndex(note: Note, index: number): NoteEntity {
  return {
    value: note,
    frequency: getNoteFrequency(note),
    index,
  };
} 