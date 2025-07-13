import React, { useRef, useEffect } from 'react'
import './WaveformDisplay.css'

interface WaveformDisplayProps {
  buffer: Float32Array;
  pitch: number | null;
  detectedNote: string | null;
  matchedIndices: number[];
  melodyLength: number;
  sampleRate: number;
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  buffer,
  pitch,
  detectedNote,
  matchedIndices,
  melodyLength,
  sampleRate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw black background
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw waveform (bright yellow)
    if (buffer.length > 0) {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      for (let i = 0; i < buffer.length; i++) {
        const x = (i / buffer.length) * canvas.width
        const y = (1 - buffer[i]) * (canvas.height / 2)
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#ffe066'
      ctx.lineWidth = 3
      ctx.stroke()
    }

    // Draw pitch marker
    if (pitch) {
      const period = sampleRate / pitch
      if (period > 0 && period < buffer.length) {
        const x = (period / buffer.length) * canvas.width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = '#00c853'
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fillStyle = '#00c853'
        ctx.font = '18px system-ui, Arial'
        ctx.fillText(`${pitch.toFixed(1)} Hz`, x + 6, 24)
        if (detectedNote) {
          ctx.fillText(`${detectedNote}`, x + 6, 48)
        }
      }
    }

    // Draw matched note markers
    if (matchedIndices.length > 0 && melodyLength > 0) {
      matchedIndices.forEach((idx) => {
        const x = ((idx + 0.5) / melodyLength) * canvas.width
        ctx.beginPath()
        ctx.arc(x, 20, 12, 0, 2 * Math.PI)
        ctx.fillStyle = '#ff9800'
        ctx.globalAlpha = 0.8
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px system-ui, Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${idx + 1}`, x, 26)
      })
    }
  }, [buffer, pitch, detectedNote, matchedIndices, melodyLength, sampleRate])

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  return (
    <div className="waveform-container">
      <canvas
        ref={canvasRef}
        className="waveform-display"
        width={800}
        height={200}
      />
    </div>
  )
}