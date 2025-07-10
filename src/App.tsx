import { useState, useRef } from 'react';
import './App.css';
import * as Tone from 'tone';

// Объявление глобального интерфейса для AudioWorkletProcessor
declare global {
    interface AudioWorkletProcessor {
        process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
    }
}

// Типы для состояний
interface AppState {
    isPlaying: boolean;
    isRecording: boolean;
    score: number;
    melody: string[];
    isInitialized: boolean;
}

// Тип для рефов
interface AppRefs {
    audioContextRef: React.MutableRefObject<AudioContext | null>;
    analyserRef: React.MutableRefObject<AnalyserNode | null>;
    microphoneRef: React.MutableRefObject<MediaStreamAudioSourceNode | null>;
    workletNodeRef: React.MutableRefObject<AudioWorkletNode | null>;
}

// Тип для заметки (нота)
type Note = string;

function App() {
    const [state, setState] = useState<AppState>({
        isPlaying: false,
        isRecording: false,
        score: 0,
        melody: [],
        isInitialized: false,
    });

    // Создаем синтезатор
    const synth = new Tone.Synth().toDestination();
    // Массив нот в до мажор
    const notes: Note[] = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
    const refs: AppRefs = {
        audioContextRef: useRef<AudioContext | null>(null),
        analyserRef: useRef<AnalyserNode | null>(null),
        microphoneRef: useRef<MediaStreamAudioSourceNode | null>(null),
        workletNodeRef: useRef<AudioWorkletNode | null>(null),
    };

    // Генерация случайной мелодии (5–7 нот)
    const generateMelody = (): Note[] => {
        const melodyLength = Math.floor(Math.random() * 3) + 5;
        const newMelody: Note[] = [];
        for (let i = 0; i < melodyLength; i++) {
            newMelody.push(notes[Math.floor(Math.random() * notes.length)]);
        }
        setState((prev) => ({ ...prev, melody: newMelody }));
        return newMelody;
    };

    // Инициализация микрофона и AudioWorklet
    const initializeAudio = async (): Promise<void> => {
        if (state.isInitialized) return;

        refs.audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        refs.analyserRef.current = refs.audioContextRef.current.createAnalyser();
        refs.analyserRef.current.fftSize = 2048;

        try {
            await refs.audioContextRef.current.audioWorklet.addModule('/src/worklet/processor.js');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            refs.microphoneRef.current = refs.audioContextRef.current.createMediaStreamSource(stream);
            refs.microphoneRef.current.connect(refs.analyserRef.current);

            refs.workletNodeRef.current = new AudioWorkletNode(refs.audioContextRef.current, 'pitch-processor');
            refs.microphoneRef.current.connect(refs.workletNodeRef.current);
            refs.workletNodeRef.current.port.onmessage = (e: MessageEvent<{ pitch: number | null }>) => {
                const { pitch } = e.data;
                if (pitch !== null && state.isRecording) {
                    const detectedNote = findClosestNote(pitch);
                    console.log('Detected pitch:', pitch, 'Detected note:', detectedNote);

                    if (state.melody.length > 0) {
                        const expectedNote = state.melody[0];
                        if (detectedNote === expectedNote) {
                            console.log('Match found:', detectedNote);
                            setState((prev) => ({ ...prev, score: prev.score + 10, melody: prev.melody.slice(1) }));
                        }
                    }
                } else {
                    console.log('No pitch detected');
                }
            };

            setState((prev) => ({ ...prev, isInitialized: true }));
        } catch (err) {
            console.error('Ошибка инициализации аудио:', err);
        }
    };

    // Воспроизведение мелодии
    const playMelody = async (): Promise<void> => {
        if (state.isPlaying) return;

        // Инициализация при первом клике
        if (!state.isInitialized) {
            await initializeAudio();
        }

        setState((prev) => ({ ...prev, isPlaying: true }));
        await Tone.start();

        const melodyToPlay = generateMelody();
        const transport = Tone.getTransport();
        transport.cancel();
        transport.stop();

        const sequence = new Tone.Sequence(
            (time: number, note: string) => {
                synth.triggerAttackRelease(note, '8n', time);
            },
            melodyToPlay,
            '4n'
        );

        sequence.start(0);
        transport.start();

        const totalDuration = melodyToPlay.length * 0.5 * 1000;
        setTimeout(() => {
            transport.stop();
            sequence.dispose();
            setState((prev) => ({ ...prev, isPlaying: false, isRecording: true }));
        }, totalDuration);
    };

    // Преобразование частоты в ноту
    const findClosestNote = (frequency: number): Note | null => {
        if (!frequency || isNaN(frequency)) {
            console.log('Invalid frequency:', frequency);
            return null;
        }
        const noteFrequencies = notes.map(note => Tone.Frequency(note).toFrequency());
        const closest = noteFrequencies.reduce((prev, curr) =>
            Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
        );
        return notes[noteFrequencies.indexOf(closest)];
    };

    // Остановка записи
    const stopRecording = (): void => {
        setState((prev) => ({ ...prev, isRecording: false, melody: [] }));
    };

    return (
        <div className="app-container">
            <h1>Repeat the Melody</h1>
            <div className="game-panel">
                <div className="score-bar">Score: {state.score}</div>
                <button
                    onClick={playMelody}
                    disabled={state.isPlaying}
                >
                    {state.isPlaying ? 'Playing...' : 'Play Melody'}
                </button>
                {state.isRecording && (
                    <button
                        onClick={stopRecording}
                        style={{ marginLeft: '10px' }}
                    >
                        Stop Recording
                    </button>
                )}
                <p style={{ marginTop: '20px' }}>Listen and repeat!</p>
            </div>
        </div>
    );
}

export default App;
