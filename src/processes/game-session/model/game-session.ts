import { useState, useRef, useCallback, useEffect } from 'react'
import * as Tone from 'tone'
import { Difficulty } from '../../../shared/types'
import { AUDIO_CONFIG, GAME_CONFIG, NOTES } from '../../../shared/config/constants'
import { generateMelodyWithIntervals } from '../../../features/melody-generation/model/melody-generator'
import { detectPitchFromBuffer, calculateAverageFrequency } from '../../../features/pitch-detection/model/pitch-detector'
import { checkMelodyMatch } from '../../../features/game-logic/model/game-logic'
import { createMelody } from '../../../entities/melody/model/melody'
import { GameEntity, createGame, updateGameStats, setGameState, setCurrentMelody, addUserInput, setMatchedIndices, setFeedback, setDetectedPitch, setDetectedNote, resetGameInput } from '../../../entities/game/model/game'
import { useDifficultyStore } from '../../../shared/store/difficulty-store'
import { findClosestNote } from '../../../shared/lib/note-utils'

export function useGameSession () {
  const difficulty = useDifficultyStore(s => s.difficulty)
  const [game, setGame] = useState<GameEntity>(() => createGame(difficulty))
  const [audioBuffer, setAudioBuffer] = useState<Float32Array>(new Float32Array())
  const [averageAudioInput, setAverageAudioInput] = useState<number>(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const isListeningRef = useRef(false)
  const gameMelodyRef = useRef<GameEntity['currentMelody']>(null)
  const isProcessingRef = useRef(false)

  // New state for 1-second recording
  const recordingStartTimeRef = useRef<number | null>(null)
  const accumulatedFrequenciesRef = useRef<number[]>([])
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update ref on every render
  gameMelodyRef.current = game.currentMelody

  // Sync difficulty from store to game state
  useEffect(() => {
    if (game.difficulty !== difficulty) {
      setGame(prev => ({ ...prev, difficulty }))
    }
  }, [difficulty, game.difficulty])

  const clearRecordingPeriod = useCallback(() => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
      recordingTimeoutRef.current = null
    }
    recordingStartTimeRef.current = null
    accumulatedFrequenciesRef.current = []
  }, [])

  function finishRecordingPeriod () {
    const averageFrequency = calculateAverageFrequency(accumulatedFrequenciesRef.current)

    if (averageFrequency) {
      const detectedNote = findClosestNote(averageFrequency)
      setGame(prev => setDetectedPitch(prev, averageFrequency))
      setGame(prev => setDetectedNote(prev, detectedNote))
      setAverageAudioInput(averageFrequency)

      if (detectedNote && gameMelodyRef.current && !isProcessingRef.current) {
        isProcessingRef.current = true
        setGame(prev => {
          const newGame = addUserInput(prev, detectedNote)
          let attempts = prev.attemptsLeft
          const result = checkMelodyMatch(
            newGame.userInput,
            gameMelodyRef.current,
            newGame.stats.score,
            newGame.stats.streak
          )

          if (!result.isCorrect) {
            attempts = prev.attemptsLeft - 1
            if (attempts <= 0) {
              setGame(prev => setFeedback(prev, 'No attempts left!'))
              setTimeout(() => setGame(prev => setFeedback(prev, null)), GAME_CONFIG.ERROR_FEEDBACK_DURATION)
              setTimeout(() => stopListening(), GAME_CONFIG.ERROR_FEEDBACK_DURATION)
              setTimeout(() => {
                isProcessingRef.current = false
              }, 700)
              return { ...resetGameInput(newGame), attemptsLeft: 0 }
            } else {
              setGame(prev => setFeedback(prev, 'Try again!'))
              setTimeout(() => setGame(prev => setFeedback(prev, null)), GAME_CONFIG.ERROR_FEEDBACK_DURATION)
              replayMelody()
              setTimeout(() => {
                startRecordingPeriod()
                isProcessingRef.current = false
              }, 700)
              return { ...newGame, attemptsLeft: attempts }
            }
          }

          const updatedGame = setMatchedIndices(newGame, result.matchedIndices)
          if (!result.shouldContinue) {
            setGame(prev => setFeedback(prev, 'Success!'))
            setGame(prev => updateGameStats(prev, result.score, result.streak))
            setTimeout(() => setGame(prev => setFeedback(prev, null)), GAME_CONFIG.FEEDBACK_DURATION)
            setTimeout(() => stopListening(), GAME_CONFIG.SUCCESS_DELAY)
            setTimeout(() => {
              isProcessingRef.current = false
            }, 700)
            return { ...updatedGame, attemptsLeft: 3 }
          }

          setTimeout(() => {
            startRecordingPeriod()
            isProcessingRef.current = false
          }, 100)

          return { ...updatedGame, attemptsLeft: attempts }
        })
      }
    } else {
      setAverageAudioInput(0)
      setTimeout(() => {
        startRecordingPeriod()
      }, 100)
    }
    recordingTimeoutRef.current = null
  }

  function startRecordingPeriod () {
    recordingStartTimeRef.current = Date.now()
    accumulatedFrequenciesRef.current = []
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
    }
    recordingTimeoutRef.current = setTimeout(() => {
      finishRecordingPeriod()
    }, AUDIO_CONFIG.RECORDING_DURATION)
  }

  const stopListening = useCallback(() => {
    setGame(prev => setGameState(prev, 'idle'))
    isListeningRef.current = false
    setGame(prev => setCurrentMelody(prev, null))
    setGame(prev => resetGameInput(prev))

    // Clear recording period
    clearRecordingPeriod()

    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
  }, [clearRecordingPeriod])

  const startListening = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext()
      }
      if (audioContextRef.current.state !== 'running') {
        await audioContextRef.current.resume()
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const source = audioContextRef.current.createMediaStreamSource(stream)
      const processor = audioContextRef.current.createScriptProcessor(AUDIO_CONFIG.BUFFER_SIZE, 1, 1)

      source.connect(processor)
      processor.connect(audioContextRef.current.destination)

      processor.onaudioprocess = (event) => {
        if (!isListeningRef.current || !gameMelodyRef.current || isProcessingRef.current) {
          return
        }

        // Only accumulate frequencies if we're in a recording period
        if (recordingStartTimeRef.current) {
          const input = event.inputBuffer.getChannelData(0)
          setAudioBuffer(new Float32Array(input))
          const pitchResult = detectPitchFromBuffer(input, audioContextRef.current?.sampleRate || 44100)

          // Accumulate valid frequencies
          if (pitchResult.frequency && pitchResult.frequency > 0) {
            accumulatedFrequenciesRef.current.push(pitchResult.frequency)
          }

          // Show current detection for visual feedback
          setGame(prev => setDetectedPitch(prev, pitchResult.frequency))
          setGame(prev => setDetectedNote(prev, pitchResult.note))
        }
      }

      processorRef.current = processor
    } catch {
      setGame(prev => setFeedback(prev, 'Microphone error'))
    }
  }, [])

  const replayMelody = useCallback(async () => {
    if (!game.currentMelody) return

    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext()
    }
    if (audioContextRef.current.state !== 'running') {
      await audioContextRef.current.resume()
    }

    await Tone.start()
    const synth = new Tone.AMSynth().toDestination()
    let time = 0

    game.currentMelody.notes.forEach((note) => {
      // Convert note to frequency
      const noteIndex = NOTES.indexOf(note.name)
      if (noteIndex === -1) {
        return
      }

      // Use MIDI note number instead of frequency
      const midiNoteNumber = noteIndex + ((note.octave ?? 4) + 1) * 12
      synth.triggerAttackRelease(midiNoteNumber, AUDIO_CONFIG.NOTE_DURATION, Tone.now() + time)
      time += AUDIO_CONFIG.NOTE_INTERVAL
    })
  }, [game.currentMelody])

  const playMelody = useCallback(async () => {
    try {
      setGame(prev => ({ ...setGameState(prev, 'playing'), attemptsLeft: 3 }))
      setGame(prev => resetGameInput(prev))

      // Отключаем микрофон перед проигрыванием мелодии
      stopListening()

      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext()
      }
      if (audioContextRef.current.state !== 'running') {
        await audioContextRef.current.resume()
      }

      const newMelodyNotes = generateMelodyWithIntervals(game.difficulty)
      const newMelody = createMelody(newMelodyNotes)

      setGame(prev => setCurrentMelody(prev, newMelody))
      await Tone.start()

      const synth = new Tone.AMSynth().toDestination()
      let time = 0
      newMelody.notes.forEach((note) => {
        // Convert note to frequency
        const noteIndex = NOTES.indexOf(note.name)
        if (noteIndex === -1) {
          return
        }
        // Use MIDI note number instead of frequency
        const midiNoteNumber = noteIndex + ((note.octave ?? 4) + 1) * 12
        synth.triggerAttackRelease(midiNoteNumber, AUDIO_CONFIG.NOTE_DURATION, Tone.now() + time)
        time += AUDIO_CONFIG.NOTE_INTERVAL
      })

      const delay = newMelodyNotes.length * AUDIO_CONFIG.NOTE_INTERVAL * 1000 + 200

      setTimeout(() => {
        setGame(prev => setGameState(prev, 'listening'))
        isListeningRef.current = true
        startListening()
        startRecordingPeriod()
      }, delay)
    } catch {
      setGame(prev => setFeedback(prev, 'Error playing melody'))
    }
  }, [game.difficulty, stopListening, startListening, startRecordingPeriod])

  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    setGame(prev => ({ ...prev, difficulty }))
  }, [])

  return {
    game,
    audioBuffer,
    averageAudioInput,
    playMelody,
    stopListening,
    replayMelody,
    changeDifficulty,
  }
}