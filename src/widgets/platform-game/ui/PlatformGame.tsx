import React, { useRef, useState, useEffect, useCallback } from 'react'
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

interface JumpAnimation {
  isActive: boolean;
  startTime: number;
  duration: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  peakY: number;
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
  const roosterVelocityRef = useRef({ x: 2, y: 0 })
  const [isRoosterJumping, setIsRoosterJumping] = useState(false)
  const [jumpAnimation, setJumpAnimation] = useState<JumpAnimation>({
    isActive: false,
    startTime: 0,
    duration: 0,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    peakY: 0,
  })

  // Используем refs для стабильных ссылок на данные
  const platformsRef = useRef<Platform[]>([])
  const jumpAnimationRef = useRef<JumpAnimation>(jumpAnimation)

  // Обновляем refs при изменении данных
  useEffect(() => {
    platformsRef.current = platforms
  }, [platforms])

  useEffect(() => {
    jumpAnimationRef.current = jumpAnimation
  }, [jumpAnimation])

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
  const jumpTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Функция для создания плавного прыжка
  const createSmoothJump = useCallback((startX: number, startY: number, targetX: number, targetY: number) => {
    const distance = Math.abs(targetX - startX)
    const jumpHeight = Math.max(80, distance * 0.3) // Высота прыжка зависит от расстояния
    const duration = Math.max(800, distance * 2) // Длительность зависит от расстояния

    setJumpAnimation({
      isActive: true,
      startTime: Date.now(),
      duration,
      startX,
      startY,
      targetX,
      targetY,
      peakY: Math.min(startY, targetY) - jumpHeight,
    })
  }, [])

  // Реакция на новый звук пользователя
  useEffect(() => {
    if (!isListening) {
      setIsRoosterJumping(false)
      setIsLockedOnPlatform(false)
      prevDetectedNoteRef.current = null
      if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
      setJumpAnimation(prev => ({ ...prev, isActive: false }))
      return
    }

    if (detectedNote && detectedNote !== prevDetectedNoteRef.current) {
      prevDetectedNoteRef.current = detectedNote
      const currentPlatform = platforms.find((p) => p.isCurrent)

      if (currentPlatform && detectedNote === currentPlatform.note) {
        // Успешное попадание - плавный прыжок к платформе
        const targetX = currentPlatform.x + currentPlatform.width / 2
        const targetY = currentPlatform.y - 60 // Позиция петуха на платформе

        createSmoothJump(roosterPosition.x, roosterPosition.y, targetX, targetY)
        setIsRoosterJumping(true)
        setIsLockedOnPlatform(true)

        if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
        jumpTimeoutRef.current = setTimeout(() => {
          setIsRoosterJumping(false)
          setJumpAnimation(prev => ({ ...prev, isActive: false }))
        }, jumpAnimation.duration)

      } else if (!isLockedOnPlatform) {
        // Неправильная нота - небольшой прыжок на месте
        setIsRoosterJumping(true)
        if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
        jumpTimeoutRef.current = setTimeout(() => setIsRoosterJumping(false), 300)
      }
    }
  }, [detectedNote, isListening, platforms, isLockedOnPlatform, roosterPosition, createSmoothJump, jumpAnimation.duration])

  // Сброс блокировки при переходе к следующей платформе
  useEffect(() => {
    setIsLockedOnPlatform(false)
    setJumpAnimation(prev => ({ ...prev, isActive: false }))
  }, [currentNoteIndex])

  // Анимация петуха с плавной траекторией
  useEffect(() => {
    let animationId: number
    const gravity = 0.8

    const animate = () => {
      setRoosterPosition(prev => {
        let newX = prev.x
        let newY = prev.y
        let velocity = roosterVelocityRef.current
        const currentJumpAnimation = jumpAnimationRef.current

        if (currentJumpAnimation.isActive) {
          // Плавная анимация прыжка
          const elapsed = Date.now() - currentJumpAnimation.startTime
          const progress = Math.min(elapsed / currentJumpAnimation.duration, 1)

          // Используем кривую Безье для плавной траектории
          const t = progress
          const t2 = t * t
          const t3 = t2 * t
          const mt = 1 - t
          const mt2 = mt * mt
          const mt3 = mt2 * mt

          // Контрольные точки для кривой Безье
          const cp1x = currentJumpAnimation.startX + (currentJumpAnimation.targetX - currentJumpAnimation.startX) * 0.25
          const cp1y = currentJumpAnimation.peakY
          const cp2x = currentJumpAnimation.startX + (currentJumpAnimation.targetX - currentJumpAnimation.startX) * 0.75
          const cp2y = currentJumpAnimation.peakY

          // Кривая Безье: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
          newX = mt3 * currentJumpAnimation.startX +
                 3 * mt2 * t * cp1x +
                 3 * mt * t2 * cp2x +
                 t3 * currentJumpAnimation.targetX

          newY = mt3 * currentJumpAnimation.startY +
                 3 * mt2 * t * cp1y +
                 3 * mt * t2 * cp2y +
                 t3 * currentJumpAnimation.targetY

          // Добавляем небольшое колебание для более естественного движения
          const wobble = Math.sin(progress * Math.PI * 4) * 2
          newY += wobble

        } else {
          // Обычная физика для свободного падения
          newX = prev.x + velocity.x
          newY = prev.y + velocity.y

          // Применяем гравитацию
          velocity = {
            x: velocity.x * 0.98,
            y: velocity.y + gravity,
          }
          roosterVelocityRef.current = velocity

          // Проверяем столкновения с платформами
          const currentPlatforms = platformsRef.current
          currentPlatforms.forEach((platform) => {
            if (newX + 40 > platform.x &&
              newX < platform.x + platform.width &&
              newY + 60 > platform.y &&
              newY + 60 < platform.y + platform.height + 10) {

              // Петух приземлился на платформу
              newY = platform.y - 60
              roosterVelocityRef.current = { ...velocity, y: 0 }
            }
          })

          // Ограничиваем движение
          if (newX < 100) newX = 100
          if (newX > 700) newX = 700
          if (newY > 450) {
            newY = 450
            roosterVelocityRef.current = { ...velocity, y: 0 }
          }
          if (newY < 50) {
            newY = 50
            roosterVelocityRef.current = { ...velocity, y: 0 }
          }
        }

        return { x: newX, y: newY }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, []) // Убираем зависимости, используем refs

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