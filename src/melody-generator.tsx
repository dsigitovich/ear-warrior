import * as Tone from 'tone';

// Создаем синтезатор
const synth = new Tone.Synth().toDestination();

// Массив нот в до мажор
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

// Функция для генерации случайной мелодии
export function generateMelody() {
    const melodyLength = Math.floor(Math.random() * 3) + 5; // 5–7 нот
    const melody = [];

    for (let i = 0; i < melodyLength; i++) {
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        melody.push(randomNote);
    }

    return melody;
}

// Функция для воспроизведения мелодии
export async function playMelody() {
    await Tone.start(); // Запускаем аудио-контекст (нужно после действия пользователя)
    const melody = generateMelody();

    let time = 0;
    melody.forEach((note) => {
        synth.triggerAttackRelease(note, '8n', time); // Каждая нота длится 1/8
        time += 0.5; // Интервал между нотами (0.5 сек)
    });

    console.log('Generated melody:', melody); // Для отладки
    return melody; // Возвращаем для сравнения с вводом пользователя
}
