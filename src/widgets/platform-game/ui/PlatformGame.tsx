import React, { useRef, useState, useEffect } from 'react'
import './PlatformGame.css'

interface PlatformGameProps {
  detectedNote: string | null;
  matchedIndices: number[];
  melodyLength: number;
  currentNoteIndex: number;
  isListening: boolean;
  melodyNotes: string[];
  averageAudioInput?: number;
}

export const PlatformGame: React.FC<PlatformGameProps> = ({
  isListening,
  averageAudioInput = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Параметры для звездного параллакса
  const STAR_LAYERS = 3
  const STARS_PER_LAYER = 24
  const STAR_COLORS = ['#ffe066', '#fffbe6', '#ffaf7b']
  const STAR_SPEEDS = [0.2, 0.1, 0.05]
  const STAR_SIZES = [2, 1.2, 0.7, 3, 1.5, 0.8, 0.4]
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 600

  // Генерируем звезды один раз
  const [starField] = useState(() => {
    const layers = []
    for (let l = 0; l < STAR_LAYERS; l++) {
      const stars = []
      for (let i = 0; i < STARS_PER_LAYER; i++) {
        stars.push({
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * CANVAS_HEIGHT,
        })
      }
      layers.push(stars)
    }
    return layers
  })
  const [starParallax, setStarParallax] = useState(0)

  // Анимация параллакса звезд
  useEffect(() => {
    let raf: number
    const animate = () => {
      setStarParallax(prev => (prev + 1) % CANVAS_WIDTH)
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [CANVAS_WIDTH])

  // Отрисовка
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Рисуем фон с градиентом
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1a082d')
    gradient.addColorStop(1, '#3a1c71')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Ретро звездное небо с параллаксом
    for (let l = 0; l < STAR_LAYERS; l++) {
      const color = STAR_COLORS[l]
      if (!color) continue
      ctx.fillStyle = color
      for (let i = 0; i < STARS_PER_LAYER; i++) {
        const star = starField[l]?.[i]
        if (!star || typeof star.x !== 'number' || typeof star.y !== 'number') continue
        // Зацикленный параллакс
        let x = (star.x + starParallax * (STAR_SPEEDS[l] || 1)) % CANVAS_WIDTH
        if (x < 0) x += CANVAS_WIDTH
        ctx.beginPath()
        const size = STAR_SIZES[l] ?? 1
        ctx.arc(x, star.y, size, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }, [starField, starParallax, STAR_LAYERS, STARS_PER_LAYER, STAR_COLORS, STAR_SPEEDS, STAR_SIZES, CANVAS_WIDTH, CANVAS_HEIGHT])

  return (
    <div className="platform-game-container">
      <canvas
        ref={canvasRef}
        className="platform-game-canvas"
        width={800}
        height={600}
      />
      {isListening && (
        <div className="platform-game-controls-hint">
          <div className="controls-hint-row">
            <span className="controls-hint-icon">🎤</span>
            <span className="controls-hint-text">Sing or hum the melody</span>
          </div>
          <div className="controls-hint-row">
            <span className="controls-hint-icon">📊</span>
            <span className="controls-hint-text">
              Audio input: {averageAudioInput.toFixed(1)} Hz
            </span>
          </div>
        </div>
      )}
    </div>
  )
}