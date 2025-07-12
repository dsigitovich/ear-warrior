import React from 'react'

/**
 * DuckIcon renders a pixel-perfect pixel-art duck with a top hat and bow tie, matching the provided image, without a black outline.
 */
export function DuckIcon({ width = 64, height = 64 }: { width?: number; height?: number }) {
  // 16x16 pixel grid, each rect is 1x1 unit
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-label="Duck logo"
      role="img"
    >
      {/* Top hat */}
      <rect x="5" y="0" width="6" height="3" fill="#000" />
      <rect x="4" y="3" width="8" height="1" fill="#000" />
      {/* Head */}
      <rect x="5" y="4" width="6" height="4" fill="#ffe066" />
      {/* Eye */}
      <rect x="9" y="5" width="1" height="1" fill="#000" />
      {/* Beak */}
      <rect x="11" y="6" width="2" height="1" fill="#ff9800" />
      <rect x="13" y="7" width="1" height="1" fill="#e65100" />
      {/* Bow tie */}
      <rect x="7" y="8" width="2" height="1" fill="#000" />
      <rect x="6" y="9" width="1" height="1" fill="#000" />
      <rect x="9" y="9" width="1" height="1" fill="#000" />
      {/* Collar */}
      <rect x="6" y="8" width="1" height="1" fill="#fff" />
      <rect x="9" y="8" width="1" height="1" fill="#fff" />
      {/* Body */}
      <rect x="2" y="8" width="10" height="4" fill="#ffe066" />
      {/* Wing */}
      <rect x="7" y="10" width="3" height="2" fill="#fff59d" />
      {/* Tail */}
      <rect x="1" y="10" width="1" height="2" fill="#ffb300" />
      <rect x="0" y="11" width="1" height="1" fill="#ffb300" />
      {/* Feet */}
      <rect x="4" y="12" width="1" height="2" fill="#ff9800" />
      <rect x="9" y="12" width="1" height="2" fill="#ff9800" />
    </svg>
  )
} 