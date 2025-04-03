class PitchProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.pitchHistory = [];
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const buffer = input[0];
            const sampleRate = this.sampleRate;

            // Простая автокорреляция для определения pitch
            let maxCorr = 0;
            let lag = 0;

            for (let i = 1; i < buffer.length / 4; i++) { // Уменьшаем диапазон для оптимизации
                let corr = 0;
                for (let j = 0; j < buffer.length - i; j++) {
                    corr += buffer[j] * buffer[j + i];
                }
                if (corr > maxCorr) {
                    maxCorr = corr;
                    lag = i;
                }
            }

            // Отладочная информация
            console.log('Max correlation:', maxCorr, 'Lag:', lag);

            if (maxCorr > 0.1 && lag > 0) { // Увеличиваем порог и проверяем lag
                const frequency = sampleRate / lag;
                this.pitchHistory.push(frequency);
                if (this.pitchHistory.length > 10) this.pitchHistory.shift();
                const avgPitch = this.pitchHistory.reduce((a, b) => a + b) / this.pitchHistory.length;

                // Отправляем данные в основной поток
                this.port.postMessage({ pitch: avgPitch });
            } else {
                this.port.postMessage({ pitch: null }); // Отправляем null при отсутствии pitch
            }
        }
        return true; // Продолжаем обработку
    }
}

registerProcessor('pitch-processor', PitchProcessor);
