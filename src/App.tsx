import { useState } from 'react';
import './App.css';
import * as Tone from 'tone';

function App() {
    const [isPlaying, setIsPlaying] = useState(false);

    // Создаем синтезатор
    const synth = new Tone.Synth().toDestination();
    // Массив нот в до мажор
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

    // Генерация случайной мелодии (5–7 нот)
    const generateMelody = () => {
        const melodyLength = Math.floor(Math.random() * 3) + 5; // 5–7 нот
        const newMelody = [];
        for (let i = 0; i < melodyLength; i++) {
            newMelody.push(notes[Math.floor(Math.random() * notes.length)]);
        }
        return newMelody;
    };

    // Воспроизведение мелодии один раз
    const playMelody = async () => {
        if (isPlaying) return; // Блокируем, если уже играет

        setIsPlaying(true);
        await Tone.start(); // Инициализация аудио-контекста

        const melodyToPlay = generateMelody();

        // Используем getTransport() вместо прямого доступа к Transport
        const transport = Tone.getTransport();
        transport.cancel(); // Очищаем предыдущие события
        transport.stop();

        // Создаем последовательность нот
        const sequence = new Tone.Sequence(
            (time, note) => {
                synth.triggerAttackRelease(note, '8n', time);
            },
            melodyToPlay,
            '4n' // Интервал между нотами (четвертная нота, ~0.5 сек при темпе 120 BPM)
        );

        // Запускаем последовательность
        sequence.start(0);
        transport.start();

        // Останавливаем после завершения
        const totalDuration = melodyToPlay.length * 0.5 * 1000; // Длительность в мс
        setTimeout(() => {
            transport.stop();
            sequence.dispose(); // Очищаем последовательность
            setIsPlaying(false);
        }, totalDuration);
    };

    return (
        <div style={{ background: 'black', color: 'white', textAlign: 'center', padding: '20px', minHeight: '100vh' }}>
            <h1>Repeat the Melody</h1>
            <button
                onClick={playMelody}
                disabled={isPlaying}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    background: isPlaying ? '#555' : '#fff',
                    color: isPlaying ? '#aaa' : '#000',
                }}
            >
                {isPlaying ? 'Playing...' : 'Play Melody'}
            </button>
            <p style={{ marginTop: '20px' }}>
                Listen and repeat!
            </p>
        </div>
    );
}

export default App;
