import { useState, useRef, useCallback, useEffect } from 'react'
import * as Tone from 'tone'
import { Difficulty } from '../../../shared/types'
import { AUDIO_CONFIG, GAME_CONFIG } from '../../../shared/config/constants'
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

  // Helper functions for recording period
  const startRecordingPeriod = useCallback(() => {
    recordingStartTimeRef.current = Date.now()
    accumulatedFrequenciesRef.current = []

    // Clear any existing timeout
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
    }

    // Set timeout for 1 second
    recordingTimeoutRef.current = setTimeout(() => {
      finishRecordingPeriod()
    }, AUDIO_CONFIG.RECORDING_DURATION)
  }, [])

  const finishRecordingPeriod = useCallback(() => {
    const averageFrequency = calculateAverageFrequency(accumulatedFrequenciesRef.current)

    if (averageFrequency) {
      const detectedNote = findClosestNote(averageFrequency)
      setGame(prev => setDetectedPitch(prev, averageFrequency))
      setGame(prev => setDetectedNote(prev, detectedNote))

      // Process the detected note
      if (detectedNote && gameMelodyRef.current && !isProcessingRef.current) {
        isProcessingRef.current = true

        setGame(prev => {
          const newGame = addUserInput(prev, detectedNote)
          let attempts = prev.attemptsLeft
          const result = checkMelodyMatch(
            newGame.userInput,
            gameMelodyRef.current!,
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
              // Start new recording period after replay
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

          // Start new recording period for next note
          setTimeout(() => {
            startRecordingPeriod()
            isProcessingRef.current = false
          }, 100)

          return { ...updatedGame, attemptsLeft: attempts }
        })
      }
    } else {
      // No valid frequency detected, start new recording period
      setTimeout(() => {
        startRecordingPeriod()
      }, 100)
    }

    // Clear timeout reference
    recordingTimeoutRef.current = null
  }, [])

  const clearRecordingPeriod = useCallback(() => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
      recordingTimeoutRef.current = null
    }
    recordingStartTimeRef.current = null
    accumulatedFrequenciesRef.current = []
  }, [])

  const playMelody = useCallback(async () => {
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
    newMelodyNotes.forEach((note) => {
      synth.triggerAttackRelease(note, AUDIO_CONFIG.NOTE_DURATION, Tone.now() + time)
      time += AUDIO_CONFIG.NOTE_INTERVAL
    })

    setTimeout(() => {
      setGame(prev => setGameState(prev, 'listening'))
      isListeningRef.current = true
      startListening()
      startRecordingPeriod()
    }, newMelodyNotes.length * AUDIO_CONFIG.NOTE_INTERVAL * 1000 + 200)
  }, [game.difficulty])

  const startListening = useCallback(async () => {
    try {
      console.log('startListening called')
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext()
      }
      if (audioContextRef.current.state !== 'running') {
        await audioContextRef.current.resume()
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('got user media stream', stream)
      const source = audioContextRef.current.createMediaStreamSource(stream)
      const processor = audioContextRef.current.createScriptProcessor(AUDIO_CONFIG.BUFFER_SIZE, 1, 1)
      console.log('created ScriptProcessor', processor)

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
          const pitchResult = detectPitchFromBuffer(input, audioContextRef.current!.sampleRate)

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
  }, [game.currentMelody])

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
      synth.triggerAttackRelease(note.toString(), AUDIO_CONFIG.NOTE_DURATION, Tone.now() + time)
      time += AUDIO_CONFIG.NOTE_INTERVAL
    })
  }, [game.currentMelody])

  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    setGame(prev => ({ ...prev, difficulty }))
  }, [])

  return {
    game,
    audioBuffer,
    playMelody,
    stopListening,
    replayMelody,
    changeDifficulty,
  }
}