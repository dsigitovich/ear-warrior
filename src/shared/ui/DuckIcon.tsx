import React from 'react'

/**
 * DuckIcon renders a pixel-art style SVG duck illustration.
 */
export function DuckIcon({ width = 48, height = 36 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Body */}
      <rect x="6" y="8" width="10" height="6" fill="#ffe066" stroke="#ffb300" strokeWidth="0.5" />
      {/* Head */}
      <rect x="3" y="7" width="4" height="4" fill="#ffe066" stroke="#ffb300" strokeWidth="0.5" />
      {/* Beak */}
      <rect x="1" y="9" width="2" height="1" fill="#ff9800" />
      {/* Eye */}
      <rect x="5.5" y="8.5" width="1" height="1" fill="#222" />
      {/* Wing */}
      <rect x="12" y="10" width="3" height="2" fill="#fff59d" stroke="#ffb300" strokeWidth="0.5" />
      {/* Tail: two stacked vertical pixels */}
      <rect x="16" y="9" width="1" height="2" fill="#ffb300" />
      <rect x="17" y="8" width="1" height="2" fill="#ffb300" />
      {/* Rear foot only */}
      <rect x="13" y="14" width="1" height="2" fill="#ff9800" />
      {/* Rear foot toes */}
      <rect x="12.5" y="16" width="2" height="0.7" fill="#ff9800" />
    </svg>
  )
} 