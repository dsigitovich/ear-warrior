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
  easeType: 'success' | 'miss';
}

interface RoosterState {
  isLanding: boolean;
  landingStartTime: number;
  isAnticipating: boolean;
  anticipationStartTime: number;
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
  const [roosterState, setRoosterState] = useState<RoosterState>({
    isLanding: false,
    landingStartTime: 0,
    isAnticipating: false,
    anticipationStartTime: 0,
  })
  const [jumpAnimation, setJumpAnimation] = useState<JumpAnimation>({
    isActive: false,
    startTime: 0,
    duration: 0,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    peakY: 0,
    easeType: 'success',
  })

  // Используем refs для стабильных ссылок на данные
  const platformsRef = useRef<Platform[]>([])
  const jumpAnimationRef = useRef<JumpAnimation>(jumpAnimation)
  const roosterStateRef = useRef<RoosterState>(roosterState)

  // Обновляем refs при изменении данных
  useEffect(() => {
    platformsRef.current = platforms
  }, [platforms])

  useEffect(() => {
    jumpAnimationRef.current = jumpAnimation
  }, [jumpAnimation])

  useEffect(() => {
    roosterStateRef.current = roosterState
  }, [roosterState])

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

  // Улучшенная функция easing
  const easeOutBounce = (t: number): number => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }

  // Функция для создания плавного прыжка с улучшенными кривыми
  const createSmoothJump = useCallback((startX: number, startY: number, targetX: number, targetY: number, isSuccess: boolean = true) => {
    const distance = Math.abs(targetX - startX)
    const jumpHeight = isSuccess ? Math.max(100, distance * 0.4) : 60 // Выше прыжок для успешных попаданий
    const duration = isSuccess ? Math.max(1000, distance * 1.8) : 600 // Дольше для успешных прыжков

    // Добавляем anticipation (подготовку к прыжку)
    setRoosterState(prev => ({
      ...prev,
      isAnticipating: true,
      anticipationStartTime: Date.now(),
    }))

    // Запускаем прыжок с небольшой задержкой для anticipation
    setTimeout(() => {
      setJumpAnimation({
        isActive: true,
        startTime: Date.now(),
        duration,
        startX,
        startY,
        targetX,
        targetY,
        peakY: Math.min(startY, targetY) - jumpHeight,
        easeType: isSuccess ? 'success' : 'miss',
      })
      setRoosterState(prev => ({
        ...prev,
        isAnticipating: false,
      }))
    }, 150) // 150ms anticipation
  }, [])

  // Реакция на новый звук пользователя
  useEffect(() => {
    if (!isListening) {
      setIsRoosterJumping(false)
      setIsLockedOnPlatform(false)
      prevDetectedNoteRef.current = null
      if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
      setJumpAnimation(prev => ({ ...prev, isActive: false }))
      setRoosterState({
        isLanding: false,
        landingStartTime: 0,
        isAnticipating: false,
        anticipationStartTime: 0,
      })
      return
    }

    if (detectedNote && detectedNote !== prevDetectedNoteRef.current) {
      prevDetectedNoteRef.current = detectedNote
      const currentPlatform = platforms.find((p) => p.isCurrent)

      if (currentPlatform && detectedNote === currentPlatform.note) {
        // Успешное попадание - плавный прыжок к платформе
        const targetX = currentPlatform.x + currentPlatform.width / 2
        const targetY = currentPlatform.y - 60 // Позиция петуха на платформе

        createSmoothJump(roosterPosition.x, roosterPosition.y, targetX, targetY, true)
        setIsRoosterJumping(true)
        setIsLockedOnPlatform(true)

        if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
        jumpTimeoutRef.current = setTimeout(() => {
          setIsRoosterJumping(false)
          setJumpAnimation(prev => ({ ...prev, isActive: false }))
          // Добавляем эффект приземления
          setRoosterState(prev => ({
            ...prev,
            isLanding: true,
            landingStartTime: Date.now(),
          }))
        }, jumpAnimation.duration + 150) // +150ms для anticipation

      } else if (!isLockedOnPlatform) {
        // Неправильная нота - небольшой прыжок на месте
        createSmoothJump(roosterPosition.x, roosterPosition.y, roosterPosition.x + (Math.random() - 0.5) * 40, roosterPosition.y, false)
        setIsRoosterJumping(true)
        if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
        jumpTimeoutRef.current = setTimeout(() => {
          setIsRoosterJumping(false)
          setJumpAnimation(prev => ({ ...prev, isActive: false }))
        }, 600 + 150) // +150ms для anticipation
      }
    }
  }, [detectedNote, isListening, platforms, isLockedOnPlatform, roosterPosition, createSmoothJump, jumpAnimation.duration])

  // Сброс блокировки при переходе к следующей платформе
  useEffect(() => {
    setIsLockedOnPlatform(false)
    setJumpAnimation(prev => ({ ...prev, isActive: false }))
    setRoosterState({
      isLanding: false,
      landingStartTime: 0,
      isAnticipating: false,
      anticipationStartTime: 0,
    })
  }, [currentNoteIndex])

  // Анимация петуха с улучшенной плавной траекторией
  useEffect(() => {
    let animationId: number
    const gravity = 0.5 // Уменьшенная гравитация для более плавного движения
    const airResistance = 0.995 // Сопротивление воздуха для более реалистичного движения

    const animate = () => {
      setRoosterPosition(prev => {
        let newX = prev.x
        let newY = prev.y
        let velocity = roosterVelocityRef.current
        const currentJumpAnimation = jumpAnimationRef.current
        const currentRoosterState = roosterStateRef.current

        if (currentJumpAnimation.isActive) {
          // Улучшенная анимация прыжка с разными кривыми для разных типов
          const elapsed = Date.now() - currentJumpAnimation.startTime
          const progress = Math.min(elapsed / currentJumpAnimation.duration, 1)

          let easedProgress: number
          if (currentJumpAnimation.easeType === 'success') {
            // Успешный прыжок - более плавная кривая
            easedProgress = easeInOutCubic(progress)
          } else {
            // Промах - более резкая кривая
            easedProgress = easeOutElastic(progress)
          }

          // Горизонтальное движение
          newX = currentJumpAnimation.startX + (currentJumpAnimation.targetX - currentJumpAnimation.startX) * easedProgress

          // Вертикальное движение с параболой для реалистичной физики
          const heightProgress = 4 * progress * (1 - progress) // Парабола для естественной траектории
          const peakOffset = currentJumpAnimation.peakY - Math.max(currentJumpAnimation.startY, currentJumpAnimation.targetY)
          newY = Math.max(currentJumpAnimation.startY, currentJumpAnimation.targetY) +
                 peakOffset * heightProgress +
                 (currentJumpAnimation.targetY - currentJumpAnimation.startY) * easedProgress

          // Добавляем небольшие колебания для более живой анимации
          const wobbleX = Math.sin(progress * Math.PI * 3) * 1.5
          const wobbleY = Math.sin(progress * Math.PI * 6) * 0.8
          newX += wobbleX
          newY += wobbleY

        } else if (currentRoosterState.isAnticipating) {
          // Эффект anticipation - легкое приседание перед прыжком
          const elapsed = Date.now() - currentRoosterState.anticipationStartTime
          const anticipationProgress = Math.min(elapsed / 150, 1)
          const squashEffect = Math.sin(anticipationProgress * Math.PI) * 3
          newY = prev.y + squashEffect

        } else if (currentRoosterState.isLanding) {
          // Эффект приземления с отскоком
          const elapsed = Date.now() - currentRoosterState.landingStartTime
          const landingProgress = Math.min(elapsed / 400, 1)

          if (landingProgress < 1) {
            const bounceEffect = easeOutBounce(landingProgress) * 8
            newY = prev.y - bounceEffect
          } else {
            // Завершаем эффект приземления
            setRoosterState(prevState => ({
              ...prevState,
              isLanding: false,
            }))
          }

        } else {
          // Обычная физика для свободного падения с улучшениями
          newX = prev.x + velocity.x
          newY = prev.y + velocity.y

          // Применяем гравитацию и сопротивление воздуха
          velocity = {
            x: velocity.x * airResistance,
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

              // Добавляем эффект приземления
              setRoosterState(prev => ({
                ...prev,
                isLanding: true,
                landingStartTime: Date.now(),
              }))
            }
          })

          // Ограничиваем движение с более плавными границами
          if (newX < 100) {
            newX = 100
            roosterVelocityRef.current = { ...velocity, x: Math.abs(velocity.x) * 0.7 }
          }
          if (newX > 700) {
            newX = 700
            roosterVelocityRef.current = { ...velocity, x: -Math.abs(velocity.x) * 0.7 }
          }
          if (newY > 450) {
            newY = 450
            roosterVelocityRef.current = { ...velocity, y: -Math.abs(velocity.y) * 0.3 } // Небольшой отскок от земли
            setRoosterState(prev => ({
              ...prev,
              isLanding: true,
              landingStartTime: Date.now(),
            }))
          }
          if (newY < 50) {
            newY = 50
            roosterVelocityRef.current = { ...velocity, y: Math.abs(velocity.y) * 0.3 }
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
      const color = STAR_COLORS[l]
      if (!color) continue
      ctx.fillStyle = color
      for (let i = 0; i < STARS_PER_LAYER; i++) {
        const star = starField[l]?.[i]
        if (!star || typeof star.x !== 'number' || typeof star.y !== 'number') continue
        // Зацикленный параллакс
        let x = (star.x + starParallax * STAR_SPEEDS[l]!) % CANVAS_WIDTH
        if (x < 0) x += CANVAS_WIDTH
        ctx.beginPath()
        const size = STAR_SIZES[l] ?? 1
        ctx.arc(x, star.y, size, 0, 2 * Math.PI)
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
            jumping={isRoosterJumping || roosterState.isAnticipating}
          />
        </div>
      </div>
    </div>
  )
}