import { Note } from '../../../shared/types';
import { NoteEntity, createNoteWithIndex } from '../../note/model/note';

export interface MelodyEntity {
  notes: NoteEntity[];
  length: number;
  difficulty: string;
}

export function createMelody(notes: Note[], difficulty: string): MelodyEntity {
  const noteEntities = notes.map((note, index) => createNoteWithIndex(note, index));
  
  return {
    notes: noteEntities,
    length: notes.length,
    difficulty,
  };
}

export function getMelodyNotes(melody: MelodyEntity): Note[] {
  return melody.notes.map(note => note.value);
}

export function getMelodyLength(melody: MelodyEntity): number {
  return melody.length;
} 