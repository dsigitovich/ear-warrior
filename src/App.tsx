import React, { useState, useRef } from 'react';
import './App.css';
import * as Tone from 'tone';

const NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'] as const;
type Note = typeof NOTES[number];

function getRandomMelody(length: number = 5): Note[] {
  const melody: Note[] = [];
  for (let i = 0; i < length; i++) {
    melody.push(NOTES[Math.floor(Math.random() * NOTES.length)]);
  }
  return melody;
}

// Simple autocorrelation pitch detection
function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  let maxCorr = 0;
  let bestLag = 0;
  for (let lag = 80; lag < 1000; lag++) { // ~80Hz to 1000Hz
    let corr = 0;
    for (let i = 0; i < buffer.length - lag; i++) {
      corr += buffer[i] * buffer[i + lag];
    }
    if (corr > maxCorr) {
      maxCorr = corr;
      bestLag = lag;
    }
  }
  if (maxCorr > 10) { // Empirical threshold
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

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const melodyRef = useRef<Note[]>([]);
  const isListeningRef = useRef(false);

  const playMelody = async () => {
    setIsPlaying(true);
    setIsListening(false);
    isListeningRef.current = false;
    setFeedback(null);
    setDetectedNote(null);
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    if (audioContextRef.current.state !== 'running') {
      await audioContextRef.current.resume();
    }
    const newMelody = getRandomMelody(5 + Math.floor(Math.random() * 3));
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
          const detected = findClosestNote(pitch);
          setDetectedNote(detected);
          if (detected === melodyRef.current[0]) {
            setFeedback('Correct!');
            setScore((s) => s + 10);
            melodyRef.current = melodyRef.current.slice(1);
            setMelody(melodyRef.current);
            setExpectedNote(melodyRef.current[0] || null);
            setTimeout(() => setFeedback(null), 700);
          } else {
            setFeedback(null);
          }
        } else {
          setDetectedNote(null);
        }
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
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
  };

  return (
    <div className="app-container">
      <h1>Melody Ear Trainer</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={playMelody} disabled={isPlaying || isListening}>
          {isPlaying ? 'Playing...' : 'Play Melody'}
        </button>
        {isListening && (
          <button onClick={stopListening} style={{ marginLeft: 10 }}>
            Stop
          </button>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>Score: <b>{score}</b></div>
      {isListening && (
        <div style={{ marginBottom: 16 }}>
          <div>Expected note: <b>{expectedNote || '-'}</b></div>
          <div>Your note: <b>{detectedNote || '-'}</b></div>
          {feedback && (
            <div style={{ marginTop: 10, fontWeight: 'bold', color: feedback === 'Correct!' ? '#00c853' : '#d50000' }}>{feedback}</div>
          )}
        </div>
      )}
      <p style={{ color: '#888' }}>Listen to the melody, then sing or play it back!</p>
    </div>
  );
};

export default App;
