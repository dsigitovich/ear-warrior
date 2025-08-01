import React, { useEffect, useRef, useCallback } from 'react'
import './Waveform.css'

export interface WaveformProps {
  isListening: boolean
  className?: string
}

export const Waveform: React.FC<WaveformProps> = ({ isListening, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)

  const animate = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw waveform
    const barWidth = (canvas.width / bufferLength) * 2.5
    let barHeight
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const dataValue = dataArray[i]
      if (dataValue !== undefined) {
        barHeight = (dataValue / 255) * canvas.height

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#ff6b35')
        gradient.addColorStop(0.5, '#f7931e')
        gradient.addColorStop(1, '#ffcc02')

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  const startVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }

      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)
      microphoneRef.current.connect(analyserRef.current)

      animate()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error accessing microphone for visualization:', error)
    }
  }, [animate])

  useEffect(() => {
    if (isListening) {
      startVisualization()
    } else {
      stopVisualization()
    }

    return () => {
      stopVisualization()
    }
  }, [isListening, startVisualization])

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
      microphoneRef.current = null
    }
  }

  return (
    <div className={`waveform-container ${className}`}>
      <div className="waveform-header">
        <h3>🎤 Audio Input</h3>
        <div className={`listening-indicator ${isListening ? 'active' : ''}`}>
          {isListening ? '🔴 Recording' : '⚪ Idle'}
        </div>
      </div>
      <div className="waveform-wrapper">
        <canvas
          ref={canvasRef}
          className="waveform-canvas"
          width={800}
          height={200}
        />
        {!isListening && (
          <div className="waveform-placeholder">
            <div className="placeholder-text">
              Click "Record Melody" to start visualization
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
