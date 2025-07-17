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
            transform: translateY(0) scaleY(1) scaleX(1) rotate(0deg); 
          }
          /* Anticipation - подготовка к прыжку */
          5% { 
            transform: translateY(1px) scaleY(0.95) scaleX(1.05) rotate(-0.5deg); 
          }
          10% { 
            transform: translateY(3px) scaleY(0.85) scaleX(1.12) rotate(-1.5deg); 
          }
          /* Start of jump - начало прыжка */
          18% { 
            transform: translateY(-8px) scaleY(1.08) scaleX(0.92) rotate(2deg); 
          }
          /* Rising - подъем */
          28% { 
            transform: translateY(-22px) scaleY(1.04) scaleX(0.96) rotate(4deg); 
          }
          35% { 
            transform: translateY(-32px) scaleY(1.02) scaleX(0.98) rotate(4.5deg); 
          }
          /* Peak - пик прыжка */ 
          45% { 
            transform: translateY(-40px) scaleY(0.96) scaleX(1.04) rotate(3deg); 
          }
          /* Peak hold - удержание в пике */
          55% { 
            transform: translateY(-40px) scaleY(0.94) scaleX(1.06) rotate(1deg); 
          }
          /* Falling - падение */
          65% { 
            transform: translateY(-32px) scaleY(1.01) scaleX(0.99) rotate(-1deg); 
          }
          75% { 
            transform: translateY(-18px) scaleY(1.06) scaleX(0.94) rotate(-3deg); 
          }
          /* Approaching ground - приближение к земле */
          85% { 
            transform: translateY(-5px) scaleY(1.12) scaleX(0.88) rotate(-3.5deg); 
          }
          /* Landing preparation - подготовка к приземлению */
          92% { 
            transform: translateY(1px) scaleY(0.8) scaleX(1.2) rotate(-0.5deg); 
          }
          /* Bounce back - отскок */
          96% { 
            transform: translateY(-3px) scaleY(1.08) scaleX(0.92) rotate(0.5deg); 
          }
          /* Settle - успокоение */
          100% { 
            transform: translateY(0) scaleY(1) scaleX(1) rotate(0deg); 
          }
        }

        @keyframes roosterIdle {
          0%, 100% { 
            transform: scaleY(1) scaleX(1) rotate(0deg); 
          }
          25% { 
            transform: scaleY(1.015) scaleX(0.985) rotate(0.3deg); 
          }
          50% { 
            transform: scaleY(0.985) scaleX(1.015) rotate(0deg); 
          }
          75% { 
            transform: scaleY(1.008) scaleX(0.992) rotate(-0.3deg); 
          }
        }

        @keyframes roosterLanding {
          0% { 
            transform: translateY(-6px) scaleY(1.08) scaleX(0.92) rotate(1.5deg); 
          }
          15% { 
            transform: translateY(2px) scaleY(0.75) scaleX(1.25) rotate(-0.8deg); 
          }
          30% { 
            transform: translateY(-1.5px) scaleY(1.12) scaleX(0.88) rotate(0.4deg); 
          }
          50% { 
            transform: translateY(0.8px) scaleY(0.92) scaleX(1.08) rotate(-0.2deg); 
          }
          70% { 
            transform: translateY(-0.8px) scaleY(1.04) scaleX(0.96) rotate(0.1deg); 
          }
          85% { 
            transform: translateY(0.3px) scaleY(0.98) scaleX(1.02) rotate(-0.05deg); 
          }
          100% { 
            transform: translateY(0) scaleY(1) scaleX(1) rotate(0deg); 
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
        animation: 'jumpMarioRooster 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transformOrigin: 'center bottom'
      } : {
        animation: 'roosterIdle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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