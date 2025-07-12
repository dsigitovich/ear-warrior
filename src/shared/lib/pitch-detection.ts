import { AUDIO_CONFIG } from '../config/constants'

export function detectPitch (buffer: Float32Array, sampleRate: number): number | null {
  const windowed = buffer.map((v, i) => v * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (buffer.length - 1))))
  let maxCorr = 0
  let bestLag = 0
  let rms = 0

  for (let i = 0; i < windowed.length; i++) rms += windowed[i] * windowed[i]
  rms = Math.sqrt(rms / windowed.length)

  if (rms < AUDIO_CONFIG.MIN_RMS) return null // Too quiet

  for (let lag = AUDIO_CONFIG.MIN_FREQUENCY; lag < AUDIO_CONFIG.MAX_FREQUENCY; lag++) {
    let corr = 0
    let norm = 0

    for (let i = 0; i < windowed.length - lag; i++) {
      corr += windowed[i] * windowed[i + lag]
      norm += windowed[i] * windowed[i] + windowed[i + lag] * windowed[i + lag]
    }

    if (norm > 0) corr /= Math.sqrt(norm)

    if (corr > maxCorr) {
      maxCorr = corr
      bestLag = lag
    }
  }

  if (maxCorr > AUDIO_CONFIG.MIN_CORRELATION && bestLag > AUDIO_CONFIG.MIN_FREQUENCY && bestLag < AUDIO_CONFIG.MAX_FREQUENCY - 1) {
    return sampleRate / bestLag
  }

  return null
}