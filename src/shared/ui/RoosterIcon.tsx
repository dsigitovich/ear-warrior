import { useEffect } from 'react'

/**
 * RoosterIcon renders a pixel-art rooster (cock) based on the provided image.
 * If jumping is true, the rooster jumps in Mario style.
 */
export function RoosterIcon ({ width = 64, height = 64, jumping = false }: { width?: number; height?: number; jumping?: boolean }) {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('rooster-jump-keyframes')) {
      const style = document.createElement('style')
      style.id = 'rooster-jump-keyframes'
      style.innerHTML = `
        @keyframes jumpMarioRooster {
          0% { 
            transform: translateY(0px) scaleY(1) scaleX(1); 
          }
          /* Небольшая подготовка к прыжку */
          10% { 
            transform: translateY(2px) scaleY(0.9) scaleX(1.1); 
          }
          /* Отрыв от земли */
          20% { 
            transform: translateY(-15px) scaleY(1.05) scaleX(0.95); 
          }
          /* Пик прыжка */
          40% { 
            transform: translateY(-35px) scaleY(1) scaleX(1); 
          }
          /* Удержание в воздухе */
          60% { 
            transform: translateY(-35px) scaleY(1) scaleX(1); 
          }
          /* Начало падения */
          75% { 
            transform: translateY(-20px) scaleY(1.02) scaleX(0.98); 
          }
          /* Подготовка к приземлению */
          90% { 
            transform: translateY(-5px) scaleY(1.05) scaleX(0.95); 
          }
          /* Приземление с небольшим сжатием */
          95% { 
            transform: translateY(0px) scaleY(0.85) scaleX(1.15); 
          }
          /* Возврат к нормальному состоянию */
          100% { 
            transform: translateY(0px) scaleY(1) scaleX(1); 
          }
        }

        @keyframes roosterIdle {
          0%, 100% { 
            transform: scaleY(1) scaleX(1); 
          }
          25% { 
            transform: scaleY(1.01) scaleX(0.99); 
          }
          50% { 
            transform: scaleY(0.99) scaleX(1.01); 
          }
          75% { 
            transform: scaleY(1.005) scaleX(0.995); 
          }
        }

        @keyframes roosterLanding {
          0% { 
            transform: translateY(-5px) scaleY(1.05) scaleX(0.95); 
          }
          30% { 
            transform: translateY(1px) scaleY(0.85) scaleX(1.15); 
          }
          60% { 
            transform: translateY(-1px) scaleY(1.08) scaleX(0.92); 
          }
          80% { 
            transform: translateY(0px) scaleY(0.95) scaleX(1.05); 
          }
          100% { 
            transform: translateY(0px) scaleY(1) scaleX(1); 
          }
        }`
      document.head.appendChild(style)
    }
  }, [])

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-label="Rooster logo"
      role="img"
      style={jumping ? {
        animation: 'jumpMarioRooster 1.2s ease-out',
        transformOrigin: 'center bottom'
      } : {
        animation: 'roosterIdle 4s ease-in-out infinite',
        transformOrigin: 'center bottom'
      }}
    >
      {/* Comb (red) */}
      <rect x="2" y="2" width="2" height="1" fill="#e74c3c" />
      <rect x="1" y="3" width="4" height="1" fill="#e74c3c" />
      <rect x="1" y="4" width="4" height="1" fill="#e74c3c" />
      <rect x="2" y="5" width="2" height="1" fill="#e74c3c" />
      {/* Beak (orange) */}
      <rect x="0" y="5" width="2" height="1" fill="#f4a259" />
      {/* Head (red) */}
      <rect x="2" y="6" width="3" height="2" fill="#e74c3c" />
      <rect x="3" y="8" width="2" height="1" fill="#e74c3c" />
      {/* Eye */}
      <rect x="4" y="7" width="1" height="1" fill="#222" />
      {/* Neck (light brown) */}
      <rect x="5" y="6" width="2" height="5" fill="#e8ded9" />
      <rect x="7" y="7" width="1" height="3" fill="#e8ded9" />
      {/* Body (light brown) */}
      <rect x="6" y="9" width="7" height="5" fill="#e8ded9" />
      <rect x="5" y="11" width="1" height="2" fill="#e8ded9" />
      <rect x="13" y="10" width="2" height="3" fill="#e8ded9" />
      <rect x="8" y="14" width="4" height="2" fill="#e8ded9" />
      <rect x="7" y="15" width="1" height="1" fill="#e8ded9" />
      {/* Shadow (darker brown) */}
      <rect x="6" y="10" width="2" height="2" fill="#b8ada7" />
      <rect x="8" y="11" width="2" height="2" fill="#b8ada7" />
      <rect x="10" y="12" width="2" height="1" fill="#b8ada7" />
      <rect x="7" y="13" width="2" height="1" fill="#b8ada7" />
      <rect x="9" y="14" width="1" height="1" fill="#b8ada7" />
      <rect x="12" y="13" width="1" height="1" fill="#b8ada7" />
      <rect x="13" y="12" width="1" height="1" fill="#b8ada7" />
      {/* Tail (light and dark brown) */}
      <rect x="14" y="9" width="1" height="2" fill="#e8ded9" />
      <rect x="15" y="8" width="1" height="3" fill="#e8ded9" />
      <rect x="16" y="7" width="1" height="4" fill="#e8ded9" />
      <rect x="17" y="6" width="1" height="5" fill="#e8ded9" />
      <rect x="18" y="7" width="1" height="3" fill="#e8ded9" />
      <rect x="19" y="8" width="1" height="2" fill="#e8ded9" />
      <rect x="15" y="11" width="2" height="2" fill="#b8ada7" />
      <rect x="17" y="10" width="2" height="2" fill="#b8ada7" />
      <rect x="18" y="9" width="1" height="1" fill="#b8ada7" />
      {/* Legs (orange) */}
      <rect x="7" y="16" width="1" height="2" fill="#f4a259" />
      <rect x="10" y="16" width="1" height="2" fill="#f4a259" />
      <rect x="6" y="18" width="2" height="1" fill="#f4a259" />
      <rect x="9" y="18" width="2" height="1" fill="#f4a259" />
    </svg>
  )
}