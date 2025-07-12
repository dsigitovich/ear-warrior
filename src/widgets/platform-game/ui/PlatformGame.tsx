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
  const [parallaxOffset, setParallaxOffset] = useState(0)
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
      setParallaxOffset(prev => (prev + 1) % 1000)

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

    // Рисуем звезды (параллакс фон)
    ctx.fillStyle = '#ffe066'
    for (let i = 0; i < 50; i++) {
      const x = (i * 17 + parallaxOffset * 0.1) % canvas.width
      const y = (i * 23) % canvas.height
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Рисуем платформы
    platforms.forEach((platform, index) => {
      // Параллакс эффект для платформ
      const parallaxX = platform.x - parallaxOffset * 0.5

      // Цвет платформы в зависимости от состояния
      let color = '#3a1c71'
      if (platform.isMatched) {
        color = '#ff9800'
      } else if (platform.isCurrent) {
        color = '#ffe066'
      }

      // Рисуем платформу
      ctx.fillStyle = color
      ctx.fillRect(parallaxX, platform.y, platform.width, platform.height)

      // Рисуем обводку
      ctx.strokeStyle = '#ffe066'
      ctx.lineWidth = 2
      ctx.strokeRect(parallaxX, platform.y, platform.width, platform.height)

      // Рисуем номер ноты
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${index + 1}`, parallaxX + platform.width / 2, platform.y + 15)
    })

  }, [platforms, roosterPosition, parallaxOffset])

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
        <RoosterIcon
          width={64}
          height={64}
          jumping={isRoosterJumping}
        />
      </div>
      {/* Отладочная информация (можно убрать после проверки) */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        color: 'white',
        fontSize: '12px',
        zIndex: 1000,
      }}>
        Rooster: x={roosterPosition.x}, y={roosterPosition.y}
      </div>
    </div>
  )
} 