import React, { useRef, useEffect, useState } from 'react'
import { RoosterIcon } from '../../../shared/ui/RoosterIcon'
import './PlatformGame.css'

interface PlatformGameProps {
  detectedNote: string | null;
  matchedIndices: number[];
  melodyLength: number;
  currentNoteIndex: number;
  isListening: boolean;
  melodyNotes: string[];
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  note: string;
  isMatched: boolean;
  isCurrent: boolean;
}

export const PlatformGame: React.FC<PlatformGameProps> = ({
  detectedNote,
  matchedIndices,
  melodyLength,
  currentNoteIndex,
  isListening,
  melodyNotes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [roosterPosition, setRoosterPosition] = useState({ x: 400, y: 300 })
  const [roosterVelocity, setRoosterVelocity] = useState({ x: 2, y: 0 })
  const [isRoosterJumping, setIsRoosterJumping] = useState(false)

  // Генерируем платформы на основе мелодии
  useEffect(() => {
    if (melodyLength > 0) {
      const newPlatforms: Platform[] = []
      const platformWidth = 120
      const platformHeight = 20
      const spacing = 200

      for (let i = 0; i < melodyLength; i++) {
        newPlatforms.push({
          x: 150 + i * spacing,
          y: 400 + Math.sin(i * 0.5) * 50,
          width: platformWidth,
          height: platformHeight,
          note: melodyNotes[i] || `Note ${i + 1}`,
          isMatched: matchedIndices.includes(i),
          isCurrent: i === currentNoteIndex && isListening,
        })
      }
      setPlatforms(newPlatforms)
    }
  }, [melodyLength, matchedIndices, currentNoteIndex, isListening, melodyNotes])

  // Параметры для звездного параллакса
  const STAR_LAYERS = 3
  const STARS_PER_LAYER = 24
  const STAR_COLORS = ['#ffe066', '#fffbe6', '#ffaf7b']
  const STAR_SPEEDS = [0.2, 0.1, 0.05]
  const STAR_SIZES = [2, 1.2, 0.7]
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
  }, [])

  // Для отслеживания предыдущей ноты
  const prevDetectedNoteRef = useRef<string | null>(null)
  // Для блокировки прыжка после попадания
  const [isLockedOnPlatform, setIsLockedOnPlatform] = useState(false)
  // Для хранения id таймера прыжка
  const jumpTimeoutRef = useRef<number | null>(null)

  // Реакция на новый звук пользователя
  useEffect(() => {
    if (!isListening) {
      setIsRoosterJumping(false)
      setIsLockedOnPlatform(false)
      prevDetectedNoteRef.current = null
      if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
      return
    }
    if (detectedNote && detectedNote !== prevDetectedNoteRef.current) {
      prevDetectedNoteRef.current = detectedNote
      const currentPlatform = platforms.find((p) => p.isCurrent)
      if (currentPlatform && detectedNote === currentPlatform.note) {
        setIsRoosterJumping(false)
        setIsLockedOnPlatform(true)
        if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
      } else if (!isLockedOnPlatform) {
        setIsRoosterJumping(false)
        if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
        setTimeout(() => setIsRoosterJumping(true), 10)
        jumpTimeoutRef.current = setTimeout(() => setIsRoosterJumping(false), 220)
      }
    }
  }, [detectedNote, isListening, platforms, isLockedOnPlatform])

  // Сброс блокировки при переходе к следующей платформе
  useEffect(() => {
    setIsLockedOnPlatform(false)
  }, [currentNoteIndex])

  // Анимация петуха
  useEffect(() => {
    let animationId: number
    const gravity = 0.8
    const jumpPower = -15

    const animate = () => {
      setRoosterPosition(prev => {
        let newX = prev.x + roosterVelocity.x
        let newY = prev.y + roosterVelocity.y

        // Применяем гравитацию
        setRoosterVelocity(prevVel => ({
          x: prevVel.x * 0.98,
          y: prevVel.y + gravity,
        }))

        // Проверяем столкновения с платформами
        platforms.forEach((platform) => {
          if (newX + 40 > platform.x &&
              newX < platform.x + platform.width &&
              newY + 60 > platform.y &&
              newY + 60 < platform.y + platform.height + 10) {

            // Петух приземлился на платформу
            newY = platform.y - 60
            setRoosterVelocity(prev => ({ ...prev, y: 0 }))

            // Если это текущая нота и она совпадает
            if (platform.isCurrent && detectedNote && platform.note === detectedNote) {
              // Успешное попадание
              setIsRoosterJumping(true)
              setRoosterVelocity(prev => ({ ...prev, y: jumpPower }))
              // Сбрасываем прыжок через некоторое время
              setTimeout(() => setIsRoosterJumping(false), 1200)
            }
          }
        })

        // Ограничиваем движение
        if (newX < 100) newX = 100
        if (newX > 700) newX = 700
        if (newY > 450) {
          newY = 450
          setRoosterVelocity(prev => ({ ...prev, y: 0 }))
        }
        if (newY < 50) {
          newY = 50
          setRoosterVelocity(prev => ({ ...prev, y: 0 }))
        }

        return { x: newX, y: newY }
      })

      // Параллакс эффект для платформ
      // setParallaxOffset(prev => (prev + 1) % 1000) // Удалено

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [platforms, detectedNote, roosterVelocity])

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
      ctx.fillStyle = STAR_COLORS[l]
      for (let i = 0; i < STARS_PER_LAYER; i++) {
        const star = starField[l][i]
        // Зацикленный параллакс
        let x = (star.x + starParallax * STAR_SPEEDS[l]) % CANVAS_WIDTH
        if (x < 0) x += CANVAS_WIDTH
        ctx.beginPath()
        ctx.arc(x, star.y, STAR_SIZES[l], 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // Рисуем платформы (без параллакса)
    platforms.forEach((platform, index) => {
      const px = platform.x
      let color = '#3a1c71'
      if (platform.isMatched) {
        color = '#ff9800'
      } else if (platform.isCurrent) {
        color = '#ffe066'
      }
      ctx.fillStyle = color
      ctx.fillRect(px, platform.y, platform.width, platform.height)
      ctx.strokeStyle = '#ffe066'
      ctx.lineWidth = 2
      ctx.strokeRect(px, platform.y, platform.width, platform.height)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${index + 1}`, px + platform.width / 2, platform.y + 15)
    })
  }, [platforms, roosterPosition, starField, starParallax])

  return (
    <div className="platform-game-container">
      <canvas
        ref={canvasRef}
        className="platform-game-canvas"
        width={800}
        height={600}
      />
      <div
        className="rooster-game-character"
        style={{
          position: 'absolute',
          left: roosterPosition.x,
          top: roosterPosition.y - 100, // выше над платформой
          transform: 'translate(-50%, 0)',
          zIndex: 100,
        }}
      >
        <div style={{ transform: 'scaleX(-1)' }}>
          <RoosterIcon
            width={64}
            height={64}
            jumping={isRoosterJumping}
          />
        </div>
      </div>
    </div>
  )
}