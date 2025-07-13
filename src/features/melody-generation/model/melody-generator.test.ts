import { generateMelodyWithIntervals } from './melody-generator'

describe('Melody Generation', () => {
  it('should generate different melodies each time', () => {
    const melodies = []
    const numTests = 20

    for (let i = 0; i < numTests; i++) {
      const melody = generateMelodyWithIntervals('easy')
      melodies.push(melody.join('-'))
    }

    const uniqueMelodies = new Set(melodies)
    console.log(`Generated ${melodies.length} melodies, ${uniqueMelodies.size} are unique`)
    console.log('Sample melodies:', melodies.slice(0, 10))

    // We expect at least 50% unique melodies (this should be much higher for random generation)
    expect(uniqueMelodies.size).toBeGreaterThan(numTests * 0.5)
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
})