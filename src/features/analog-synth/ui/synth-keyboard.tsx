import { analogSynthStore } from '../model/analog-synth-store'
import './synth-keyboard.module.scss'

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_KEYS = ['C#', 'D#', null, 'F#', 'G#', 'A#', null] // null for positions without black keys

export function SynthKeyboard () {
  const { playNote } = analogSynthStore()
  const octave = 4

  const handleKeyPress = (note: string) => {
    playNote(`${note}${octave}`, '8n')
  }

  return (
    <div className="synth-keyboard">
      <div className="keyboard-info">
        <h4>Test Keyboard</h4>
        <p>Click keys to test analog sounds</p>
      </div>

      <div className="keyboard">
        <div className="white-keys">
          {WHITE_KEYS.map((note) => (
            <button
              key={note}
              className="key white-key"
              onMouseDown={() => handleKeyPress(note)}
              onTouchStart={() => handleKeyPress(note)}
            >
              <span className="key-label">{note}</span>
            </button>
          ))}
        </div>

        <div className="black-keys">
          {BLACK_KEYS.map((note, index) => (
            note ? (
              <button
                key={note}
                className="key black-key"
                style={{ left: `${(index * 14.28) + 10}%` }}
                onMouseDown={() => handleKeyPress(note)}
                onTouchStart={() => handleKeyPress(note)}
              >
                <span className="key-label">{note}</span>
              </button>
            ) : (
              <div key={`empty-${index}`} />
            )
          ))}
        </div>
      </div>

      <div className="keyboard-controls">
        <button
          className="demo-button"
          onClick={() => {
            const melody = ['C', 'E', 'G', 'C', 'G', 'E', 'C']
            const notes = melody.map(note => `${note}${octave}`)
            analogSynthStore.getState().playMelody(notes, 140)
          }}
        >
          🎵 Play Demo
        </button>
      </div>
    </div>
  )
}