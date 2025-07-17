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

  // Аудио визуализация параметры
  const [audioVisualTime, setAudioVisualTime] = useState(0)
  const [audioIntensity, setAudioIntensity] = useState(0)
  const [audioHue, setAudioHue] = useState(0)

  // Aurora Borealis параметры
  const [auroraPoints] = useState(() => {
    const points = []
    for (let i = 0; i < 20; i++) {
      points.push({
        x: (i / 19) * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT * 0.4 + 50,
        baseY: Math.random() * CANVAS_HEIGHT * 0.4 + 50,
        amplitude: Math.random() * 30 + 20,
        frequency: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      })
    }
    return points
  })

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

  // Анимация параллакса звезд и аудио визуализации
  useEffect(() => {
    let raf: number
    const animate = () => {
      setStarParallax(prev => (prev + 1) % CANVAS_WIDTH)
      setAudioVisualTime(prev => prev + 0.016) // 60fps ~ 16ms
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [CANVAS_WIDTH])

  // Обновление аудио визуализации
  useEffect(() => {
    if (isListening && averageAudioInput > 0) {
      // Преобразуем частоту в интенсивность (0-1)
      const normalizedFreq = Math.min(Math.max((averageAudioInput - 80) / 920, 0), 1)
      setAudioIntensity(normalizedFreq * 0.8 + 0.2) // минимум 0.2 для базового эффекта

      // Преобразуем частоту в цветовой оттенок
      // Низкие частоты = красный/фиолетовый (270-330°)
      // Высокие частоты = синий/зеленый (180-240°)
      const hue = 270 + normalizedFreq * 60 // 270° (фиолетовый) до 330° (пурпурный)
      setAudioHue(hue)
    } else {
      // Плавно затухаем когда нет аудио
      setAudioIntensity(prev => Math.max(prev * 0.95, 0.1))
      setAudioHue(prev => (prev + 1) % 360) // медленная смена цвета
    }
  }, [isListening, averageAudioInput])

  // Отрисовка с аудио визуализацией
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Рисуем динамический фон с градиентом, реагирующий на аудио
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)

    if (isListening && audioIntensity > 0.1) {
      // Аудио-реактивный градиент
      const hue1 = audioHue
      const hue2 = (audioHue + 30) % 360
      const saturation = Math.min(70 + audioIntensity * 30, 100)
      const lightness1 = Math.min(15 + audioIntensity * 10, 30)
      const lightness2 = Math.min(25 + audioIntensity * 15, 45)

      gradient.addColorStop(0, `hsl(${hue1}, ${saturation}%, ${lightness1}%)`)
      gradient.addColorStop(0.6, `hsl(${hue2}, ${saturation - 20}%, ${lightness2}%)`)
      gradient.addColorStop(1, '#3a1c71')
    } else {
      // Базовый градиент
      gradient.addColorStop(0, '#1a082d')
      gradient.addColorStop(1, '#3a1c71')
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Aurora Borealis эффект (северное сияние)
    if (isListening && audioIntensity > 0.2) {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      // Рисуем волнистые линии Aurora
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath()

        for (let i = 0; i < auroraPoints.length; i++) {
          const point = auroraPoints[i]
          if (!point) continue

          const waveOffset = Math.sin(audioVisualTime * point.frequency + point.phase) * point.amplitude * audioIntensity
          const y = point.baseY + waveOffset + layer * 20

          if (i === 0) {
            ctx.moveTo(point.x, y)
          } else {
            ctx.lineTo(point.x, y)
          }
        }

        // Aurora цвета с прозрачностью
        const auroraHue = (audioHue + layer * 40) % 360
        const opacity = audioIntensity * (0.3 - layer * 0.08)
        ctx.strokeStyle = `hsla(${auroraHue}, 80%, 70%, ${opacity})`
        ctx.lineWidth = 8 - layer * 2
        ctx.stroke()

        // Добавляем свечение
        ctx.shadowColor = `hsl(${auroraHue}, 80%, 70%)`
        ctx.shadowBlur = 15 + audioIntensity * 10
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      ctx.restore()
    }

    // Ретро звездное небо с параллаксом и аудио-реакцией
    for (let l = 0; l < STAR_LAYERS; l++) {
      const color = STAR_COLORS[l]
      if (!color) continue

      for (let i = 0; i < STARS_PER_LAYER; i++) {
        const star = starField[l]?.[i]
        if (!star || typeof star.x !== 'number' || typeof star.y !== 'number') continue

        // Зацикленный параллакс
        let x = (star.x + starParallax * (STAR_SPEEDS[l] || 1)) % CANVAS_WIDTH
        if (x < 0) x += CANVAS_WIDTH

        // Аудио-реактивный размер и яркость звезд
        const baseSize = STAR_SIZES[l] ?? 1
        const audioSizeMultiplier = isListening ? (1 + audioIntensity * 0.5 + Math.sin(audioVisualTime * 2 + i) * audioIntensity * 0.2) : 1
        const size = baseSize * audioSizeMultiplier

        // Мерцание звезд синхронно с аудио
        const twinkle = isListening ?
          (0.7 + 0.3 * Math.sin(audioVisualTime * 3 + i * 0.5) * audioIntensity) :
          (0.8 + 0.2 * Math.sin(audioVisualTime * 0.5 + i))

        ctx.save()
        ctx.globalAlpha = twinkle
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, star.y, size, 0, 2 * Math.PI)
        ctx.fill()

        // Добавляем свечение для больших звезд при высокой интенсивности
        if (isListening && audioIntensity > 0.5 && size > 2) {
          ctx.shadowColor = color
          ctx.shadowBlur = audioIntensity * 8
          ctx.fill()
        }

        ctx.restore()
      }
    }
  }, [starField, starParallax, auroraPoints, audioVisualTime, audioIntensity, audioHue, isListening, STAR_LAYERS, STARS_PER_LAYER, STAR_COLORS, STAR_SPEEDS, STAR_SIZES, CANVAS_WIDTH, CANVAS_HEIGHT])

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