import { Game } from './game'
import { Note } from '../../note/model/note'
import { Melody } from '../../melody/model/melody'

describe('Game', () => {
  const createTestMelody = () => {
    const notes = [
      new Note('C', 4, 261.63),
      new Note('D', 4, 293.66),
      new Note('E', 4, 329.63),
      new Note('F', 4, 349.23),
      new Note('G', 4, 392.00)
    ]
    return new Melody(notes)
  }

  describe('constructor', () => {
    it('should create a game with initial state', () => {
      const melody = createTestMelody()
      const game = new Game(melody)

      expect(game.melody).toEqual(melody)
      expect(game.currentNoteIndex).toBe(0)
      expect(game.score).toBe(0)
      expect(game.isGameOver).toBe(false)
      expect(game.isPlaying).toBe(false)
    })

    it('should create a game with empty melody', () => {
      const melody = new Melody([])
      const game = new Game(melody)

      expect(game.melody).toEqual(melody)
      expect(game.currentNoteIndex).toBe(0)
      expect(game.score).toBe(0)
      expect(game.isGameOver).toBe(true) // Game is over if no notes
    })
  })

  describe('start', () => {
    it('should start the game', () => {
      const melody = createTestMelody()
      const game = new Game(melody)

      game.start()

      expect(game.isPlaying).toBe(true)
      expect(game.currentNoteIndex).toBe(0)
      expect(game.score).toBe(0)
      expect(game.isGameOver).toBe(false)
    })

    it('should not start game if already playing', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()

      game.start()

      expect(game.isPlaying).toBe(true)
      expect(game.currentNoteIndex).toBe(0)
    })

    it('should not start game if game is over', () => {
      const melody = new Melody([])
      const game = new Game(melody)

      game.start()

      expect(game.isPlaying).toBe(false)
      expect(game.isGameOver).toBe(true)
    })
  })

  describe('pause', () => {
    it('should pause the game', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()

      game.pause()

      expect(game.isPlaying).toBe(false)
    })

    it('should not pause if game is not playing', () => {
      const melody = createTestMelody()
      const game = new Game(melody)

      game.pause()

      expect(game.isPlaying).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset the game to initial state', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.nextNote()
      game.addScore(10)

      game.reset()

      expect(game.currentNoteIndex).toBe(0)
      expect(game.score).toBe(0)
      expect(game.isPlaying).toBe(false)
      expect(game.isGameOver).toBe(false)
    })

    it('should reset game with empty melody', () => {
      const melody = new Melody([])
      const game = new Game(melody)

      game.reset()

      expect(game.currentNoteIndex).toBe(0)
      expect(game.score).toBe(0)
      expect(game.isPlaying).toBe(false)
      expect(game.isGameOver).toBe(true)
    })
  })

  describe('nextNote', () => {
    it('should advance to next note', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()

      game.nextNote()

      expect(game.currentNoteIndex).toBe(1)
      expect(game.isGameOver).toBe(false)
    })

    it('should end game when reaching last note', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.currentNoteIndex = 4 // Last note

      game.nextNote()

      expect(game.currentNoteIndex).toBe(5)
      expect(game.isGameOver).toBe(true)
      expect(game.isPlaying).toBe(false)
    })

    it('should not advance if game is not playing', () => {
      const melody = createTestMelody()
      const game = new Game(melody)

      game.nextNote()

      expect(game.currentNoteIndex).toBe(0)
    })
  })

  describe('getCurrentNote', () => {
    it('should return current note', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.nextNote()

      const currentNote = game.getCurrentNote()

      expect(currentNote).toEqual(melody.getNoteAt(1))
    })

    it('should return undefined if no current note', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.currentNoteIndex = 5 // Beyond melody length

      const currentNote = game.getCurrentNote()

      expect(currentNote).toBeUndefined()
    })

    it('should return undefined for empty melody', () => {
      const melody = new Melody([])
      const game = new Game(melody)

      const currentNote = game.getCurrentNote()

      expect(currentNote).toBeUndefined()
    })
  })

  describe('getCurrentFrequency', () => {
    it('should return current note frequency', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.nextNote()

      const frequency = game.getCurrentFrequency()

      expect(frequency).toBe(293.66) // D4 frequency
    })

    it('should return undefined if no current note', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.currentNoteIndex = 5

      const frequency = game.getCurrentFrequency()

      expect(frequency).toBeUndefined()
    })
  })

  describe('addScore', () => {
    it('should add points to score', () => {
      const melody = createTestMelody()
      const game = new Game(melody)

      game.addScore(10)
      game.addScore(5)

      expect(game.score).toBe(15)
    })

    it('should handle negative points', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.addScore(20)

      game.addScore(-5)

      expect(game.score).toBe(15)
    })

    it('should not allow negative score', () => {
      const melody = createTestMelody()
      const game = new Game(melody)

      game.addScore(-10)

      expect(game.score).toBe(0)
    })
  })

  describe('getProgress', () => {
    it('should return progress as percentage', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.nextNote()
      game.nextNote()

      const progress = game.getProgress()

      expect(progress).toBe(60) // 3/5 * 100
    })

    it('should return 0 for new game', () => {
      const melody = createTestMelody()
      const game = new Game(melody)

      const progress = game.getProgress()

      expect(progress).toBe(0)
    })

    it('should return 100 for completed game', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.currentNoteIndex = 5

      const progress = game.getProgress()

      expect(progress).toBe(100)
    })

    it('should return 0 for empty melody', () => {
      const melody = new Melody([])
      const game = new Game(melody)

      const progress = game.getProgress()

      expect(progress).toBe(0)
    })
  })

  describe('isLastNote', () => {
    it('should return true for last note', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.currentNoteIndex = 4

      expect(game.isLastNote()).toBe(true)
    })

    it('should return false for other notes', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()

      expect(game.isLastNote()).toBe(false)

      game.nextNote()
      expect(game.isLastNote()).toBe(false)
    })

    it('should return false for empty melody', () => {
      const melody = new Melody([])
      const game = new Game(melody)

      expect(game.isLastNote()).toBe(false)
    })
  })

  describe('getRemainingNotes', () => {
    it('should return number of remaining notes', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.nextNote()

      const remaining = game.getRemainingNotes()

      expect(remaining).toBe(3)
    })

    it('should return 0 for completed game', () => {
      const melody = createTestMelody()
      const game = new Game(melody)
      game.start()
      game.currentNoteIndex = 5

      const remaining = game.getRemainingNotes()

      expect(remaining).toBe(0)
    })

    it('should return 0 for empty melody', () => {
      const melody = new Melody([])
      const game = new Game(melody)

      const remaining = game.getRemainingNotes()

      expect(remaining).toBe(0)
    })
  })
})