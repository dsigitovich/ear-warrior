import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import * as Tone from 'tone';

const NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'] as const;
type Note = typeof NOTES[number];

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { label: 'Elementary', value: 'elementary', notes: 1 },
  { label: 'Easy', value: 'easy', notes: 3 },
  { label: 'Medium', value: 'medium', notes: 5 },
  { label: 'Hard', value: 'hard', notes: 8 },
];

// Generate a random melody based on difficulty
const generateMelody = (difficulty: 'elementary' | 'easy' | 'medium' | 'hard'): Note[] => {
  const level = DIFFICULTY_LEVELS.find(l => l.value === difficulty) || DIFFICULTY_LEVELS[1];
  const notesCount = level.notes;
  const melody: Note[] = [];
  for (let i = 0; i < notesCount; i++) {
    melody.push(NOTES[Math.floor(Math.random() * NOTES.length)]);
  }
  return melody;
};

type Difficulty = 'easy' | 'medium' | 'hard';

function getRandomMelody(length: number = 5): Note[] {
  const melody: Note[] = [];
  for (let i = 0; i < length; i++) {
    melody.push(NOTES[Math.floor(Math.random() * NOTES.length)]);
  }
  return melody;
}

// Improved autocorrelation pitch detection
function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  const windowed = buffer.map((v, i) => v * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (buffer.length - 1))));
  let maxCorr = 0;
  let bestLag = 0;
  let rms = 0;
  for (let i = 0; i < windowed.length; i++) rms += windowed[i] * windowed[i];
  rms = Math.sqrt(rms / windowed.length);
  if (rms < 0.01) return null; // Too quiet
  for (let lag = 80; lag < 1000; lag++) { // ~80Hz to 1000Hz
    let corr = 0;
    let norm = 0;
    for (let i = 0; i < windowed.length - lag; i++) {
      corr += windowed[i] * windowed[i + lag];
      norm += windowed[i] * windowed[i] + windowed[i + lag] * windowed[i + lag];
    }
    if (norm > 0) corr /= Math.sqrt(norm);
    if (corr > maxCorr) {
      maxCorr = corr;
      bestLag = lag;
    }
  }
  if (maxCorr > 0.7 && bestLag > 80 && bestLag < 1000 - 1) {
    return sampleRate / bestLag;
  }
  return null;
}

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [melody, setMelody] = useState<Note[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [expectedNote, setExpectedNote] = useState<Note | null>(null);
  const [detectedNote, setDetectedNote] = useState<Note | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastPitch, setLastPitch] = useState<number | null>(null);
  // Set default difficulty
  const [difficulty, setDifficulty] = useState<'elementary' | 'easy' | 'medium' | 'hard'>('easy');
  const [userInputNotes, setUserInputNotes] = useState<Note[]>([]);
  const [userMatchedIndices, setUserMatchedIndices] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const melodyRef = useRef<Note[]>([]);
  const isListeningRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playMelody = async () => {
    setIsPlaying(true);
    setIsListening(false);
    isListeningRef.current = false;
    setFeedback(null);
    setDetectedNote(null);
    setLastPitch(null);
    setUserInputNotes([]);
    setUserMatchedIndices([]);
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    if (audioContextRef.current.state !== 'running') {
      await audioContextRef.current.resume();
    }
    // When generating melody, use the selected difficulty
    const newMelody = generateMelody(difficulty);
    setMelody(newMelody);
    melodyRef.current = [...newMelody];
    setExpectedNote(newMelody[0]);
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    let time = 0;
    newMelody.forEach((note) => {
      synth.triggerAttackRelease(note, '8n', Tone.now() + time);
      time += 0.5;
    });
    setTimeout(() => {
      setIsPlaying(false);
      setIsListening(true);
      isListeningRef.current = true;
      startListening();
    }, newMelody.length * 500 + 200);
  };

  const startListening = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext();
      }
      if (audioContextRef.current.state !== 'running') {
        await audioContextRef.current.resume();
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(2048, 1, 1);
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      processor.onaudioprocess = (event) => {
        if (!isListeningRef.current || !melodyRef.current.length) return;
        const input = event.inputBuffer.getChannelData(0);
        const pitch = detectPitch(input, audioContextRef.current!.sampleRate);
        if (pitch) {
          setLastPitch(pitch);
          const detected = findClosestNote(pitch);
          setDetectedNote(detected);
          setUserInputNotes(prev => {
            if (prev[prev.length - 1] === detected) return prev;
            const newInput = [...prev, detected];
            const melodyToMatch = melodyRef.current;
            const isCorrectSoFar = newInput.every((n, i) => n === melodyToMatch[i]);
            if (!isCorrectSoFar) {
              setFeedback('Try again!');
              setTimeout(() => setFeedback(null), 700);
              setUserMatchedIndices([]);
              return [];
            }
            // Add marker for each correct note
            if (newInput.length > prev.length) {
              setUserMatchedIndices(indices => [...indices, newInput.length - 1]);
            }
            if (newInput.length === melodyToMatch.length) {
              setFeedback('Success!');
              setScore(s => s + 10 * melodyToMatch.length);
              setTimeout(() => setFeedback(null), 1000);
              setTimeout(() => stopListening(), 1200);
              return [];
            }
            return newInput;
          });
        } else {
          setDetectedNote(null);
          setLastPitch(null);
        }
        drawWaveform(input, pitch);
      };
      processorRef.current = processor;
    } catch (err) {
      setFeedback('Microphone error');
    }
  };

  function findClosestNote(frequency: number): Note {
    const noteFrequencies = NOTES.map((note) => Tone.Frequency(note).toFrequency());
    const closest = noteFrequencies.reduce((prev, curr) =>
      Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
    );
    return NOTES[noteFrequencies.indexOf(closest)];
  }

  const stopListening = () => {
    setIsListening(false);
    isListeningRef.current = false;
    setMelody([]);
    setExpectedNote(null);
    setDetectedNote(null);
    setFeedback(null);
    setLastPitch(null);
    setUserInputNotes([]);
    setUserMatchedIndices([]);
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Replay the current melody without resetting user input
  const replayMelody = async () => {
    if (!melody.length) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    if (audioContextRef.current.state !== 'running') {
      await audioContextRef.current.resume();
    }
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    let time = 0;
    melody.forEach((note: Note) => {
      synth.triggerAttackRelease(note, '8n', Tone.now() + time);
      time += 0.5;
    });
  };

  // Draw waveform and pitch marker, plus matched note markers
  function drawWaveform(buffer: Float32Array, pitch: number | null) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw waveform
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let i = 0; i < buffer.length; i++) {
      const x = (i / buffer.length) * canvas.width;
      const y = (1 - buffer[i]) * (canvas.height / 2);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#1976d2';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Draw pitch marker
    if (pitch) {
      const period = audioContextRef.current ? audioContextRef.current.sampleRate / pitch : 0;
      if (period > 0 && period < buffer.length) {
        const x = (period / buffer.length) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = '#00c853';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#00c853';
        ctx.font = '12px system-ui, Arial';
        ctx.fillText(`${pitch.toFixed(1)} Hz`, x + 4, 16);
        if (detectedNote) {
          ctx.fillText(`${detectedNote}`, x + 4, 32);
        }
      }
    }
    // Draw matched note markers
    if (userMatchedIndices.length > 0 && melody.length > 0) {
      userMatchedIndices.forEach((idx, i) => {
        const x = ((idx + 0.5) / melody.length) * canvas.width;
        ctx.beginPath();
        ctx.arc(x, 12, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff9800';
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px system-ui, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${idx + 1}`, x, 16);
      });
    }
  }

  // Resize canvas on mount
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 400;
      canvasRef.current.height = 100;
    }
  }, []);

  return (
    <div className="app-container">
      <h1>Melody Ear Trainer</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>
          Difficulty:
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as 'elementary' | 'easy' | 'medium' | 'hard')}
            disabled={isPlaying || isListening}
            style={{ marginLeft: 8 }}
          >
            {DIFFICULTY_LEVELS.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </label>
        <button onClick={playMelody} disabled={isPlaying || isListening}>
          {isPlaying ? 'Playing...' : 'Play Melody'}
        </button>
        {isListening && (
          <>
            <button onClick={stopListening} style={{ marginLeft: 10 }}>
              Stop
            </button>
            <button onClick={replayMelody} style={{ marginLeft: 10 }}>
              Replay Melody
            </button>
          </>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>Score: <b>{score}</b></div>
      {isListening && (
        <>
          <canvas ref={canvasRef} style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001' }} />
          <div style={{ marginBottom: 16 }}>
            <div>Expected melody: <b>{melody.join(' ')}</b></div>
            <div>Your input: <b>{userInputNotes.join(' ') || '-'}</b></div>
            <div>Current note: <b>{detectedNote || '-'}</b></div>
            {feedback && (
              <div style={{ marginTop: 10, fontWeight: 'bold', color: feedback === 'Success!' ? '#00c853' : '#d50000' }}>{feedback}</div>
            )}
          </div>
        </>
      )}
      <p style={{ color: '#888' }}>Listen to the melody, then sing or play it back!</p>
    </div>
  );
};

export default App;
