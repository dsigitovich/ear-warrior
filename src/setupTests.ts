import '@testing-library/jest-dom'

// Mock Web Audio API and related APIs that are not available in test environment
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    createMediaStreamSource: jest.fn(),
    createAnalyser: jest.fn(() => ({
      fftSize: 4096,
      smoothingTimeConstant: 0.3,
      getFloatTimeDomainData: jest.fn()
    })),
    state: 'running',
    close: jest.fn()
  }))
})

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }]
    })
  }
})

// Mock fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
  writable: true,
  value: null
})

Object.defineProperty(document.documentElement, 'requestFullscreen', {
  writable: true,
  value: jest.fn()
})

Object.defineProperty(document, 'exitFullscreen', {
  writable: true,
  value: jest.fn()
})