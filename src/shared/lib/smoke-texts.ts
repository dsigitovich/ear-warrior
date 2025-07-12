interface SmokeTexts {
  instructions: string[]
  tips: string[]
  achievements: string[]
  loadingStates: string[]
  errorMessages: string[]
  progressMessages: string[]
  musicalTerms: string[]
  encouragements: string[]
  gameStates: string[]
  features: string[]
}

export const smokeTexts: SmokeTexts = {
  instructions: [
    'Listen carefully to the melody and try to sing it back as accurately as possible.',
    'Use your microphone to capture your voice and match the target notes.',
    'Pay attention to the pitch and rhythm of each note in the sequence.',
    'Start with easier difficulties and gradually work your way up to master level.',
    'Practice daily to improve your ear training skills and musical perception.',
    'Focus on one note at a time if you\'re having trouble with longer sequences.',
    'Make sure your microphone is properly calibrated for best results.',
    'Try to sing in a comfortable pitch range that matches your voice.',
  ],

  tips: [
    'Humming can be just as effective as singing with lyrics for pitch detection.',
    'Record yourself practicing to identify areas for improvement.',
    'Use a piano or instrument to check your pitch accuracy during practice.',
    'Train your ear by listening to different musical intervals and scales.',
    'Start each session with vocal warm-ups to improve your pitch accuracy.',
    'Practice in a quiet environment to minimize background noise interference.',
    'Take breaks between sessions to avoid vocal fatigue and maintain focus.',
    'Challenge yourself with different musical genres and styles.',
  ],

  achievements: [
    'Perfect Pitch Pioneer: Successfully match 10 consecutive melodies without error',
    'Streak Master: Maintain a 5-game winning streak in any difficulty level',
    'Difficulty Climber: Complete challenges in all difficulty levels from beginner to expert',
    'Note Navigator: Correctly identify and reproduce over 100 individual notes',
    'Melody Maestro: Achieve 95% accuracy rate across 50 completed challenges',
    'Speed Demon: Complete 20 challenges in under 60 seconds each',
    'Consistency Champion: Play for 7 consecutive days without missing a session',
    'Musical Memory: Remember and reproduce melodies with 8 or more notes perfectly',
  ],

  loadingStates: [
    'Tuning your musical experience...',
    'Generating harmonious challenges...',
    'Calibrating pitch detection algorithms...',
    'Preparing melodic sequences...',
    'Loading audio synthesis engine...',
    'Initializing ear training modules...',
    'Setting up your musical playground...',
    'Warming up the virtual instruments...',
  ],

  errorMessages: [
    'Oops! There seems to be an issue with your microphone. Please check your settings.',
    'Audio playback failed. Please refresh the page and try again.',
    'Pitch detection is temporarily unavailable. Please try again in a moment.',
    'Connection lost. Please check your internet connection and reload the game.',
    'Unable to generate melody. Please try selecting a different difficulty level.',
    'Session expired. Please restart the game to continue your musical journey.',
    'Browser compatibility issue detected. Please try using a modern browser.',
    'Audio permissions denied. Please allow microphone access to play the game.',
  ],

  progressMessages: [
    'Great progress! You\'re developing a keen musical ear.',
    'Excellent work! Your pitch accuracy is improving steadily.',
    'Keep it up! You\'re building strong musical foundations.',
    'Fantastic! Your musical memory is getting sharper.',
    'Well done! You\'re mastering the art of ear training.',
    'Outstanding! Your musical perception skills are advancing.',
    'Impressive! You\'re becoming a true ear warrior.',
    'Superb! Your dedication to musical excellence is showing.',
  ],

  musicalTerms: [
    'Pitch: The perceived frequency of a sound, determining how high or low it sounds.',
    'Interval: The distance between two notes, measured in semitones or musical steps.',
    'Melody: A sequence of musical notes that creates a recognizable tune or phrase.',
    'Rhythm: The pattern of beats and timing that gives music its temporal structure.',
    'Harmony: The combination of different notes played simultaneously to create chords.',
    'Tempo: The speed of music, typically measured in beats per minute (BPM).',
    'Scale: A series of notes arranged in ascending or descending order of pitch.',
    'Octave: The interval between one musical note and another with double its frequency.',
  ],

  encouragements: [
    'Every musician started as a beginner. Keep practicing and you\'ll improve!',
    'Your ear is getting better with each attempt. Don\'t give up!',
    'Music is a journey, not a destination. Enjoy the process of learning!',
    'Perfect pitch isn\'t everything. Focus on developing your musical intuition.',
    'Small improvements add up to significant progress over time.',
    'Trust your musical instincts and let your ear guide you.',
    'Every mistake is a learning opportunity on your musical path.',
    'Celebrate your progress, no matter how small it may seem.',
  ],

  gameStates: [
    'Ready to challenge your musical ear? Let\'s begin!',
    'Listening mode activated. The melody is playing now...',
    'Your turn! Sing back the melody you just heard.',
    'Processing your performance... Analyzing pitch accuracy...',
    'Challenge complete! Review your results and try again.',
    'New melody generated. Are you ready for the next challenge?',
    'Game paused. Resume when you\'re ready to continue.',
    'Session summary: Review your performance and track your progress.',
  ],

  features: [
    'Real-time pitch detection with advanced audio processing algorithms',
    'Multiple difficulty levels from beginner to professional musician',
    'Comprehensive scoring system with streak bonuses and achievements',
    'Visual feedback with waveform display and note matching indicators',
    'Customizable game settings to match your skill level and preferences',
    'Progress tracking and statistics to monitor your improvement over time',
    'Adaptive difficulty adjustment based on your performance patterns',
    'High-quality audio synthesis for clear and accurate melody playback',
  ],
}

export function getRandomSmokeText (category: keyof SmokeTexts): string {
  const texts = smokeTexts[category]
  return texts[Math.floor(Math.random() * texts.length)]
}

export function getSmokeTexts (category: keyof SmokeTexts, count: number = 3): string[] {
  const texts = smokeTexts[category]
  const shuffled = [...texts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, texts.length))
}

export function getAllSmokeTexts (): SmokeTexts {
  return smokeTexts
}