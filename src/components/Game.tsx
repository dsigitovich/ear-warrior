import React, { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { Waveform } from './Waveform'
import './Game.css'

export interface GameProps {
  className?: string
}

export const Game: React.FC<GameProps> = ({ className = '' }) => {
  const {
    isGameStarted,
    isGamePaused,
    difficulty,
    currentLevel,
    timeRemaining,
    currentStreak,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    updateScore,
    updateStreak,
    setCurrentLevel,
    setTimeRemaining,
    setListening,
    setPitchAccuracy
  } = useGameStore()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [melody, setMelody] = useState<number[]>([])
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [userMelody, setUserMelody] = useState<number[]>([])
  const [feedback, setFeedback] = useState<string>('')
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info')

  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
  }, [])

  // Generate melody based on difficulty
  const generateMelody = (): number[] => {
    const baseFrequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25] // C4 to C5
    const melody: number[] = []

    let noteCount: number
    switch (difficulty) {
    case 'beginner':
      noteCount = 3 + Math.floor(Math.random() * 2) // 3-4 notes
      break
    case 'intermediate':
      noteCount = 5 + Math.floor(Math.random() * 2) // 5-6 notes
      break
    case 'advanced':
      noteCount = 7 + Math.floor(Math.random() * 2) // 7-8 notes
      break
    case 'expert':
      noteCount = 8 + Math.floor(Math.random() * 4) // 8-12 notes
      break
    default:
      noteCount = 4
    }

    for (let i = 0; i < noteCount; i++) {
      const randomIndex = Math.floor(Math.random() * baseFrequencies.length)
      const frequency = baseFrequencies[randomIndex]
      if (frequency !== undefined) {
        melody.push(frequency)
      }
    }

    return melody
  }

  // Play a single note
  const playNote = (frequency: number, duration: number = 1000): Promise<void> => {
    return new Promise((resolve) => {
      if (!audioContextRef.current) {
        resolve()
        return
      }

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000)

      oscillatorRef.current = oscillator
      gainNodeRef.current = gainNode

      setTimeout(resolve, duration)
    })
  }

  // Play the entire melody
  const playMelody = async (): Promise<void> => {
    setIsPlaying(true)
    setFeedback('Listen carefully to the melody...')
    setFeedbackType('info')

    for (let i = 0; i < melody.length; i++) {
      if (!isGameStarted || isGamePaused) break
      const note = melody[i]
      if (note !== undefined) {
        await playNote(note, 800)
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    setIsPlaying(false)
    setFeedback('Now sing or hum the melody back!')
    setFeedbackType('info')
  }

  // Start recording user input
  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        analyzeRecording()
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setListening(true)
      setFeedback('Recording... Sing clearly!')
      setFeedbackType('info')

      // Stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop()
          stream.getTracks().forEach(track => track.stop())
        }
      }, 10000)

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error accessing microphone:', error)
      setFeedback('Microphone access denied. Please allow microphone access and try again.')
      setFeedbackType('error')
    }
  }

  // Analyze the recorded audio
  const analyzeRecording = (): void => {
    setIsRecording(false)
    setListening(false)

    // Simulate pitch detection (in a real implementation, you'd use a pitch detection library)
    const detectedPitches = simulatePitchDetection()
    setUserMelody(detectedPitches)

    // Compare with target melody
    const accuracy = calculateAccuracy(melody, detectedPitches)
    setPitchAccuracy(accuracy)

    if (accuracy > 0.7) {
      // Success
      const points = Math.floor(accuracy * 100) * (1 + currentStreak * 0.1)
      updateScore(points)
      updateStreak(true)
      setFeedback(`Excellent! Accuracy: ${Math.round(accuracy * 100)}% +${points} points`)
      setFeedbackType('success')

      if (currentLevel < 10) {
        setCurrentLevel(currentLevel + 1)
        setTimeout(() => {
          setMelody(generateMelody())
          setCurrentNoteIndex(0)
          setUserMelody([])
          setFeedback('')
        }, 2000)
      } else {
        // Game completed
        endGame()
      }
    } else {
      // Failure
      updateStreak(false)
      setFeedback(`Try again! Accuracy: ${Math.round(accuracy * 100)}%`)
      setFeedbackType('error')

      setTimeout(() => {
        setUserMelody([])
        setFeedback('')
      }, 2000)
    }
  }

  // Simulate pitch detection (replace with actual pitch detection)
  const simulatePitchDetection = (): number[] => {
    const detected: number[] = []
    const baseFrequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]

    for (let i = 0; i < melody.length; i++) {
      // Simulate some accuracy based on difficulty
      const accuracy = 0.6 + Math.random() * 0.3 // 60-90% accuracy
      if (Math.random() < accuracy) {
        const note = melody[i]
        if (note !== undefined) {
          detected.push(note)
        }
      } else {
        // Add some variation
        const randomIndex = Math.floor(Math.random() * baseFrequencies.length)
        const frequency = baseFrequencies[randomIndex]
        if (frequency !== undefined) {
          detected.push(frequency)
        }
      }
    }

    return detected
  }

  // Calculate accuracy between target and detected pitches
  const calculateAccuracy = (target: number[], detected: number[]): number => {
    if (detected.length === 0) return 0

    let correctNotes = 0
    const minLength = Math.min(target.length, detected.length)

    for (let i = 0; i < minLength; i++) {
      const tolerance = 10 // Hz tolerance
      const targetNote = target[i]
      const detectedNote = detected[i]
      if (targetNote !== undefined && detectedNote !== undefined && Math.abs(targetNote - detectedNote) <= tolerance) {
        correctNotes++
      }
    }

    return correctNotes / target.length
  }

  // Timer effect
  useEffect(() => {
    if (isGameStarted && !isGamePaused && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (timeRemaining <= 0) {
      endGame()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isGameStarted, isGamePaused, timeRemaining, endGame, setTimeRemaining])

  // Initialize game
  useEffect(() => {
    if (isGameStarted && melody.length === 0) {
      setMelody(generateMelody())
    }
  }, [isGameStarted, difficulty, melody.length, setMelody])

  // Handle game start
  const handleStartGame = () => {
    startGame()
    setMelody(generateMelody())
    setCurrentNoteIndex(0)
    setUserMelody([])
    setFeedback('')
  }

  // Handle game pause/resume
  const handleTogglePause = () => {
    if (isGamePaused) {
      resumeGame()
    } else {
      pauseGame()
    }
  }

  return (
    <div className={`game ${className}`}>
      {!isGameStarted ? (
        <div className="game-start">
          <button
            className="start-button"
            onClick={handleStartGame}
          >
            🎵 Start Game
          </button>
        </div>
      ) : (
        <div className="game-interface">
          <div className="game-controls">
            <button
              className="control-button"
              onClick={handleTogglePause}
            >
              {isGamePaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button
              className="control-button"
              onClick={endGame}
            >
              🏁 End Game
            </button>
          </div>

          <div className="game-status">
            <div className="status-item">
              <span className="status-label">Level:</span>
              <span className="status-value">{currentLevel}/10</span>
            </div>
            <div className="status-item">
              <span className="status-label">Time:</span>
              <span className="status-value">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div className="game-area">
            <div className="melody-section">
              <h3>🎼 Target Melody</h3>
              <div className="melody-display">
                {melody.map((note, index) => (
                  <div
                    key={index}
                    className={`note ${index < currentNoteIndex ? 'played' : ''}`}
                  >
                    {Math.round(note)}Hz
                  </div>
                ))}
              </div>
              <button
                className="play-button"
                onClick={playMelody}
                disabled={isPlaying || isRecording}
              >
                {isPlaying ? '🔊 Playing...' : '▶️ Play Melody'}
              </button>
            </div>

            <div className="recording-section">
              <h3>🎤 Your Melody</h3>
              <div className="melody-display">
                {userMelody.map((note, index) => (
                  <div key={index} className="note recorded">
                    {Math.round(note)}Hz
                  </div>
                ))}
              </div>
              <button
                className="record-button"
                onClick={startRecording}
                disabled={isPlaying || isRecording}
              >
                {isRecording ? '🔴 Recording...' : '🎤 Record Melody'}
              </button>
            </div>
          </div>

          <div className="feedback-section">
            <div className={`feedback ${feedbackType}`}>
              {feedback}
            </div>
          </div>

          <Waveform isListening={isRecording} />
        </div>
      )}
    </div>
  )
}
