import { generateMelodyWithIntervals, generateRandomMelody, clearMelodyHistory, getMelodyHistorySize } from './melody-generator'

describe('Melody Generation', () => {
  beforeEach(() => {
    // Clear melody history before each test to ensure clean state
    clearMelodyHistory()
  })

  it('should generate 100% unique melodies each time', () => {
    const melodies = []
    const numTests = 50

    for (let i = 0; i < numTests; i++) {
      const melody = generateMelodyWithIntervals('easy')
      melodies.push(melody.join('-'))
    }

    const uniqueMelodies = new Set(melodies)
    console.log(`Generated ${melodies.length} melodies, ${uniqueMelodies.size} are unique`)
    console.log('Sample melodies:', melodies.slice(0, 10))

    // We now expect 100% unique melodies due to our uniqueness guarantee
    expect(uniqueMelodies.size).toBe(numTests)
    expect(getMelodyHistorySize()).toBe(numTests)
  })

  it('should track melody history correctly', () => {
    expect(getMelodyHistorySize()).toBe(0)

    generateMelodyWithIntervals('easy')
    expect(getMelodyHistorySize()).toBe(1)

    generateMelodyWithIntervals('medium')
    expect(getMelodyHistorySize()).toBe(2)

    generateRandomMelody(4)
    expect(getMelodyHistorySize()).toBe(3)
  })

  it('should clear melody history when requested', () => {
    generateMelodyWithIntervals('easy')
    generateMelodyWithIntervals('medium')
    expect(getMelodyHistorySize()).toBe(2)

    clearMelodyHistory()
    expect(getMelodyHistorySize()).toBe(0)
  })

  it('should generate unique random melodies', () => {
    const melodies = []
    const numTests = 20

    for (let i = 0; i < numTests; i++) {
      const melody = generateRandomMelody(4)
      melodies.push(melody.join('-'))
    }

    const uniqueMelodies = new Set(melodies)

    // Should be 100% unique
    expect(uniqueMelodies.size).toBe(numTests)
  })

  it('should generate melodies with correct length based on difficulty', () => {
    const easyMelody = generateMelodyWithIntervals('easy')
    const mediumMelody = generateMelodyWithIntervals('medium')
    const hardMelody = generateMelodyWithIntervals('hard')

    expect(easyMelody).toHaveLength(3)
    expect(mediumMelody).toHaveLength(5)
    expect(hardMelody).toHaveLength(8)
  })

  it('should use valid notes from the NOTES array', () => {
    const melody = generateMelodyWithIntervals('medium')
    const validNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    melody.forEach(note => {
      expect(validNotes).toContain(note)
    })
  })

  it('should maintain uniqueness across different difficulty levels', () => {
    const allMelodies = new Set()

    // Generate melodies of different difficulties
    for (let i = 0; i < 10; i++) {
      const easy = generateMelodyWithIntervals('easy')
      const medium = generateMelodyWithIntervals('medium')
      const hard = generateMelodyWithIntervals('hard')

      allMelodies.add(easy.join('-'))
      allMelodies.add(medium.join('-'))
      allMelodies.add(hard.join('-'))
    }

    // All should be unique
    expect(allMelodies.size).toBe(30)
    expect(getMelodyHistorySize()).toBe(30)
  })
})