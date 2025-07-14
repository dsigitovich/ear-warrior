import { useState, useCallback, useRef } from 'react'
import './synth-knob.module.scss'

interface SynthKnobProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  precision?: number
}

export function SynthKnob({ 
  label, 
  value, 
  min, 
  max, 
  onChange, 
  precision = 2 
}: SynthKnobProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startValue, setStartValue] = useState(0)
  const knobRef = useRef<HTMLDivElement>(null)

  const normalizedValue = (value - min) / (max - min)
  const rotation = normalizedValue * 270 - 135 // -135° to +135°

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setStartY(e.clientY)
    setStartValue(value)
    e.preventDefault()
  }, [value])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const deltaY = startY - e.clientY // Inverted for intuitive control
    const sensitivity = (max - min) / 100 // Adjust sensitivity
    const newValue = Math.max(min, Math.min(max, startValue + deltaY * sensitivity))
    
    onChange(Number(newValue.toFixed(precision)))
  }, [isDragging, startY, startValue, min, max, onChange, precision])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse events
  useState(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  })

  const displayValue = value.toFixed(precision)

  return (
    <div className="synth-knob">
      <div 
        ref={knobRef}
        className={`knob ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        style={{ 
          transform: `rotate(${rotation}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="knob-indicator" />
        <div className="knob-center" />
      </div>
      
      <label className="knob-label">{label}</label>
      <div className="knob-value">{displayValue}</div>
    </div>
  )
}