import { useState, useRef, useCallback } from 'react'
import * as Tone from 'tone'
import { Difficulty } from '../../../shared/types'
import { AUDIO_CONFIG, GAME_CONFIG } from '../../../shared/config/constants'
import { generateMelodyWithIntervals } from '../../../features/melody-generation/model/melody-generator'
import { detectPitchFromBuffer } from '../../../features/pitch-detection/model/pitch-detector'
import { checkMelodyMatch } from '../../../features/game-logic/model/game-logic'
import { createMelody } from '../../../entities/melody/model/melody'
import { GameEntity, createGame, updateGameStats, setGameState, setCurrentMelody, addUserInput, setMatchedIndices, setFeedback, setDetectedPitch, setDetectedNote, resetGameInput } from '../../../entities/game/model/game'
import { useDifficultyStore } from '../../../shared/store/difficulty-store'

export function useGameSession () {
  const difficulty = useDifficultyStore(s => s.difficulty)
  const [game, setGame] = useState<GameEntity>(() => createGame(difficulty))
  const [audioBuffer, setAudioBuffer] = useState<Float32Array>(new Float32Array())

  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const isListeningRef = useRef(false)
  const gameMelodyRef = useRef<GameEntity['currentMelody']>(null)
  const isProcessingRef = useRef(false)

  // Update ref on every render
  gameMelodyRef.current = game.currentMelody

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
    const newMelody = createMelody(newMelodyNotes, game.difficulty)

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
        isProcessingRef.current = true
        const input = event.inputBuffer.getChannelData(0)
        setAudioBuffer(new Float32Array(input))
        const pitchResult = detectPitchFromBuffer(input, audioContextRef.current!.sampleRate)
        setGame(prev => setDetectedPitch(prev, pitchResult.frequency))
        setGame(prev => setDetectedNote(prev, pitchResult.note))
        if (pitchResult.note) {
          setGame(prev => {
            const newGame = addUserInput(prev, pitchResult.note!)
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
                setTimeout(() => replayMelody(), GAME_CONFIG.ERROR_FEEDBACK_DURATION)
                setTimeout(() => {
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
              isProcessingRef.current = false
            }, 700)
            return { ...updatedGame, attemptsLeft: attempts }
          })
        } else {
          setGame(prev => setDetectedNote(prev, null))
          setGame(prev => setDetectedPitch(prev, null))
          setTimeout(() => {
            isProcessingRef.current = false
          }, 700)
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

    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
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
      synth.triggerAttackRelease(note.value, AUDIO_CONFIG.NOTE_DURATION, Tone.now() + time)
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